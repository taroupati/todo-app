import { NextApiRequest } from "next"
import { NextApiResponseServerIO } from "src/types/next"


async function doc (req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === "POST") {
    // get text
    // const text = "POST"
    const text = req.body

    console.log("text")
    console.log(text)
    // dispatch to channel "text"
    res?.socket?.server?.io?.emit("text", text)
    const Redis = require('ioredis')
    const redis = new Redis(6379, 'redis')
    await redis.set('text', text)

    // return text
    res.status(201).json(text)
  }
}

export default doc
