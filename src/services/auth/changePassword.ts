import axios, { isAxiosError } from 'axios'

interface ApiResponse {
    message: string
}

export const changePassword = async (token: string, userId: string, currentPassword: string, newPassword: string) => {
    try {
        const { data } = await axios.patch<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/changePassword`,
            {
                userId,
                currentPassword,
                newPassword
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message as string || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}