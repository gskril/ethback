import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { SortResponse, VotesApiResponse } from '../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VotesApiResponse>
) {
  const { address: _address, start_block, end_block, type } = req.query
  const address = _address!.toString().toLowerCase()

  const ensContracts = [
    '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
    '0x323a76393544d5ecca80cd6ef2a560c6a395b7e3',
  ]

  const sortQuery = `
    select
      "from",
      t.gas.transaction_fee.eth as gas
    from
      ${
        ensContracts.includes(address)
          ? 'user14.transaction'
          : 'ethereum.transaction'
      } t
    where
        "to" = '${address}'
        and t.function.name like '${type}'
        and block_number > ${start_block}
        and block_number < ${end_block}
    order by
      timestamp desc
    LIMIT 10000
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
