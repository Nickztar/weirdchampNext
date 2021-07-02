import { Heading, useColorMode, Box } from '@chakra-ui/react';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DiscordChannel } from '../../types/DiscordTypes';
import TeamPlaceholder from '../TeamPlaceholder';
import TeamUser from '../TeamUser';

interface ITeamListProps {
  channel: DiscordChannel;
  toggleIgnored: (userId: string) => void;
  onPlaceholderAdd: (name: string) => void;
  listId: string;
  listType: string;
}

export const TeamList: React.FC<ITeamListProps> = ({
  channel,
  toggleIgnored,
  onPlaceholderAdd,
  listId,
  listType,
}) => {
  const { colorMode } = useColorMode();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Heading ml={4} as="h2" userSelect="none" size="xl" isTruncated>
        {channel.name}
      </Heading>
      <Droppable
        droppableId={listId}
        type={listType}
        direction="vertical"
        isCombineEnabled={false}
      >
        {(dropProvided) => (
          <Box
            {...dropProvided.droppableProps}
            bg={colorMode == 'light' ? `white` : `gray.900`}
            boxShadow="xl"
            rounded="md"
            flex={1}
            display="flex"
            flexDir="column"
            margin="20px"
            padding="15px"
            w="30vw"
            minH="70%"
            overflowY="auto"
            overflowX="hidden"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: colorMode == 'light' ? 'gray.900' : 'white',
                borderRadius: '24px',
              },
            }}
            ref={dropProvided.innerRef}
          >
            <>
              {channel.currentUsers.map((user, index) => (
                <Draggable
                  key={user.id}
                  draggableId={user.id}
                  index={index}
                  isDragDisabled={user.isIgnored}
                >
                  {(dragProvided) => (
                    <div
                      {...dragProvided.dragHandleProps}
                      {...dragProvided.draggableProps}
                      ref={dragProvided.innerRef}
                    >
                      <TeamUser
                        user={user}
                        handleClick={() => toggleIgnored(user.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              <TeamPlaceholder handleAdd={onPlaceholderAdd} />
            </>

            {dropProvided.placeholder}
          </Box>
        )}
      </Droppable>
    </div>
  );
};
