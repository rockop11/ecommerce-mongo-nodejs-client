import axios, { isAxiosError } from 'axios'

interface UserDataProps {
    name: string;
    username: string;
    email: string;
    password: string;
    image: File
}

interface ApiResponse {
    status: number
    message: string
}

export const register = async (userData: UserDataProps) => {
    const { name, username, email, password, image } = userData

    const formData = new FormData()

    formData.append("name", name)
    formData.append("username", username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', image)

    try {
        const { data } = await axios.post<ApiResponse>(
            `${import.meta.env.VITE_API_URL}/auth/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Hubo un error, intente mas tarde" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}