import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import HomePage from '../components/HomePage';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import BannedPage from '../components/BannedPage';
import { useRouter } from 'next/router';
import { Spinner, Flex } from '@chakra-ui/react';

interface HomePageProps {
  user: UserType | null;
}

export default function Home({ user }: HomePageProps): React.ReactChild {
  const router = useRouter();
  const { soundID } = router.query;

  if (!user) {
    //Fallback if we client side change user?
    useEffect(() => {
      router.push('/login');
    }, [router]);
    return (
      <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (user.isBanned) {
    return <BannedPage user={user} />;
  }
  return <HomePage user={user} soundID={soundID} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType = await parseUser(ctx);

  if (!user) {
    const res = ctx.res;
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: { user } };
};
