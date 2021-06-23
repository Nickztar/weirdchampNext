import React, { useEffect, useState } from 'react';
import {
  IoCloudDownload,
  IoMusicalNotes,
  IoPause,
  IoPlaySharp,
  IoReload,
  IoTrash,
} from 'react-icons/io5';
import { Spinner } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { download, readBlobURL, rename } from '../../utils/utils';
import WebAudio from '../../utils/webaudio';
import { sliceAudioBuffer } from '../../utils/audio-helper';
import Player from '../Player';
import FilePicker from '../FilePicker';
import AudioController from '../AudioController';

const containerWidth = 1000;

interface ICutterProps {
  file: File;
  handleFileChange: (file: File) => void;
}

export const Cutter: React.FC<ICutterProps> = ({ file, handleFileChange }) => {
  const [decoding, setDecoding] = useState<boolean>(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>(null);
  const [paused, setPaused] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(4);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);

  const { colorMode } = useColorMode();

  const handleCancel = () => {
    handleFileChange(null);
    setDecoding(false);
    setAudioBuffer(null);
    setPaused(true);
    setStartTime(0);
    setEndTime(4);
    setCurrentTime(0);
    setProcessing(false);
  };

  useEffect(() => {
    setPaused(true);
    setDecoding(true);
    setAudioBuffer(null);

    WebAudio.decode(file).then((audioBuffer) => {
      setPaused(false);
      setDecoding(false);
      setAudioBuffer(audioBuffer);
      setStartTime(0);
      setCurrentTime(0);
      setEndTime(audioBuffer.duration);
    });
  }, [file]);

  const handleStartTimeChange = (time: number) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time: number) => {
    setEndTime(time);
  };

  const handleCurrentTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlayPauseClick = () => {
    setPaused(!paused);
  };

  const handleReplayClick = () => {
    setCurrentTime(startTime);
  };

  return (
    <div className="container">
      {audioBuffer || decoding ? (
        <div>
          <h2 className="app-title">Audio Cutter</h2>

          {decoding ? (
            <div className="player player-landing">DECODING...</div>
          ) : (
            <>
              <Player
                audioBuffer={audioBuffer}
                paused={paused}
                startTime={startTime}
                endTime={endTime}
                currentTime={currentTime}
                onStartTimeChange={handleStartTimeChange}
                onEndTimeChange={handleEndTimeChange}
                onCurrentTimeChange={handleCurrentTimeChange}
                onSetPaused={handlePlayPauseClick}
                encoding={true}
                //   ref="player"
              />
              <AudioController
                audioBuffer={audioBuffer}
                isPaused={paused}
                startTime={startTime}
                endTime={endTime}
                handleCancel={() => handleFileChange(null)}
                fileName={file.name}
                handlePlayPauseClick={handlePlayPauseClick}
                handleReplayClick={handleReplayClick}
              />
            </>
          )}
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};
