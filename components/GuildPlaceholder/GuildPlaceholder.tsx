import { Box, useColorModeValue, Heading, Skeleton } from '@chakra-ui/react';
import React from 'react';

export const GuildPlaceholder: React.FC = () => {
  return (
    <Box
      w="xs"
      mx={4}
      borderRadius="lg"
      border="2px solid transparent"
      overflow="hidden"
      justifySelf="center"
      alignSelf="center"
      bg={useColorModeValue(`white`, `gray.900`)}
      boxShadow="xl"
      rounded="md"
      transition="all 0.25s"
      transitionTimingFunction="spring(1 100 10 10)"
      _hover={{
        border: `2px solid ${useColorModeValue(`black`, `white`)}`,
        transform: `translateY(-4px)`,
        shadow: `2xl`,
        cursor: 'pointer',
      }}
    >
      <Skeleton w="full" h="316px" />
      <Box p="6" bg="">
        <Heading textAlign="center" as="h2" size="xl" isTruncated>
          Loading...
        </Heading>
      </Box>
    </Box>
  );
};
