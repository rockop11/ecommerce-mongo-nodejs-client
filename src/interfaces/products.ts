export interface IProduct {
    category: string
    date: Date
    discount: number
    images: string[]
    imageUrl?: string
    price: number
    stock: number
    title: string
    description: string
    _id: string
    createdBy: string,
    updatedAt?: Date
}