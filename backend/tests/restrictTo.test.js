import assert from 'node:assert';
import { describe, it } from 'node:test';

import { restrictTo } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

describe('restrictTo middleware', () => {
  it('allows when role included', () => {
    const mw = restrictTo('admin', 'user');
    const req = { user: { rol: 'user' } };
    let called = false;
    const next = (err) => { if (err) { throw err; } called = true; };
    const res = {};

    mw(req, res, next);
    assert.strictEqual(called, true);
  });

  it('returns AppError when role not allowed', () => {
    const mw = restrictTo('admin');
    const req = { user: { rol: 'user' } };
    let nextArg;
    const next = (err) => { nextArg = err; };
    const res = {};

    mw(req, res, next);
    assert(nextArg instanceof AppError);
    assert.strictEqual(nextArg.statusCode, 403);
  });
});
