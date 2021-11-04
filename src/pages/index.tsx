import type { NextPage } from 'next'
import ButtonAppBar from '../components/appBar'
import TodoList from 'src/components/todoList'

const Home: NextPage = ({ messages }) => {
  console.log("Home")
  console.log(messages)

  return (
    <div>
      <ButtonAppBar />
      <TodoList messages={messages} />
    </div>
  )
}

export default Home

export async function getServerSideProps () {
  const Redis = require('ioredis')
  const redis = new Redis(6379, 'redis')
  let messages = await redis.lrange('messages', 0, -1)
  messages = messages.map(e => JSON.parse(e))
  console.log(messages)
  return {
    props: {
      messages
    }
  }
}
