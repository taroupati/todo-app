import type { NextPage } from 'next'
import ButtonAppBar from '../src/appBar'
import TodoList from '../src/todoList'

const Home: NextPage = () => {
  return (
    <div>
      <ButtonAppBar />
      <TodoList />
    </div>
  )
}

export default Home
