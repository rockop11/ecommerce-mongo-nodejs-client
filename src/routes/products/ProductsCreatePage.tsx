import type { IUser } from '../../interfaces'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJwt } from 'react-jwt'
import { useModal } from '../../hooks/useModal'
import { createProduct } from '../../services'
import {
    Autocomplete,
    Button,
    Container,
    Grid,
    Input,
    TextField,
    Typography
} from '@mui/material'
import { Modal } from '../../components'

import CheckIcon from "../../assets/CheckIcon.svg"
import ErrorIcon from "../../assets/ErrorIcon.svg"

interface InputValuesProps {
    title: string,
    price: string,
    discount: string,
    stock: string,
    category: string,
    description: string,
    images: File[],
}

export const ProductsCreatePage = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
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
    } = useModal();

    const userFullName = decodedToken?.userData.name

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [inputValues, setInputValues] = useState<InputValuesProps>({
        title: '',
        price: '',
        discount: '',
        stock: '',
        category: '',
        description: '',
        images: [],
    })

    const setInputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target

        setErrorMessage('')

        if (name === "images" && files) {
            const imageFiles = Array.from(files);

            setInputValues((prevValues) => ({
                ...prevValues,
                images: imageFiles,
            }));
        } else {
            setInputValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
    }

    const createProductHanlder = async () => {
        const { title, price, discount, stock, category, description, images } = inputValues
        openModal('loading', "Cargando...")

        if (!title || !price || !discount || !stock || !category || !description || !images.length) {
            closeModal()
            setErrorMessage('Debe completar todos los campos*')

            return
        }

        try {
            await createProduct(token!, inputValues, userFullName!)

            openModal('success', 'Producto Creado', CheckIcon, 'Aceptar', 'success')
            setInputValues({
                title: '',
                price: '',
                discount: '',
                stock: '',
                category: '',
                description: '',
                images: [],
            })

        } catch (err) {
            console.log(err)
            openModal('error', 'Hubo un Errrrroor', ErrorIcon, 'reintentar', "primary")
        }
    }

    return (
        <Container sx={{ padding: 3, marginTop: 6, overflowY: 'auto', height: "94vh" }}>
            <Typography variant='h4'>Crear Producto</Typography>

            <Grid container justifyContent={'center'} alignItems={'center'} direction={'column'} marginTop={5}>
                <Grid item sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 4,
                    gap: 4,
                    width: '430px'
                }}>
                    {/* Input de Título */}
                    <TextField
                        type='text'
                        placeholder='titulo'
                        label='Titulo'
                        size='small'
                        name='title'
                        value={inputValues.title}
                        onChange={setInputValuesHandler}
                        error={errorMessage && !inputValues.title ? true : false}
                    />

                    {/* Inputs de Precio, Stock y Descuento */}
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                type='text'
                                placeholder='Precio'
                                label='Precio'
                                size='small'
                                name='price'
                                value={inputValues.price}
                                onChange={setInputValuesHandler}
                                error={errorMessage && !inputValues.price ? true : false}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type='text'
                                placeholder='Descuento'
                                label='Descuento'
                                size='small'
                                name='discount'
                                value={inputValues.discount}
                                onChange={setInputValuesHandler}
                                error={errorMessage && !inputValues.discount ? true : false}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type='text'
                                placeholder='Stock'
                                label='Stock'
                                size='small'
                                name='stock'
                                value={inputValues.stock}
                                onChange={setInputValuesHandler}
                                error={errorMessage && !inputValues.stock ? true : false}
                            />
                        </Grid>
                    </Grid>

                    {/* Input de Categoría */}
                    <Autocomplete
                        options={['Electrodomestico', 'Hogar', 'Jardin']}
                        size='small'
                        value={inputValues.category || null}
                        onChange={(_event, newValue) => setInputValues((prevValues) => ({
                            ...prevValues,
                            category: newValue || '',
                        }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Categoria"
                                name='category'
                                error={errorMessage && !inputValues.category ? true : false}
                            />
                        )}
                    />

                    {/* Input de Descripción */}
                    <TextField
                        type='text'
                        placeholder='Descripcion'
                        label='Descripcion'
                        multiline
                        maxRows={4}
                        name='description'
                        value={inputValues.description}
                        onChange={setInputValuesHandler}
                        error={errorMessage && !inputValues.description ? true : false}
                    />

                    {/* Input de Imágenes */}
                    <Grid>
                        <Input
                            type='file'
                            size='small'
                            name='images'
                            inputProps={{ multiple: true }}
                            onChange={setInputValuesHandler}
                            error={errorMessage && !inputValues.images.length ? true : false}
                        />
                        {/* {errorMessage && !inputValues.images.length && (
                            <Typography align="center" color={'error'}>Por favor, selecciona una imagen.</Typography>
                        )} */}
                    </Grid>

                    {/* Mensaje de Error */}
                    {errorMessage && (<Typography align="center" color={'error'}>{errorMessage}</Typography>)}

                    {/* Botón para Crear Producto */}
                    <Button
                        variant='contained'
                        onClick={createProductHanlder}
                    >
                        Crear Producto
                    </Button>
                </Grid>
            </Grid>

            {/* Modal para confirmación o información adicional */}
            {toggleModal && (
                <Modal
                    type={modalType}
                    open={toggleModal}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={() => navigate('/products')}
                    closeModalHandler={() => closeModal()}
                />
            )}
        </Container>

    )
}
