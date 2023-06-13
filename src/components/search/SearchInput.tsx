import { useState } from 'react'
import { useConnector } from 'react-instantsearch-hooks-web'
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import { connectSearchBox } from 'instantsearch.js/es/connectors'

const SearchInput = () => {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value)
    }

    const handleSearch = () => {
        refine(query)
    }

    // @ts-ignore
    const { refine } = useConnector(connectSearchBox, {}, { $$widgetType: 'my-custom.searchBox' })

    return (
        <OutlinedInput
            id="job-search"
            type="text"
            endAdornment={
                <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleSearch}>
                        <SearchOutlined color="primary" />
                    </IconButton>
                </InputAdornment>
            }
            fullWidth
            placeholder="Look for a remote job"
            sx={{
                width: '75%',
            }}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
                if (isFocused && event.key === 'Enter') {
                    event.preventDefault()
                    handleSearch()
                }
            }}
        />
    )
}

export default SearchInput
