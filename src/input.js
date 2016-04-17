import { each, any, pull } from 'lodash';

class Input {

  constructor() {
    this.state = {};
    this.listeners = {};

    window.addEventListener('keydown', event =>
      this.handleKeydown(event)
    );
    window.addEventListener('keyup', event =>
      this.handleKeyup(event)
    );
  }

  handleKeyup(event) {
    this.state[event.code] = false;
  }

  handleKeydown(event) {
    const handlers = this.listeners[event]
    each(handlers, handler => handler());
    this.state[event.code] = true;
  }

  isKeyDown(code) {
    return this.state[code] || false;
  }

  addListener(code, handler) {
    if (this.listeners[code] == null) {
      this.listeners[code] = [];
    }
    this.listeners[code].push(handler);
  }

  removeListener(code, handler) {
    pull(this.listeners[code], handler);
  }
}

export default new Input();
