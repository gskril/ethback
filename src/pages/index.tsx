import Head from 'next/head'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { handleSubmit } from '../utils'
import { TransactionProps } from '../types'
import disperseAbi from '../contracts/disperse-abi.json'

export default function Home() {
  const [msg, setMsg] = useState<string>('')
  const [values, setValues] = useState<number[]>([])
  const [addresses, setAddresses] = useState<string[]>([])

  return (
    <>
      <Head>
        <title>Reimburse.xyz</title>
        <meta name="description" content="Reimburse DAO contributors for gas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          style={{ marginTop: '1rem' }}
          onSubmit={(event) =>
            handleSubmit({ event, setMsg, setAddresses, setValues })
          }
        >
          <div className="input-group">
            <label htmlFor="address">ERC-20 Contract Address</label>
            <input
              type="text"
              name="address"
              id="address"
              autoComplete="off"
              disabled
              value="0xc18360217d8f7ab5e7c516566761ea12ce7f9d72"
              placeholder="0xc18360217d8f7ab5e7c516566761ea12ce7f9d72"
            />
          </div>

          <div className="input-group">
            <label htmlFor="start-block">Start block</label>
            <input
              type="number"
              name="start-block"
              id="start-block"
              placeholder="15500000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="end-block">End block</label>
            <input
              type="number"
              name="end-block"
              id="end-block"
              placeholder="15700000"
            />
          </div>

          <button>Fetch gas costs</button>
        </form>

        <p className="msg">{msg}</p>

        {addresses.length > 0 && (
          <Transaction addresses={addresses} values={values} />
        )}
      </main>
    </>
  )
}

function Transaction({ addresses, values }: TransactionProps) {
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

  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  if (isConnected) {
    return <button onClick={() => write?.()}>Submit transaction</button>
  } else {
    return <ConnectButton showBalance={false} />
  }
}
