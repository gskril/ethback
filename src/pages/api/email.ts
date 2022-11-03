import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { email, contract } = req.body

  const tgApi = await got('https://api.gregskril.com/tg-message', {
    searchParams: {
      text: `${email} requested support for ${contract} on ETHBack`,
    },
  }).json()

  res.status(200).json(tgApi)
}
