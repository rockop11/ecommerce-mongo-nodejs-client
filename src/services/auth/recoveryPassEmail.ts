import axios, { isAxiosError } from "axios"

export const recoveryPassEmail = async (email: string) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/recoveryLink`, {
            email
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