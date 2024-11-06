import type { IProduct, IUser, IUsers } from "../../interfaces"
import { useEffect, useState } from "react"
import { useJwt } from "react-jwt"
import { getLastProduct, getLastUserCreated, getProductsList, getAllUsers } from "../../services"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { DetailCard } from "../../components"
import { Link } from "react-router-dom"

export const IndexPage = () => {

	const token = localStorage.getItem('token')
	const { decodedToken } = useJwt<IUser>(token!)

	const [loader, setLoader] = useState<boolean>(true)
	const [productListLenght, setProductListLength] = useState<number>(0)
	const [usersListLength, setUsersListLength] = useState<number>(0)

	const [lastProductData, setLastProductData] = useState<IProduct>({
		category: '',
		date: new Date(),
		discount: 0,
		images: [''],
		imageUrl: '',
		price: 0,
		stock: 0,
		title: '',
		description: '',
		_id: '',
		createdBy: '',
	})
	const [lastUserData, setLastUserData] = useState<IUsers>({
		createdAt: new Date(),
		email: '',
		image: '',
		isAdmin: false,
		name: '',
		username: '',
		__v: 0,
		_id: ''
	})

	const getIndexData = async () => {
		const { data: lastProduct } = await getLastProduct(token!)
		const { data: lastUser } = await getLastUserCreated(token!)
		const { length: productListLength } = await getProductsList(token!)
		const { length: usersListLength } = await getAllUsers(token!)

		setLastProductData(lastProduct)
		setLastUserData(lastUser)
		setProductListLength(productListLength)
		setUsersListLength(usersListLength)
		setLoader(false)
	}

	useEffect(() => {
		getIndexData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Container sx={{ padding: 3, marginTop: 4 }}>
			<Typography variant='h4' sx={{ marginBottom: 2 }}>Bienvenido {decodedToken?.userData.name}</Typography>

			{loader && (
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
					<CircularProgress />
					<Typography variant='body2' align="center">Cargando Información...</Typography>
				</Box>
			)}

			{!loader && (
				<Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>

					<Link to={`/product/${lastProductData._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
						<DetailCard
							title={'Último Producto Agregado'}
							subtitle={lastProductData.title}
							date={lastProductData.date}
							image={lastProductData.imageUrl!}
							color='#228899'
						/>
					</Link>

					<Link to='/users' style={{ textDecoration: 'none', color: 'inherit' }}>
						<DetailCard
							title="Ultimo Usuario Creado"
							subtitle={lastUserData.name}
							image={lastUserData.image}
							date={lastUserData.createdAt}
							color='#009812'
						/>
					</Link>

					<DetailCard
						color='#248bff'
						title="Productos en DB"
						subtitle={productListLenght}
					/>

					<DetailCard
						color='#C70039'
						title="Usuarios en DB"
						subtitle={usersListLength}
					/>
				</Box>
			)}
		</Container >
	)
}