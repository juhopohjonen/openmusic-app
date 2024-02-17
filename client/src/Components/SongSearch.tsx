import { Autocomplete, TextField } from "@mui/material";
import { AutocompleteOption, Song, SongSearchProps } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../constants";



const SongSearch = ({ width=300, song, setSong, label='test' }: SongSearchProps) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<AutocompleteOption[]>([])

    useEffect(() => {
        if (query) {
            axios.post<Song[]>(`${API_BASE}/api/search/music`, {
                query
            })
                .then(res => setResults(res.data.map(result => {
                    return {
                        label: `${result.title}`,
                        id: result.id
                    }
                })))
                .catch(err => {
                    console.error(err)
                })
        }
    }, [query])


    return (
        <>
            <Autocomplete
                disablePortal
                options={results}
                sx={{ width }}
                value={song}
                onChange={(_e, newValue) => setSong(newValue)}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.label}
                    </li>
                )}
                renderInput={(params) => {
                    return <TextField key={params.id} value={query} onChange={(e) => setQuery(e.target.value)} {...params} label={label} />
                }}
                onInputChange={(_e, value) => setQuery(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
        </>
    )
}

export default SongSearch