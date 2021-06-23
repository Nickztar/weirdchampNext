import React from 'react';
import { formatSeconds, leftZero } from '../../utils/utils';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface ITimestamp {
  currentTime: number;
}

export const Timestamp: React.FC<ITimestamp> = (props) => {
  const formated = formatSeconds(props.currentTime);

  return (
    <Box
      _after={{
        content: `""`,
        position: 'absolute',
        border: '10px solid transparent',
        borderTopColor: useColorModeValue(`rgb(16, 65, 110)`, `white`),
        bottom: '-18px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
      position="absolute"
      fontSize="16px"
      top="-30px"
      fontWeight="semibold"
      textAlign="center"
      color={useColorModeValue(`white`, `black`)}
      transform="translate(-50%) scale(0.8)"
      background={useColorModeValue(
        `linear-gradient(rgb(9 74 134), rgb(50 64 144))`,
        `white`
      )}
      userSelect="none"
      padding="1px 18px"
      borderRadius="10px"
    >
      <span>{leftZero(formated[0], 2)}</span>:
      <span>{leftZero(formated[1], 2)}</span>:
      <span>{leftZero(formated[2], 2)}</span>
    </Box>
  );
};
