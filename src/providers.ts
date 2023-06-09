import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ''
export const chains = [mainnet, goerli]

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  alchemyProvider({ apiKey: ALCHEMY }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Web3 Starter',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
