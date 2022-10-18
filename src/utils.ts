import type {
  ContractFunctions,
  FormProps,
  Response,
  VotesApiResponse,
} from './types'

export async function handleSubmit({
  event: e,
  setMsg,
  setAddresses,
  setValues,
}: FormProps) {
  e.preventDefault()

  const form = e.target as HTMLFormElement
  const startBlock: string = form['start-block'].value || '15100000'
  const endBlock: string = form['end-block'].value || '20000000'
  const type: ContractFunctions = form['type'].value
  const address: string = form.address.value

  setMsg('Fetching gas costs...')

  const apiUrl = `/api/votes?address=${address}&start_block=${startBlock}&end_block=${endBlock}&type=${type}`
  const res: VotesApiResponse = await fetch(apiUrl)
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
    } ${beautifyFunction(type)}`
  )

  const addresses = res!.rows!.map((row) => row.from)
  const values = res!.rows!.map((row) => row.gas)

  setAddresses(addresses)
  setValues(values)
}

function beautifyFunction(name: ContractFunctions) {
  switch (name) {
    case 'castVote':
      return 'votes'
    case 'delegate':
      return 'delegatations'
    default:
      return name
  }
}
