import axios, { isAxiosError } from 'axios'

export const recoveryPassword = async (token: string, password: string) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/recoveryPassword/${token}`, { newPassword: password })

        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}