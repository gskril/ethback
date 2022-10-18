import { handleSubmit } from '../utils'
import { useState } from 'react'
import Head from 'next/head'

import { ContractFunctions } from '../types'
import Transaction from '../components/Transaction'

export default function Home() {
  const [msg, setMsg] = useState<string>('')
  const [values, setValues] = useState<number[]>([])
  const [addresses, setAddresses] = useState<string[]>([])
  const [typeSelection, setTypeSelection] =
    useState<ContractFunctions>('delegate')

  const placeholderAddress =
    typeSelection === 'delegate'
      ? '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
      : '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3'

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
            <label htmlFor="addresses">Transaction type</label>
            <div className="col">
              <div className="radio-group">
                <input
                  type="radio"
                  name="type"
                  value="delegate"
                  id="delegate"
                  defaultChecked
                  onChange={() => setTypeSelection('delegate')}
                />
                <label htmlFor="delegate">Delegations</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="type"
                  value="castVote"
                  id="castVote"
                  onChange={() => setTypeSelection('castVote')}
                />
                <label htmlFor="castVote">Votes</label>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="address">Contract Address</label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={placeholderAddress}
              placeholder={placeholderAddress}
              onBlur={() =>
                alert(
                  'Non-ENS contracts are currently limited to 7 days of transaction history.'
                )
              }
            />
          </div>

          <div className="input-group">
            <label htmlFor="start-block">Start block</label>
            <input
              type="number"
              name="start-block"
              id="start-block"
              defaultValue={15100000}
              placeholder="15100000"
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

          <button type="submit">Fetch gas costs</button>
        </form>

        <p className="msg">{msg}</p>

        {addresses.length > 0 && (
          <Transaction addresses={addresses} values={values} />
        )}
      </main>
    </>
  )
}
