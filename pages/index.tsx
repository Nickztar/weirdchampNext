import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import { getSounds } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { useRouter } from 'next/router';
import { Spinner, Flex } from '@chakra-ui/react';
import { S3File } from '../types/APITypes';

interface HomePageProps {
  user: UserType | null;
  sounds: S3File[];
}

export default function Home({
  user,
  sounds,
}: HomePageProps): React.ReactChild {
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
  const { data, isFetching } = useQuery(`sounds`, getSounds, {
    initialData: sounds,
    refetchInterval: 10 * 1000, //Fetch new data every 10 seconds :D
  });
  return (
    <HomePage
      user={user}
      sounds={data}
      soundID={soundID}
      isFetching={isFetching}
    />
  );
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
  const sounds = await getSounds();
  return { props: { user, sounds } };
};
