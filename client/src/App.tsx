import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './LayoutComponent.tsx'
import Index from './pages/Index.tsx'
import Login from './pages/Login.tsx'
import { useState } from 'react'
import { AuthProps, AuthState } from './types.ts'
import { getAuth } from './utils.ts'
import Upload from './pages/Upload.tsx'
import Listen from './pages/Listen.tsx'
import ListenTo from './pages/ListenTo.tsx'

const App = () => {
  
const [auth, setAuth] = useState<AuthState>(getAuth())

  const authProps: AuthProps = {
    auth,
    setAuth
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Index auth={auth} setAuth={setAuth} />} />
          <Route path='login' element={<Login auth={auth} setAuth={setAuth} />} />
          <Route path='upload' element={<Upload {...authProps} />} />
          <Route path='listen'>
            <Route index element={<Listen />} />
            <Route path=':id' element={<ListenTo /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App