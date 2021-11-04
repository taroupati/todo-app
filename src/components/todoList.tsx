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

interface IMsg {
  user: string
  msg: string
}

// create random user
const user = "User_" + String(new Date().getTime()).substr(-3)

export default function TodoList ({ messages }) {

  const [content, setContent] = useState('')
  const [todoList, setTodoList] = useState<string[]>(messages)
  console.log("chats")
  console.log(messages)
  // console.log(chat)

  const inputRef = useRef(null)

  // connected flag
  const [connected, setConnected] = useState<boolean>(false)

  // init chat and message
  const [chat, setChat] = useState<IMsg[]>(messages)
  // const [chat, setChat] = useState<[]>(messages)
  const [msg, setMsg] = useState<string>("")

  useEffect((): any => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    })

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id)
      // console.log(socket)
      setConnected(true)
    })

    // update chat on new message dispatched
    socket.on("message", (message: IMsg) => {
      chat.push(message)
      setChat([...chat])
    })

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect()
  }, [])

  const sendMessage = async () => {
    if (msg) {
      // build message obj
      const message: IMsg = {
        user,
        msg,
      }

      // dispatch message to other users
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      // reset field if OK
      if (resp.ok) setMsg("")
    }

    // focus after click
    inputRef?.current?.focus()
  }

  return (
    <>
      <Box m={2}>
        <Stack spacing={2} direction="row">
          <TextField
            id="outlined-basic"
            label="やること"
            variant="outlined"
            // value={content}
            value={msg}
            onChange={(e) => {
              // setContent(e.target.value)
              setMsg(e.target.value)
            }}
          />
          <Button
            variant="contained"
            // disabled={content === ''}
            disabled={msg === ''}
            onClick={() => {
              // setTodoList([...todoList, content])
              // setContent('')
              sendMessage()
            }}
          >
            追加
          </Button>
        </Stack>
      </Box>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} m={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-start" spacing={2}>
            {/* {todoList.map((value, index) => ( */}
            {chat.map((value, index) => (
              <Grid key={value.user} item>
                <Card sx={{ minWidth: 275 }} key={value.user}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {value.user}
                      {value.msg}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Date&Time picker"
                        value={new Date()}
                        onChange={() => {}}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Grid container justifyContent="flex-end">
                      <IconButton
                        aria-label="edit todo"
                        onClick={() => {
                          // alert(todoList)
                          alert(chat)
                        }}
                      >
                        <EditIcon color="action" />
                      </IconButton>
                      <IconButton
                        aria-label="remove todo"
                        onClick={() => {
                          setTodoList(todoList.filter((value, i) => {
                            return index !== i
                          }))
                        }}
                      >
                        <DeleteIcon color="action" />
                      </IconButton>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
