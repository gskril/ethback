export type FormProps = {
  event: React.FormEvent<HTMLFormElement>
  setMsg: React.Dispatch<React.SetStateAction<string>>
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>
  setValues: React.Dispatch<React.SetStateAction<number[]>>
  setIsEmailVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export type VotesApiResponse = {
  rows?: Response[]
  meta?: Object
  error?: string
}

export type Response = {
  from: string
  gas: number
}

export type SortResponse = {
  code: number
  data: {
    durationMs: number
    id: string
    query: string
    records: Response[]
    recordCount: number
  }
}

export type TransactionProps = {
  index: number
  addresses: string[]
  values: number[]
  setTxnStarted: (value: boolean) => void
}

export type ContractFunctions = 'castVote' | 'delegate'
