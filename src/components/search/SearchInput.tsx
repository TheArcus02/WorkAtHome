import { useEffect, useState } from 'react'
import { useConnector } from 'react-instantsearch-hooks-web'
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import { connectSearchBox } from 'instantsearch.js/es/connectors'

interface SearchInputProps {
    initialQuery: string
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
    const [query, setQuery] = useState(initialQuery)
    const [isFocused, setIsFocused] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value)
    }

    const handleSearch = () => {
        refine(query)
    }

    useEffect(() => {
        if (query) {
            refine(query)
        }
    }, [])

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
