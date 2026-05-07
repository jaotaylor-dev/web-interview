import React, { useEffect, useRef, useState } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const getDueLabel = (dueDate) => {
  if (!dueDate) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const [year, month, day] = dueDate.split('-').map(Number)
  const due = new Date(year, month - 1, day)
  const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return 'Due today'
  return `${diffDays}d remaining`
}

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timeout = setTimeout(() => {
      saveTodoList(todoList.id, { todos })
    }, 500)

    return () => clearTimeout(timeout)
  }, [todos, saveTodoList, todoList.id])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px', width: '1.5rem', flexShrink: 0 }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.text}
                onChange={(event) => {
                  const updated = { ...todo, text: event.target.value }
                  setTodos([...todos.slice(0, index), updated, ...todos.slice(index + 1)])
                }}
              />
              <TextField
                type='date'
                size='small'
                label='Due date'
                value={todo.dueDate || ''}
                onChange={(event) => {
                  const updated = { ...todo, dueDate: event.target.value || null }
                  setTodos([...todos.slice(0, index), updated, ...todos.slice(index + 1)])
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '11rem', flexShrink: 0, marginTop: '1rem', marginLeft: '0.5rem' }}
              />
              <div
                style={{
                  width: '7rem',
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem',
                  marginLeft: '0.5rem',
                }}
              >
                {(() => {
                  const label = getDueLabel(todo.dueDate)
                  return label ? (
                    <Chip
                      label={label}
                      size='small'
                      color={label.includes('overdue') ? 'error' : 'default'}
                    />
                  ) : null
                })()}
              </div>
              <Checkbox
                checked={todo.completed}
                onChange={() => {
                  const updated = { ...todo, completed: !todo.completed }
                  setTodos([...todos.slice(0, index), updated, ...todos.slice(index + 1)])
                }}
              />
              <Button
                sx={{ flexShrink: 0 }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos([...todos.slice(0, index), ...todos.slice(index + 1)])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', completed: false, dueDate: null }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}
