import express from 'express'
import cors from 'cors'
import todoListsRouter from './routes/todoLists.js'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app.use('/api/todo-lists', todoListsRouter)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
