import { useState } from "react"
import { AutocompleteOption } from "../types"
import SongSearch from "../Components/SongSearch"
import { Box, Button, Typography } from "@mui/material"

const Search = () => {
    const [song, setSong] = useState<AutocompleteOption | null>(null)
    const [selectedOptions, setOptions] = useState<AutocompleteOption[]>([])

    const addCurrentToOptions = () => {
        if (!song) {
            return
        }

        setOptions([...selectedOptions, song])
        setSong(null)
    }

    console.log(selectedOptions)

    return (
        <> 
            {
                selectedOptions && selectedOptions.map(option => (
                    <Box key={option.id}>
                        <Typography paragraph>{option.label}</Typography>
                    </Box>
                ))
            }
            
            <SongSearch
                song={song}
                setSong={setSong}
                label="test"
            />

            <Button
                disabled={!song}
                onClick={addCurrentToOptions}
            >
                Add
            </Button>
        </>
    )
}

export default Search