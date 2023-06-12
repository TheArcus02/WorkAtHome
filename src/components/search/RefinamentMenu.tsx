import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { UseMenuProps, useMenu } from 'react-instantsearch-hooks-web'

const RefinementMenu = (props: UseMenuProps) => {
    const { items, canToggleShowMore, isShowingMore, toggleShowMore, refine } = useMenu(props)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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

export default RefinementMenu
