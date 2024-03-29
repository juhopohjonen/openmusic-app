import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './LayoutComponent.tsx'
import Index from './pages/Index.tsx'
import Login from './pages/Login.tsx'
import { useState } from 'react'
import { AlertProps, AuthProps, AuthState } from './types.ts'
import { getAuth, setStateWithTimeout } from './utils.ts'
import Upload from './pages/Upload.tsx'
import Listen from './pages/Listen.tsx'
import ListenTo from './pages/ListenTo.tsx'
import Signup from './pages/Signup.tsx'
import MyProfile from './pages/MyProfile.tsx'
import ResponsiveDrawer from './Components/Drawer.tsx'
import MySongs from './pages/MySongs.tsx'
import User from './pages/User.tsx'
import MyActivity from './pages/MyActivity.tsx'
import MyPlaylists from './pages/MyPlaylists.tsx'
import ViewPlaylist from './pages/ViewPlaylist.tsx'


const App = () => {
  
  const [auth, setAuth] = useState<AuthState>(getAuth())
  const [successAlert, setSuccessValue] = useState('')
  const [dangerAlert, setDangerValue] = useState('')

  const alerts: AlertProps = { successAlert, dangerAlert, setSuccess: (msg: string) => setStateWithTimeout(setSuccessValue, msg), setDanger: (msg: string) => setStateWithTimeout(setDangerValue, msg) }

  const authProps: AuthProps = {
    setSuccess: alerts.setSuccess,
    setDanger: alerts.setDanger,

    successAlert,
    dangerAlert,

    auth,
    setAuth,
    logout: () => {
      window.localStorage.removeItem('auth')
      setAuth(null)
      alerts.setSuccess('Logout succeed.')
    }
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout {...authProps} />}>
          <Route index element={<Index />} />
          <Route path='login' element={<Login {...authProps} />} />
          <Route path='signup' element={<Signup {...authProps} />} />
          <Route path='upload' element={<Upload {...authProps} />} />
          <Route path='listen'>
            <Route index element={<Listen {...authProps} />} />
            <Route path=':id' element={<ListenTo {...authProps} /> } />
          </Route>
          <Route path='profile' element={<ResponsiveDrawer {...authProps} />}>
            <Route index element={<MyProfile {...authProps} />} />
            <Route path='songs' element={<MySongs {...authProps} />} />
            <Route path='activity' element={<MyActivity />} />
          </Route>
          <Route path='/user/:username' element={<User {...authProps} />} />
          <Route path='playlists'>
            <Route path='my' element={<MyPlaylists {...authProps} />} />
            <Route path=':id' element={<ViewPlaylist {...authProps} />} />
          </Route>
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}

export default App