import Head from 'next/head'
import { useState } from 'react'
import { handleSubmit } from '../utils'
import Transaction from '../components/Transaction'

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
              disabled
              placeholder="0xc18360217d8f7ab5e7c516566761ea12ce7f9d72"
            />
          </div>

          <div className="input-group">
            <label htmlFor="start-block">Start block</label>
            <input
              type="number"
              name="start-block"
              id="start-block"
              placeholder="15000000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="end-block">End block</label>
            <input
              type="number"
              name="end-block"
              id="end-block"
              placeholder="20000000"
            />
          </div>

          <div className="button-group">
            <button name="fetch" id="delegate">
              Fetch delegation costs
            </button>
            <button name="fetch" id="castVote">
              Fetch voting costs
            </button>
          </div>
        </form>

        <p className="msg">{msg}</p>

        {addresses.length > 0 && (
          <Transaction addresses={addresses} values={values} />
        )}
      </main>
    </>
  )
}
