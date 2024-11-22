import type { IProduct } from '../../interfaces';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { Carousel } from '../../components';
import { getProductDetail } from '../../services';

export const ProductDetailPage = () => {

	const token = localStorage.getItem('token')
	const { id } = useParams()

	const [loader, setLoader] = useState<boolean>(true)
	const [productsImages, setProductImages] = useState<string[]>([])
	const [productDetail, setProductDetail] = useState<IProduct>({
		category: '',
		date: new Date(),
		discount: 0,
		images: [],
		price: 0,
		stock: 0,
		title: '',
		description: '',
		_id: '',
		createdBy: '',
		updatedAt: new Date()
	})

	const formatPrice = (price: number): string => {
		const formattedPrice = price.toLocaleString('es-AR', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 2
		})

		return formattedPrice
	}

	const finalPriceHandler = (price: number, discount: number) => {
		const discountAmount = (price * discount) / 100;
		const discountedPrice = price - discountAmount;

		const finalPrice = formatPrice(discountedPrice)

		return finalPrice
	}

	const getProductDetailHanlder = async () => {
		try {
			const { data, urlImages } = await getProductDetail(token!, id!)
			setProductDetail(data)
			setProductImages(urlImages)
			setLoader(false)
		} catch (err) {
			setLoader(false)
			console.log(err)
		}
	}

	useEffect(() => {
		getProductDetailHanlder()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Container sx={{ padding: 3, marginTop: 4 }}>
			{loader && (
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '420px', gap: 4 }}>
					<CircularProgress />

					<Typography variant='h6'>Obteniendo detalle de Producto...</Typography>
				</Box>
			)}

			{!loader && (

				<Box>
					{/* Enlace de regreso */}
					<Link
						to="/products"
						style={{
							color: '#1976d2',
							fontWeight: 'bold',
							textDecoration: 'none',
							marginBottom: 2,
							display: 'inline-block',
							transition: 'color 0.3s ease',
						}}
					>
						Volver a Productos
					</Link>

					{/* Título del producto */}
					<Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
						{productDetail.title}
					</Typography>

					{/* Información y galería del producto */}
					<Box sx={{ display: 'flex', marginTop: 4, gap: 4 }}>
						{/* Carrusel de imágenes */}
						<Carousel imageList={productsImages} />

						{/* Detalles del producto */}
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Typography variant="h5" fontWeight="bold" color="text.primary" sx={{
								textDecoration: productDetail.discount > 0 ? 'line-through' : '',
								fontSize: '1.5rem'
							}}>
								{formatPrice(productDetail.price)}
							</Typography>
							<Typography variant="body1" color="#9e9e9e" fontWeight="medium" sx={{ fontSize: '1rem' }}>
								{productDetail.discount}% OFF
							</Typography>
							<Typography variant="h4" fontWeight="bold" color="#1976d2" sx={{ fontSize: '1.8rem', marginTop: 1 }}>
								{finalPriceHandler(productDetail.price, productDetail.discount)}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Stock: {productDetail.stock}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Categoría: {productDetail.category}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Creado Por: {productDetail.createdBy}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								fecha de Creacion: {new Date(productDetail.date).toLocaleDateString()}
							</Typography>
							{productDetail.updatedAt && (
								<Typography variant="body2" color="text.secondary">
									Ultima Edicion: {new Date(productDetail.updatedAt).toLocaleDateString()}
								</Typography>
							)}
						</Box>
					</Box>

					{/* Descripción del producto */}
					<Box sx={{ marginTop: 4 }}>
						<Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
							Detalle:
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
							{productDetail.description}
						</Typography>
					</Box>
				</Box>


				// <Box>
				// 	<Link to="/products">Volver a Productos</Link>
				// 	<Typography variant="h4">{productDetail.title}</Typography>

				// 	<Box sx={{ display: 'flex', marginTop: 4 }}>
				// 		<Carousel imageList={productsImages} />
				// 		<Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: 4 }}>
				// 			<Typography variant="body1" color={'gray'}>{formatPrice(productDetail.price)}</Typography>
				// 			<Typography variant='body1' color={'gray'}>{productDetail.discount}% OFF</Typography>
				// 			<Typography variant='h6'>{finalPriceHandler(productDetail.price, productDetail.discount)}</Typography>
				// 			<Typography variant='body1' color={'gray'}>Stock: {productDetail.stock}</Typography>
				// 			<Typography variant='body1' color={'gray'}>Categoria: {productDetail.category}</Typography>
				// 			<Typography color={'gray'}>Creado Por: {productDetail.createdBy}</Typography>
				// 		</Box>
				// 	</Box>

				// 	<Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
				// 		<Typography variant='h5'>Detalle:</Typography>
				// 		<Typography variant='body1'>{productDetail.description}</Typography>
				// 	</Box>
				// </Box>
			)}
		</Container>
	)
}
