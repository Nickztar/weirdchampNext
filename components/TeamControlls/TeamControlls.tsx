import React, { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { FaRandom, FaUsersCog, FaUserPlus } from 'react-icons/fa';
import { FiMove } from 'react-icons/fi';
interface ITeamControllsProps {
  onRandomize: () => void;
  onAddUser: (name: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const TeamControlls: React.FC<ITeamControllsProps> = ({
  onRandomize,
  onAddUser,
  onConfirm,
  isLoading,
}) => {
  const [placeholderName, setPlaceholderName] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const focusRef = useRef(null);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const placeHolderFinish = () => {
    onAddUser(placeholderName);
    setPlaceholderName('');
    close();
  };
  return (
    <Flex
      w="20vw"
      h="100%"
      flexDir="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Button
        colorScheme="blue"
        textAlign="center"
        w="100%"
        onClick={onRandomize}
        isLoading={isLoading}
      >
        Randomize <Icon as={FaRandom} ml={2} />
      </Button>
      <Popover isOpen={isOpen} onClose={close} initialFocusRef={focusRef}>
        <PopoverTrigger>
          <Button
            colorScheme="pink"
            textAlign="center"
            mt={2}
            w="100%"
            isLoading={isLoading}
            onClick={open}
          >
            Add placeholder <Icon as={FaUsersCog} ml={2} />
          </Button>
        </PopoverTrigger>
        <PopoverContent shadow="xl">
          <PopoverArrow />
          <PopoverCloseButton zIndex={4} />
          <PopoverBody>
            <FormControl id="placeholder-name">
              <FormLabel maxW="80%">Name</FormLabel>
              <Input
                value={placeholderName}
                placeholder="Nickztar"
                autoComplete="off"
                ref={focusRef}
                onKeyUp={(e) => {
                  if (e.key == 'Enter' && !!placeholderName) {
                    placeHolderFinish();
                  }
                }}
                onChange={(e) => setPlaceholderName(e.target.value)}
              />
              <Button
                colorScheme="pink"
                textAlign="center"
                mt={4}
                disabled={!placeholderName}
                w="100%"
                onClick={placeHolderFinish}
              >
                Add {placeholderName} <Icon as={FaUserPlus} ml={2} />
              </Button>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Button
        colorScheme="purple"
        textAlign="center"
        mt={2}
        w="100%"
        onClick={onConfirm}
        isLoading={isLoading}
      >
        Confirm <Icon as={FiMove} ml={2} />
      </Button>
    </Flex>
  );
};
