import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../Navbar'

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('Token')

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  // If authenticated, show the Navbar and render the nested route (via <Outlet />)
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default ProtectedRoute
