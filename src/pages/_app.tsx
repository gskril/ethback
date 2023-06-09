import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import { WagmiConfig } from 'wagmi'
import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'

import '../styles/globals.scss'
import { chains, wagmiConfig } from '../providers'

function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="ethback.xyz" trackOutboundLinks>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
