import React, { useCallback, useEffect, useRef, useState } from 'react';
import Waver from '../Waver';
import Dragger from '../Dragger';
import WebAudio from '../../utils/webaudio';
import { IOnDrag } from '../../types/generalTypes';
import Timestamp from '../Timestamp';
import { Box } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const containerWidth = 1000;
const containerHeight = 160;

function getClipRect(start: number, end: number) {
  return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`;
}

const color = '#00ff8e';
const gray = '#5f8b78eb';

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
  const endTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

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
  }, [props.startTime]);

  useEffect(() => {
    endTimeRef.current = props.endTime;
  }, [props.endTime]);

  useEffect(() => {
    if (!props.paused && currentTime !== props.currentTime) {
      audio && audio.play(props.currentTime);
    }
    currentTimeRef.current = props.currentTime;
  }, [props.currentTime]);

  useEffect(() => {
    return () => {
      clean();
    };
  }, []);

  return (
    <Box
      className="player"
      background="linear-gradient(180deg,#003d75,#232b56)"
      borderRadius="4px"
    >
      <div className="clipper">
        <Waver
          audioBuffer={props.audioBuffer}
          width={containerWidth}
          height={containerHeight}
          color={gray}
          IsBackground={true}
        />
      </div>
      <div
        className="clipper"
        style={{
          clip: getClipRect(time2pos(props.startTime), time2pos(props.endTime)),
        }}
      >
        <Waver
          IsBackground={false}
          audioBuffer={props.audioBuffer}
          width={containerWidth}
          height={containerHeight}
          color={color}
        />
      </div>
      <Dragger
        IsSideDragger={true}
        IsLeft={true}
        x={time2pos(props.startTime)}
        onDrag={dragStart}
      >
        <BsThreeDotsVertical
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '100%',
            color: 'white',
            transform: 'translateY(-50%) scale(2)',
            pointerEvents: 'none',
          }}
        />
      </Dragger>
      <Dragger
        IsSideDragger={false}
        className="drag-current"
        x={time2pos(props.currentTime)}
        onDrag={dragCurrent}
      >
        <Timestamp currentTime={currentTimeRef.current} />
      </Dragger>
      <Dragger
        IsSideDragger={true}
        IsLeft={false}
        x={time2pos(props.endTime)}
        onDrag={dragEnd}
      >
        <BsThreeDotsVertical
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '100%',
            transform: 'translateY(-50%) scale(2)',
            color: 'white',
            pointerEvents: 'none',
          }}
        />
      </Dragger>
    </Box>
  );
};
