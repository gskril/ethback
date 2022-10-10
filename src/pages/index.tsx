import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Response, VotesApiResponse } from '../types'
import { FormProps } from '../types'

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
        <ConnectButton showBalance={false} />
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
      </main>
    </>
  )
}

async function handleSubmit({
  event: e,
  setMsg,
  setAddresses,
  setValues,
}: FormProps) {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const address: string =
    form.address.value || '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
  const startBlock: string = form['start-block'].value || '0'
  const endBlock: string = form['end-block'].value || '20000000'

  setMsg('Fetching gas costs...')
  const res: VotesApiResponse = await fetch(
    `/api/votes?address=${address}&start_block=${startBlock}&end_block=${endBlock}`
  )
    .then((res) => res.json())
    .catch((err) => setMsg(err.message))

  console.log(res.rows)

  const totalSpentOnGas = res!.rows!.reduce(
    (acc: number, curr: Response) => acc + curr.gas,
    0
  )
  setMsg(
    `${totalSpentOnGas.toFixed(2)} ETH spent on gas from ${
      res!.rows!.length
    } voters. Check the console for more details.`
  )

  const addresses = res!.rows!.map((row) => row.from)
  const values = res!.rows!.map((row) => row.gas)

  setAddresses(addresses)
  setValues(values)
}
