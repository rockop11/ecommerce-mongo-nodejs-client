import type { IUser } from '../../interfaces'
import { useJwt } from "react-jwt"
import { Link } from 'react-router-dom'
import { Box, useTheme } from '@mui/material'

export const Navbar = () => {

    const userDataToken = localStorage.getItem('token')
    const { decodedToken } = useJwt<IUser>(userDataToken!)
    const theme = useTheme()

    return (
        <Box component='nav' sx={{ width: '100%', height: '50px', position: 'absolute', borderBottom: `1px solid ${theme.palette.divider}`, }}>
            <Box sx={{ position: 'absolute', top: '5px', right: '5px' }}>
                <Link to='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={decodedToken?.userData.userImage} alt="profile-img" style={{ width: '35px', height: '35px', borderRadius: '50%', cursor: "pointer" }} />
                </Link>
            </Box>
        </Box>
    )
}
