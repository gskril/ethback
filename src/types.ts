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
  id: string
  success: number
  query_response: {
    collections: string[]
    aliases: string[]
    column_fields: Object[]

    results: Response[]
    query_id: string
    stats: {
      elapsed_time_ms: number
      throttled_time_micros: number
    }
    status: string
  }
}

export type TransactionProps = {
  addresses: string[]
  values: number[]
  setTxnStarted: (value: boolean) => void
}

export type ContractFunctions = 'castVote' | 'delegate'
