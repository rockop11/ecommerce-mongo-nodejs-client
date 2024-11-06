import { Box, Typography, useTheme } from "@mui/material"

interface DetailCardProps {
    color?: string
    title: string
    subtitle: string | number
    date?: Date
    image?: string
}

export const DetailCard = ({ color, title, subtitle, date, image }: DetailCardProps) => {

    const theme = useTheme()

    return (
        <Box
            sx={{
                position: 'relative',
                height: '110px',
                width: '400px',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',  // Sombra inicial
                "&:hover": {
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.03)',
                },
                bgcolor: 'background.paper'
            }}
        >
            <Box sx={{
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
                padding: 2,
            }}>
                {/* Barra de color a la izquierda */}
                <Box sx={{
                    backgroundColor: color,
                    width: '6px',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                }} />

                {/* Contenido de texto */}
                <Box sx={{ flex: 1, marginLeft: 2, paddingRight: '90px' }}>
                    <Typography variant="h6" fontWeight="bold" color={color}>
                        {title}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                    {date && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Creado: {new Date(date).toLocaleDateString()}
                        </Typography>
                    )}
                </Box>

                {!image ? ('')
                    : (<Box
                        component="img"
                        src={image}
                        alt={title}
                        sx={{
                            height: 90,
                            width: 90,
                            borderRadius: 1,
                            objectFit: 'cover',
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />)}

            </Box>
        </Box>
    )
}
