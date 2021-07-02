import {
  Avatar,
  Flex,
  IconButton,
  Input,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';

interface ITeamPlaceholderProps {
  handleAdd: (name: string) => void;
}

export const TeamPlaceholder: React.FC<ITeamPlaceholderProps> = ({
  handleAdd,
}) => {
  const [placeholderName, setPlaceholderName] = useState<string>('');

  return (
    <Flex
      alignItems="center"
      p={2}
      mb={2}
      userSelect="none"
      bg={useColorModeValue(`white`, `gray.900`)}
      boxShadow="xl"
      rounded="md"
    >
      <Avatar
        icon={<AiOutlineUser fontSize="1.5rem" />}
        color={useColorModeValue(`white`, `gray.900`)}
        bg={useColorModeValue(`gray.900`, `white`)}
      />
      <Input
        ml={4}
        value={placeholderName}
        placeholder="Placeholder"
        borderColor="purple.300"
        onChange={(e) => setPlaceholderName(e.target.value)}
        onKeyUp={(e) => {
          if (e.key == 'Enter' && !!placeholderName) {
            handleAdd(placeholderName);
            setPlaceholderName('');
          }
        }}
      />
      <Tooltip label={'Add placeholder'} placement="top">
        <IconButton
          onClick={() => {
            if (!placeholderName) return;
            handleAdd(placeholderName);
            setPlaceholderName('');
          }}
          aria-label={'Add placeholder'}
          ml={2}
          colorScheme={'purple'}
          variant="solid"
          icon={<IoMdAdd />}
        />
      </Tooltip>
    </Flex>
  );
};
