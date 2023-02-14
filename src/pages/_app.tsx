import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from "../chakra/theme";
import Layout from '../components/Layout';
import { RecoilRoot } from 'recoil'; //GLobal state

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Wrap Everythiong with recoil for global state
    <RecoilRoot> 
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  )
}
