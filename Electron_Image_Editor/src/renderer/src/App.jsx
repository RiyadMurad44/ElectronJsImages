import './assets/base.css'
import { Home } from './pages/Home'
import Profile from './pages/Profile'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
// import Counter from './components/counterTest/counter'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
