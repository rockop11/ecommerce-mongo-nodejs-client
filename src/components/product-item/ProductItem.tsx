import { useModal } from '../../hooks/useModal';
import { Link } from 'react-router-dom';
import { Modal } from '../modal/Modal';
import { Box, Typography, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import WarningIcon from "../../assets/WarnignIcon.png"

interface ProductItemProps {
    id: string
    productTitle: string
    imageUrl: string
    deleteProductHandler: () => Promise<void>
    getProductsListHandler: () => Promise<void>
}

export const ProductItem = ({ id, productTitle, imageUrl, deleteProductHandler, getProductsListHandler }: ProductItemProps) => {

    const theme = useTheme()
    const {
        toggleModal,
        modalType,
        title,
        icon,
        buttonValue,
        buttonColor,
        openModal,
        closeModal
    } = useModal()

    const deleteProduct = async () => {
        try {
            openModal('loading', 'Eliminando producto...')
            await deleteProductHandler()
            await getProductsListHandler()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            openModal('info', 'No se pudo eliminar el producto', WarningIcon, 'Aceptar', 'primary')
        }
    }

    return (
        <>
            <Box sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                height: '60px',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <img src={imageUrl} style={{ width: '50px', height: '50px' }} />

                    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant='body1' sx={{
                            "&:hover": {
                                fontWeight: 'bold',
                                color: '#1976d2'
                            }
                        }}>
                            {productTitle}
                        </Typography>
                    </Link>
                </Box>

                <Box display={'flex'} gap={2}>
                    <Link to={`/editProduct/${id}`}>
                        <Edit
                            color={'primary'}
                            sx={{ cursor: 'pointer' }}
                        />
                    </Link>

                    <Delete
                        color='error'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => openModal(
                            'error',
                            'Desea eliminar el producto?',
                            WarningIcon,
                            'eliminar',
                            'error'
                        )}
                    />
                </Box>
            </Box>

            {toggleModal && (
                <Modal
                    type={modalType}
                    open={toggleModal}
                    title={title}
                    icon={icon}
                    buttonValue={buttonValue}
                    buttonColor={buttonColor}
                    actionButtonHandler={() => deleteProduct()}
                    closeModalHandler={() => closeModal()}
                />
            )}
        </>
    )
}