import SESSION_STATUSES from './sessionStatuses';

const STRINGS = Object.freeze({
  [SESSION_STATUSES.STARTED]: 'session started',
  [SESSION_STATUSES.STOPPED]: 'disconnected',
  [SESSION_STATUSES.ERROR]: 'error'
});

export default STRINGS;
