import React from 'react';
import cx from 'classnames';
import './SesssionStatusIndicator.css';

const SessionStatusIndicator = ({ sessionStatus }) => (
  <div className="SessionStatusIndicator">
    Status: <span className={sessionStatus}>{sessionStatus}</span>
  </div>
);

export default SessionStatusIndicator;
