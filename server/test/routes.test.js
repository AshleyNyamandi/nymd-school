import './helpers/setup.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Material from '../models/material.model.js';
import User from '../models/user.model.js';
import TutorSupport from '../models/tutorRequest.model.js';
import authRouter from '../routes/auth.route.js';
import userRouter from '../routes/user.route.js';
import subjectsRouter from '../routes/subjects.route.js';
import tutorRouter from '../routes/tutorSupport.route.js';

const userId = '507f1f77bcf86cd799439011';
const token = jwt.sign({ userId }, process.env.JWT_SECRET);

async function request(t, path, { method = 'GET', role, cookie = false, body, user = { _id: userId, role } } = {}) {
  t.mock.method(User, 'findById', id => {
    assert.equal(String(id), userId);
    return { select: async () => user, then: resolve => resolve(user) };
  });
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/subjects', subjectsRouter);
  app.use('/tutor', tutorRouter);
  app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ message: error.message });
  });
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  await new Promise(resolve => server.once('listening', resolve));
  const headers = { 'Content-Type': 'application/json' };
  if (role) headers[cookie ? 'Cookie' : 'Authorization'] = cookie ? `accessToken=${token}` : `Bearer ${token}`;
  return fetch(`http://127.0.0.1:${server.address().port}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(3000),
  });
}

const protectedRoutes = [
  ['GET', '/users'],
  ['GET', `/users/${userId}`],
  ['PATCH', `/users/${userId}/role`],
  ['DELETE', `/users/${userId}`],
  ['POST', '/subjects/upload-material'],
  ['GET', '/tutor/tutor-requests'],
  ['POST', '/tutor/reply-tutor-requests'],
];

for (const [method, path] of protectedRoutes) {
  for (const role of [undefined, 'student']) {
    test(`${method} ${path} rejects ${role || 'anonymous'} access before side effects`, async t => {
      // Fail fast if the request incorrectly reaches a controller.
      for (const operation of ['find', 'findByIdAndUpdate', 'findByIdAndDelete', 'countDocuments']) {
        t.mock.method(User, operation, () => { throw new Error('Unexpected database access'); });
      }
      t.mock.method(nodemailer, 'createTransport', () => { throw new Error('Unexpected email access'); });
      t.mock.method(TutorSupport, 'find', () => { throw new Error('Unexpected database access'); });
      const res = await request(t, path, { method, role, body: method === 'GET' ? undefined : {} });
      assert.equal(res.status, role ? 403 : 401);
    });
  }
}

test('teachers cannot change user roles', async t => {
  const update = t.mock.method(User, 'findByIdAndUpdate', () => { throw new Error('must not update'); });
  const res = await request(t, `/users/${userId}/role`, { method: 'PATCH', role: 'teacher', body: { role: 'admin' } });
  assert.equal(res.status, 403);
  assert.equal(update.mock.callCount(), 0);
});

test('admins can list users using a cookie', async t => {
  const chain = {
    select(fields) { assert.ok(fields.includes('-password')); return this; },
    sort() { return this; }, skip() { return this; }, limit() { return this; },
    async lean() { return [{ _id: userId, role: 'student' }]; },
  };
  t.mock.method(User, 'find', () => chain);
  t.mock.method(User, 'countDocuments', async () => 1);
  const res = await request(t, '/users', { role: 'admin', cookie: true });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).data.total, 1);
});

for (const role of ['teacher', 'admin']) {
  test(`${role} can reach material upload validation`, async t => {
    const res = await request(t, '/subjects/upload-material', { method: 'POST', role, body: {} });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).message, 'No file provided.');
  });

  test(`${role} can list tutor requests`, async t => {
    t.mock.method(TutorSupport, 'find', () => ({ sort() { return this; }, skip() { return this; }, async limit() { return []; } }));
    t.mock.method(TutorSupport, 'countDocuments', async () => 0);
    const res = await request(t, '/tutor/tutor-requests', { role });
    assert.equal(res.status, 200);
    assert.deepEqual((await res.json()).data, []);
  });
}

test('public tutor-support submission stays accessible', async t => {
  const create = t.mock.method(TutorSupport, 'create', async body => ({ _id: userId, ...body }));
  const res = await request(t, '/tutor/request-support', { method: 'POST', body: {
    subject: 'Physics', level: 'o-level', email: 'student@example.test', message: 'Help with waves',
  } });
  assert.equal(res.status, 200);
  assert.equal(create.mock.callCount(), 1);
});

test('public material browsing stays accessible', async t => {
  t.mock.method(Material, 'find', async () => [{ subject: 'Physics' }]);
  const res = await request(t, '/subjects/subject/level/o-level/subject/Physics/year/2025');
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).data, [{ subject: 'Physics' }]);
});

test('authenticated account deletion verifies password and deletes the signed-in user', async t => {
  const password = 'test-password';
  const user = { _id: userId, role: 'student', password: await bcrypt.hash(password, 4) };
  const remove = t.mock.method(User, 'findByIdAndDelete', async id => { assert.equal(String(id), userId); return user; });
  const res = await request(t, '/auth/delete-account', { method: 'DELETE', role: 'student', user, body: { password } });
  assert.equal(res.status, 200);
  assert.equal(remove.mock.callCount(), 1);
  assert.ok(res.headers.get('set-cookie').includes('accessToken=;'));
  assert.ok(res.headers.get('set-cookie').includes('refreshToken=;'));
});

test('account deletion rejects an incorrect password without deleting the user', async t => {
  const user = { _id: userId, role: 'student', password: await bcrypt.hash('correct-password', 4) };
  const remove = t.mock.method(User, 'findByIdAndDelete', () => { throw new Error('must not delete'); });
  const res = await request(t, '/auth/delete-account', { method: 'DELETE', role: 'student', user, body: { password: 'wrong-password' } });
  assert.equal(res.status, 401);
  assert.equal(remove.mock.callCount(), 0);
});

test('account deletion rejects anonymous requests before database access', async t => {
  const remove = t.mock.method(User, 'findByIdAndDelete', () => { throw new Error('must not delete'); });
  const res = await request(t, '/auth/delete-account', { method: 'DELETE', body: { password: 'password' } });
  assert.equal(res.status, 401);
  assert.equal(remove.mock.callCount(), 0);
});
