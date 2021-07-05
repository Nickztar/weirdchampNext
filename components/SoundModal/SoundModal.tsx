import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  useDisclosure,
  useColorModeValue,
  Flex,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  useToast,
  Input,
} from '@chakra-ui/react';

import { useQuery, useQueryClient } from 'react-query';

import { AiFillStar } from 'react-icons/ai';
import { getSounds } from '../../utils/queries';
import { S3File } from '../../types/APITypes';
import { IoMusicalNotes } from 'react-icons/io5';
import { S3Fields } from '../../types/generalTypes';
import axios from 'axios';

export const SoundModal = ({ isAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [soundName, setSoundName] = useState(``);
  const [soundNameError, setSoundNameError] = useState(``);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>(null);
  const [soundError, setSoundError] = useState(``);
  const [success, setSuccess] = useState(``);

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`sounds`).catch(console.error);
      toast({
        variant: `subtle`,
        title: success === `addition` ? `Sound Added` : `Sound Modified`,
        description:
          success === `addition`
            ? `Your sound was successfully added as ${soundName}`
            : `Your change on ${soundName} was successful`,
        status: `success`,
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
      setFile(null);
      setSoundName('');
      setSuccess(null);
    }
  }, [success]);

  const initialRef = React.useRef();
  const { data: sounds } = useQuery(`sounds`, getSounds);

  const handleFileChange = () => {
    const file = fileRef.current?.files[0];
    if (file?.type == 'audio/mpeg' || file?.type == 'audio/wav') {
      setSoundError(``);
      setFile(file);
      setSoundName(file.name);
    } else {
      setSoundError(`Please select a mp3/wav sound!`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setSoundError(`Please select a valid sound!.`);
    } else if (
      sounds.filter((x) => x.key.replace(/(.wav)|(.mp3)/gm, '') === soundName)
        .length != 0
    ) {
      return setSoundNameError(`Please select a unique sound name!.`);
    }
    const fileExt = file.type == 'audio/mpeg' ? '.mp3' : '.wav';
    let localSoundName = soundName;

    if (!soundName.includes('.mp3') && !soundName.includes('.wav'))
      localSoundName += fileExt;

    const filename = encodeURIComponent(localSoundName);
    try {
      const newFile = new File([file], localSoundName);
      const formData = new FormData();
      formData.append('file', newFile);
      const upload = await axios.put(
        `/api/upload-url?file=${filename}&filetype=${file.type}`,
        formData,
        {
          headers: { 'Content-type': 'multipart/form-data' },
        }
      );

      if (upload.status == 200) {
        setSuccess('addition');
      } else {
        toast({
          variant: `subtle`,
          title: 'Failed to upload sounds',
          description: `Try again later or just give up :D`,
          status: `error`,
          position: 'top',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button
        variant="solid"
        colorScheme="purple"
        mr={isAdmin ? 0 : 3}
        display={{ base: 'none', md: 'block' }}
        leftIcon={<AddIcon />}
        onClick={() => onOpen()}
      >
        Add sound
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontSize="2xl" fontWeight="semibold">
              Add a sound
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel mb={3} fontSize="1.1em" fontWeight="semibold">
                Select Sound 🎵
              </FormLabel>
              <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  borderRadius="md"
                  color={useColorModeValue(`purple.700`, `purple.300`)}
                  px={4}
                  h={12}
                  fontSize="lg"
                  fontWeight="semibold"
                  border="2px solid transparent"
                  _hover={{
                    border: `2px solid ${useColorModeValue(
                      `#2c313d`,
                      `#939eb9`
                    )}`,
                  }}
                  background={useColorModeValue(`gray.100`, `#2c313d`)}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w={{ base: `full`, sm: `full` }}
                  mb={{ base: 2, sm: 0 }}
                  onClick={(e) => fileRef.current?.click()}
                  size="lg"
                  role="button"
                >
                  {file?.name ?? '1-4 seconds clip'}
                  <IoMusicalNotes size={25} style={{ marginLeft: '10px' }} />
                </Box>
                <Input
                  type="file"
                  zIndex="100"
                  visibility="hidden"
                  position="absolute"
                  width="100%"
                  height="100%"
                  top="0"
                  left="0"
                  ref={fileRef}
                  onChange={(e) => handleFileChange()}
                />
              </Box>
              {soundError && (
                <Text color={useColorModeValue(`red.600`, `red.300`)}>
                  {soundError}
                </Text>
              )}
              <FormLabel my={3} fontSize="1.1em" fontWeight="semibold">
                Select a name
              </FormLabel>
              <Input
                value={soundName}
                onChange={(e) => {
                  e.preventDefault();
                  setSoundNameError('');
                  return setSoundName(e.target.value);
                }}
                placeholder="Butterdog"
                color={useColorModeValue(`purple.700`, `purple.300`)}
                background={useColorModeValue(`gray.100`, `#2c313d`)}
              />
              {soundNameError && (
                <Text color={useColorModeValue(`red.600`, `red.300`)}>
                  {soundNameError}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.100`, `gray.800`)}
            borderBottomRadius="md"
          >
            <Button
              colorScheme="purple"
              mr={3}
              onClick={handleSubmit}
              isDisabled={!!(soundNameError || soundError)}
            >
              Add sound
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
