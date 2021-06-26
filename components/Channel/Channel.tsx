import { Box, Text, useColorModeValue, Flex, chakra } from '@chakra-ui/react';

import { DiscordChannel } from '../../types/DiscordTypes';

interface IChannelProps {
  channel: DiscordChannel;
  onClick: () => void;
}

export const Channel: React.FC<IChannelProps> = ({
  channel,
  onClick,
}): React.ReactElement => {
  return (
    <chakra.div
      onClick={onClick}
      role="button"
      position="relative"
      direction="column"
      maxW="min(90vw, 400px)"
      w="full"
      maxH={88}
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
      alignSelf="center"
      justifySelf="center"
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
        >
          Select
        </Text>
      </Box>
      <Flex isTruncated direction="column" justifyContent="space-between">
        <Flex direction={'column'} isTruncated>
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              as="h3"
              color={useColorModeValue(`gray.700`, `white`)}
              fontSize="2xl"
              fontWeight="bold"
              isTruncated
            >
              {channel.name}: {`${channel.currentUsers.length} users`}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </chakra.div>
  );
};
