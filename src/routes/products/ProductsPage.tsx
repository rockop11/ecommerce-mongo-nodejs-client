import type { IProduct } from "../../interfaces"
import { useEffect, useState } from "react"
import { getProductsList, deleteProduct } from "../../services"
import { Container, Typography, CircularProgress, Box } from "@mui/material"
import { ProductItem } from "../../components"


export const ProductsPage = () => {

    const token = localStorage.getItem('token')

    const [productList, setProductList] = useState<IProduct[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    const getProductsListHandler = async () => {
        try {
            const { data } = await getProductsList(token!)
            setProductList(data)
            setLoader(false)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setLoader(false)
            setProductList([])
        }
    }

    const deleteProductHandler = async (id: string) => {
        try {
            await deleteProduct(token!, id)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            throw new Error('No se pudo eliminar')
        }
    }

    useEffect(() => {
        getProductsListHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Container sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h4">Productos</Typography>
            <Typography variant="body1" color='gray'>Productos en DB: {productList.length}</Typography>

            {loader && (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                    <CircularProgress />
                    <Typography variant='body2' align="center">Cargando Productos...</Typography>
                </Box>
            )}

            {!productList.length && !loader && (
                <Typography variant='h6'>No se pudo obtener la lista.</Typography>
            )}

            <Box sx={{ marginTop: 4 }}>
                {productList.map((product) => (
                    <ProductItem
                        key={product._id}
                        id={product._id}
                        productTitle={product.title}
                        imageUrl={product.imageUrl!}
                        deleteProductHandler={() => deleteProductHandler(product._id)}
                        getProductsListHandler={getProductsListHandler}
                    />
                ))}
            </Box>

        </Container>
    )
}