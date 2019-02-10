import React, { Component, Fragment } from 'react';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { ASRClient } from './asr/ASRClient';
import { updateSessionStatus } from './redux/actions';
import { getSessionStatus } from './redux/selectors';
import SESSION_STATUSES from './const/sessionStatuses';

class App extends Component {
  ASRInstance = new ASRClient('wss://vibe-rc.i2x.ai');

  state = {
    phrases: ['product', 'Hi', 'Hello', 'My name is'],
    log: ''
  };

  _startSession = () => {
    this.props.updateSessionStatus(SESSION_STATUSES.STARTED);
    // would need a callback here!
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
    this.setState({
      log: this.state.log + '\n' + JSON.stringify(results, null, 2)
    });
  };

  render() {
    return (
      <Fragment>
        <div>
          <div>{this.props.sessionStatus}</div>
          <button onClick={this._onToggle}>
            {this.props.sessionStatus === SESSION_STATUSES.STARTED
              ? 'Stop'
              : 'Start'}
          </button>
        </div>
        <div>
          <textarea
            onChange={this._onUpdatePhrases}
            value={this.state.phrases.join('\n')}
            cols="30"
            rows="10"
          />
        </div>
        <div
          style={{ height: 600, overflowY: 'auto', border: '1px solid black' }}
        >
          <pre>{this.state.log}</pre>
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
