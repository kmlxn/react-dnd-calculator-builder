import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
    blocks: [
        {
            name: "ResultBlock",
        },
        {
            name: "OperationsBlock",
        },
        {
            name: "DigitsBlock",
        },
        {
            name: "CalculateBlock",
        }
    ],
    placedBlocks: [],
};


export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        place: (state, { payload }) => {
            if (payload.dragOrigin === "BlocksSection") {
                if (state.placedBlocks.find(blockName =>
                    blockName === payload.blockName)
                ) {
                    return;
                }

                state.placedBlocks.splice(payload.position, 0,
                    payload.blockName);
            }
            if (payload.dragOrigin === "BuildZoneSection") {
                const index = state.placedBlocks.findIndex(blockName =>
                    blockName === payload.blockName);

                state.placedBlocks.splice(index, 1);
                state.placedBlocks.splice(payload.position, 0,
                    payload.blockName);
            }
        },
        remove: (state, { payload }) => {
            state.placedBlocks = state.placedBlocks.filter(blockName =>
                blockName !== payload.blockName)
        },
    },
});

export const { place, remove } = calculatorSlice.actions;

export const getPlacedBlocks = (state) => state.calculator.placedBlocks;


export const store = configureStore({
    reducer: {
        calculator: calculatorSlice.reducer,
    },
});
