import type { IUser } from "../../../interfaces";
import { useJwt } from "react-jwt"
import { Box, Button, Container, Typography } from "@mui/material"
import { Link } from "react-router-dom";

export const ProfilePage = () => {
    const token = localStorage.getItem("token")
    const { decodedToken } = useJwt<IUser>(token!);

    return (
        <Container sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h4">Perfil</Typography>

            <Box>
                <Typography variant="body1">Nombre: {decodedToken?.userData.name}</Typography>
                <Typography variant="body1">email: {decodedToken?.userData.email}</Typography>
                <Typography variant="body1">username: {decodedToken?.userData.username}</Typography>
                <Typography variant="body1">Admin: {!decodedToken?.userData.isAdmin ? "No" : 'Si'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                <Link to="/editUser" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button variant='contained'>Editar usuario</Button>
                </Link>

                <Link to="/changePassword">
                    <Button variant='contained'>Cambiar Contraseña</Button>
                </Link>
            </Box>
        </Container>
    )
}
