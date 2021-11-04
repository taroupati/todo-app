import { NextApiRequest } from "next"
import { NextApiResponseServerIO } from "src/types/next"


async function chat (req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === "POST") {
    // get message
    const message = req.body

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("message", message)
    const Redis = require('ioredis')
    const redis = new Redis(6379, 'redis')
    console.log("push")
    console.log(message)
    console.log(typeof message)
    await redis.rpush('messages', JSON.stringify(message))

    // return message
    res.status(201).json(message)
  }
}

export default chat
