import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material"
import { Login, VisibilityOff, Visibility } from "@mui/icons-material"
import { login } from "../../../services"

interface inputValuesProps {
    username: string
    password: string
}

export const LoginPage = () => {
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [inputIcon, setInputIcon] = useState<boolean>(false)
    const [inputValues, setInputValues] = useState<inputValuesProps>({
        username: '',
        password: ''
    })

    const inputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setErrorMessage('')

        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

    const inputIconHandler = () => {
        setInputIcon(!inputIcon)
    }

    const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { username, password } = inputValues

        if (!inputValues.username || !inputValues.password) {
            setErrorMessage('Debe completar los campos*')
            return
        }

        try {
            await login(username, password);
            navigate('/')
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            }
        }
    }

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}
        >
            <Grid
                item
                sx={{
                    padding: '40px',
                    width: { xs: '100%', sm: '350px' },
                    backgroundColor: '#fff',
                    boxShadow: 3,
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h4"
                    mb={3}
                    align="center"
                    sx={{ fontWeight: 'bold', color: '#1976d2' }}
                >
                    Bienvenido
                </Typography>

                <Typography
                    variant="body1"
                    mb={4}
                    align="center"
                    sx={{ color: '#555' }}
                >
                    Por favor, ingrese sus credenciales
                </Typography>

                <form onSubmit={loginHandler}>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                        <TextField
                            size="small"
                            label="Usuario"
                            type="text"
                            variant="outlined"
                            fullWidth
                            name='username'
                            onChange={inputValuesHandler}
                            value={inputValues.username}
                            error={errorMessage && !inputValues.username ? true : false}
                        />

                        <TextField
                            size="small"
                            label="Contraseña"
                            type={inputIcon ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            name='password'
                            onChange={inputValuesHandler}
                            value={inputValues.password}
                            error={errorMessage && !inputValues.password ? true : false}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {inputIcon
                                            ? (<Visibility
                                                sx={{ cursor: 'pointer' }}
                                                onClick={inputIconHandler}
                                            />)
                                            : (<VisibilityOff
                                                sx={{ cursor: 'pointer' }}
                                                onClick={inputIconHandler}
                                            />)}
                                    </InputAdornment>
                                )
                            }}
                        />

                        {errorMessage && (<Typography align="center" color={'red'}>{errorMessage}</Typography>)}

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            type='submit'
                            startIcon={<Login />}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#1565c0' },
                                padding: '12px'
                            }}
                        >
                            Ingresar
                        </Button>
                    </Box>
                </form>
                <Typography align="center" variant="body1" marginTop={2}><Link to='/changePassword'>Perdiste tu contraseña?</Link></Typography>
                <Typography align="center" variant="body1" marginTop={2}>No tienes cuenta? <Link to='/register'>Registrate</Link></Typography>
            </Grid>
        </Grid>
    )
}
