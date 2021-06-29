import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import PlausibleProvider from 'next-plausible';
import { DefaultSeo } from 'next-seo';

const theme = extendTheme({
  colors: {
    brand: {
      300: `#84C9FB`,
    },
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactChild {
  return (
    <>
      <DefaultSeo
        titleTemplate={'%s | Weird'}
        description={'A private discord bot website'}
        openGraph={{
          title: `Weirdchamp`,
          type: `website`,
          site_name: `Weirdchamp`,
        }}
      />
      <PlausibleProvider
        domain="weirdchamp.wtf"
        selfHosted
        trackOutboundLinks
        enabled={process.env.NODE_ENV === 'production'}
        customDomain={process.env.NEXT_PUBLIC_APP_URI}
      >
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </PlausibleProvider>
    </>
  );
}

export default MyApp;
