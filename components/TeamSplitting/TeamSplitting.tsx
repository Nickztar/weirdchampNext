import { Button, Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { DiscordChannel, DiscordGuild } from '../../types/DiscordTypes';
import ChannelSelection from '../ChannelSelection';
import GuildSelection from '../GuildSelection';
import TeamDivision from '../TeamDivision';

interface ITeamSplittingProps {
  data: DiscordGuild[];
}

export const TeamSplitting: React.FC<ITeamSplittingProps> = ({ data }) => {
  const [guild, setGuild] = useState<DiscordGuild>(null);
  const [channels, setSelectedChannels] = useState<
    [DiscordChannel?, DiscordChannel?]
  >(null);
  const breakPointValue = useBreakpointValue({ base: false, md: true });

  if (!breakPointValue) {
    return (
      <Flex
        alignItems="center"
        flexDir="column"
        justifyContent="center"
        h="50%"
      >
        <Heading as="h2" size="md">
          Not available on mobile yet...
        </Heading>
        <Link href="/">
          <Button my={4} colorScheme="purple">
            Go home
          </Button>
        </Link>
      </Flex>
    );
  }

  if (guild == null) {
    return <GuildSelection guilds={data} onGuildSet={setGuild} />;
  } else if (channels == null) {
    return (
      <ChannelSelection
        channels={guild.channels}
        onChannelsSet={(channels) => setSelectedChannels(channels)}
        onServerChange={() => {
          setGuild(null);
          setSelectedChannels(null);
        }}
      />
    );
  }
  const [FirstChannel, SecondChannel] = channels;
  return (
    <TeamDivision
      guild={guild}
      firstChannel={FirstChannel}
      secondChannel={SecondChannel}
      changeServer={() => {
        setGuild(null);
        setSelectedChannels(null);
      }}
    />
  );
};
