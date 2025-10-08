import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AdminProvider } from './contexts/AdminContext'


function App() {
  return (
    <AdminProvider>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
      </BrowserRouter>
    </AdminProvider>
  )
}

export default App