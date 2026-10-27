import './helpers/setup.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import Material from '../models/material.model.js';
import { supabase } from '../config/supabase.js';
import { getSubjectMaterials, uploadMaterial } from '../controllers/subject.controller.js';
import { response } from './helpers/setup.js';

for (const type of ['notes', 'past-paper', 'marking-scheme']) {
  test(`upload ${type} uses the appropriate filename and saves metadata`, async t => {
    const body = type === 'notes'
      ? { level: 'o-level', subject: 'Physics', type, topic: 'Waves' }
      : { level: 'o-level', subject: 'Physics', type, year: '2025', session: 'june', paper: 'paper-1' };
    let path;
    const buffer = Buffer.from('synthetic document');
    t.mock.method(supabase.storage, 'from', bucket => {
      assert.equal(bucket, 'online-school-documents');
      return {
        async upload(filePath, content, options) {
          path = filePath;
          assert.equal(content, buffer);
          assert.equal(options.contentType, 'application/pdf');
          assert.equal(options.upsert, false);
          return { data: { path }, error: null };
        },
        getPublicUrl(filePath) {
          assert.equal(filePath, path);
          return { data: { publicUrl: `https://test.supabase.co/${path}` } };
        },
      };
    });
    let metadata;
    t.mock.method(Material, 'create', async data => { metadata = data; return { _id: 'material-id', ...data }; });
    const res = response();
    await uploadMaterial({ body, file: { originalname: 'document.pdf', mimetype: 'application/pdf', buffer } }, res, assert.ifError);
    const prefix = type === 'notes' ? 'o-level/Physics/o-level_Physics_Waves_' : `o-level/Physics/o-level_Physics_2025_june_paper-1_${type}_`;
    assert.ok(path.startsWith(prefix), path);
    assert.ok(path.endsWith('.pdf'));
    assert.ok(!path.includes('undefined'));
    assert.equal(metadata.materialType, type);
    assert.equal(metadata.topic, body.topic);
    assert.equal(metadata.fileUrl, `https://test.supabase.co/${path}`);
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.data._id, 'material-id');
  });
}

test('upload without a file rejects before calling storage or the database', async t => {
  const storage = t.mock.method(supabase.storage, 'from', () => { throw new Error('must not upload'); });
  const create = t.mock.method(Material, 'create', () => { throw new Error('must not save'); });
  const res = response();
  await uploadMaterial({ body: {} }, res, assert.ifError);
  assert.equal(res.statusCode, 400);
  assert.equal(storage.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
});

test('failed storage upload does not save metadata', async t => {
  t.mock.method(supabase.storage, 'from', () => ({ async upload() { return { error: { message: 'Storage unavailable' } }; } }));
  const create = t.mock.method(Material, 'create', () => { throw new Error('must not save'); });
  const res = response();
  await uploadMaterial({ body: {}, file: { originalname: 'test.pdf' } }, res, assert.ifError);
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Document upload failed');
  assert.equal(create.mock.callCount(), 0);
});

test('subject lookup matches literal names case-insensitively within level and year', async t => {
  let query;
  const materials = [{ _id: 'material-id' }];
  t.mock.method(Material, 'find', async filter => { query = filter; return materials; });
  const res = response();
  await getSubjectMaterials({ params: { level: 'a-level', subject: 'Physics (Advanced)+', year: '2025' } }, res, assert.ifError);
  assert.equal(query.level, 'a-level');
  assert.equal(query.year, '2025');
  assert.equal(query.subject.test('physics (advanced)+'), true);
  assert.equal(query.subject.test('Physics Advanceddd'), false);
  assert.equal(query.subject.test('Other Physics (Advanced)+'), false);
  assert.deepEqual(res.body.data, materials);
});

test('subject lookup forwards the original database error', async t => {
  const expected = new Error('Database unavailable');
  t.mock.method(Material, 'find', async () => { throw expected; });
  let received;
  await getSubjectMaterials({ params: { level: 'o-level', subject: 'Physics', year: '2025' } }, response(), error => { received = error; });
  assert.equal(received, expected);
});
