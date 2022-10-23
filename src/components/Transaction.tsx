import { Button } from '@ensdomains/thorin'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import toast from 'react-hot-toast'

import { TransactionProps } from '../types'
import disperseAbi from '../contracts/disperse-abi.json'
import { formatEtherscanLink } from '../utils'

const buttonStyles = {
  width: 'fit-content',
  margin: '0 auto',
}

export default function Transaction({
  addresses,
  values,
  setTxnStarted,
}: TransactionProps) {
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

  const { data: txn, write } = useContractWrite(config)
  const {
    data: txnReceipt,
    isError: txnIsError,
    isLoading: txnIsPending,
  } = useWaitForTransaction(txn)

  if (!isConnected) {
    return (
      <Button size="small" onClick={openConnectModal} style={buttonStyles}>
        Connect wallet
      </Button>
    )
  }

  if (txnIsPending) {
    setTxnStarted(true)

    return (
      <Button
        as="a"
        loading
        size="small"
        target="_blank"
        href={formatEtherscanLink(chain!.id, txn!)}
        style={buttonStyles}
      >
        <span
          style={{
            color: '#fff',
          }}
        >
          View on Etherscan
        </span>
      </Button>
    )
  }

  if (txnIsError) {
    return (
      <Button
        as="a"
        size="small"
        tone="red"
        variant="secondary"
        target="_blank"
        href="https://github.com/gskril/ethback/issues"
        style={buttonStyles}
      >
        Transaction failed
      </Button>
    )
  }

  if (txnReceipt) {
    return (
      <Button
        as="a"
        size="small"
        target="_blank"
        href={formatEtherscanLink(chain!.id, txn!)}
        style={buttonStyles}
      >
        Transaction completed!
      </Button>
    )
  }

  return (
    <Button
      size="small"
      disabled={prepareTxError !== null}
      onClick={() => write?.()}
      style={buttonStyles}
    >
      Submit transaction {chain?.id !== 1 && '(testnet)'}
    </Button>
  )
}
