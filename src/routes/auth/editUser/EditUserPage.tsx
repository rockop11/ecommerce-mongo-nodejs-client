import type { IUser } from "../../../interfaces"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useJwt } from "react-jwt"
import { useModal } from "../../../hooks/useModal"
import { Container, Typography, TextField, Grid, Input, Button } from "@mui/material"
import { Modal } from "../../../components"
import { editUser, logout } from "../../../services"

import CheckIcon from "../../../assets/CheckIcon.svg"
import ErrorIcon from "../../../assets/ErrorIcon.svg"

interface InputValuesProps {
    name: string,
    username: string
    email: string
    image: File | null
}

export const EditUserPage = () => {

    const token = localStorage.getItem('token')
    const { decodedToken } = useJwt<IUser>(token!)
    const { toggleModal, modalType, title, icon, buttonValue, buttonColor, openModal, closeModal } = useModal()
    const navigate = useNavigate()

    const [inputValues, setInputValues] = useState<InputValuesProps>({
        name: '',
        username: '',
        email: '',
        image: null
    })

    const inputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target

        if (name === 'image' && files) {
            const imageFile = Array.from(files)

            setInputValues((prevValues) => ({
                ...prevValues,
                image: imageFile[0],
            }));
        } else {
            setInputValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
    }

    const editUserHandler = async () => {
        try {
            openModal('loading', 'Cargando...')
            await editUser(decodedToken?.userData._id as string, inputValues, token!)
            openModal('success', 'Usuario Editado', CheckIcon, "Ir al Login", "primary")

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            openModal('error', 'Error al editar Usuario', ErrorIcon)
        }
    }

    const actionButtonHandler = () => {
        logout()
        navigate('/login')
    }

    useEffect(() => {
        if (decodedToken) {
            setInputValues({
                name: decodedToken?.userData.name as string,
                username: decodedToken?.userData.username as string,
                email: decodedToken?.userData.email as string,
                image: null
            })
        }
    }, [decodedToken])


    return (
        <Container sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant='h4'>Editar Usuario</Typography>

            <Grid container justifyContent={'center'} alignItems={'center'} direction={'column'}>

                <Grid item sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 4,
                    gap: 4,
                    width: '350px'
                }}>
                    <TextField
                        type='text'
                        placeholder='Nombre'
                        label='Nombre'
                        size='small'
                        name='name'
                        value={inputValues.name}
                        onChange={inputValuesHandler}
                    />

                    <TextField
                        type='text'
                        placeholder='Usuario'
                        label='Usuario'
                        size='small'
                        name='username'
                        value={inputValues.username}
                        onChange={inputValuesHandler}
                    />

                    <TextField
                        type='email'
                        placeholder='Email'
                        label='Email'
                        size='small'
                        name='email'
                        value={inputValues.email}
                        onChange={inputValuesHandler}
                    />

                    <Input
                        type='file'
                        size='small'
                        name='image'
                        onChange={inputValuesHandler}
                    />

                    <Button variant="contained" onClick={editUserHandler}>
                        Editar Usuario
                    </Button>
                </Grid>
            </Grid>

            {
                toggleModal && (
                    <Modal
                        type={modalType}
                        open={toggleModal}
                        title={title}
                        icon={icon}
                        buttonValue={buttonValue}
                        buttonColor={buttonColor}
                        actionButtonHandler={actionButtonHandler}
                        closeModalHandler={closeModal}
                    />
                )
            }
        </Container>
    )
}