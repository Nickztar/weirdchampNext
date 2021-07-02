import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import Guild from '../Guild';
import GuildPlaceholder from '../GuildPlaceholder';
import { DiscordGuild } from './../../types/DiscordTypes';

interface IGuildSelectionProps {
  guilds: DiscordGuild[];
  onGuildSet: (newGuild: DiscordGuild) => void;
  onSkip: () => void;
}

const getColumnValue = (guilds: DiscordGuild[]) => {
  if (guilds == null) return 2;
  if (guilds.length > 2) return 3;
  return guilds.length;
};

export const GuildSelection: React.FC<IGuildSelectionProps> = ({
  guilds,
  onGuildSet,
  onSkip,
}) => {
  const columns = useBreakpointValue({
    base: 1,
    md: getColumnValue(guilds),
  });
  return (
    <Flex
      flexDir="column"
      justifyContent="space-around"
      minH="70%"
      overflow="auto"
    >
      <Flex mx="auto" alignItems="center" mb={4}>
        <Button opacity="0" userSelect="none" pointerEvents="none">
          Skip step
        </Button>
        <Heading textAlign="center" as="h2" mx={4} size="xl">
          Select your prefered server!
        </Heading>
        <Button colorScheme="purple" onClick={onSkip}>
          Skip step
        </Button>
      </Flex>

      <SimpleGrid columns={columns} h="100%" gap={6}>
        {guilds != null ? (
          guilds.map((guild, i) => {
            return (
              <Guild
                guild={guild}
                key={`${i}-guild`}
                guildClicked={() => onGuildSet(guild)}
              />
            );
          })
        ) : (
          <>
            <GuildPlaceholder />
            <GuildPlaceholder />
          </>
        )}
      </SimpleGrid>
    </Flex>
  );
};
