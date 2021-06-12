import {
  Box,
  Flex,
  chakra,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const SocialIcons = ({ children, href, label }) => {
  return (
    <Tooltip label={label}>
      <chakra.button
        bg={useColorModeValue(`blackAlpha.100`, `whiteAlpha.100`)}
        rounded="full"
        w={8}
        h={8}
        cursor="pointer"
        as="a"
        href={href}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        transition="background 0.3s ease"
        _hover={{
          bg: useColorModeValue(`blackAlpha.200`, `whiteAlpha.200`),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    </Tooltip>
  );
};
export const Footer = () => (
  <Box as="footer" role="contentinfo" mt={8} py="6">
    <Flex
      direction={{ base: `column`, md: `row` }}
      maxW={{ base: `xl`, md: `7xl` }}
      mx="auto"
      px={{ base: `6`, md: `8` }}
      align="center"
    >
      <a aria-current="page" aria-label="Back to Home page" href="/" rel="home">
        <h1>ScuffedMDB</h1>
      </a>

      <Text marginStart={{ md: `auto` }} justifySelf="middle">
        Made by Nickztar ⚡
      </Text>

      <Stack direction="row" spacing={6} ml="auto" mr={{ base: `auto`, md: 5 }}>
        <SocialIcons label="GitHub" href="https://github.com/Nickztar">
          <FaGithub />
        </SocialIcons>
      </Stack>
    </Flex>
  </Box>
);
