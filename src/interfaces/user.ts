export interface IUser {
    exp: number
    iat: number
    userData: {
        _id: string,
        name: string,
        username: string,
        image: string,
        email: string,
        __v: number,
        userImage: string
        isAdmin: boolean
    }
}

export interface IUsers {
    createdAt: Date,
    email: string
    image: string
    isAdmin: boolean
    name: string
    username: string
    __v: number
    _id: string
}