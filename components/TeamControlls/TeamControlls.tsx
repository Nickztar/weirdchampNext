import React from 'react';
import { Button, Flex, Icon } from '@chakra-ui/react';
import { FaRandom } from 'react-icons/fa';
import { FiMove } from 'react-icons/fi';
interface ITeamControllsProps {
  onRandomize: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const TeamControlls: React.FC<ITeamControllsProps> = ({
  onRandomize,
  onConfirm,
  isLoading,
}) => {
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
