import { Button, Input, Typography } from '@ensdomains/thorin'
import { css } from 'styled-components'
import { handleSubmit } from '../utils'
import { useState } from 'react'
import Head from 'next/head'

import { ContractFunctions } from '../types'
import Transaction from '../components/Transaction'

const inputStyles = css`
  background: #fff;
`

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
          onSubmit={(event) => {
            handleSubmit({ event, setMsg, setAddresses, setValues })
          }}
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

          <div className="input-group-thorin">
            <Input
              type="text"
              name="address"
              id="address"
              label="Contract Address"
              parentStyles={inputStyles}
              value={placeholderAddress}
              placeholder={placeholderAddress}
              onBlur={() =>
                alert(
                  'Non-ENS contracts are currently limited to 7 days of transaction history.'
                )
              }
            />
          </div>

          <div className="input-group-thorin">
            <Input
              type="number"
              name="start-block"
              id="start-block"
              value={15100000}
              step={10000}
              min={0}
              placeholder="15100000"
              label="Start block"
              parentStyles={inputStyles}
            />
          </div>

          <div className="input-group-thorin">
            <Input
              type="number"
              name="end-block"
              id="end-block"
              placeholder="20000000"
              step={10000}
              min={0}
              label="End block"
              parentStyles={inputStyles}
            />
          </div>

          <Button tone="accent" type="submit">
            Fetch gas costs
          </Button>
        </form>

        <Typography as="p" style={{ marginBottom: '0.5rem' }}>
          {msg}
        </Typography>

        {addresses.length > 0 && (
          <Transaction addresses={addresses} values={values} />
        )}
      </main>
    </>
  )
}
