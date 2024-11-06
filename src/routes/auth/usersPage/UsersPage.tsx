import type { IUser, IUsers } from '../../../interfaces'
import { useEffect, useState } from 'react'
import { useJwt } from 'react-jwt'
import { useModal } from '../../../hooks/useModal'
import { getAllUsers, changeUserRole, deleteUser } from '../../../services'
import { Modal } from '../../../components'
import { Box, Button, CircularProgress, Container, IconButton, Typography, useTheme } from '@mui/material'
import { VerifiedUser, Delete, Home } from '@mui/icons-material';
import CheckIcon from "../../../assets/CheckIcon.svg"
import WarningIcon from "../../../assets/WarnignIcon.png"
import { Link } from 'react-router-dom'

export const UsersPage = () => {

    const token = localStorage.getItem('token')
    const theme = useTheme()
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

    const [usersList, setUsersList] = useState<IUsers[]>([])
    const [actionType, setActionType] = useState<string>("")
    const [loader, setLoader] = useState<boolean>(true)
    const [userToDeleteId, setUserToDeleteId] = useState<string>('')
    const [userToChangeRole, setUserToChangeRole] = useState<IUsers>({
        email: '',
        image: '',
        isAdmin: false,
        name: '',
        username: '',
        createdAt: new Date(),
        __v: 0,
        _id: '',
    })

    const openModalHandler = async (user: IUsers, actionType: string) => {
        setActionType(actionType)
        setUserToDeleteId(user._id)

        if (actionType === 'changeRole' && user.isAdmin) {
            openModal('success', 'Desesa cambiar el rol a usuario?', WarningIcon, 'aceptar', 'success')
            setUserToChangeRole(user)

            return
        }

        if (actionType === 'changeRole' && !user.isAdmin) {
            openModal('success', 'Desea cambiar el rol a Admin?', WarningIcon, 'aceptar', 'success')
            setUserToChangeRole(user)

            return
        }

        if (actionType === "deleteUser") {
            openModal('error', 'Desea Eliminar el usuario?', WarningIcon, "borrar", 'error')
        }
    }

    const actionButtonHandler = async () => {
        if (actionType === 'changeRole' && userToChangeRole.isAdmin) {
            openModal('loading', 'Cargando...')
            await changeUserRole(token!, userToChangeRole._id, false)
            openModal('info', "Se cambio el Rol a Usuario", CheckIcon, 'aceptar', 'success')
            getAllUsersHandler()

            return
        }

        if (actionType === 'changeRole' && !userToChangeRole.isAdmin) {
            openModal('loading', 'Cargando...')
            await changeUserRole(token!, userToChangeRole._id, true)
            openModal('info', "Se cambio el Rol a Admin", CheckIcon, 'aceptar', 'success')
            getAllUsersHandler()

            return
        }

        if (actionType === 'deleteUser') {
            openModal('loading', 'Eliminando usuario...')
            await deleteUser(token!, userToDeleteId)
            openModal('info', 'Se elimino el Usuario', CheckIcon, 'aceptar', 'success')
            getAllUsersHandler()
        }

    }

    const getAllUsersHandler = async () => {
        try {
            const { users } = await getAllUsers(token!);

            const hideCurrentUser = users.filter(user => {
                return user.name !== decodedToken?.userData.name;
            });

            setUsersList(hideCurrentUser);
            setLoader(false)
        } catch (err) {
            setUsersList([]);
            setLoader(false)
            console.log("Error al obtener usuarios:", err);
        }
    };

    useEffect(() => {
        if (decodedToken) {
            getAllUsersHandler()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedToken])


    return (
        <Container sx={{ padding: 3, marginTop: 4 }}>

            {decodedToken?.userData.isAdmin
                ? (<>
                    <Typography variant='h4'>Panel de Usuarios</Typography>

                    {loader && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                            <CircularProgress />
                            <Typography variant='body2' align="center">Cargando Usuarios...</Typography>
                        </Box>
                    )}

                    {!usersList.length && !loader && (
                        <Typography variant='h6'>No se pudo obtener la lista.</Typography>
                    )}

                    <Typography variant='body1' color='gray'>Usuarios en DB: {usersList.length + 1}</Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {usersList.map((user) => (
                            <Box
                                key={user._id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    padding: 3,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    bgcolor: 'background.paper',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: 6,
                                    },
                                    width: 350,
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" fontWeight="bold">
                                        {user.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Creado: {new Date(user.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color={user.isAdmin ? 'primary.main' : 'text.secondary'}>
                                        Rol: {user.isAdmin ? "Admin" : "Usuario"}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                                        <IconButton onClick={() => openModalHandler(user, "changeRole")} color="primary">
                                            <VerifiedUser color={user.isAdmin ? 'disabled' : 'success'} />
                                        </IconButton>

                                        <IconButton onClick={() => openModalHandler(user, "deleteUser")} color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Box
                                    component="img"
                                    src={user.image}
                                    alt={user.name}
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: `2px solid ${user.isAdmin ? theme.palette.primary.main : theme.palette.divider}`,
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </>)
                : (<>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 4
                        }}
                    >
                        <Typography variant="h3" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Acceso Denegado
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                            No tienes permisos para acceder a esta página.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Home />}
                            component={Link}
                            to="/"
                            sx={{ paddingX: 3, paddingY: 1 }}
                        >
                            Volver al Inicio
                        </Button>
                    </Box>
                </>)
            }

            {toggleModal && (
                <Modal
                    open={toggleModal}
                    type={modalType}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={actionButtonHandler}
                    closeModalHandler={closeModal}
                />
            )}
        </Container>
    )
}
