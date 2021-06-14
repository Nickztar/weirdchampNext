import { GetServerSideProps } from 'next';
import React from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import { getSounds } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { useRouter } from 'next/router';

interface HomePageProps {
  user: UserType | null;
  movies: [];
}

export default function Home({
  user,
  movies,
}: HomePageProps): React.ReactChild {
  const router = useRouter();
  const { soundID } = router.query;

  if (!user) {
    return <LandingPage />;
  }
  if (user.isBanned) {
    return <BannedPage user={user} />;
  }
  //idk typescript well enough to know whats goin wrong here but | any ignores it :/
  const data = useQuery(`sounds`, getSounds, {
    initialData: [],
  });
  return <HomePage user={user} sounds={data} soundID={soundID} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType = await parseUser(ctx);

  if (!user) {
    return { props: { user: null } };
  }
  const movies = await getSounds();
  return { props: { user, movies } };
};
