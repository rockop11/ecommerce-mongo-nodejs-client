import axios, { isAxiosError } from 'axios'
import { IProduct } from '../../interfaces'

interface ApiResonseProps {
    length: number
    data: IProduct[]
}

export const getProductsList = async (token: string) => {
    try {
        const { data } = await axios.get<ApiResonseProps>(`${import.meta.env.VITE_API_URL}/products`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        return data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'no se pudo obtener la lista de productos');
        } else {
            throw new Error('error inesperado')
        }
    }
}