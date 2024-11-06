import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useModal } from "../../../hooks/useModal";
import { register } from "../../../services";
import { Modal } from "../../../components";
import { Box, Button, Grid, Input, TextField, Typography } from "@mui/material"
import CheckIcon from "../../../assets/CheckIcon.svg"
import ErrorIcon from "../../../assets/ErrorIcon.svg"

interface InputVaulesProps {
    name: string;
    username: string;
    email: string;
    password: string;
    image: File | null
}

export const RegisterPage = () => {

    const navigate = useNavigate()
    const {
        toggleModal,
        modalType,
        title,
        icon,
        buttonValue,
        buttonColor,
        openModal,
        closeModal,
    } = useModal()

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [inputValues, setInputValues] = useState<InputVaulesProps>({
        name: '',
        username: '',
        email: '',
        password: '',
        image: null
    })

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

    const registerHandler = async () => {
        const { name, username, password, email } = inputValues

        if (!inputValues.image || !name || !username || !password || !email) {
            setErrorMessage('Debe completar todos los campos*')
            return
        }

        try {
            openModal('loading', 'Creando Usuario')

            await register({
                ...inputValues, image: inputValues.image
            });

            openModal('success', 'Usuario Creado', CheckIcon, 'Aceptar', 'success')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setErrorMessage("Hubo un error, intente mas tarde")
            openModal('info', "Verifique las credenciales", ErrorIcon, "Reintentar", 'primary')
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

                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
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
                        onClick={registerHandler}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                            padding: '12px'
                        }}
                    >
                        Registrarse
                    </Button>
                </Box>

                <Typography align="center" variant="body1" marginTop={2}>
                    Ya tienes cuenta? <Link to='/login'>Logueate</Link>
                </Typography>
            </Grid>

            {toggleModal && (
                <Modal
                    open={toggleModal}
                    type={modalType}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={() => navigate('/login')}
                    closeModalHandler={closeModal}
                />
            )}
        </Grid>
    )
}