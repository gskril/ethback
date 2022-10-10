import type { FormProps, Response, VotesApiResponse } from './types'

export async function handleSubmit({
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
    } voters`
  )

  const addresses = res!.rows!.map((row) => row.from)
  const values = res!.rows!.map((row) => row.gas)

  setAddresses(addresses)
  setValues(values)
}
