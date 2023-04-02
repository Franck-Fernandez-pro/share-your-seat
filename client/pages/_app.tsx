import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '@/components/Layout';
import { Provider } from '@/contexts/TicketFactory';

const { chains, provider } = configureChains(
  [polygon, polygonMumbai, hardhat],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID || '' }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Share Your Seat',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
