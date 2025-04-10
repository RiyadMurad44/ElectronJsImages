import './assets/base.css'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Route, Routes } from 'react-router-dom'
import Counter from './components/counterTest/counter'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
