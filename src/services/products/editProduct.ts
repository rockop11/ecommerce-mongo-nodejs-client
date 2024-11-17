import axios, { isAxiosError } from 'axios'
import { IProduct } from '../../interfaces'

interface ProductDataProps {
    title: string
    price: string
    discount: string
    stock: string
    category: string
    description: string
    images?: File[]
}

interface ApiResponse {
    data: IProduct
}

export const editProduct = async (token: string, id: string, productData: ProductDataProps) => {

    const { title, price, discount, stock, category, description, images } = productData

    const formData = new FormData()

    formData.append('title', title)
    formData.append('price', price)
    formData.append('discount', discount)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('description', description)

    if (images !== undefined && images.length > 0) {
        images.forEach(image => {
            formData.append('images', image)
        })
    }

    try {
        const { data } = await axios.patch<ApiResponse>(`${import.meta.env.VITE_API_URL}/products/edit/${id}`, formData, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}