import { SearchOutlined } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, Input, InputAdornment, Typography } from '@mui/material'
import { UseRefinementListProps, useRefinementList } from 'react-instantsearch-hooks-web'

const RefinementList = (props: UseRefinementListProps) => {
    const { items, refine, searchForItems, toggleShowMore, isShowingMore, canToggleShowMore } = useRefinementList(props)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        searchForItems(value)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Input
                placeholder="Search..."
                size="small"
                onChange={handleSearch}
                sx={{ marginBottom: 1 }}
                endAdornment={
                    <InputAdornment position="end">
                        <SearchOutlined />
                    </InputAdornment>
                }
            />
            {items.map((item) => (
                <FormControlLabel
                    key={item.label}
                    control={<Checkbox checked={item.isRefined} onChange={() => refine(item.value)} />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>{item.label}</Typography>
                            <Typography
                                style={{
                                    marginLeft: '4px',
                                    fontSize: '0.8rem',
                                    color: 'gray',
                                }}
                            >
                                ({item.count})
                            </Typography>
                        </Box>
                    }
                />
            ))}
            {canToggleShowMore && (
                <Button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleShowMore()
                    }}
                >
                    {isShowingMore ? 'Show less' : 'Show more'}
                </Button>
            )}
        </Box>
    )
}

export default RefinementList
