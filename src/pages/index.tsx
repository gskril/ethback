import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [msg, setMsg] = useState('hi')
  return (
    <>
      <Head>
        <title>Reimburse.xyz</title>
        <meta name="description" content="Reimburse DAO contributors for gas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="address">ERC-20 Contract Address</label>
            <input type="text" name="address" id="address" autoComplete="off" />
          </div>

          <div className="input-group">
            <label htmlFor="start-block">Start block</label>
            <input type="number" name="start-block" id="start-block" />
          </div>

          <div className="input-group">
            <label htmlFor="end-block">End block</label>
            <input type="number" name="end-block" id="end-block" />
          </div>

          <button>Fetch gas costs</button>
        </form>

        <p className="msg">{msg}</p>
      </main>
    </>
  )
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
}
