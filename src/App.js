import React, { Component, Fragment } from 'react';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { ASRClient } from './asr/ASRClient';
import { updateSessionStatus } from './redux/actions';
import { getSessionStatus } from './redux/selectors';
import SessionStatusIndicator from './components/SessionStatusIndicator';
import SpeechBubble from './components/SpeechBubble';
import SESSION_STATUSES from './const/sessionStatuses';
import { Message } from 'protobufjs';

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

  formatMessage = msg => {
    let x = msg;
    const b = this.state.phrases.reduce((acc, phrase) => {
      const arr = msg.split('');
      const i = msg.toLowerCase().indexOf(phrase.toLowerCase());
      if (i + 1) {
        const arr1 = arr.slice(0, i);
        const arr2 = arr.slice(i + phrase.length, arr.length);
        x = [...arr1, '<em>', phrase, '</em>', ...arr2].join('');
      }
      return x;
      // todos
      // test if begining, end
      // what is stuff is here double
      // snaitize
      // test that it updates well with user input
      // what if nested????
      // also highlight the right one
    }, msg);
    return x;
  };
  // this.state.phrases && this.state.phrases.includes `${msg} yooooo`;

  render() {
    const transcriptMessages = this.state.transcriptLog.map(l => (
      <SpeechBubble key={l.timestamp}>
        <div className="bubble">
          {this.formatMessage(l.transcript.utterance)}
        </div>
      </SpeechBubble>
    ));
    console.log(this.state.phrases);

    return (
      <Fragment>
        <div className="mb2">
          <SessionStatusIndicator sessionStatus={this.props.sessionStatus} />
        </div>
        <div className="flex mb2">
          <div className="mr2 flex-1">
            <h3>Transcript</h3>
            <div
              ref={ref => (this.transcript = ref)}
              className="transcript"
              style={{
                height: '60vh',
                width: '100%',
                overflowY: 'auto'
              }}
            >
              <pre>{transcriptMessages}</pre>
            </div>
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
