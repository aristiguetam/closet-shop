import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"

interface Props {
    currentValue: number;
    maxValue: number;
    updatedQuantity: (value: number) => void;

}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {

    const addOrRemove = (value: number) => {
        if (value === -1) {
            if (currentValue === 1) return;
            return updatedQuantity(currentValue - 1)
        }

        if (currentValue >= maxValue) return;
        updatedQuantity(currentValue + 1);
    }

    return (
        <Box display='flex' alignItems='center'>
            <IconButton
                disabled={currentValue === 1}
                // onClick={() => updatedQuantity(currentValue - 1)}
                onClick={() => addOrRemove(-1)}
            >
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
            <IconButton
                disabled={currentValue === maxValue || maxValue === 0}
                // onClick={() => updatedQuantity(currentValue + 1)}
                onClick={() => addOrRemove(+1)}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>

    )
}
