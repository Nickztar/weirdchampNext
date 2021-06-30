import { Flex, Box } from '@chakra-ui/react';
import React from 'react';
import { S3File } from '../../types/APITypes';
import Card from '../Card';
import PreviewButton from '../PreviewButton';
interface ISoundCardProps {
  handleClick: () => void;
  sound: S3File;
  index: number;
}

export const SoundCard: React.FC<ISoundCardProps> = ({
  handleClick,
  sound,
  index,
}) => {
  return (
    <Flex maxW="100%">
      <Box height="full" width="full" maxW="80%" onClick={handleClick}>
        <Card sound={sound} key={`${index.toString()}card`} />
      </Box>
      <PreviewButton SongKey={sound.key} hash={sound.NameHash} Index={index} />
    </Flex>
  );
};
