import assert from 'node:assert';
import { describe, it } from 'node:test';

import { protect } from '../middleware/auth.js';

describe('protect logging', () => {
  it('logs an error when no token provided', async () => {
    const req = { headers: {} };
    const res = {};
    let nextArg;
    const next = (err) => { nextArg = err; };

    const originalConsoleError = console.error;
    let logged = false;
    console.error = () => { logged = true; };

    try {
      await protect(req, res, next);
    } finally {
      console.error = originalConsoleError;
    }

    assert.strictEqual(logged, true, 'Expected protect to log an error when token missing');
    // also ensure next received an AppError-like object
    assert(nextArg && nextArg.statusCode === 401);
  });
});
