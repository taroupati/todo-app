import type { NextPage } from 'next'
import ButtonAppBar from '../components/appBar'
import TodoList from 'src/components/todoList'

const Home: NextPage = ({ messages, text }) => {
  console.log("Home")
  console.log(messages)

  return (
    <>
      <ButtonAppBar />
      <TodoList messages={messages} text={text} />
    </>
  )
}

export default Home

export async function getServerSideProps () {
  const Redis = require('ioredis')
  const redis = new Redis(6379, 'redis')
  let messages = await redis.lrange('messages', 0, -1)
  messages = messages.map(e => JSON.parse(e))
  let text = await redis.get('text')
  // text = JSON.parse(text)
  return {
    props: {
      messages,
      text
    }
  }
}
