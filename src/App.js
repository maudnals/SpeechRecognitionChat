import React, { Component, Fragment } from 'react';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { ASRClient } from './asr/ASRClient';
import { updateSessionStatus } from './redux/actions';
import { getSessionStatus } from './redux/selectors';
import SessionStatusIndicator from './components/SessionStatusIndicator';
import Transcript from './components/Transcript';
import SESSION_STATUSES from './const/sessionStatuses';

class App extends Component {
  ASRInstance = new ASRClient('wss://vibe-rc.i2x.ai');

  state = {
    phrases: ['product', 'Hi', 'Hello', 'My name is'],
    transcriptLog: []
  };

  _startSession = () => {
    this.props.updateSessionStatus(SESSION_STATUSES.STARTED);
    // TODO: callback
    this.ASRInstance.start(compact(this.state.phrases), this._onMessage);
  };

  _stopSession = () => {
    this.props.updateSessionStatus(SESSION_STATUSES.STOPPED);
    this.ASRInstance.stop();
  };

  _onToggle = () => {
    if (this.props.sessionStatus === SESSION_STATUSES.STARTED) {
      this._stopSession();
    } else {
      this._startSession();
    }
  };

  _onUpdatePhrases = event => {
    const nextPhrases = event.target.value.split('\n');
    if (this.ASRInstance.isStarted()) {
      this.ASRInstance.updateSpottingConfig(compact(nextPhrases));
    }
    this.setState({ phrases: nextPhrases });
  };

  _onMessage = (error, results) => {
    this.setState(state => ({
      transcriptLog: [
        ...state.transcriptLog,
        { ...results, timestamp: Date.now() }
      ]
    }));
  };

  render() {
    return (
      <Fragment>
        <div className="mb2">
          <SessionStatusIndicator sessionStatus={this.props.sessionStatus} />
        </div>
        <div className="flex mb2">
          <div className="mr2 flex-1">
            <h3>Transcript</h3>
            <Transcript
              transcriptLog={this.state.transcriptLog}
              phrases={this.state.phrases}
            />
          </div>
          <div>
            <h3>Spotting phrases</h3>
            <div>
              <textarea
                onChange={this._onUpdatePhrases}
                value={this.state.phrases.join('\n')}
                cols="30"
                rows="10"
              />
            </div>
          </div>
        </div>
        <div>
          <button className="btn-primary" onClick={this._onToggle}>
            {this.props.sessionStatus === SESSION_STATUSES.STARTED
              ? '🔴 Stop session'
              : '🔵 Start session'}
          </button>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sessionStatus: getSessionStatus(state)
});

export default connect(
  mapStateToProps,
  { updateSessionStatus }
)(App);
