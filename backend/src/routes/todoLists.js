import { Router } from 'express'
import { getAllLists, updateListTodos } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(getAllLists())
})

router.put('/:id', (req, res) => {
  const { todos } = req.body
  const result = updateListTodos(req.params.id, todos)
  if (!result) return res.status(404).json({ error: 'List not found' })
  res.json(result)
})

export default router
