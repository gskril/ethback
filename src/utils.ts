import type {
  contractFunctions,
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
  const event = e.nativeEvent as any
  const startBlock: string = form['start-block'].value || '15000000'
  const endBlock: string = form['end-block'].value || '20000000'
  const submitter: contractFunctions = event.submitter.id
  const address: string =
    form.address.value || submitter === 'delegate'
      ? '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
      : '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3'

  setMsg('Fetching gas costs...')

  const apiUrl = `/api/votes?address=${address}&start_block=${startBlock}&end_block=${endBlock}&submitter=${submitter}`
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
    } ${beautifyFunction(submitter)}`
  )

  const addresses = res!.rows!.map((row) => row.from)
  const values = res!.rows!.map((row) => row.gas)

  setAddresses(addresses)
  setValues(values)
}

function beautifyFunction(name: contractFunctions) {
  switch (name) {
    case 'castVote':
      return 'votes'
    case 'delegate':
      return 'delegatations'
    default:
      return name
  }
}
