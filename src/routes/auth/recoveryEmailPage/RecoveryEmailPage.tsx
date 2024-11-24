import { ChangeEvent, FormEvent, useState } from "react"
import { Alert, AlertTitle, Box, Button, Grid, Snackbar, TextField, Typography } from "@mui/material"
import { recoveryPassEmail } from "../../../services"

export const RecoveryEmailPage = () => {

	//Consts
	const time: number = 3000

	//Local States
	const [inputEmailValue, setInputEmailValue] = useState<string>('')
	const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
	const [snackbarTitle, setSnackbarTitle] = useState<string>('')
	const [snackbarSubtitle, setSnackbarSubtitle] = useState<string>('')
	const [snackbarSeverity, setSnackbarSeverity] = useState<'info' | 'success' | 'error'>('info')
	const [disableButton, setDisableButton] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')


	//Handlers
	const inputValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setInputEmailValue(value)
		setErrorMessage('')
	}

	const recoveryPassLinkHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!inputEmailValue) {
			setErrorMessage('complete el campo de email*')
			return
		}

		try {
			setDisableButton(true)
			setOpenSnackbar(true)
			setSnackbarTitle('Enviando email de confirmacion...')
			setSnackbarSeverity('info')

			const recoveryEmail = await recoveryPassEmail(inputEmailValue)
			console.log(recoveryEmail)

			setOpenSnackbar(true)
			setSnackbarTitle('Correo de recuperacion enviado')
			setSnackbarSubtitle('verifique su casilla de email')
			setSnackbarSeverity('success')
		} catch (error) {
			console.log(error)
			setOpenSnackbar(true)
			setSnackbarTitle('Hubo un error al enviar el mail de verificacion')
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
					Recuperar Contraseña
				</Typography>

				<Typography
					variant="body1"
					mb={4}
					align="center"
					sx={{ color: '#555' }}
				>
					Por favor, ingrese su email para recibir el correo de confirmacion
				</Typography>

				<form onSubmit={recoveryPassLinkHandler}>
					<Box
						sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
					>
						<TextField
							size="small"
							label="email"
							type="email"
							variant="outlined"
							fullWidth
							name='email'
							onChange={inputValueHandler}
							value={inputEmailValue}
							error={errorMessage && !inputEmailValue ? true : false}
						/>

						{errorMessage && (
							<Typography align="center" color={'red'}>{errorMessage}</Typography>
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
							Enviar
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
