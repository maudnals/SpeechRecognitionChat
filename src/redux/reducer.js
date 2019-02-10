import { UPDATE_SESSION_STATUS } from './actionTypes';
import SESSION_STATUSES from '../const/sessionStatuses';

const initialState = {
  sessionStatus: SESSION_STATUSES.STOPPED
};

// no need for combineReducers here, the app is simple
export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SESSION_STATUS: {
      const { sessionStatus } = action.payload;
      return {
        ...state,
        sessionStatus
      };
    }
    default:
      return state;
  }
}
