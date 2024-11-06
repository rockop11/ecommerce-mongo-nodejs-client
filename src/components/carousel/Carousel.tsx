import { useState } from 'react'
import { Box, IconButton } from "@mui/material"
import { ArrowRight, ArrowLeft } from '@mui/icons-material'

interface CarouselProps {
    imageList: string[]
}

export const Carousel = ({ imageList }: CarouselProps) => {
    const [imageIndex, setImageIndex] = useState<number>(0)

    const nextImage = () => {
        setImageIndex(imageIndex + 1)

        if (imageIndex === imageList.length - 1) {
            setImageIndex(0)
        }
    }

    const prevImage = () => {
        setImageIndex(imageIndex - 1)

        if (imageIndex === 0) {
            setImageIndex(imageList.length - 1)
        }
    }

    return (
        <Box sx={{ position: 'relative', height: '400px', width: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <IconButton sx={{ position: 'absolute', top: '170px', left: '10px', zIndex: '10' }} onClick={prevImage}>
                <ArrowLeft fontSize='large' />
            </IconButton>

            <Box sx={{ position: 'absolute', height: '400px', left: '20%' }}>
                <img src={imageList[imageIndex]} style={{ width: '300px', height: '380px'}} />
            </Box>

            <IconButton sx={{ position: 'absolute', top: '170px', right: '10px', zIndex: '10', backgroundColor: 'white' }} onClick={nextImage}>
                <ArrowRight fontSize='large' />
            </IconButton>
        </Box>
    )
}
