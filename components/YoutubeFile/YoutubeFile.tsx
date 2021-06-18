import React, { useRef, useState } from 'react';
import {
  Button,
  Icon,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { BlobToFile } from '../../utils/utils';
interface IYoutubeFile {
  OnChange: (file: File) => void;
}
const regYoutube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
export const YoutubeFile: React.FC<IYoutubeFile> = (props) => {
  const [keyState, setKeyState] = useState<number>(0);
  const [url, setUrl] = useState<string>('');
  const toast = useToast();

  const isInvalid = !url.match(regYoutube);

  const handleClick = async () => {
    if (isInvalid) return;
    const res = await fetch(
      `${process.env.BOT_URL}/api/youtube/mp3?videoUrl=${url}`
    );

    if (res.status === 200) {
      const blob = await res.blob();
      setKeyState(keyState + 1);
      props.OnChange(BlobToFile(blob, 'file.mp3'));
    } else if (res.status == 403) {
      toast({
        variant: `subtle`,
        title: 'Video is too long...',
        description: 'Try process somewhere else Sadge...',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        variant: `subtle`,
        title: 'Video was not found...',
        description: 'Try using something else...',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Input
        placeholder="Enter a valid youtube url..."
        value={url}
        key={keyState}
        isInvalid={isInvalid}
        onChange={(e) => setUrl(e.currentTarget.value)}
      />
      <Button
        variant="solid"
        disabled={isInvalid}
        color={useColorModeValue(`purple.700`, `purple.300`)}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w={{ base: `full`, sm: `auto` }}
        mx="auto"
        mb={{ base: 2, sm: 0 }}
        size="lg"
        onClick={handleClick}
      >
        Get Sound
        <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </Icon>
      </Button>
    </>
  );
};
