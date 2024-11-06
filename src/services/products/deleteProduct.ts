import axios, { isAxiosError } from 'axios'

interface ApiResponse {
    status: number
    message: string
}

export const deleteProduct = async (token: string, id: string) => {
    try {
        const { status } = await axios.delete<ApiResponse>(`${import.meta.env.VITE_API_URL}/products/delete/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        return status
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}