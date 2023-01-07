import { useRef } from 'react';
import { useDrag } from "react-dnd";
import { getPlacedBlocks, place, remove, getState } from '../store'
import { useSelector, useDispatch } from 'react-redux';

function Block({ name, section, canDrag = true, children }) {
    const dispatch = useDispatch();
    let canDragRef = useRef();
    canDragRef.current = canDrag;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "block",
        item: { blockName: name, dragOrigin: section },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: (monitor) => {
            return canDragRef.current;
        },
    }));

    return <div
        onDoubleClick={() => {
            if (section === "BuildZoneSection") {
                dispatch(remove({ blockName: name }))
            }
        }}
        ref={drag}
        className={"calc_block" + (canDrag ? "" : " disabled")}
    >
        {children}
    </div>
}

export function ResultBlock(props) {
    return <Block name="ResultBlock" {...props}>
        <div className="calc_result">0</div>
    </Block>
}

export function OperationsBlock(props) {
    return <Block name="OperationsBlock" {...props}>
        <div className="row">
            <div className="col-3 button_wrapper">
                <button className="calc_button">/</button>
            </div>
            <div className="col-3 button_wrapper">
                <button className="calc_button">x</button>
            </div>
            <div className="col-3 button_wrapper">
                <button className="calc_button">-</button>
            </div>
            <div className="col-3 button_wrapper">
                <button className="calc_button">+</button>
            </div>
        </div>
    </Block>
}

export function DigitsBlock(props) {
    return <Block name="DigitsBlock" {...props}>
        <div className="row">
            <div className="col-4 button_wrapper">
                <button className="calc_button">7</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">8</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">9</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">4</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">5</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">6</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">1</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">2</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">3</button>
            </div>
            <div className="col-8 button_wrapper">
                <button className="calc_button">0</button>
            </div>
            <div className="col-4 button_wrapper">
                <button className="calc_button">,</button>
            </div>
        </div>
    </Block>
}

export function CalculateBlock(props) {
    return <Block name="CalculateBlock" {...props}>
        <div className="calculate_block">
            <button className="calculate_button">=</button>
        </div>
    </Block>
}

export default function BlocksSection() {
    const placedBlocks = useSelector(getPlacedBlocks)

    return <>
        <ResultBlock
            section="BlocksSection"
            canDrag={!placedBlocks.includes("ResultBlock")} />
        <OperationsBlock
            section="BlocksSection"
            canDrag={!placedBlocks.includes("OperationsBlock")} />
        <DigitsBlock
            section="BlocksSection"
            canDrag={!placedBlocks.includes("DigitsBlock")} />
        <CalculateBlock
            section="BlocksSection"
            canDrag={!placedBlocks.includes("CalculateBlock")} />
    </>
}