import { Button } from '@ensdomains/thorin'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { TransactionProps } from '../types'
import disperseAbi from '../contracts/disperse-abi.json'
import { formatEtherscanLink } from '../utils'
import { parseEther } from 'viem'

const buttonStyles = {
  width: 'fit-content',
  margin: '0 auto',
}

export default function Transaction({
  index,
  addresses,
  values: ethValues,
  setTxnStarted,
}: TransactionProps) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const weiValues = ethValues.map((value) =>
    Math.ceil(value / 0.000000000000000001).toString()
  )

  const totalEth = ethValues.reduce((a, b) => a + b, 0)
  const { openConnectModal } = useConnectModal()

  const { config, error: prepareTxError } = usePrepareContractWrite({
    address: '0xD152f549545093347A162Dce210e7293f1452150',
    abi: disperseAbi,
    functionName: 'disperseEther',
    args: [addresses, weiValues],
    value: parseEther(`${totalEth + 0.001}`), // add some buffer
    onError: (err) => {
      const msg = err.message.includes('insufficient funds')
        ? 'Insufficient funds'
        : 'Error preparing transaction'
      toast.error(msg)
    },
  })

  const { data: txn, write } = useContractWrite(config)
  const {
    isError: txnIsError,
    isLoading: txnIsPending,
    isSuccess: txnIsSuccess,
  } = useWaitForTransaction(txn)

  useEffect(() => {
    if (txn?.hash) {
      setTxnStarted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txn?.hash])

  if (!isConnected) {
    return (
      <Button size="small" onClick={openConnectModal} style={buttonStyles}>
        Connect wallet
      </Button>
    )
  }

  if (txnIsPending) {
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

  if (txnIsSuccess) {
    return (
      <Button
        as="a"
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
          Transaction completed!
        </span>
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
      Submit transaction {index} {chain?.id !== 1 && '(testnet)'}
    </Button>
  )
}
