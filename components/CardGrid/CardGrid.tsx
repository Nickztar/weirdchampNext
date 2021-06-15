import {
  Container,
  SimpleGrid,
  useDisclosure,
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  chakra,
  useColorModeValue,
  useToast,
  useColorMode,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Card from '../Card';
import { UserType } from '../../models/user';
import { NextSeo } from 'next-seo';
import { PlayEndpointBodyType, S3File } from '../../types/APITypes';
import { IPreviewSound } from '../../types/generalTypes';
import { StarIcon } from '@chakra-ui/icons';

interface CardGridProps {
  sounds: { data: S3File[] };
  user: UserType;
  soundID?: string | string[];
}

export const CardGrid: React.FC<CardGridProps> = ({
  sounds: unSortedSounds,
  user,
  soundID,
}): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');

  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`otherToast`, {
      variant: `subtle`,
      title: 'Sound not found',
      description: 'The shared sound does not exist',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [colorMode]);

  useEffect(() => {
    if (soundID && !isOpen) {
      const foundSound = sounds.data.find((mv) => mv.Key === soundID);
      if (!foundSound) {
        toast({
          id: 'otherToast',
          variant: `subtle`,
          title: 'Sound not found',
          description: 'The shared sound does not exist',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      onOpen();
      return;
    }
  }, []);
  const handlePreview = async (sound: S3File) => {
    if (!sound) {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URI}/api/preview?key=${sound.Key}`
    );

    const json = (await res.json()) as IPreviewSound;
    const audio = new Audio(json.url);
    audio.volume = 0.1;
    await audio.play();

    if (res.status === 200) {
      toast({
        title: 'Preview playing!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handlePlay = async (sound: S3File) => {
    if (!sound) {
      return;
      // return setMovieError(`Please select a valid movie.`);
    }

    const data: PlayEndpointBodyType = {
      // eslint-disable-next-line no-underscore-dangle
      soundID: sound.Key,
      channelID: '621035571057524737',
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URI}/api/sounds`, {
      method: `post`,
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      toast({
        title: 'Sound playing!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sounds = {
    data: unSortedSounds?.data
      .filter((mv) => {
        if (mv.Key.toLowerCase().includes(filter.toLowerCase())) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (sort === 'recent') {
          return (
            new Date(b.LastModified).getTime() -
            new Date(a.LastModified).getTime()
          );
        } else if (sort === 'old') {
          return (
            new Date(a.LastModified).getTime() -
            new Date(b.LastModified).getTime()
          );
        } else if (sort === 'best') {
          return a.Size - b.Size;
        } else if (sort === 'worst') {
          return b.Size - a.Size;
        }
      }),
  };

  // if (sort === 'best' || sort === 'recent') {
  //   // sounds.data = sounds.data.reverse();
  // }

  return (
    <>
      <NextSeo
        openGraph={{
          title: `Weirdchamp`,
          type: `website`,
          site_name: `Weirdchamp`,
        }}
        description={'A private discord bot website'}
      />
      <Container maxW="container.xl" mt={10}>
        <Heading fontSize="6xl" textAlign="center">
          We have{' '}
          {
            <chakra.span color={useColorModeValue('purple.500', 'purple.300')}>
              {unSortedSounds?.data?.length}
            </chakra.span>
          }{' '}
          sounds
        </Heading>
        <Flex
          width="full"
          direction={{ base: 'column', md: 'row' }}
          my={7}
          justifyContent="space-between"
        >
          <InputGroup
            maxWidth={{ base: 'full', md: '200px' }}
            mb={{ base: 5, md: 0 }}
          >
            <InputLeftElement pointerEvents="none">
              <AiOutlineSearch color="gray.300" />
            </InputLeftElement>
            <Input
              variant="filled"
              type="text"
              placeholder="Search"
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            />
          </InputGroup>

          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />}>
              Sort by...
            </MenuButton>
            <MenuList zIndex={998}>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'recent'}
                onClick={() => setSort('recent')}
              >
                Recent
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'old'}
                onClick={() => setSort('old')}
              >
                Old
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'best'}
                onClick={() => setSort('best')}
              >
                Smallest
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'worst'}
                onClick={() => setSort('worst')}
              >
                Biggest
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          alignItems="stretch"
        >
          {sounds.data?.map((sound: S3File, i) => (
            <Flex key={`${i.toString()}flex`} maxW="100%">
              <Box
                height="full"
                width="full"
                maxW="90%"
                key={`${i.toString()}cardBox`}
                onClick={() => {
                  handlePlay(sound);
                  return onOpen();
                }}
              >
                <Card sound={sound} key={`${i.toString()}card`} />
              </Box>
              <Tooltip
                label="Play preview"
                placement="top"
                hasArrow
                aria-label="Play preview"
              >
                <IconButton
                  key={`${i.toString()}icon`}
                  variant="ghost"
                  h="100%"
                  minH="100%"
                  aria-label="Play preview"
                  onClick={() => handlePreview(sound)}
                  icon={<StarIcon size={18} />}
                />
              </Tooltip>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
