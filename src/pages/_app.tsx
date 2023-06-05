import '../styles/globals.scss'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [infuraProvider({}), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'ethback.xyz',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="ethback.xyz" trackOutboundLinks>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
