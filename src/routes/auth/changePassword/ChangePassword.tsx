import type { IUser } from "../../../interfaces";
import { ChangeEvent, FormEvent, useState } from "react"
import { useModal } from "../../../hooks/useModal";
import { useJwt } from "react-jwt";
import { changePassword } from "../../../services";
import { Box, Button, Container, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Modal } from "../../../components";
import CheckIcon from "../../../assets/CheckIcon.svg"

export const ChangePassword = () => {

    const token = localStorage.getItem('token')
    const { decodedToken } = useJwt<IUser>(token!)

    const {
        toggleModal,
        modalType,
        title,
        icon,
        buttonValue,
        buttonColor,
        openModal,
        closeModal
    } = useModal()

    const [showActualPassword, setShowActualPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [actualPasswordValue, setActualPasswordValue] = useState<string>('')
    const [newPasswordValue, setNewPasswordValue] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')


    const handleClickShowActualPassword = () => setShowActualPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

    const actualPasswordValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        setActualPasswordValue(value)
    }

    const newPasswordValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        setNewPasswordValue(value)
    }

    const changePasswordHandler = async (e: FormEvent) => {
        e.preventDefault()

        if (!actualPasswordValue || !newPasswordValue) {
            setErrorMessage('debe completar los campos')

            return
        }

        if (!decodedToken) {
            console.error("Error: Token no válido o expirado.");
            return
        }

        openModal('loading', 'Actualizando contraseña...')

        try {
            await changePassword(
                token!,
                decodedToken?.userData._id,
                actualPasswordValue,
                newPasswordValue
            )

            openModal(
                'success',
                'Contraseña actualizada',
                CheckIcon,
                'Aceptar',
                'success'
            )

            setErrorMessage('')
            setActualPasswordValue('')
            setNewPasswordValue('')
            setShowActualPassword(false)
            setShowNewPassword(false)

        } catch (error: unknown) {
            if (typeof error === "string") {
                setErrorMessage(error)
            }

            closeModal()
        }
    }

    return (
        <Container sx={{ padding: 3, marginTop: 4, overflowY: 'auto', height: "94vh" }}>

            <Typography variant="h4">Actualizar Contraseña</Typography>

            <Box
                component={'form'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '50%',
                    gap: 2,
                    margin: '50px auto 0px'
                }}
                onSubmit={changePasswordHandler}
            >

                <TextField
                    label="Contraseña actual"
                    variant="outlined"
                    type={showActualPassword ? "text" : "password"}
                    fullWidth
                    value={actualPasswordValue}
                    onChange={actualPasswordValueHandler}
                    error={!!errorMessage}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowActualPassword} edge="end">
                                    {showActualPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            "& fieldset": errorMessage ? { borderColor: "red" } : {},
                        },
                    }}
                />

                <TextField
                    label="Nueva contraseña"
                    variant="outlined"
                    value={newPasswordValue}
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    onChange={newPasswordValueHandler}
                    error={!!errorMessage}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowNewPassword} edge="end">
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            "& fieldset": errorMessage ? { borderColor: "red" } : {},
                        },

                    }}
                />

                {errorMessage && (
                    <Typography variant='body1' align="center" color={'error'}>
                        {errorMessage}
                    </Typography>
                )}

                <Button variant="contained" type='submit'>Actualizar contraseña</Button>
            </Box>

            {toggleModal && (
                <Modal
                    type={modalType}
                    open={toggleModal}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={() => closeModal()}
                    closeModalHandler={() => closeModal()}
                />
            )}

        </Container>
    )
}
