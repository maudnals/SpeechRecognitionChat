import React, { Component, Fragment } from 'react';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { ASRClient } from './asr/ASRClient';
import { updateSessionStatus } from './redux/actions';
import { getSessionStatus } from './redux/selectors';
import SessionStatusIndicator from './components/SessionStatusIndicator';
import SpeechBubble from './components/SpeechBubble';
import SESSION_STATUSES from './const/sessionStatuses';

class App extends Component {
  ASRInstance = new ASRClient('wss://vibe-rc.i2x.ai');

  state = {
    phrases: ['product', 'Hi', 'Hello', 'My name is'],
    transcriptLog: []
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transcriptLog.length !== this.state.transcriptLog.length) {
      if (this.transcript) {
        this.transcript.scrollTop = this.transcript.scrollHeight;
      }
    }
  }

  _startSession = () => {
    this.props.updateSessionStatus(SESSION_STATUSES.STARTED);
    // would need a callback here!
    this.ASRInstance.start(compact(this.state.phrases), this._onMessage);
    // console.log(this.ASRInstance);
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
    const transcriptMessages = this.state.transcriptLog.map(l => (
      <SpeechBubble key={l.timestamp}>
        <div className="bubble">{l.transcript.utterance}</div>
      </SpeechBubble>
    ));
    console.log(transcriptMessages);

    return (
      <Fragment>
        <div>
          <SessionStatusIndicator sessionStatus={this.props.sessionStatus} />
        </div>
        <div className="flex">
          <div
            ref={ref => (this.transcript = ref)}
            className="mr05 mv1 transcript"
            style={{
              height: '30vh',
              width: '100%',
              overflowY: 'auto'
            }}
          >
            <pre>{transcriptMessages}</pre>
          </div>
          <div className="mv1">
            <textarea
              onChange={this._onUpdatePhrases}
              value={this.state.phrases.join('\n')}
              cols="30"
              rows="10"
            />
          </div>
        </div>
        <button className="btn-primary" onClick={this._onToggle}>
          {this.props.sessionStatus === SESSION_STATUSES.STARTED
            ? '🔴 Stop session'
            : '🔵 Start session'}
        </button>
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
