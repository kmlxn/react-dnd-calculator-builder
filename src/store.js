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
    mode: "build",
    prevNumber: "0",
    newNumber: "0",
    mathOperation: undefined,
    result: "0",
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
        switchMode: (state, { payload }) => {
            state.mode = payload.mode;
        },
        inputDigit(state, { payload }) {
            let newNumber = parseFloat(state.newNumber + payload.digit);
            console.log('newNumber', newNumber);

            state.result = newNumber;

            if (payload.digit === "." && !state.newNumber.includes(".")) {
                state.newNumber = "" + newNumber + ".";
            } else {
                state.newNumber = "" + newNumber;
            }
        },
        performMath(state, { payload }) {
            calculatorSlice.caseReducers.calculate(state, { payload });

            state.prevNumber = state.result;
            state.newNumber = "0";
            state.mathOperation = payload.mathOperation;
        },
        calculate(state, { payload }) {
            if (!state.mathOperation) {
                return
            }

            switch (state.mathOperation) {
                case "+":
                    state.result = parseFloat(state.prevNumber) + parseFloat(state.newNumber)
                    break;
                case "-":
                    state.result = parseFloat(state.prevNumber) - parseFloat(state.newNumber)
                    break;
                case "*":
                    state.result = parseFloat(state.prevNumber) * parseFloat(state.newNumber)
                    break;
                case "/":
                    state.result = parseFloat(state.prevNumber) / parseFloat(state.newNumber)
                    break;
                default:
                    break;
            }

            state.prevNumber = state.result;
            state.newNumber = "0";

            state.mathOperation = undefined;
        }
    },
});

export const { place, remove, switchMode, performMath, inputDigit, calculate } = calculatorSlice.actions;

export const getPlacedBlocks = (state) => state.calculator.placedBlocks;
export const getMode = (state) => state.calculator.mode;

export const getResult = (state) => {
    if (state.calculator.mode === "build") {
        return 0;
    }

    return state.calculator.result;
}


export const store = configureStore({
    reducer: {
        calculator: calculatorSlice.reducer,
    },
});
