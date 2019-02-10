import React from 'react';
import './SessionStatusIndicator.css';

const SessionStatusIndicator = ({ sessionStatus }) => (
  <div className="SessionStatusIndicator">
    <h1>
      Status: <span className={sessionStatus}>{sessionStatus}</span>
    </h1>
  </div>
);

export default SessionStatusIndicator;
