import { ChangeEvent, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Autocomplete, Box, Button, Container, Grid, Input, TextField, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import { getProductDetail } from "../../services"

interface InputValuesProps {
    title: string,
    price: number,
    discount: number,
    stock: number,
    category: string,
    description: string,
    images: File[],
}

export const EditProductsPage = () => {

    //Hooks and Consts.
    const token = localStorage.getItem('token')
    const { id } = useParams()

    //States
    const [inputValues, setInputValues] = useState<InputValuesProps>({
        title: '',
        price: 0,
        discount: 0,
        stock: 0,
        category: '',
        description: '',
        images: [],
    })
    const [productImages, setProductImages] = useState<string[]>([])


    //Handlers
    const setInputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target

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

    const editProductHandler = () => {
        console.log(inputValues)
    }

    const getProductDetailHandler = async () => {

        try {
            const { data, urlImages } = await getProductDetail(token!, id!)
            setProductImages(urlImages)

            setInputValues({
                title: data.title,
                price: data.price,
                discount: data.discount,
                stock: data.stock,
                category: data.category,
                description: data.description,
                images: []
            })

        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        getProductDetailHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container sx={{ padding: 3, marginTop: 4, overflowY: 'auto', height: "94vh" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                    to="/products"
                    style={{
                        color: '#1976d2',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        marginBottom: 2,
                        transition: 'color 0.3s ease',
                        width: 'fit-content'
                    }}
                >
                    Volver a Productos
                </Link>

                <Typography variant='h4'>Editar Producto</Typography>
            </Box>

            <Grid container justifyContent={'center'} alignItems={'center'} direction={'column'}>
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
                    // error={errorMessage && !inputValues.title ? true : false}
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
                            // error={errorMessage && !inputValues.price ? true : false}
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
                            // error={errorMessage && !inputValues.discount ? true : false}
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
                            // error={errorMessage && !inputValues.stock ? true : false}
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
                            // error={errorMessage && !inputValues.category ? true : false}
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
                    // error={errorMessage && !inputValues.description ? true : false}
                    />

                    {/* Input de Imágenes */}
                    <Grid>
                        <Input
                            type='file'
                            size='small'
                            name='images'
                            inputProps={{ multiple: true }}
                            onChange={setInputValuesHandler}
                        // error={errorMessage && !inputValues.images.length ? true : false}
                        />

                        <Box sx={{
                            display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginTop: 2,
                        }}>
                            {productImages.map((image, i) => (
                                <Box key={i} sx={{ position: 'relative' }}>
                                    <Cancel color={'error'} onClick={() => console.log('eliminar imagen')} sx={{ position: 'absolute', right: 0, cursor: 'pointer' }} />
                                    <img
                                        src={image}
                                        style={{
                                            width: '120px',
                                            height: '120px'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>

                    </Grid>

                    <Button
                        variant='contained'
                        onClick={editProductHandler}
                    >
                        Editar Producto
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}
