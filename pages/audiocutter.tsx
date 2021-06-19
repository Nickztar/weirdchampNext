import React, { useState } from 'react';
import { isAudio } from '../utils/utils';
import { GetServerSideProps } from 'next';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import LandingPage from '../components/LandingPage';
import BannedPage from '../components/BannedPage';
import { NextSeo } from 'next-seo';
import AppLayout from '../components/AppLayout';
import { useColorMode, useToast } from '@chakra-ui/react';
import Head from 'next/head';
import CutterPicker from '../components/CutterPicker';
import Cutter from '../components/Cutter';

interface IAudioCutterProps {
  user: UserType | null;
}

export default function AudioCutter({
  user,
}: IAudioCutterProps): React.ReactChild {
  const [file, setFile] = useState<File>(null);
  const toast = useToast();
  const handleFileChange = async (file: File) => {
    if (file == null) {
      setFile(null);
      return;
    }
    if (!isAudio(file)) {
      toast({
        variant: `subtle`,
        title: 'Invalid file...',
        description: 'Please use a mp3 or wav file...',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setFile(null);
      return;
    }

    setFile(file);
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
        {file == null ? (
          <CutterPicker handleFileChange={handleFileChange} />
        ) : (
          <Cutter handleFileChange={handleFileChange} file={file} />
        )}
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
