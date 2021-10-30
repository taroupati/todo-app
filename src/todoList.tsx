import React, { useState } from 'react'
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

export default function TodoList () {

  const [content, setContent] = useState('')
  const [todoList, setTodoList] = useState<string[]>([])

  return (
    <>
      <Box m={2}>
        <Stack spacing={2} direction="row">
          <TextField
            id="outlined-basic"
            label="やること"
            variant="outlined"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />
          <Button
            variant="contained"
            disabled={content === ''}
            onClick={() => {
              setTodoList([...todoList, content])
              setContent('')
            }}
          >
            追加
          </Button>
        </Stack>
      </Box>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} m={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-start" spacing={2}>
            {todoList.map((value, index) => (
              <Grid key={value} item>
                <Card sx={{ minWidth: 275 }} key={value}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {value}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Grid container justifyContent="flex-end">
                      <IconButton
                        aria-label="edit todo"
                        onClick={() => {
                          alert(todoList)
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