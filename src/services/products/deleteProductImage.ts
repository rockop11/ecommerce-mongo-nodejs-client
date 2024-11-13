import axios, { isAxiosError } from 'axios'

export const deleteProductImage = async (token: string, prodId: string, folderName: string, fileName: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/products/deleteProductImage`,
            {
                data: { prodId, folderName, fileName },
                headers: { authorization: `Bearer ${token}` }
            }
        )

        return response
    }

    catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data.message || { message: "Error desconocido" }
        } else {
            throw new Error('Hubo un error, intente mas tarde')
        }
    }
}