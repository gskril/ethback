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
    name: 'LilNouns',
    functions: ['delegate'],
    address: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b',
  },
]

const Contracts = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
            contractAddress === contract.address ? 'primary' : 'secondary'
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
