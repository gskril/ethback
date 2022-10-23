import { Button } from '@ensdomains/thorin'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import toast from 'react-hot-toast'

import { TransactionProps } from '../types'
import disperseAbi from '../contracts/disperse-abi.json'

export default function Transaction({ addresses, values }: TransactionProps) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const formattedValues = values.map((value) =>
    Math.ceil(value / 0.000000000000000001).toString()
  )

  const { openConnectModal } = useConnectModal()

  const { config, error: prepareTxError } = usePrepareContractWrite({
    addressOrName: '0xD152f549545093347A162Dce210e7293f1452150',
    contractInterface: disperseAbi,
    functionName: 'disperseEther',
    args: [addresses, formattedValues],
    overrides: {
      value: formattedValues.reduce((a, b) => a + Number(b), 0).toString(),
    },
    onError: (err) => {
      const msg = err.message.includes('insufficient funds')
        ? 'Insufficient funds'
        : 'Error preparing transaction'
      toast.error(msg)
    },
  })

  const { write } = useContractWrite(config)

  if (isConnected) {
    return (
      <Button
        size="small"
        disabled={prepareTxError !== null}
        onClick={() => write?.()}
        style={{ width: 'fit-content', margin: '0 auto' }}
      >
        Submit transaction {chain?.id !== 1 && '(testnet)'}
      </Button>
    )
  } else {
    return (
      <Button
        size="small"
        onClick={openConnectModal}
        style={{ width: 'fit-content', margin: '0 auto' }}
      >
        Connect wallet
      </Button>
    )
  }
}
