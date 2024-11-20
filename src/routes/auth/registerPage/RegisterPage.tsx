import { ChangeEvent, FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../../../services";
import { Alert, AlertTitle, Box, Button, Grid, Input, Snackbar, TextField, Typography } from "@mui/material"

interface InputVaulesProps {
    name: string;
    username: string;
    email: string;
    password: string;
    image: File | null
}

export const RegisterPage = () => {

    //Hooks
    const navigate = useNavigate()
    const time: number = 3000

    //States
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackBarTitle, setSnackBarTitle] = useState<string>('')
    const [snackBarSubtitle, setSnackBarSubtitle] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info')
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [inputValues, setInputValues] = useState<InputVaulesProps>({
        name: '',
        username: '',
        email: '',
        password: '',
        image: null
    })

    //Handlers
    const setInputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target
        setErrorMessage('')

        if (name === "image" && files) {
            const image = files[0]

            setInputValues((prevValues) => ({
                ...prevValues,
                image: image,
            }));

        } else {
            setInputValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
    }

    const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { name, username, password, email } = inputValues

        if (!inputValues.image || !name || !username || !password || !email) {
            setErrorMessage('Debe completar todos los campos*')
            return
        }

        try {
            setDisableButton(true)
            setOpenSnackbar(true)
            setSnackBarTitle('Registrando Usuario...')

            await register({
                ...inputValues, image: inputValues.image
            });

            setInputValues({
                name: '',
                username: '',
                email: '',
                password: '',
                image: null
            })

            setOpenSnackbar(true)
            setSnackbarSeverity('success')
            setSnackBarTitle('Usuario Registrado')
            setSnackBarSubtitle('redirigiendo al Login')

            setTimeout(() => {
                navigate('/login')
            }, time)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setDisableButton(false)
            setOpenSnackbar(true)
            setSnackBarTitle('Error al crear Usuario')
            setSnackBarSubtitle('intente de nuevo')
            setSnackbarSeverity('error')
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
                    width: { xs: '100%', sm: '400px', },
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
                    Crear Cuenta
                </Typography>

                <Typography
                    variant="body1"
                    mb={4}
                    align="center"
                    sx={{ color: '#555' }}
                >
                    Por favor, complete los campos para registrarse
                </Typography>

                <form onSubmit={registerHandler}>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3, }}
                    >
                        <TextField
                            size="small"
                            label="Nombre Completo"
                            type="text"
                            variant="outlined"
                            fullWidth
                            name='name'
                            value={inputValues.name}
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.name ? true : false}
                        />

                        <TextField
                            size="small"
                            label="Usuario"
                            type="text"
                            variant="outlined"
                            fullWidth
                            name='username'
                            value={inputValues.username}
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.username ? true : false}
                        />

                        <TextField
                            size="small"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            name='email'
                            value={inputValues.email}
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.email ? true : false}
                        />

                        <TextField
                            size="small"
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            name='password'
                            value={inputValues.password}
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.password ? true : false}
                        />

                        <Input
                            type="file"
                            fullWidth
                            name='image'
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.image ? true : false}
                        />

                        {errorMessage && (<Typography align="center" color={'red'}>{errorMessage}</Typography>)}

                        <Button
                            type='submit'
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={disableButton}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#1565c0' },
                                padding: '12px'
                            }}
                        >
                            Registrarse
                        </Button>
                    </Box>
                </form>

                <Typography align="center" variant="body1" marginTop={2}>
                    Ya tienes cuenta? <Link to='/login'>Logueate</Link>
                </Typography>
            </Grid>

            {openSnackbar && (
                <Snackbar
                    open={true}
                    autoHideDuration={time}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert severity={snackbarSeverity} variant='filled' onClose={() => setOpenSnackbar(false)}>
                        <AlertTitle>{snackBarTitle}</AlertTitle>
                        <Typography variant="body2">{snackBarSubtitle}</Typography>
                    </Alert>
                </Snackbar>
            )}
        </Grid>
    )
}