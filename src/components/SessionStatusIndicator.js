import React from 'react';
import './SessionStatusIndicator.css';

const SessionStatusIndicator = ({ sessionStatus }) => (
  <div className="SessionStatusIndicator">
    Status: <span className={sessionStatus}>{sessionStatus}</span>
  </div>
);

export default SessionStatusIndicator;
