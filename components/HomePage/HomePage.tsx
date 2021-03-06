import { useEffect } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';
import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { UserType } from '../../models/user';
import { NextSeo } from 'next-seo';

interface HomePageProps {
  user: UserType;
  soundID: string | string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  soundID,
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
          <CardGrid user={user} soundID={soundID} />
        </div>
      </AppLayout>
    </>
  );
};
