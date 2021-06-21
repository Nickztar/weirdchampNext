import {
  Box,
  chakra,
  useColorModeValue,
  Text,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react';
import {FaDiscord} from "react-icons/fa";

export const LandingPage: React.FC = (): React.ReactElement => (
  <Flex
    minH="100vh"
    flex={1}
    p={5}
    direction="row"
    align="center"
    justify="center"
  >
    <Box
      w={{ base: `full`, md: 11 / 12, xl: 8 / 12 }}
      mx="auto"
      textAlign={{ base: `left`, sm: `center` }}
    >
      <chakra.h1
        mb={6}
        fontSize={{ base: `4xl`, md: `6xl` }}
        fontWeight="bold"
        lineHeight="none"
        letterSpacing={{ base: `normal`, md: `tight` }}
        color={useColorModeValue(`gray.900`, `gray.100`)}
      >
        <Text
          display={{ base: `block`, lg: `inline` }}
          w="full"
          bgClip="text"
          bgGradient="linear(to-r, green.400,purple.500)"
          fontWeight="extrabold"
        >
          Weirdchamp
        </Text>
        {` `}
      </chakra.h1>
      <chakra.p
        px={{ base: 0, lg: 24 }}
        mb={6}
        fontSize={{ base: `lg`, md: `xl` }}
        color={useColorModeValue(`gray.600`, `gray.300`)}
      >
        The website where cool kids play discord sounds :).
      </chakra.p>
      <Button
        as="a"
        color={useColorModeValue(`purple.700`, `purple.300`)}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w={{ base: `full`, sm: `auto` }}
        mb={{ base: 2, sm: 0 }}
        href="/api/oauth"
        size="lg"
      >
        Log in with discord
        <FaDiscord size={20} style={{color: "inherit", marginLeft: "var(--chakra-space-2)"}} />
      </Button>
    </Box>
  </Flex>
);
