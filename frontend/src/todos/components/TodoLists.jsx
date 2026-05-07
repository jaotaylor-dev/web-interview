import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { TodoListForm } from './TodoListForm'
import { fetchTodoLists, saveTodoListToServer } from '../../api/api'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  const mapTodoLists = (todoLists) => {
    return Object.keys(todoLists).map((key) => {
      const list = todoLists[key]
      const allCompleted = list.todos.length > 0 && list.todos.every((t) => t.completed)
      return (
        <ListItemButton key={key} onClick={() => setActiveList(key)}>
          <ListItemIcon>
            {allCompleted ? <DoneAllIcon color='success' /> : <ReceiptIcon />}
          </ListItemIcon>
          <ListItemText primary={todoLists[key].title} />
        </ListItemButton>
      )
    })
  }

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>{mapTodoLists(todoLists)}</List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            saveTodoListToServer(id, { todos }).then(() => {
              const listToUpdate = todoLists[id]
              setTodoLists({
                ...todoLists,
                [id]: { ...listToUpdate, todos },
              })
            })
          }}
        />
      )}
    </Fragment>
  )
}
