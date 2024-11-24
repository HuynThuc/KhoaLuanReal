import React, { useRef } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);

  const videoId = 'tpN9CPwZ-oE'; // Thay đổi video ID tại đây

  const handleButtonClick = (time) => {
    if (videoRef.current) {
      const iframe = videoRef.current;
      const playerUrl = `https://www.youtube.com/embed/${videoId}?start=${time}&autoplay=1`;
      iframe.src = playerUrl; // Cập nhật src của iframe để phát video từ thời gian chỉ định
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <iframe 
        ref={videoRef}
        width="640"
        height="390"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="mt-3" id="js-sound-buttons-container">
        <button onClick={() => handleButtonClick(56)} className="btn shadow-none me-3 mb-3 player-btn player-btn-0 btn-outline-success">short /a/ æ</button>
        <button onClick={() => handleButtonClick(64)} className="btn shadow-none me-3 mb-3 player-btn player-btn-1 btn-success">short /e/ e</button>
        <button onClick={() => handleButtonClick(71)} className="btn shadow-none me-3 mb-3 player-btn player-btn-2 btn-outline-success">short /i/ ɪ</button>
        <button onClick={() => handleButtonClick(89)} className="btn shadow-none me-3 mb-3 player-btn player-btn-3 btn-outline-success">short /o/ ɑː</button>
        <button onClick={() => handleButtonClick(97)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-4">short /u/ ʌ</button>

        <button onClick={() => handleButtonClick(107)} className="btn shadow-none me-3 mb-3 player-btn player-btn-5 btn-outline-success">long /a/  eɪ</button>
        <button onClick={() => handleButtonClick(116)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-6">long /e/ iː</button>
        <button onClick={() => handleButtonClick(123)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-7">long /i/  aɪ </button>
        <button onClick={() => handleButtonClick(132)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-8">long /o/   oʊ</button>
        <button onClick={() => handleButtonClick(141)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-9">long /u/  juː</button>
        <button onClick={() => handleButtonClick(151)} className="btn btn-outline-success shadow-none me-3 mb-3 player-btn player-btn-10">long /oo/  uː</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
