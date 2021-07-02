import { Box, Text, useColorModeValue, Flex, chakra } from '@chakra-ui/react';

import { S3File } from '../../types/APITypes';

interface CardProps {
  sound: S3File;
  isLoading: boolean;
}

export const Card: React.FC<CardProps> = ({
  sound,
  isLoading,
}): React.ReactElement => {
  return (
    <chakra.div
      position="relative"
      direction="column"
      maxW="400px"
      w="full"
      bg={useColorModeValue(`white`, `gray.900`)}
      boxShadow="xl"
      rounded="md"
      transition="all 0.25s"
      transitionTimingFunction="spring(1 100 10 10)"
      p={6}
      _hover={{
        transform: `translateY(-4px)`,
        shadow: `2xl`,
        cursor: 'pointer',
      }}
      overflow="hidden"
      height="full"
    >
      <Box
        opacity={0}
        top={0}
        zIndex={10}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        transition="all 0.25s"
        bg={useColorModeValue(`white`, `gray.800`)}
        transitionTimingFunction="spring(1 100 10 10)"
        _hover={{
          opacity: 0.95,
          shadow: `2xl`,
        }}
      >
        <Text
          fontSize="4xl"
          fontWeight="semibold"
          color={useColorModeValue(`gray.800`, `white`)}
          _after={
            isLoading
              ? {
                  animation: 'dots 1s steps(5, end) infinite',
                  content: '"."',
                }
              : {}
          }
        >
          {isLoading ? 'Loading' : 'Play'}
        </Text>
      </Box>
      <Box mt={-6} mx={-6} mb={6} pos="relative"></Box>

      <Flex isTruncated direction="column" justifyContent="space-between">
        <Flex direction={'column'} isTruncated>
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              as="h3"
              color={useColorModeValue(`gray.700`, `white`)}
              fontSize="2xl"
              fontWeight="bold"
              isTruncated={!isLoading}
              _after={
                isLoading
                  ? {
                      animation: 'dots 1s steps(5, end) infinite',
                      content: '"."',
                    }
                  : {}
              }
            >
              {isLoading ? 'Loading' : sound.DisplayName}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </chakra.div>
  );
};
