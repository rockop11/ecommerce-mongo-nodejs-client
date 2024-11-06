import axios, { isAxiosError } from 'axios'
import { IProduct } from '../../interfaces'

interface ApiResonseProps {
    data: IProduct
    urlImages: string[]
}

export const getProductDetail = async (token: string, id: string) => {
    try {
        const { data } = await axios.get<ApiResonseProps>(`${import.meta.env.VITE_API_URL}/products/detail/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        return data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || `no se pudo obtener el detalle del producto con id ${id}`);
        } else {
            throw new Error('error inesperado')
        }
    }
}