import {
  Avatar,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { FaUserPlus, FaUserSlash } from 'react-icons/fa';
import { TeamPlayer } from '../../types/DiscordTypes';

interface ITeamUserProps {
  user: TeamPlayer;
  handleClick: () => void;
}

const getButtonText = (user: TeamPlayer) => {
  if (!user.isPlaceholder) {
    return user.isIgnored ? `Include user` : `Exclude user from move`;
  }
  return 'Remove placeholder';
};

export const TeamUser: React.FC<ITeamUserProps> = ({ user, handleClick }) => {
  return (
    <Flex
      alignItems="center"
      p={2}
      mb={2}
      userSelect="none"
      bg={useColorModeValue(`white`, `gray.900`)}
      boxShadow="xl"
      rounded="md"
    >
      <Avatar
        name={user.isPlaceholder ? null : user.name}
        icon={<AiOutlineUser fontSize="1.5rem" />}
        src={user.picture}
        opacity={user.isIgnored ? '0.6' : '1'}
        color={
          user.isPlaceholder
            ? useColorModeValue(`white`, `gray.900`)
            : useColorModeValue(`gray.900`, `white`)
        }
        bg={
          user.isPlaceholder
            ? useColorModeValue(`gray.900`, `white`)
            : useColorModeValue(`white`, `gray.900`)
        }
      />
      <Tooltip label={user.name} placement="top">
        <Heading
          ml={4}
          as="h2"
          size="xl"
          color={
            user.isIgnored
              ? useColorModeValue(`grey`, `gray`)
              : useColorModeValue(`inherit`, `inherit`)
          }
          textDecoration={user.isIgnored ? 'line-through' : 'none'}
          isTruncated
        >
          {user.name}
        </Heading>
      </Tooltip>
      <Tooltip label={getButtonText(user)} placement="top">
        <IconButton
          onClick={handleClick}
          aria-label={getButtonText(user)}
          ml="auto"
          colorScheme={user.isIgnored ? `green` : `red`}
          variant="ghost"
          icon={user.isIgnored ? <FaUserPlus /> : <FaUserSlash />}
        />
      </Tooltip>
    </Flex>
  );
};
