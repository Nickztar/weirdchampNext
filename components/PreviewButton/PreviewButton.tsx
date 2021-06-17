import { Tooltip, IconButton, toast, useToast } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { S3File } from '../../types/APITypes';
import { IPreviewSound } from '../../types/generalTypes';
import Hashvatar from '../Hashvatar';
import { sha256, useHash } from '../Hashvatar/Hashvatar';

interface IPreviewButtonProps {
  SongKey: string;
  Index: number;
}

export const PreviewButton: React.FC<IPreviewButtonProps> = ({
  SongKey,
  Index,
}) => {
  const toast = useToast();
  const hash = useHash(SongKey);
  const handlePreview = async (key: string) => {
    if (!key) {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URI}/api/preview?key=${key}`
    );
    if (res.status === 200) {
      const json = (await res.json()) as IPreviewSound;

      const audio = new Audio(json.url);
      audio.onloadedmetadata = async () => {
        audio.volume = 0.1;
        toast({
          title: 'Preview playing...',
          status: 'success',
          position: 'top',
          duration: audio.duration * 1000,
          isClosable: false,
        });
        await audio.play();
      };
    } else {
      toast({
        title: 'Failed to get preview!',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Tooltip
      label="Play preview"
      placement="top"
      hasArrow
      aria-label="Play preview"
    >
      <IconButton
        key={`${Index}icon`}
        variant="ghost"
        h="84px"
        w="20%"
        padding={4}
        minH="100%"
        aria-label="Play preview"
        onClick={() => handlePreview(SongKey)}
        icon={<Hashvatar hash={hash} showGrid variant="spider" w="100%" h="100%" />}
      />
    </Tooltip>
  );
};
