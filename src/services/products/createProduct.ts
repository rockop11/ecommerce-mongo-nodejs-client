import type { IProduct } from '../../interfaces'
import axios, { isAxiosError } from 'axios'

interface ProductDataProps {
    title: string
    price: string
    discount: string
    stock: string
    category: string
    description: string
    images: File[]
}

interface ApiResponse {
    data: IProduct
    status: number
    message: string
}

export const createProduct = async (token: string, productData: ProductDataProps, createdBy: string) => {

    const { title, price, discount, stock, category, description, images } = productData

    const formData = new FormData()

    formData.append("title", title)
    formData.append("price", price)
    formData.append('discount', discount)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('createdBy', createdBy)
    images.forEach((image) => {
        formData.append('images', image);
    });

    try {
        const { data, status } = await axios.post<ApiResponse>(
            `${import.meta.env.VITE_API_URL}/products/create`,
            formData,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

        return { data, status }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}