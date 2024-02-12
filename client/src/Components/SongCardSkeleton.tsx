import { Box, Skeleton } from "@mui/material"

const SongCardSkeleton = () => {
    return (
        <Box sx={{ width: 250, mt: -2 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', mb: -1 }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
            <Skeleton
                height={200}
                sx={{ }}
                variant="rectangular"
            />
        </Box>
    )
}

export default SongCardSkeleton