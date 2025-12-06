import assert from 'node:assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import * as jwt from 'jsonwebtoken';

import { protect, __setJwtVerify } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

describe('protect middleware', () => {
  let originalVerify;

  beforeEach(() => {
    originalVerify = jwt.verify;
    // ensure auth middleware uses the real verify by default
    __setJwtVerify(jwt.verify);
  });

  afterEach(() => {
    __setJwtVerify(originalVerify);
  });

  it('calls next with AppError when no token provided', async () => {
    const req = { headers: {} };
    let nextArg;
    const next = (err) => { nextArg = err; };
    const res = {};

    await protect(req, res, next);

    assert(nextArg instanceof AppError, 'Expected next to be called with AppError');
    assert.strictEqual(nextArg.statusCode, 401);
  });

  it('calls next with AppError when jwt.verify throws', async () => {
    __setJwtVerify(() => { throw new Error('invalid token'); });
    const req = { headers: { authorization: 'Bearer badtoken' } };
    let nextArg;
    const next = (err) => { nextArg = err; };
    const res = {};

    await protect(req, res, next);

    assert(nextArg instanceof AppError, 'Expected next to be called with AppError');
    assert.strictEqual(nextArg.statusCode, 401);
  });

  it('sets req.user and calls next when token is valid', async () => {
    __setJwtVerify(() => ({ id: 'user123', rol: 'user' }));
    const req = { headers: { authorization: 'Bearer goodtoken' } };
    let nextCalled = false;
    const next = (err) => { if (err) { throw err; } nextCalled = true; };
    const res = {};

    await protect(req, res, next);

    assert(nextCalled, 'Expected next to be called without error');
    assert.deepStrictEqual(req.user, { id: 'user123', rol: 'user' });
  });
});
