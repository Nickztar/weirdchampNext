import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import BannedPage from '../components/BannedPage';
import { NextSeo } from 'next-seo';
import AppLayout from '../components/AppLayout';
import { Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { getGuilds } from '../utils/queries';
import { useQuery } from 'react-query';
import TeamSplitting from '../components/TeamSplitting';

interface ITeamSplittingPageProps {
  user: UserType | null;
}

export default function TeamSplittingPage({
  user,
}: ITeamSplittingPageProps): React.ReactChild {
  const router = useRouter();
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
  const { data } = useQuery(`guilds`, getGuilds, {
    initialData: null,
    staleTime: 60 * 60,
  });
  return (
    <>
      <NextSeo title="Team splitting" />
      <AppLayout user={user}>
        <TeamSplitting data={data} />
      </AppLayout>
    </>
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

  return { props: { user } };
};
