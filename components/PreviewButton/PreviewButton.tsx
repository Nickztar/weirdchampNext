import { Tooltip, IconButton, useToast } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { IPreviewSound } from '../../types/generalTypes';
import Hashvatar from '../Hashvatar';

interface IPreviewButtonProps {
  SongKey: string;
  hash: string;
  Index: number;
}

export const PreviewButton: React.FC<IPreviewButtonProps> = ({
  SongKey,
  Index,
  hash,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handlePreview = async (key: string) => {
    if (!key) {
      return;
    }
    setIsLoading(true);
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
        setIsLoading(false);
      };
    } else {
      toast({
        title: 'Failed to get preview!',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
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
        isLoading={isLoading}
        variant="ghost"
        h="84px"
        w="20%"
        padding={4}
        minH="100%"
        aria-label="Play preview"
        onClick={() => handlePreview(SongKey)}
        icon={
          <Hashvatar hash={hash} showGrid variant="spider" w="100%" h="100%" />
        }
      />
    </Tooltip>
  );
};
