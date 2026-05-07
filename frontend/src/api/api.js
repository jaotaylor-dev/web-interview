const API_URL = 'http://localhost:3001/api/todo-lists'

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
  return res.json()
}

export const fetchTodoLists = async () => {
  const res = await fetch(API_URL)
  return handleResponse(res)
}

export const saveTodoListToServer = async (id, { todos }) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todos }),
  })
  return handleResponse(res)
}
