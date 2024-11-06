import axios, { isAxiosError } from 'axios'
import type { IUsers } from '../../interfaces'

interface ApiResonseProps {
    users: IUsers[],
    length: number
}

export const getAllUsers = async (token: string) => {
    try {
        const { data } = await axios.get<ApiResonseProps>(`${import.meta.env.VITE_API_URL}/auth/allUsers`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        return data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'no se pudo obtener la lista de usuarios');
        } else {
            throw new Error('error inesperado')
        }
    }
}