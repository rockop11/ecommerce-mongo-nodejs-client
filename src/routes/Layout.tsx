import type { IUser } from "../interfaces";
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useJwt } from "react-jwt";
import { useAuth } from "../hooks/useAuth"
import { logout } from "../services"
import { Box } from "@mui/material"
import { Sidebar, Navbar } from "../components"


export const Layout = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const { decodedToken } = useJwt<IUser>(token!);


    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('login')
        }

        if (decodedToken && decodedToken.exp) {
            //automatic logout
            const expirationTime = decodedToken.exp * 1000
            const currentTime = Date.now()

            const timeUltiExpires = expirationTime - currentTime

            const timer = setTimeout(() => {
                logout()
                navigate("/login")
            }, timeUltiExpires)

            return () => clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    return (
        <Box sx={{ display: 'flex', position: 'relative' }}>
            <Sidebar />
            <Navbar />
            <Outlet />
        </Box>
    )
}
