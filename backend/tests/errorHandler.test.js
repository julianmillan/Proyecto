import assert from 'node:assert';
import { describe, it } from 'node:test';

import { errorHandler, AppError } from '../middleware/errorHandler.js';

describe('errorHandler and AppError', () => {
  it('AppError sets statusCode and isOperational', () => {
    const err = new AppError('fail', 401);
    assert.strictEqual(err.message, 'fail');
    assert.strictEqual(err.statusCode, 401);
    assert.strictEqual(err.isOperational, true);
  });

  it('errorHandler responds with proper JSON', () => {
    const captured = {};
    const res = {
      status(code) { captured.status = code; return this; },
      json(obj) { captured.json = obj; }
    };

    const testErr = new Error('boom');
    errorHandler(testErr, res);

    assert.strictEqual(captured.status, 500);
    assert.strictEqual(captured.json.success, false);
    assert.strictEqual(captured.json.message, 'boom');
  });
});
