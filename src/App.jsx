import './App.css'
import Login from './components/Auth/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './components/Auth/Signup'
import Dashboard from './components/screen/Dashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Layout from './components/screen/Layout'
import NotFound from './components/screen/NotFound'
import Setting from './components/screen/Setting'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Setting/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
