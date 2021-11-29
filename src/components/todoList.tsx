import React, { useState, useEffect, useRef } from "react"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DateTimePicker from '@mui/lab/DateTimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import SocketIOClient from "socket.io-client"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from '../styles/Home.module.css'
import NoSsr from '@mui/material/NoSsr'

const Editor = (props: any) => {
  if (typeof window !== "undefined") {
    const Ace = require("react-ace").default
    require("ace-builds/src-noconflict/mode-markdown.js")
    require("ace-builds/src-noconflict/theme-github")
    return <Ace {...props} />
  }
  return null
}

interface IMsg {
  user: string
  msg: string
}

// create random user
const user = "User_" + String(new Date().getTime()).substr(-3)

export default function TodoList ({ messages, text }) {
  const [userList, setUserList] = useState<string[]>()
  const [docText, setDocText] = useState(text)
  const [selectionStart, setSelectionStart] = React.useState()

  // connected flag
  const [connected, setConnected] = useState<boolean>(false)

  // init chat and message
  const [chat, setChat] = useState<IMsg[]>(messages)
  const [msg, setMsg] = useState<string>("")

  function onChange (newValue) {
    setText(newValue)
  }

  useEffect((): any => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    })

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id)
      setConnected(true)
    })

    // update chat on new message dispatched
    socket.on("message", (message: IMsg) => {
      chat.push(message)
      setChat([...chat])
    })

    // update chat on new message dispatched
    socket.on("text", (text: String) => {
      setDocText(text)
      // TODO: userCursorの更新時に呼び出す
      updateCursorElement(0)
    })

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect()
  }, [])

  const setText = async (value) => {
    // dispatch text to other users
    const resp = await fetch("/api/doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
  }

  function updateCursorElement (userId) {
    if (typeof document !== 'undefined') {
      document.getElementById(userId)?.remove()
      const subRoot1 = document.createElement('div')
      subRoot1.className = styles.cursor
      subRoot1.id = userId
      const topLine = document.getElementsByClassName("ace_gutter-cell")[0].textContent
      subRoot1.style["top"] = String((10 - Number(topLine)) * 14) + "px"
      document.getElementsByClassName("ace_cursor-layer")[0].appendChild(subRoot1)
    }
  }

  function updateCursorTop () {
    // TODO: debounceするべき
    // https://aloerina01.github.io/blog/2017-08-03-1
    if (typeof document !== 'undefined') {
      setTimeout(function () {
        const subRoot1 = document.getElementById("0")
        if (subRoot1) {
          const topLine = document.getElementsByClassName("ace_gutter-cell")[0].textContent
          subRoot1.style["top"] = String((10 - Number(topLine)) * 14) + "px"
          document.getElementsByClassName("ace_cursor-layer")[0].appendChild(subRoot1)
        }
      }, 50)
    }
  }

  return (
    <Box m={2}>
      <Stack spacing={2} direction="row">
        <Box>
          <NoSsr>
            <Editor
              mode="markdown"
              theme="github"
              onChange={onChange}
              onScroll={updateCursorTop}
              value={docText}
              name="UNIQUE_ID_OF_DIV"
              instanceId="test"
              editorProps={{ $blockScrolling: true }}
            />
          </NoSsr>
        </Box>
        <Box>
          <ReactMarkdown
            children={docText}
            components={{
              code ({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    // style={dark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </Box>
      </Stack>
    </Box>
  )
}
