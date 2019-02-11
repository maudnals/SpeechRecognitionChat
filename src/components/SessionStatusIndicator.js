import React from 'react';
import './SessionStatusIndicator.css';
import STRINGS from '../const/strings';
import sessionStatuses from '../const/sessionStatuses';

const SessionStatusIndicator = ({ sessionStatus, errorMessage }) => (
  <div className="SessionStatusIndicator">
    <h1>
      Status: <span className={sessionStatus}>{STRINGS[sessionStatus]}</span>
    </h1>
    {sessionStatus === sessionStatuses.ERROR && (
      <div className={sessionStatus}>{errorMessage}</div>
    )}
  </div>
);

export default SessionStatusIndicator;
