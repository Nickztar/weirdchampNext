import {
  Box,
  Button,
  chakra,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { IoMusicalNotes } from 'react-icons/io5';
import FilePicker from '../FilePicker';
import YoutubeFile from '../YoutubeFile';

interface ICutterPicker {
  handleFileChange: (file: File) => void;
}

export const CutterPicker: React.FC<ICutterPicker> = ({ handleFileChange }) => {
  return (
    <Box>
      <chakra.h1 fontSize="4xl" textAlign="center" mb={10}>
        Audio cutter
      </chakra.h1>
      <SimpleGrid
        columns={2}
        spacing={10}
        w={{ base: `full`, sm: `80%` }}
        mx="auto"
      >
        <FilePicker OnChange={handleFileChange}>
          <Box
            borderRadius="md"
            color={useColorModeValue(`purple.700`, `purple.300`)}
            px={4}
            h={12}
            fontSize="lg"
            fontWeight="semibold"
            border="2px solid transparent"
            _hover={{
              border: `2px solid ${useColorModeValue(`#2c313d`, `#939eb9`)}`,
            }}
            background={useColorModeValue(`gray.100`, `#2c313d`)}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: `full`, sm: `auto` }}
            mb={{ base: 2, sm: 0 }}
            size="lg"
          >
            Select file
          </Box>
          {/* <Button colorScheme="blue" pointerEvents="none">
        </Button> */}
        </FilePicker>
        <YoutubeFile OnChange={handleFileChange} />
      </SimpleGrid>
    </Box>
  );
};
