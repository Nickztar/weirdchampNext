import {
  Flex,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import Guild from '../Guild';
import { DiscordGuild } from './../../types/DiscordTypes';

interface IGuildSelectionProps {
  guilds: DiscordGuild[];
  onGuildSet: (newGuild: DiscordGuild) => void;
}

export const GuildSelection: React.FC<IGuildSelectionProps> = ({
  guilds,
  onGuildSet,
}) => {
  const columns = useBreakpointValue({
    base: 1,
    md: guilds.length > 2 ? 3 : guilds.length,
  });
  return (
    <Flex
      flexDir="column"
      justifyContent="space-around"
      minH="70%"
      overflow="auto"
    >
      <Heading textAlign="center" as="h2" mb={4} size="xl">
        Select your prefered server!
      </Heading>
      <SimpleGrid columns={columns} h="100%" gap={6}>
        {guilds.map((guild, i) => {
          return (
            <Guild
              guild={guild}
              key={`${i}-guild`}
              guildClicked={() => onGuildSet(guild)}
            />
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};
