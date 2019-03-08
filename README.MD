## Specs: 

App that processes speech input and transform it to text using ASRClient library.
Current code has an example on how to use ASRClient module.

1. Open the speech recognition connection using the provided adapter (ASRClient).
1. Render the transcript:
    - Render phrases as chat bubbles. Phrases should be splitted into separate bubbles if the latest appears 2 sec later after the previous.
    - Highlight spotting phrases that appeared in transcript
1. Display the state of session on top of the screen.
    - either `Session started` or `Disconnected` or `Error` (in which case you should display the error message).
1. Start/stop button should change titles accordingly.

**Optional**
1. Implement virtual scroll for log transcripts
2. Add some unit/integration/e2e tests. Or describe how you would approach testing.

## final result:

![mockup](./transcript-mock.png)

## ASRClient:

  ASRClient is responsible for capturing audio input, sending data to i2x service and returning speech transcripts.   

- ### ASRClient
    Constructor of the speech recognition client.
    
    **params**
    *endpoint* - server endpoint (wss://vibe-rc.i2x.ai);

- ### start
    Starts the speech recognition session

    **params**
    
    *spottingPhrases* — array of phrases that should be highlighted in the sound stream

    *callback* — function which will be called when new chunk of sound is transcribed. 
    First argument is an error. Second argument is a result object with transcription.
    
    **result object format**
    
    ```
    {
      "transcript": {
        // transcripted words
        "utterance": "Hello, how are you?", 
        // time of the phrase start from the beginning of the session
        "startOffsetMsec": 420, 
        // time of the phrase end from the beginning of the session
        "endOffsetMsec": 2730 
      },
      // spotted words in this phrase from the `spottingPhrases`
      "spotted": [
        "hello" 
      ]
    }
    ```

- ### stop

    Finishes speech recognition session

- ### updateSpottingConfig

    Updates the list of spotting phrases. Throws an error if session is not started.

    **params**
    
    *spottingPhrases* — array of phrases that should be highlighted in the sound stream

- ### isStarted

    Returns true if session is started.
