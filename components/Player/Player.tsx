import React, { useCallback, useEffect, useRef, useState } from 'react';
import Waver from '../Waver';
import Dragger from '../Dragger';
import WebAudio from '../../utils/webaudio';
import { IOnDrag } from '../../types/generalTypes';
import Timestamp from '../Timestamp';
import { useColorMode } from '@chakra-ui/react';

const containerWidth = 1000;
const containerHeight = 160;

function getClipRect(start: number, end: number) {
  return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`;
}

const color1 = '#1900ff';
const darkColor1 = '#ff0000';
const color2 = '#6e9fe9';
const darkColor2 = '#fc2424';
const gray1 = '#ddd';
const gray2 = '#e3e3e3';

interface IPlayer {
  encoding: boolean;
  audioBuffer: AudioBuffer;
  paused: boolean;
  startTime: number;
  endTime: number;
  currentTime: number;

  onStartTimeChange: (n: number) => void;
  onEndTimeChange: (n: number) => void;
  onCurrentTimeChange: (n: number) => void;
  onSetPaused: () => void;
}

export const Player: React.FC<IPlayer> = (props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audio, setAudio] = useState<WebAudio>();
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const endTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const [current, setCurrent] = useState<number>(0);

  const { colorMode } = useColorMode();

  const widthDurationRatio: number =
    containerWidth / props.audioBuffer.duration;

  const clean = () => {
    audio && audio.destroy();
  };

  const initWebAudio = (audioBuffer: AudioBuffer) => {
    clean();

    const audio = new WebAudio(audioBuffer);
    audio.on('process', onAudioProcess);
    audio.on('end', onAudioProcessEnd);

    if (!props.paused) {
      audio.play(currentTimeRef.current);
    }

    setAudio(audio);
  };

  const keepInRange = (x: number) => {
    if (x < 0) {
      return 0;
    }

    if (x > containerWidth) {
      return containerWidth;
    }

    return x;
  };

  function onAudioProcess(current: number) {
    if (current >= endTimeRef.current) {
      props.onSetPaused();
      props.onCurrentTimeChange(startTimeRef.current || 0);
    } else {
      setCurrentTime(current);
      props.onCurrentTimeChange(current);
    }
  }

  const onAudioProcessEnd = () => {
    const { paused } = props;
    const startTime = startTimeRef.current;
    const currentTime = currentTimeRef.current;
    if (paused) {
      let newCurrentTime = 0;

      if (startTime > 0 && currentTime < startTime) {
        newCurrentTime = startTime;
      } else {
        newCurrentTime = currentTime;
      }

      props.onCurrentTimeChange(newCurrentTime);
    } else {
      props.onSetPaused();
      props.onCurrentTimeChange(startTime || 0);
    }
  };

  const dragEnd = (pos: IOnDrag) => {
    props.onEndTimeChange(pos2Time(keepInRange(pos.x)));
  };

  const dragCurrent = (pos: IOnDrag) => {
    props.onCurrentTimeChange(pos2Time(keepInRange(pos.x)));
  };

  const dragStart = (pos: IOnDrag) => {
    props.onStartTimeChange(pos2Time(keepInRange(pos.x)));
  };

  const pos2Time = (pos: number) => {
    return pos / widthDurationRatio;
  };

  const time2pos = (time: number) => {
    return time * widthDurationRatio;
  };

  useEffect(() => {
    if (props.paused) {
      audio && audio.pause();
    } else {
      audio && audio.play(currentTimeRef.current);
    }
  }, [props.paused]);

  useEffect(() => {
    initWebAudio(props.audioBuffer);
  }, [props.audioBuffer]);

  useEffect(() => {
    startTimeRef.current = props.startTime;
    setStart(time2pos(props.startTime));
  }, [props.startTime]);

  useEffect(() => {
    endTimeRef.current = props.endTime;
    setEnd(time2pos(props.endTime));
  }, [props.endTime]);

  useEffect(() => {
    if (!props.paused && currentTime !== props.currentTime) {
      audio && audio.play(props.currentTime);
    }
    currentTimeRef.current = props.currentTime;
    setCurrent(time2pos(props.currentTime));
  }, [props.currentTime]);

  return (
    <div className="player">
      <div className="clipper">
        <Waver
          audioBuffer={props.audioBuffer}
          width={containerWidth}
          height={containerHeight}
          color1={gray1}
          color2={gray2}
        />
      </div>
      <div className="clipper" style={{ clip: getClipRect(start, end) }}>
        <Waver
          audioBuffer={props.audioBuffer}
          width={containerWidth}
          height={containerHeight}
          color1={colorMode == 'light' ? color1 : darkColor1}
          color2={colorMode == 'light' ? color2 : darkColor2}
        />
      </div>
      <Dragger x={start} onDrag={dragStart} />
      <Dragger className="drag-current" x={current} onDrag={dragCurrent}>
        <Timestamp currentTime={currentTimeRef.current} />
      </Dragger>
      <Dragger x={end} onDrag={dragEnd} />
    </div>
  );
};
