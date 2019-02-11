import React from 'react';
import './SessionStatusIndicator.css';
import STRINGS from '../const/strings';

const SessionStatusIndicator = ({ sessionStatus }) => (
  <div className="SessionStatusIndicator">
    <h1>
      Status: <span className={sessionStatus}>{STRINGS[sessionStatus]}</span>
    </h1>
  </div>
);

export default SessionStatusIndicator;
