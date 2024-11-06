import axios, { isAxiosError } from 'axios'
import { IUsers } from '../../interfaces'

// interface ApiResponse {
//     message: string
//     data: IUsers
// }

export const changeUserRole = async (token: string, userId: string, role: boolean): Promise<IUsers> => {
    try {
        const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/auth/changeUserRole`,
            { _id: userId, isAdmin: role },
            { headers: { authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}