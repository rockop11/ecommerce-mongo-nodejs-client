import type { IUser } from "../../interfaces"
import { useNavigate, useLocation } from "react-router-dom"
import { useJwt } from "react-jwt"
import {
	Box,
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material"
import { AddBusiness, Person, Store, Logout, Home } from '@mui/icons-material'
import { logout } from "../../services"

interface listItemsProps {
	title: string
	route: string
	icon: JSX.Element
}

const listItems: listItemsProps[] = [
	{
		title: 'Incio',
		route: '/',
		icon: <Home />
	},
	{
		title: 'Productos',
		route: '/products',
		icon: <Store />
	},
	{
		title: 'Crear Producto',
		route: '/products/create',
		icon: <AddBusiness />
	}
]

export const Sidebar = () => {

	const token = localStorage.getItem('token')

	const { decodedToken } = useJwt<IUser>(token!)
	const theme = useTheme()
	const location = useLocation()
	const navigate = useNavigate()

	const logoutHandler = () => {
		logout()
		navigate('/login')
	}

	return (
		<Box sx={{
			width: "265px",
			height: '100vh',
			border: `1px solid ${theme.palette.divider}`,
			poition: "absolute",
			zIndex: 10
		}}>
			<List disablePadding>
				{listItems.map((item) => (
					<ListItem key={item.title} disablePadding
						sx={{
							backgroundColor: location.pathname === item.route ? '#1976d2' : '',
							color: location.pathname === item.route ? '#ffffff' : '',
						}}>
						<ListItemButton onClick={() => navigate(`${item.route}`)}>
							<ListItemIcon sx={{
								color: location.pathname === item.route ? '#ffffff' : '',
							}}>{item.icon}</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: location.pathname === item.route ? 'bold' : ''
								}}
							>
								{item.title}
							</ListItemText>
						</ListItemButton>
					</ListItem>
				))}
				{decodedToken?.userData.isAdmin && (
					<ListItem disablePadding
						sx={{
							backgroundColor: location.pathname === '/users' ? '#1976d2' : '',
							color: location.pathname === '/users' ? '#ffffff' : '',
						}}
					>
						<ListItemButton onClick={() => navigate('/users')}>
							<ListItemIcon
								sx={{
									color: location.pathname === '/users' ? '#ffffff' : '',
								}}
							><Person /></ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: location.pathname === '/users' ? 'bold' : ''
								}}
							>Usuarios</ListItemText>
						</ListItemButton>
					</ListItem>
				)}

			</List>
			<Divider />
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={logoutHandler}>
						<ListItemIcon><Logout /></ListItemIcon>
						<ListItemText>Salir</ListItemText>
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
}
