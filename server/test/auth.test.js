import './helpers/setup.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';
import { ForgotPassword, ResetPassword, SignIn } from '../controllers/auth.controller.js';
import { response } from './helpers/setup.js';

const digest = token => crypto.createHash('sha256').update(token).digest('hex');

function resetUser() {
  return { password: 'old-hash', resetPasswordToken: digest('reset-token'),
    resetPasswordExpiresAt: new Date(Date.now() + 3600000), async save() {} };
}

test('forgot password saves a hashed token and emails a usable reset link', async t => {
  const user = { email: 'student@example.test', async save() {} };
  t.mock.method(User, 'findOne', async () => user);
  let mail;
  t.mock.method(nodemailer, 'createTransport', () => ({ async sendMail(options) { mail = options; } }));
  const res = response();
  let failure;
  const before = Date.now();
  await ForgotPassword({ body: { email: user.email } }, res, error => { failure = error; });
  assert.equal(failure, undefined);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(mail.to, user.email);
  const link = mail.html.match(/href="([^"]+)"/)[1];
  const url = new URL(link);
  assert.equal(url.origin, process.env.CLIENT_URL);
  assert.equal(url.pathname, '/reset-password');
  const token = url.searchParams.get('token');
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(user.resetPasswordToken, digest(token));
  assert.ok(Number(user.resetPasswordExpiresAt) > before);
});

test('forgot password gives unknown accounts the same success response without email', async t => {
  t.mock.method(User, 'findOne', async () => null);
  const transport = t.mock.method(nodemailer, 'createTransport', () => { throw new Error('must not send'); });
  const res = response();
  await ForgotPassword({ body: { email: 'unknown@example.test' } }, res, assert.ifError);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, 'A password reset link has been sent.');
  assert.equal(transport.mock.callCount(), 0);
});

test('reset password hashes the exact password, clears the token and allows sign-in', async t => {
  const user = { ...resetUser(), _id: '507f1f77bcf86cd799439011', email: 'student@example.test', isVerified: true };
  let query;
  t.mock.method(User, 'findOne', async filter => { query = filter; return user; });
  const save = t.mock.method(user, 'save');
  const password = ' new-password ';
  const res = response();
  let failure;
  await ResetPassword({ query: { token: 'reset-token' }, body: { newPassword: password, confirmPassword: password } }, res, error => { failure = error; });
  assert.equal(failure, undefined);
  assert.equal(query.resetPasswordToken, digest('reset-token'));
  assert.ok(query.resetPasswordExpiresAt.$gt <= Date.now());
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.notEqual(user.password, 'old-hash');
  assert.equal(await bcrypt.compare(password, user.password), true);
  assert.equal(user.resetPasswordToken, undefined);
  assert.equal(user.resetPasswordExpiresAt, undefined);
  assert.equal(save.mock.callCount(), 1);
  const signInRes = response();
  await SignIn({ body: { email: user.email, password } }, signInRes, assert.ifError);
  assert.deepEqual(signInRes.cookies.map(cookie => cookie.name), ['accessToken', 'refreshToken']);
});

test('reset password rejects passwords that differ only in surrounding spaces', async t => {
  const user = resetUser();
  t.mock.method(User, 'findOne', async () => user);
  const save = t.mock.method(user, 'save');
  let failure;
  await ResetPassword({ query: { token: 'reset-token' }, body: { newPassword: 'password ', confirmPassword: 'password' } }, response(), error => { failure = error; });
  assert.equal(failure?.statusCode, 400);
  assert.equal(failure?.message, 'Passwords do not match');
  assert.equal(save.mock.callCount(), 0);
});

test('reset password rejects expired or unknown tokens without hashing a password', async t => {
  t.mock.method(User, 'findOne', async () => null);
  const hash = t.mock.method(bcrypt, 'hash', () => { throw new Error('must not hash'); });
  let failure;
  await ResetPassword({ query: { token: 'expired' }, body: { newPassword: 'password', confirmPassword: 'password' } }, response(), error => { failure = error; });
  assert.equal(failure?.statusCode, 400);
  assert.equal(hash.mock.callCount(), 0);
});
