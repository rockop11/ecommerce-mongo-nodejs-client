import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useModal } from "../../hooks/useModal"
import { useParams, Link } from "react-router-dom"
import { Autocomplete, Box, Button, Container, Grid, Input, TextField, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import { getProductDetail, deleteProductImage, editProduct } from "../../services"
import { Modal } from "../../components"
import WarningIcon from "../../assets/WarnignIcon.png"

interface InputValuesProps {
    title: string,
    price: string,
    discount: string,
    stock: string,
    category: string,
    description: string,
    images: File[],
}

export const EditProductsPage = () => {

    //Hooks and Consts.
    const token = localStorage.getItem('token')
    const { id } = useParams()
    const { toggleModal, modalType, title, icon, buttonValue, buttonColor, openModal, closeModal } = useModal()

    //States
    const [inputValues, setInputValues] = useState<InputValuesProps>({
        title: '',
        price: '',
        discount: '',
        stock: '',
        category: '',
        description: '',
        images: [],
    })
    const [productImages, setProductImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string>('')

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

    const openModalHandler = (image: string) => {
        openModal('success', 'Desea Eliminar la imagen?', WarningIcon, 'Eliminar', 'error')
        setSelectedImage(image)
    }

    const deleteProductImageHandler = async (imageUrl: string) => {
        const [mainUrl] = imageUrl.split('?');

        const parts = mainUrl.split('o/');

        const pathSegments = parts[1].split('%2F');

        const folder = decodeURIComponent(pathSegments[1]);
        const productName = decodeURIComponent(pathSegments[2]);

        try {

            const removedImageFromArray = productImages.filter(image => {
                return image !== imageUrl
            })

            setProductImages(removedImageFromArray)
            await deleteProductImage(token!, id!, folder, productName)
            closeModal()
        } catch (error) {
            console.log(error)
        }
    }

    const editProductHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        openModal('loading', 'Editando producto')

        try {
            await editProduct(token!, id!, inputValues)
            closeModal()
        } catch (err) {
            console.log(err)
        }
    }

    const getProductDetailHandler = async () => {
        try {
            const { data, urlImages } = await getProductDetail(token!, id!)
            setProductImages(urlImages)

            setInputValues({
                title: data.title,
                price: data.price.toString(),
                discount: data.discount.toString(),
                stock: data.stock.toString(),
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
                <form onSubmit={editProductHandler}>
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
                        />

                        {/* Input de Imágenes */}
                        <Grid>
                            <Input
                                type='file'
                                size='small'
                                name='images'
                                inputProps={{ multiple: true }}
                                onChange={setInputValuesHandler}
                            />

                            <Box sx={{
                                display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginTop: 2,
                            }}>
                                {productImages.map((image, i) => (
                                    <Box key={i} sx={{ position: 'relative' }}>
                                        <Cancel
                                            color={'error'}
                                            sx={{ position: 'absolute', right: 0, cursor: 'pointer' }}
                                            onClick={() => openModalHandler(image)}
                                        />
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

                        <Button variant='contained' type='submit'>
                            Editar Producto
                        </Button>
                    </Grid>
                </form>
            </Grid>

            {toggleModal && (
                <Modal
                    open={toggleModal}
                    type={modalType}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={() => deleteProductImageHandler(selectedImage)}
                    closeModalHandler={closeModal}
                />
            )}
        </Container>
    )
}
