import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { DiscordChannel } from '../../types/DiscordTypes';
import Channel from '../Channel';

interface IChannelSelectionProps {
  channels: DiscordChannel[];
  onChannelsSet: (selectedChannels: [DiscordChannel, DiscordChannel]) => void;
  onServerChange: () => void;
}

export const ChannelSelection: React.FC<IChannelSelectionProps> = ({
  channels,
  onChannelsSet,
  onServerChange,
}) => {
  const [firstChannel, setFirstChannel] = useState<DiscordChannel>(null);
  const handleSecondChannel = (channel: DiscordChannel) => {
    onChannelsSet([firstChannel, channel]);
  };
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const availableChannels = channels.filter((c) =>
    firstChannel == null ? true : c.id != firstChannel.id
  );

  return (
    <>
      <Flex
        w="100%"
        justifyContent="space-around"
        alignItems="center"
        flexDir={{ base: 'column-reverse', md: 'unset' }}
        mb={4}
      >
        <Button
          variant="solid"
          colorScheme="purple"
          opacity="0"
          pointerEvents="none"
          aria-hidden="true"
        >
          Change server
        </Button>
        <Heading textAlign="center" as="h2" size="xl">
          {firstChannel == null
            ? 'Select your starting channel:'
            : `Moving from ${firstChannel.name} to:`}
        </Heading>
        <Button
          variant="solid"
          colorScheme="purple"
          onClick={onServerChange}
          maxW={150}
        >
          Change server
        </Button>
      </Flex>
      <SimpleGrid columns={columns} gap={6} my={16}>
        {availableChannels.map((channel, i) => {
          return (
            <Channel
              key={`${i}-channel`}
              channel={channel}
              onClick={() =>
                firstChannel == null
                  ? setFirstChannel(channel)
                  : handleSecondChannel(channel)
              }
            />
          );
        })}
      </SimpleGrid>
    </>
  );
};
