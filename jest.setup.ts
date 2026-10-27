import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.PointerEvent) {
  window.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
}

if (typeof Element !== 'undefined') {
  Element.prototype.setPointerCapture = jest.fn();
}
