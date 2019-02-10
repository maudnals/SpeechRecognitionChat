import { UPDATE_SESSION_STATUS } from './actionTypes';

export const updateSessionStatus = sessionStatus => ({
  type: UPDATE_SESSION_STATUS,
  payload: {
    sessionStatus
  }
});
