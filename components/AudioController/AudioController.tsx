import React, { useState } from 'react';
import {
  IoCloudDownload,
  IoPause,
  IoPlaySharp,
  IoReload,
  IoTrash,
} from 'react-icons/io5';
import {
  IconButton,
  Spinner,
  Tooltip,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { download, readBlobURL, rename } from '../../utils/utils';
import { sliceAudioBuffer } from '../../utils/audio-helper';
import { VscDebugRestart } from 'react-icons/vsc';

interface IAudioControllerProps {
  handleCancel: () => void;
  handlePlayPauseClick: () => void;
  handleReplayClick: () => void;
  audioBuffer: AudioBuffer;
  startTime: number;
  endTime: number;
  fileName: string;
  isPaused: boolean;
}

export const AudioController: React.FC<IAudioControllerProps> = ({
  handleCancel,
  handlePlayPauseClick,
  handleReplayClick,
  audioBuffer,
  startTime,
  endTime,
  fileName,
  isPaused,
}) => {
  const [processing, setProcessing] = useState<boolean>(false);

  //Used to export;
  const handleEncode = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
        download(url, rename(fileName, type));
      })
      .catch((e) => console.error(e))
      .then(() => {
        setProcessing(false);
      });
  };

  const displaySeconds = (seconds: number) => {
    return seconds.toFixed(2) + 's';
  };

  const TimeTooltip = () => {};

  return (
    <div className="controllers" style={{ display: 'flex' }}>
      <Tooltip hasArrow placement="top" label="Reset" colorScheme="purple">
        <IconButton
          variant="solid"
          colorScheme="purple"
          aria-label="Reset"
          mr={2}
          onClick={handleCancel}
        >
          <IoTrash />
        </IconButton>
      </Tooltip>
      <Tooltip
        hasArrow
        placement="top"
        label={isPaused ? 'Play' : 'Pause'}
        colorScheme="purple"
      >
        <IconButton
          variant="solid"
          colorScheme="purple"
          aria-label="Play/Pause"
          mx={2}
          onClick={handlePlayPauseClick}
        >
          {isPaused ? <IoPlaySharp /> : <IoPause />}
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow placement="top" label="Replay" colorScheme="purple">
        <IconButton
          variant="solid"
          colorScheme="purple"
          aria-label="Replay"
          mx={2}
          onClick={handleReplayClick}
        >
          <VscDebugRestart />
        </IconButton>
      </Tooltip>
      <Tooltip
        hasArrow
        placement="top"
        label="Download as MP3"
        colorScheme="purple"
      >
        <IconButton
          variant="solid"
          colorScheme="purple"
          aria-label="Download"
          data-type="mp3"
          mx={2}
          onClick={handleEncode}
        >
          {processing ? <Spinner /> : <IoCloudDownload />}
        </IconButton>
      </Tooltip>

      {isFinite(endTime) && (
        <span className="seconds">
          <Tooltip
            hasArrow
            placement="top"
            label={`(from ${displaySeconds(startTime)} to ${displaySeconds(
              endTime
            )})`}
            colorScheme="purple"
          >
            <Text
              fontSize="3xl"
              color={useColorModeValue(`purple.700`, `purple.300`)}
            >
              {displaySeconds(endTime - startTime) + ' '}
              of {displaySeconds(audioBuffer?.duration ?? 0)}
            </Text>
          </Tooltip>
          {/* <span className="seconds-total"></span> (from{' '}
          <span className="seconds-start">{displaySeconds(startTime)}</span> to{' '}
          <span className="seconds-end">{displaySeconds(endTime)}</span>) */}
        </span>
      )}
    </div>
  );
};
