import axios, { isAxiosError } from 'axios'

export const deleteUser = async (token: string, id: string) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/auth/deleteUser/${id}`,
            { headers: { authorization: `Bearer ${token}` } }
        )

        return
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}