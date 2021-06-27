import { useEffect } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';
import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { MovieType } from '../../models/movie';
import { UserType } from '../../models/user';
import { NextSeo } from 'next-seo';
import { S3File } from '../../types/APITypes';

interface HomePageProps {
  user: UserType;
  sounds: S3File[];
  soundID: string | string[];
  isFetching: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  sounds,
  soundID,
  isFetching,
}): React.ReactElement => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`test`, {
      variant: `subtle`,
      position: `top`,
      title: `Read only mode`,
      description: `You do not have permissions to add or remove sounds.`,
      status: `error`,
      isClosable: true,
    });
  }, [colorMode]);
  useEffect(() => {
    if (!user.isAdmin && !user.isReviewer) {
      toast({
        id: `test`,
        variant: `subtle`,
        position: `top`,
        title: `Read only mode`,
        description: `You do not have permissions to add or remove sounds.`,
        status: `error`,
        isClosable: true,
      });
    }
  }, []);
  return (
    <>
      <NextSeo
        openGraph={{
          title: `Weirdchamp`,
          type: `website`,
          site_name: `Weirdchamp`,
        }}
        title="Home"
        description={'A private discord bot website'}
      />

      <AppLayout user={user} showMovies>
        <div>
          <CardGrid
            sounds={sounds}
            user={user}
            soundID={soundID}
            isFetching={isFetching}
          />
        </div>
      </AppLayout>
    </>
  );
};
