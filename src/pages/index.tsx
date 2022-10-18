import { Button, Input, Typography } from '@ensdomains/thorin'
import { handleSubmit } from '../utils'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styled, { css } from 'styled-components'

import { ContractFunctions } from '../types'
import { ContractList } from '../components/ContractList'
import Transaction from '../components/Transaction'

const inputStyles = css`
  background: #fff;
`

const Label = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    letter-spacing: normal;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  `
)

export default function Home() {
  const [msg, setMsg] = useState<string>('')
  const [values, setValues] = useState<number[]>([])
  const [addresses, setAddresses] = useState<string[]>([])
  const [contractAddress, setContractAddress] = useState<string>('')
  const [typeSelection, setTypeSelection] =
    useState<ContractFunctions>('delegate')

  const placeholderAddress =
    typeSelection === 'delegate'
      ? '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
      : '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3'

  useEffect(() => {
    setContractAddress(placeholderAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <div>
            <Label weight="bold">Transaction type</Label>
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

          <div>
            <Input
              type="text"
              name="address"
              id="address"
              label="Contract address"
              parentStyles={inputStyles}
              value={contractAddress}
              placeholder={placeholderAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />

            <ContractList
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              typeSelection={typeSelection}
            />
          </div>

          <div>
            <Input
              type="number"
              name="start-block"
              id="start-block"
              step={10000}
              min={0}
              placeholder="15100000"
              label="Start block"
              parentStyles={inputStyles}
            />
          </div>

          <div>
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
