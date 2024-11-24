import { ChangeEvent, FormEvent, useState } from 'react'
import { useParams, useNavigate } from "react-router"
import { Alert, AlertTitle, Box, Button, Grid, Snackbar, TextField, Typography } from "@mui/material"
import { recoveryPassword } from '../../../services'

interface InputValuesProps {
	password: string
	repeatPass: string
}

export const RecoveryPasswordPage = () => {

	//Hooks
	const { token } = useParams()
	const navigate = useNavigate()
	const time: number = 3000

	//Local States
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [errors, setErrors] = useState<boolean>(false)
	const [disableButton, setDisableButton] = useState<boolean>(false)
	const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
	const [snackbarTitle, setSnackbarTitle] = useState<string>('')
	const [snackbarSubtitle, setSnackbarSubtitle] = useState<string>('')
	const [snackbarSeverity, setSnackbarSeverity] = useState<'info' | 'success' | 'error'>('info')
	const [inputValues, setInputValues] = useState<InputValuesProps>({
		password: '',
		repeatPass: ''
	})

	//Handlers
	const inputValuesHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target

		setInputValues((prevValues) => ({
			...prevValues,
			[name]: value
		}))
	}

	const recoveryPasswordHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { password, repeatPass } = inputValues

		if (password !== repeatPass) {
			setErrors(true)
			setErrorMessage('las contraseñas deben coincidir*')

			return
		}

		try {
			setDisableButton(true)
			setOpenSnackbar(true)
			setSnackbarTitle('Aguarde...')
			setSnackbarSubtitle('se esta modificando la contraseña')

			await recoveryPassword(token!, password)
			setOpenSnackbar(true)
			setSnackbarTitle('Contraseña modificada con exito')
			setSnackbarSubtitle('redirigiendo a Login')
			setSnackbarSeverity('success')

			setTimeout(() => {
				navigate('/login')
			}, time)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			setOpenSnackbar(true)
			setSnackbarTitle('Hubo un error')
			setSnackbarSubtitle('intente nuevamente')
			setSnackbarSeverity('error')
			setDisableButton(false)
		}
	}

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}
		>
			<Grid
				item
				sx={{
					padding: '40px',
					width: { xs: '100%', sm: '350px' },
					backgroundColor: '#fff',
					boxShadow: 3,
					borderRadius: 2
				}}
			>
				<Typography
					variant="h5"
					mb={3}
					align="center"
					sx={{ fontWeight: 'bold', color: '#1976d2' }}
				>
					Recuperar contraseña
				</Typography>

				<Typography
					variant="body1"
					mb={4}
					align="center"
					sx={{ color: '#555' }}
				>
					Ingrese su nueva contraseña
				</Typography>

				<form onSubmit={recoveryPasswordHandler}>
					<Box
						sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
					>
						<TextField
							size="small"
							label="contraseña"
							type="password"
							variant="outlined"
							fullWidth
							name='password'
							value={inputValues.password}
							onChange={inputValuesHandler}
							error={errors}
						/>

						<TextField
							size="small"
							label="repetir contraseña"
							type="password"
							variant="outlined"
							fullWidth
							name='repeatPass'
							value={inputValues.repeatPass}
							onChange={inputValuesHandler}
							error={errors}
						/>

						{errorMessage && (
							<Typography align="center" color={'error'}>{errorMessage}</Typography>
						)}

						<Button
							variant="contained"
							fullWidth
							size="large"
							type='submit'
							disabled={disableButton}
							sx={{
								backgroundColor: '#1976d2',
								'&:hover': { backgroundColor: '#1565c0' },
								padding: '12px'
							}}
						>
							Cambiar Contraseña
						</Button>
					</Box>
				</form>
			</Grid>

			{openSnackbar && (
				<Snackbar
					open={true}
					autoHideDuration={time}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					onClose={() => setOpenSnackbar(false)}
				>
					<Alert severity={snackbarSeverity} variant='filled'>
						<AlertTitle>{snackbarTitle}</AlertTitle>
						<Typography variant='body2'>{snackbarSubtitle}</Typography>
					</Alert>
				</Snackbar>
			)}

		</Grid>
	)
}
