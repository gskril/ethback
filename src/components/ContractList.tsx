import { Button, Input, Typography } from '@ensdomains/thorin'
import { ContractFunctions } from '../types'
import styled from 'styled-components'

type Props = {
  contractAddress: string
  setContractAddress: (address: string) => void
  typeSelection: ContractFunctions
}

type Contracts = {
  name: string
  functions: string[]
  address: string
}

const presetContracts: Contracts[] = [
  {
    name: '$ENS',
    functions: ['delegate'],
    address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
  },
  {
    name: 'ENS Governor',
    functions: ['castVote'],
    address: '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3',
  },
  {
    name: '$AAVE',
    functions: ['delegate'],
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  },
  {
    name: '$UNI',
    functions: ['delegate'],
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  },
  {
    name: 'Uniswap Governor',
    functions: ['castVote'],
    address: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  },
  {
    name: 'Nouns DAO',
    functions: ['castVote'],
    address: '0x6f3e6272a167e8accb32072d08e0957f9c79223d',
  },
  {
    name: 'Nouns DAO',
    functions: ['delegate'],
    address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  },
  {
    name: 'LilNouns',
    functions: ['delegate'],
    address: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b',
  },
]

const Contracts = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
  overflow-x: scroll;

  & > * {
    width: fit-content;
  }
`

export function ContractList({
  contractAddress,
  setContractAddress,
  typeSelection,
}: Props): JSX.Element {
  const contracts = presetContracts.filter((contract) =>
    contract.functions.includes(typeSelection)
  )

  return (
    <Contracts>
      {contracts.map((contract) => (
        <Button
          variant={
            contractAddress.toLowerCase() === contract.address.toLowerCase()
              ? 'primary'
              : 'secondary'
          }
          shadowless
          size="extraSmall"
          key={contract.name}
          onClick={() => setContractAddress(contract.address)}
        >
          {contract.name}
        </Button>
      ))}
    </Contracts>
  )
}
