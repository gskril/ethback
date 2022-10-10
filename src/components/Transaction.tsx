import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { TransactionProps } from '../types'
import disperseAbi from '../contracts/disperse-abi.json'

export default function Transaction({ addresses, values }: TransactionProps) {
  const { isConnected } = useAccount()

  const formattedValues = values.map((value) =>
    Math.floor(value / 0.000000000000000001)
  )

  const { config } = usePrepareContractWrite({
    addressOrName: '0xD152f549545093347A162Dce210e7293f1452150',
    contractInterface: disperseAbi,
    functionName: 'disperseEther',
    args: [addresses, formattedValues],
    overrides: {
      value: formattedValues.reduce((a, b) => a + b, 0).toString(),
    },
  })

  const { write } = useContractWrite(config)

  if (isConnected) {
    return <button onClick={() => write?.()}>Submit transaction</button>
  } else {
    return <ConnectButton showBalance={false} />
  }
}
