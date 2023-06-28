import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSortBy, UseSortByProps } from 'react-instantsearch-hooks-web'

const Sorting = (props: UseSortByProps) => {
    const { currentRefinement, options, refine, initialIndex } = useSortBy(props)

    const handleChange = (e: SelectChangeEvent<string>) => {
        e.preventDefault()
        refine(e.target.value)
    }

    return (
        <Select value={currentRefinement} onChange={(e) => handleChange(e)} variant="standard">
            {options.map((option, index) => (
                <MenuItem value={option.value} key={option.value + index}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    )
}

export default Sorting
