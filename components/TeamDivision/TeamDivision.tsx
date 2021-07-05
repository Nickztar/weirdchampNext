import React, { useEffect, useState } from 'react';
import {
  DiscordChannel,
  DiscordGuild,
  MoveModel,
  TeamPlayer,
} from '../../types/DiscordTypes';
import { DragDropContext } from 'react-beautiful-dnd';
import { reorderColumns } from '../../utils/reorder';
import TeamList from '../TeamList';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import TeamControlls from '../TeamControlls';
import { ShuffleArray } from '../../utils/shuffle';
import { generate } from 'shortid';
import { FiMove } from 'react-icons/fi';
import { FaRandom } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { IoMdRefresh } from 'react-icons/io';

interface ITeamDivisionProps {
  guild: DiscordGuild;
  firstChannel: DiscordChannel;
  secondChannel: DiscordChannel;
  changeServer: () => void;
}

export const TeamDivision: React.FC<ITeamDivisionProps> = ({
  guild,
  firstChannel,
  secondChannel,
  changeServer,
}) => {
  const [columns, setColumns] = useState<DiscordChannel[]>([
    firstChannel,
    secondChannel,
  ]);
  const { refetch } = useQuery<DiscordGuild[]>('guilds');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const toggleUser = (userId: string) => {
    setColumns(
      columns.map((c) => {
        const user = c.currentUsers.find((u) => u.id == userId);
        if (!user) {
          return c;
        }

        if (user.isPlaceholder) {
          const otherUsers = c.currentUsers.filter((u) => u.id != userId);
          c.currentUsers = otherUsers;
          return c;
        }

        user.isIgnored = user.isIgnored == undefined ? true : !user.isIgnored;
        const otherUsers = c.currentUsers.filter((u) => u.id != userId);
        c.currentUsers = [user, ...otherUsers];
        return c;
      })
    );
  };

  const addPlaceholder = (name: string, idx: number) => {
    const newUser: TeamPlayer = {
      id: generate(),
      name: name,
      isPlaceholder: true,
      picture: '',
    };
    setColumns(
      columns.map((c, i) => {
        if (i == idx) {
          c.currentUsers = [...c.currentUsers, newUser];
        }
        return c;
      })
    );
  };

  const randomizeUsers = () => {
    const ignoredUsers = columns.reduce<TeamPlayer[]>((acc, channel) => {
      const newAcc = acc.concat(
        channel.currentUsers.filter((u) => u.isIgnored)
      );
      return newAcc;
    }, []);
    const users = columns.reduce<TeamPlayer[]>((acc, channel) => {
      const newAcc = acc.concat(
        channel.currentUsers.filter((u) => !u.isIgnored)
      );
      return newAcc;
    }, []);
    const shuffledUsers = ShuffleArray<TeamPlayer>(users);
    const teamUsers: [TeamPlayer[], TeamPlayer[]] = [[], []];
    let teamNumber = 0;
    for (let i = 0; i < shuffledUsers.length; i++) {
      let member = shuffledUsers[i];
      teamUsers[teamNumber].push(member);
      teamNumber += 1;
      if (teamNumber == columns.length) teamNumber = 0;
    }
    setColumns(
      columns.map((c, i) => {
        c.currentUsers = teamUsers[i];
        if (i == 0) {
          c.currentUsers = c.currentUsers.concat(ignoredUsers);
        }
        return c;
      })
    );
  };

  const onRefresh = async () => {
    const { data } = await refetch();
    const currentGuild = data.find((x) => x.id == guild.id);
    const firstChannel = currentGuild.channels.find(
      (x) => x.id == columns[0].id
    );
    const secondChannel = currentGuild.channels.find(
      (x) => x.id == columns[1].id
    );
    const channels = [firstChannel, secondChannel];
    setColumns(
      columns.map((c, i) => {
        c.currentUsers = channels[i].currentUsers;
        return c;
      })
    );
  };

  const handleMove = async () => {
    setIsLoading(true);
    const moveChannel = columns.map((column) => {
      const userIds = column.currentUsers.reduce<string[]>((acc, user) => {
        if (!user.isIgnored && !user.isPlaceholder) {
          acc.push(user.id);
        }
        return acc;
      }, []);
      return {
        id: column.id,
        users: userIds,
      };
    });
    const moveModel: MoveModel = {
      guildId: guild.id,
      channels: moveChannel,
    };
    const response = await fetch('/api/guilds', {
      method: 'POST',
      body: JSON.stringify(moveModel),
    });
    if (response.ok) {
      toast({
        variant: `subtle`,
        position: `top`,
        title: `Moved users`,
        description: `Users where moved into their correct spot.`,
        status: `success`,
        isClosable: true,
      });
      setIsLoading(false);
    } else {
      toast({
        variant: `subtle`,
        position: `top`,
        title: `Failed moving`,
        description: `Some users might have been moved. You can still sort teams manually.`,
        status: `error`,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDir="column" alignItems="center" h="70%">
      <Flex align="center" justify="center" w="100%" mb={4}>
        <Button variant="solid" colorScheme="purple" onClick={changeServer}>
          Change server
        </Button>
        <Button
          colorScheme="blue"
          textAlign="center"
          ml={2}
          onClick={randomizeUsers}
          isLoading={isLoading}
        >
          Randomize <Icon as={FaRandom} ml={2} />
        </Button>
        <Button
          colorScheme="purple"
          textAlign="center"
          onClick={handleMove}
          ml={2}
          isLoading={isLoading}
        >
          Confirm <Icon as={FiMove} ml={2} />
        </Button>
        <IconButton
          ml={2}
          aria-label="refresh"
          icon={<IoMdRefresh />}
          onClick={onRefresh}
          colorScheme="purple"
        />
      </Flex>

      <Flex justifyContent="space-evenly" h="100%">
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            // // dropped outside the list
            if (!destination) {
              return;
            }
            setColumns(reorderColumns(columns, source, destination));
          }}
        >
          <TeamList
            key={columns[0].id}
            listId={columns[0].id}
            listType="CARD"
            channel={columns[0]}
            toggleIgnored={toggleUser}
            onPlaceholderAdd={(name) => addPlaceholder(name, 0)}
          />
          <TeamList
            key={columns[1].id}
            listId={columns[1].id}
            listType="CARD"
            channel={columns[1]}
            toggleIgnored={toggleUser}
            onPlaceholderAdd={(name) => addPlaceholder(name, 1)}
          />
        </DragDropContext>
      </Flex>
    </Flex>
  );
};
