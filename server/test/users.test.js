import './helpers/setup.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import User from '../models/user.model.js';
import { getAllUsers } from '../controllers/user.controller.js';
import { response } from './helpers/setup.js';

test('user listing forwards database failures to the error handler', async t => {
  const expected = new Error('Database unavailable');
  t.mock.method(User, 'find', () => { throw expected; });
  let received;
  await getAllUsers({ query: {} }, response(), error => { received = error; });
  assert.equal(received, expected);
});
