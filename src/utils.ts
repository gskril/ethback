import toast from 'react-hot-toast'
import type {
  ContractFunctions,
  FormProps,
  Response,
  VotesApiResponse,
} from './types'

export const sortWhitelistedContract = [
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
  '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3',
  '0x6f3e6272a167e8accb32072d08e0957f9c79223d',
]

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
  const address: string = form.address.value.toLowerCase()

  if (!sortWhitelistedContract.includes(address)) {
    toast('This contract is limited to 7 days of transaction history', {
      icon: '🚧',
      duration: 5000,
      style: {
        maxWidth: '100%',
      },
    })
  }

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
    `${totalSpentOnGas.toFixed(
      2
    )} ETH spent on gas from ${new Intl.NumberFormat().format(
      res!.rows!.length
    )} ${beautifyFunction(type)}`
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
