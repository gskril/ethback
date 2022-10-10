import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  rows: Object[]
  meta: Object
}

type SortResponse = {
  id: string
  success: number
  query_response: {
    collections: string[]
    aliases: string[]
    column_fields: Object[]
    results: Object[]
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
  res: NextApiResponse<Data>
) {
  const address = '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
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
