import type { IUser } from '../../interfaces'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useJwt } from 'react-jwt'
import { Link, useNavigate } from 'react-router-dom'
import { createProduct } from '../../services'
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Button,
    Container,
    Grid,
    Input,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material'

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

    //Hooks & consts
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { decodedToken } = useJwt<IUser>(token!)
    const userFullName = decodedToken?.userData.name
    const time: number = 3000

    //States
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbarTitle, setSnackbarTitle] = useState<string>('')
    const [snackbarSubtitle, setSnackbarSubtitle] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info')
    const [disabledButton, setDisabledButton] = useState<boolean>(false)
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

    //Handlers
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

    const createProductHanlder = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { title, price, discount, stock, category, description, images } = inputValues

        if (!title || !price || !discount || !stock || !category || !description || !images.length) {
            setErrorMessage('Debe completar todos los campos*')

            return
        }

        try {
            setDisabledButton(true)
            setOpenSnackbar(true)
            setSnackbarTitle('Creando Producto...')

            await createProduct(token!, inputValues, userFullName!)

            setInputValues({
                title: '',
                price: '',
                discount: '',
                stock: '',
                category: '',
                description: '',
                images: [],
            })
            setOpenSnackbar(true)
            setSnackbarTitle('Producto creado')
            setSnackbarSubtitle('Redirigiendo a Productos')
            setSnackbarSeverity('success')

            setTimeout(() => {
                navigate('/products')
            }, time)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setOpenSnackbar(true)
            setSnackbarTitle('No se pudo crear el producto')
            setSnackbarSubtitle('No se pudo crear el producto')
            setSnackbarSeverity('error')
            setDisabledButton(false)
        }
    }

    return (
        <Container sx={{ padding: 3, marginTop: 6, overflowY: 'auto', height: "94vh" }}>
            <Link
                to="/products"
                style={{
                    color: '#1976d2',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    marginBottom: 2,
                    display: 'inline-block',
                    transition: 'color 0.3s ease',
                }}
            >
                Volver a Productos
            </Link>
            <Typography variant='h4'>Crear Producto</Typography>

            <Grid container justifyContent={'center'} alignItems={'center'} direction={'column'} marginTop={5}>
                <form onSubmit={createProductHanlder}>
                    <Grid item sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 4,
                        gap: 4,
                        width: '430px',
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
                        </Grid>

                        {/* Mensaje de Error */}
                        {errorMessage && (<Typography align="center" color={'error'}>{errorMessage}</Typography>)}

                        <Button
                            variant='contained'
                            type='submit'
                            disabled={disabledButton}
                        >
                            Crear Producto
                        </Button>
                    </Grid>
                </form>
            </Grid>

            {openSnackbar && (
                <Snackbar
                    open={true}
                    autoHideDuration={time}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert severity={snackbarSeverity} variant='filled' onClose={() => setOpenSnackbar(false)}>
                        <AlertTitle>{snackbarTitle}</AlertTitle>
                        <Typography variant='body2'>{snackbarSubtitle}</Typography>
                    </Alert>
                </Snackbar>
            )}
        </Container>
    )
}
