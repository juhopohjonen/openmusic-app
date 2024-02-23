import { Rating, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getAuth } from "../utils"
import axios from "axios"
import { API_BASE } from "../constants"
import { Rating as RatingType } from "../types"

const RateSong = ({ songId }: { songId: string | undefined }) => {
    const [value, setValue] = useState<number | null>(null)
    const [avg, setAvg] = useState<number | null>(null)

    const auth = getAuth()


    const MY_RATING_API = `${API_BASE}/api/music/${songId}/my-rating`
    const RATING_API = `${API_BASE}/api/music/${songId}/rating`

    console.log('val', value)

    if (!songId) {
        throw new Error('No song id specified')
    }


    const handleReqErr = (e: Error) => {
        console.error(e)
    }

    const changeRating = (grade: number) => {
        axios.put(MY_RATING_API, {
            grade
        }, {
            headers: {
                Authorization: `Bearer ${auth?.token}`
            }}
        )
            .then(res => handleSetCurrentValue(res.data))
            .catch(handleReqErr)
    }

    const setRating = (grade: number) => {
        if (!auth) {
            return
        }

        

        axios.post(RATING_API, {
            grade
        }, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => handleSetCurrentValue(res.data))
            .catch(handleReqErr)
    }
    
    const handleSetCurrentValue = (rating: RatingType) => {
        console.log('setting value', rating)

        switch (rating.code) {
            case 'OK':
                return setValue(rating.grade)
            case 'NOT_FOUND':
                return setValue(null)
        }   
    }

    useEffect(() => {
        axios.get(RATING_API)
            .then(res => {
                if (res.data.avg) {
                    setAvg(res.data.avg)
                } else {
                    setAvg(null)
                }
            })
            .catch(err => {
                console.error(err)
            })

            if (auth && !value) {
                axios.get<RatingType>(MY_RATING_API, {
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    }
                })
                    .then(res => {
                        return handleSetCurrentValue(res.data)
                    })
                    .catch(e => handleReqErr(e))
            }


    }, [value])


    return (
        <>
            {
                auth ? (
                    <Rating
                        name="song-rate"
                        value={value}
                        onChange={(_e, newValue) => {
                            if (value) {
                                newValue && changeRating(newValue)
                            } else {
                                newValue && setRating(newValue)
                            }
                            
                        }}
                        disabled={!auth}
                        readOnly={!auth}
                    />
                ) : <UnauthenticatedFeedback />
            }



            {
                avg && (
                    <Typography variant="body2" color="text.secondary">Avg: {avg} / 5.0</Typography>
                )
            }

        </>


    )
}

const UnauthenticatedFeedback = () => (
    <Tooltip 
        title="You need to be logged in to rate this song."
        enterTouchDelay={50}
    >

        <Rating 
            name="song-rate-unauthenticated"
            value={0}
        >
            
        </Rating>

    </Tooltip>
)

export default RateSong