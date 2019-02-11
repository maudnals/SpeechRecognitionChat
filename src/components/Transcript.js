import React, { Component } from 'react';
import './Transcript.css';
import SpeechBubble from '../components/SpeechBubble';
import { formatMessage } from '../helpers/messageHelper';

class Transcript extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.transcriptLog.length !== this.props.transcriptLog.length) {
      if (this.transcript) {
        this.transcript.scrollTop = this.transcript.scrollHeight;
      }
    }
  }

  render() {
    const transcriptMessages = this.props.transcriptLog.map(l => (
      <SpeechBubble key={l.timestamp}>
        <div
          className="bubble"
          dangerouslySetInnerHTML={{
            __html: formatMessage(l.transcript.utterance, this.props.phrases)
          }}
        />
      </SpeechBubble>
    ));

    return (
      <div className="Transcript">
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
    );
  }
}

export default Transcript;
