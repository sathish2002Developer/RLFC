import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AdminProvider } from './contexts/AdminContext'
// import ScrollButtons from './components/feature/ScrollButtons'


function App() {
  return (
    <AdminProvider>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
         {/* <ScrollButtons/> */}
      </BrowserRouter>
    </AdminProvider>
  )
}

export default App