import { Box, Image, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { DiscordGuild } from '../../types/DiscordTypes';

interface IGuildProps {
  guild: DiscordGuild;
  guildClicked: () => void;
}

export const Guild: React.FC<IGuildProps> = ({ guild, guildClicked }) => {
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
      onClick={guildClicked}
    >
      <Image w="full" src={guild.icon} alt={guild.name} />

      <Box p="6" bg="">
        <Heading textAlign="center" as="h2" size="xl" isTruncated>
          {guild.name}
        </Heading>
      </Box>
    </Box>
  );
};
