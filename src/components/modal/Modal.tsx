import {
    Button,
    Dialog,
    DialogActions,
    CircularProgress,
    DialogContent,
    DialogTitle,
} from "@mui/material";

interface ModalProps {
    open: boolean;
    type: 'success' | 'error' | 'loading' | 'info'
    title: string
    icon: string
    buttonValue?: string
    buttonColor?: 'success' | 'error' | 'primary' | 'secondary'
    actionButtonHandler?: () => void
    closeModalHandler?: () => void
}

export const Modal = ({
    open,
    type,
    title,
    icon,
    buttonValue,
    buttonColor,
    actionButtonHandler,
    closeModalHandler
}: ModalProps) => {
    return (
        <Dialog open={open} PaperProps={{
            sx: {
                width: '350px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingY: '20px'
            }
        }}>
            <DialogTitle textAlign={'center'}>
                {title}
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                {type === 'loading' && (<CircularProgress />)}

                {(type === 'info' || type === 'success' || type === 'error') && (
                    <img src={icon} />
                )}
            </DialogContent>

            <DialogActions>
                {type === 'loading' && ('')}

                {type === 'info' && (
                    <Button variant='contained' onClick={closeModalHandler}>Aceptar</Button>
                )}

                {(type === 'success' || type === 'error') && (
                    <>
                        <Button
                            variant='contained'
                            color={buttonColor}
                            onClick={actionButtonHandler}
                        >
                            {buttonValue}
                        </Button>
                        <Button variant='outlined' onClick={closeModalHandler}>Cancelar</Button>
                    </>
                )}
            </DialogActions>

        </Dialog >
    )
}
