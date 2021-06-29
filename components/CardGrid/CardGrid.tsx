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
  Spinner,
  Skeleton,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import React, { useState } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { UserType } from '../../models/user';
import { PlayEndpointBodyType, S3File } from '../../types/APITypes';
import LazyLoad from 'react-lazyload';
import SoundCard from '../SoundCard';

interface CardGridProps {
  sounds: S3File[];
  user: UserType;
  soundID?: string | string[];
  isFetching: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({
  sounds: unSortedSounds,
  user,
  soundID,
  isFetching,
}): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const gridRef = useRef(null);
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
    data: useMemo(
      () =>
        unSortedSounds
          ?.filter((mv) => {
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
            } else if (sort === 'name') {
              const nameA = a.Key.toLowerCase();
              const nameB = b.Key.toLowerCase();
              if (nameA < nameB)
                //sort string ascending
                return -1;
              if (nameA > nameB) return 1;
              return 0; //default return value (no sorting)
            }
          }),
      [unSortedSounds, sort]
    ),
  };

  return (
    <>
      <Container maxW="container.xl" mt={10}>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="full"
          position="relative"
        >
          <Heading fontSize="6xl" textAlign="center">
            We have{' '}
            {
              <chakra.span
                color={useColorModeValue('purple.500', 'purple.300')}
              >
                {unSortedSounds?.length}
              </chakra.span>
            }{' '}
            sounds
          </Heading>
          {isFetching && (
            <Spinner
              mx={4}
              position="absolute"
              top="-3rem"
              right={0}
              color="purple.300"
              thickness="4px"
              size="xl"
              emptyColor="gray.200"
            />
          )}
        </Flex>
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
              Sort by: {sort[0].toUpperCase() + sort.slice(1)}
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
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'name'}
                onClick={() => setSort('name')}
              >
                Name
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          ref={gridRef}
          alignItems="stretch"
        >
          {sounds.data?.map((sound: S3File, i) => (
            <LazyLoad
              placeholder={
                <Skeleton height={84} borderRadius={10} w={'100%'}></Skeleton>
              }
              height={84}
              scrollContainer={'#__next'}
              key={`${i.toString()}flex`}
            >
              <SoundCard
                handleClick={() => {
                  handlePlay(sound);
                  return onOpen();
                }}
                index={i}
                sound={sound}
              />
            </LazyLoad>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
