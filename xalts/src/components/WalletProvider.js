import React from 'react';
import { Web3ReactProvider } from '@web3-react/core'
import { useEgarConnect } from './useEgarConnect';
import { hooks as metaMaskHooks, metaMask } from './metamask'

const connectors = [
  [metaMask, metaMaskHooks],
]

export default function Web3ProviderNew({children}) {
  useEgarConnect(metaMask)
  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
    </Web3ReactProvider>
  )
}