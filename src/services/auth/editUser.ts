import axios, { isAxiosError } from 'axios'

interface editUserProps {
    name: string;
    email: string
    username: string
    image?: File | null
}

interface ApiResponse {
    data: {
        email: string
        image: string
        isAdmin: boolean
        name: string
        username: string
    }
}

export const editUser = async (_id: string, data: editUserProps, token: string) => {
    const { name, email, username, image } = data

    const formData = new FormData()

    formData.append('_id', _id)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('username', username)
    if (image) {
        formData.append('avatar', image)
    }

    try {
        const { data } = await axios.put<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/editUser`, formData, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })

        return data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}