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

// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('Token'); // Check if user is authenticated

//   if (!isAuthenticated) {
//     // If not authenticated, redirect to login page
//     return <Navigate to="/" />;
//   }

//   // If authenticated, render the children (Home and Navbar)
//   return children;
// };

// export default ProtectedRoute;
