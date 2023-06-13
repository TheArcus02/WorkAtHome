import { CodeOutlined, HelpOutline, TimelineOutlined } from '@mui/icons-material'
import { Box, Chip } from '@mui/material'

import { useCurrentRefinements, UseCurrentRefinementsProps } from 'react-instantsearch-hooks-web'

const getIcon = (attribute: string) => {
    switch (attribute) {
        case 'technologies':
            return <CodeOutlined />
        case 'seniority':
            return <TimelineOutlined />
        default:
            return <HelpOutline />
    }
}

const AppliedRefinements = (props: UseCurrentRefinementsProps) => {
    const { items, refine } = useCurrentRefinements(props)

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {items.map((item) =>
                item.refinements.map((refinement) => {
                    console.log(refinement)
                    return (
                        <Chip
                            icon={getIcon(refinement.attribute)}
                            label={refinement.label}
                            onDelete={() => refine(refinement)}
                        />
                    )
                })
            )}
        </Box>
    )
}

export default AppliedRefinements
