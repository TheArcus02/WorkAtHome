import { useConnector } from 'react-instantsearch-hooks-web'
import connectRange from 'instantsearch.js/es/connectors/range/connectRange'

import type { RangeConnectorParams, RangeWidgetDescription } from 'instantsearch.js/es/connectors/range/connectRange'
import { Box, Slider } from '@mui/material'
import { useState } from 'react'

export type UseRangeSliderProps = RangeConnectorParams

export const useRangeSlider = (props?: UseRangeSliderProps) => {
    return useConnector<RangeConnectorParams, RangeWidgetDescription>(connectRange, props)
}

export const RangeSlider = (props: UseRangeSliderProps) => {
    const { start, range, canRefine, refine, sendEvent } = useRangeSlider(props)
    console.log(start)
    // const [value, setValue] = useState<number[]>([start, range])

    return (
        <Box>
            <Slider />
        </Box>
    )
}
