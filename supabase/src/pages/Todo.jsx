import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'


const Todo=() => {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  // READ — fetch all todos from Supabase when page loads
  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching todos:', error.message)
    } else {
      setTodos(data)
    }
  }

  // CREATE — add new todo to Supabase
  async function addTodo() {
    if (input === '') return

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: input }])
      .select()

    if (error) {
      console.error('Error adding todo:', error.message)
    } else {
      setTodos([...todos, data[0]])
      setInput('')
    }
  }

  // UPDATE — edit todo title in Supabase
  async function editTodo(id, currentTitle) {
    const newTitle = prompt('Edit your task:', currentTitle)

    if (newTitle !== null && newTitle !== '') {
      const { error } = await supabase
        .from('todos')
        .update({ title: newTitle })
        .eq('id', id)

      if (error) {
        console.error('Error editing todo:', error.message)
      } else {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, title: newTitle } : todo
        ))
      }
    }
  }

  // DELETE — remove todo from Supabase
  async function deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error.message)
    } else {
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>

      {/* Back button */}
      <button onClick={() => navigate('/')}>← Back to Home</button>

      <h1>My Todos</h1>

      {/* Input to add todo */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new todo..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #ccc'
              }}
            >
              <span>{todo.title}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => editTodo(todo.id, todo.title)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Todo