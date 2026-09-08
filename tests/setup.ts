import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@/styles/index.css';

const memory = new Map<string, string>();

const localStorageMock: Storage = {
  get length() {
    return memory.size;
  },
  clear() {
    memory.clear();
  },
  getItem(key) {
    return memory.get(key) ?? null;
  },
  key(index) {
    return Array.from(memory.keys())[index] ?? null;
  },
  removeItem(key) {
    memory.delete(key);
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
};

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: localStorageMock,
});

function mockMatchMedia(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  };
}

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: mockMatchMedia,
  });
}

HTMLCanvasElement.prototype.getContext = () => null;

const dialogProto = HTMLDialogElement.prototype;

dialogProto.showModal = function showModal() {
  this.setAttribute('open', '');
};

dialogProto.close = function closeDialog() {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.body.style.overflow = '';
  const root = document.documentElement;
  root.removeAttribute('data-theme');
  root.removeAttribute('data-motion');
  root.removeAttribute('data-density');
  root.removeAttribute('data-text-scale');
  root.removeAttribute('data-captions');
  root.removeAttribute('data-braille');
  root.removeAttribute('data-sign-language');
  root.lang = 'es';
});
