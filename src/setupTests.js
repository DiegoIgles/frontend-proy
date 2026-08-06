// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (Jest 27) does not expose TextEncoder/TextDecoder, but react-router v7
// and other modern packages require them at import time.
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// jsdom does not expose crypto.randomUUID, which the app uses (e.g. FloatingChatbot).
if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
}
