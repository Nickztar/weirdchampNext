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
      setEndTime(audioBuffer.duration / 2);
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

  const getWidthDurationRatio = (duration: number) => containerWidth / duration;

  const handlePlayPauseClick = () => {
    setPaused(!paused);
  };

  const handleReplayClick = () => {
    setCurrentTime(startTime);
  };

  const startByte = () => {
    return (
      (audioBuffer.length * startTime) /
      getWidthDurationRatio(audioBuffer.duration) /
      audioBuffer.duration
    );
  };

  const endByte = () => {
    return (
      (audioBuffer.length * endTime) /
      getWidthDurationRatio(audioBuffer.duration) /
      audioBuffer.duration
    );
  };

  //Used to export;
  const handleEncode = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const type = e.currentTarget.dataset.type;
    const { length, duration } = audioBuffer;
    const { encode } = await import('../../utils/worker-client');
    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      ~~((length * startTime) / duration),
      ~~((length * endTime) / duration)
    );

    setProcessing(true);

    encode(audioSliced, type)
      .then(readBlobURL)
      .then((url: string) => {
        download(url, rename(file.name, type));
      })
      .catch((e) => console.error(e))
      .then(() => {
        setProcessing(false);
      });
  };

  const displaySeconds = (seconds: number) => {
    return seconds.toFixed(2) + 's';
  };

  return (
    <div className="container">
      {audioBuffer || decoding ? (
        <div>
          <h2 className="app-title">Audio Cutter</h2>

          {decoding ? (
            <div className="player player-landing">DECODING...</div>
          ) : (
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
          )}
          <div className="controllers" style={{ display: 'flex' }}>
            <FilePicker OnChange={handleFileChange}>
              <div className="ctrl-item" title="Reselect File">
                <IoMusicalNotes
                  color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                />
              </div>
            </FilePicker>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <a
                className="ctrl-item"
                title="Play/Pause"
                onClick={handleCancel}
              >
                <IoTrash color={colorMode == 'light' ? '#1900ff' : '#ff0000'} />
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <a
                className="ctrl-item"
                title="Play/Pause"
                onClick={handlePlayPauseClick}
              >
                {paused ? (
                  <IoPlaySharp
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                ) : (
                  <IoPause
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                )}
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <a
                className="ctrl-item"
                title="Replay"
                onClick={handleReplayClick}
              >
                <IoReload
                  color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                />
              </a>
            </div>

            <div
              className="dropdown list-wrap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <a
                className="ctrl-item"
                data-type="wav"
                onClick={handleEncode}
                title="Download"
              >
                {processing ? (
                  <Spinner
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                ) : (
                  <IoCloudDownload
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                )}
              </a>
            </div>

            {isFinite(endTime) && (
              <span className="seconds">
                Select{' '}
                <span className="seconds-range">
                  {displaySeconds(endTime - startTime)}
                </span>{' '}
                of{' '}
                <span className="seconds-total">
                  {displaySeconds(audioBuffer?.duration ?? 0)}
                </span>{' '}
                (from{' '}
                <span className="seconds-start">
                  {displaySeconds(startTime)}
                </span>{' '}
                to{' '}
                <span className="seconds-end">{displaySeconds(endTime)}</span>)
              </span>
            )}
          </div>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};
