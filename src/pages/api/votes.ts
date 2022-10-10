import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

export type VotesApiResponse = {
  rows?: Response[]
  meta?: Object
  error?: string
}

export type Response = {
  from: string
  block_number: number
  gas: number
}

type SortResponse = {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VotesApiResponse>
) {
  const { address, start_block, end_block } = req.query

  const sortQuery = `
    select
      "from",
      "block_number",
      t.gas.transaction_fee.eth as gas
    from
      ethereum.transaction t
    where
        "to" = '${address}'
        and t.function.name like 'delegate'
        and block_number > ${start_block}
        and block_number < ${end_block}
    order by
      timestamp desc
  `

  const data: SortResponse = await got('https://api.sort.xyz/v0/sql', {
    method: 'POST',
    json: {
      query: sortQuery,
      api_key: process.env.SORT_API_KEY,
    },
  }).json()

  const rows = data.query_response.results
  const meta = data.query_response.stats

  res.status(200).json({ rows, meta })
}
