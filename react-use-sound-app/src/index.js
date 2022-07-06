import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {HiOutlineBell} from 'react-icons/hi';
import useSound from 'use-sound';

import './index.css';

const App = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [play, {pause}] = useSound('/music/IDLMs.mp3');

  useEffect(() => {}, [isPlay]);

  const handleToggle = (e) => {
    if (isPlay) {
      setIsPlay(false);
      pause();
    } else {
      play();
      setIsPlay(true);
    }
  };

  return (
    <button
      className=""
      onClick={(e) => {
        handleToggle(e);
      }}
    >
      <HiOutlineBell />
      <span>通知音を再生</span>
    </button>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
