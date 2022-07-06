import React, {useRef, useState} from 'react';
import {css} from '@emotion/css';
import Siriwave from 'react-siriwave';
import ReactHowler from 'react-howler';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

import './index.css';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerEl = useRef(null);

  const handlePlay = (e) => {
    console.log(e);
    setIsPlaying(true);
  };

  const handlePause = (e) => {
    console.log(e);
    setIsPlaying(false);
  };

  return (
    <div
      className={css`
        font-family: sans-serif;
        text-align: center;
        background-image: linear-gradient(-20deg, #ec9f7a 0%, #21d4fd 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {/* https://github.com/thangngoc89/react-howler/blob/master/examples/react/src/players/OnlyPlayPauseButton.js */}
      <div>
        <Button onClick={handlePlay}>Play</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Siriwave
          color="#fff"
          cover
          speed={0.1}
          amplitude={1.3}
          frequency={3}
        />
        <ReactHowler
          src="/music/IDLMs.mp3"
          html5
          playing={isPlaying}
          ref={playerEl}
        />
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
