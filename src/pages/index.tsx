import { Button, Heading, Input, Typography } from '@ensdomains/thorin'
import { handleSubmit } from '../utils'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { usePlausible } from 'next-plausible'
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
  const plausible = usePlausible()
  const [msg, setMsg] = useState<string>('')
  const [values, setValues] = useState<number[]>([])
  const [addresses, setAddresses] = useState<string[]>([])
  const [txnStarted, setTxnStarted] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState<string>('')
  const [typeSelection, setTypeSelection] =
    useState<ContractFunctions>('castVote')

  const placeholderAddress =
    typeSelection === 'delegate'
      ? '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
      : '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3'

  useEffect(() => {
    if (txnStarted) {
      plausible('Reimburse', {
        props: {
          contract: contractAddress,
          type: typeSelection,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnStarted])

  return (
    <>
      <Head>
        <title>ETH Back</title>
        <meta property="og:title" content="ETH Back" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://ethback.xyz/sharing.jpg" />
        <meta
          name="description"
          content="The easiest way for DAOs to reimburse their contributors for gas fees on voting and delegating"
        />
        <meta
          property="og:description"
          content="Reimburse DAO contributors for governance-related transaction fees"
        />
      </Head>

      <main>
        <div className="hero">
          <Heading as="h2" level="2" style={{ marginBottom: '1.5rem' }}>
            Reimburse DAO contributors for gas
          </Heading>
          <Typography as="p" size="base">
            Data by{' '}
            <a href="https://sort.xyz" target="_blank" rel="noreferrer">
              sort.xyz
            </a>{' '}
            <br />
            Contract by{' '}
            <a href="https://disperse.app" target="_blank" rel="noreferrer">
              disperse.app
            </a>{' '}
            <br />
            Frontend by{' '}
            <a
              href="https://twitter.com/gregskril"
              target="_blank"
              rel="noreferrer"
            >
              @gregskril
            </a>
          </Typography>
        </div>

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
                  value="castVote"
                  id="castVote"
                  defaultChecked
                  disabled={txnStarted}
                  onChange={() => setTypeSelection('castVote')}
                />
                <label htmlFor="castVote">Votes</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="type"
                  value="delegate"
                  id="delegate"
                  disabled={txnStarted}
                  onChange={() => setTypeSelection('delegate')}
                />
                <label htmlFor="delegate">Delegations</label>
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
              disabled={txnStarted}
            />

            <ContractList
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              typeSelection={typeSelection}
              disabled={txnStarted}
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
              disabled={txnStarted}
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
              disabled={txnStarted}
              parentStyles={inputStyles}
            />
          </div>

          <Button tone="accent" type="submit" disabled={txnStarted}>
            Fetch gas costs
          </Button>
        </form>

        <Typography
          as="p"
          size="base"
          style={{ marginBottom: '0.75rem', textAlign: 'center' }}
        >
          {msg}
        </Typography>

        {addresses.length > 0 && (
          <Transaction
            addresses={addresses}
            values={values}
            setTxnStarted={setTxnStarted}
          />
        )}
      </main>

      <Toaster position="bottom-center" />
    </>
  )
}
