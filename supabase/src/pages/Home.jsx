import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Todo App</h1>
      <p>Manage your tasks easily</p>
      <button 
        onClick={() => navigate('/todo')}
        style={{
          padding: '10px 30px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Go to My Todos
      </button>
    </div>
  )
}

export default Home