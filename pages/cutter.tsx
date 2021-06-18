import React, { useState } from 'react';
import FilePicker from '../components/FilePicker';
import Player from '../components/Player';
import { download, isAudio, readBlobURL, rename } from '../utils/utils';
import WebAudio from '../utils/webaudio';
import { GetServerSideProps } from 'next';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import LandingPage from '../components/LandingPage';
import BannedPage from '../components/BannedPage';
import { NextSeo } from 'next-seo';
import AppLayout from '../components/AppLayout';
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
import { sliceAudioBuffer } from '../utils/audio-helper';
import YoutubeFile from '../components/YoutubeFile';
import Head from 'next/head';

const containerWidth = 1000;

interface ICutterProps {
  user: UserType | null;
}

export default function Cutter({ user }: ICutterProps): React.ReactChild {
  const [file, setFile] = useState<File>(null);
  const [decoding, setDecoding] = useState<boolean>(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>(null);
  const [paused, setPaused] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(4);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);

  const { colorMode } = useColorMode();

  const handleCancel = () => {
    setFile(null);
    setDecoding(false);
    setAudioBuffer(null);
    setPaused(true);
    setStartTime(0);
    setEndTime(4);
    setCurrentTime(0);
    setProcessing(false);
  };

  const handleFileChange = async (file: File) => {
    if (!isAudio(file)) {
      alert('Not a music file wtf');
      return;
    }

    setFile(file);
    setPaused(true);
    setDecoding(true);
    setAudioBuffer(null);

    const audioBuffer = await WebAudio.decode(file);

    setFile(file);
    setPaused(false);
    setDecoding(false);
    setAudioBuffer(audioBuffer);
    setStartTime(0);
    setCurrentTime(0);
    setEndTime(audioBuffer.duration / 2);
  };

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
    const { encode } = await import('../utils/worker-client');
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

  if (!user) {
    return <LandingPage />;
  }
  if (user.isBanned) {
    return <BannedPage user={user} />;
  }

  return (
    <>
      <NextSeo title="Upload" />
      <Head>
        <>
          <script
            src="worker.js"
            type="text/js-worker"
            x-audio-encode="true"
          ></script>
          <link rel="stylesheet" href="cutter.css"></link>
        </>
      </Head>
      <AppLayout user={user}>
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
              <div className="controllers">
                <FilePicker OnChange={handleFileChange}>
                  <div className="ctrl-item" title="Reselect File">
                    <IoMusicalNotes
                      color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                    />
                  </div>
                </FilePicker>
                <a
                  className="ctrl-item"
                  title="Play/Pause"
                  onClick={handleCancel}
                >
                  <IoTrash
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                </a>
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

                <a
                  className="ctrl-item"
                  title="Replay"
                  onClick={handleReplayClick}
                >
                  <IoReload
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                </a>

                <div className="dropdown list-wrap">
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
                    <span className="seconds-end">
                      {displaySeconds(endTime)}
                    </span>
                    )
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="landing">
              <h2>Audio Cutter</h2>
              <FilePicker OnChange={handleFileChange}>
                <div className="file-main">
                  Select music file
                  <IoMusicalNotes
                    size={30}
                    color={colorMode == 'light' ? '#1900ff' : '#ff0000'}
                  />
                </div>
              </FilePicker>
              <YoutubeFile OnChange={handleFileChange} />
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType = await parseUser(ctx);

  if (!user) {
    return { props: { user: null } };
  }
  return { props: { user } };
};
