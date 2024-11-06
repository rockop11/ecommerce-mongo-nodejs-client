import axios, { isAxiosError } from 'axios'

export const getLastUserCreated = async (token: string) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/lastUserCreated`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'no se pudo obtener la lista de usuarios');
        } else {
            throw new Error('error inesperado')
        }
    }
}