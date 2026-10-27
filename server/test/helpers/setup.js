// Synthetic configuration only. Tests stub all database, storage and email I/O.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-only-signing-secret';
process.env.BCRYPT_SALT = '4';
process.env.CLIENT_URL = 'https://school.example.test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE = 'test-only-storage-key';
process.env.DOTENV_CONFIG_QUIET = 'true';

export function response() {
  return {
    statusCode: 200,
    body: undefined,
    cookies: [],
    clearedCookies: [],
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    cookie(name, value, options) { this.cookies.push({ name, value, options }); return this; },
    clearCookie(name) { this.clearedCookies.push(name); return this; },
  };
}
