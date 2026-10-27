# Server tests

From `server/`, install dependencies with `npm ci` if needed, then run:

```sh
npm test
```

The suite uses Node's built-in test runner (Node 24 was used for validation).
Database, Supabase Storage and email operations are mocked. Tests use synthetic
configuration and temporary loopback HTTP servers; no `.env` file, running
MongoDB, provider credentials, or live external services are required.

Coverage includes password-reset token delivery and hashing, sign-in after a
reset, material filenames and lookup, database error propagation, account
deletion, and HTTP route authorization.

## API access rules

- User management (`/api/v1/users/*`): admins only, as documented in the user
  controllers. Teachers who can open the dashboard cannot manage users.
- Material uploads and tutor-request listing/replies: admins and teachers.
- Account deletion: authenticated users, with their current password.
- Material browsing and tutor-support submission: public.

Authentication accepts an HTTP-only `accessToken` cookie or a Bearer token.
The password-reset tests exercise the API and generated email; they do not
verify a frontend password-reset screen or real email delivery.
