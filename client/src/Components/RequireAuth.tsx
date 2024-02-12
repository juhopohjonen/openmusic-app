import { Navigate } from "react-router-dom"

const RequireAuth = () => { 
    return (
        <>
            {Boolean(window.localStorage.getItem('auth')) === false && <Navigate to='/' /> }
        </>
    )
}

export default RequireAuth