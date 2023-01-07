import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from "react-dnd";
import { useState } from "react";
import image from './Rectangle4.svg';
import * as blockComponents from './BlocksSection'
import { getPlacedBlocks, place, remove, getState } from '../store'

export default function BuildZone() {
    const [highlightedElemIndex, setHighlightedElemIndex] = useState();
    let highlightedElemIndexRef = useRef();
    highlightedElemIndexRef.current = highlightedElemIndex;

    const dispatch = useDispatch();
    const highlightsRef = useRef([])

    const placedBlocks = useSelector(getPlacedBlocks)
    let placedBlocksRef = useRef();
    placedBlocksRef.current = placedBlocks;

    const handleDrop = ({ blockName, dragOrigin }) => {
        dispatch(place({
            blockName,
            dragOrigin,
            position: highlightedElemIndexRef.current
        }))
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "block",
        drop: (item) => {
            handleDrop(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover(item, monitor) {
            const mousePos = monitor.getClientOffset();
            highlightsRef.current = highlightsRef.current.filter(e => e !== null)

            if (item.blockName === "ResultBlock") {
                setHighlightedElemIndex(0)
                return
            }

            let closestHighlightIndex = highlightsRef.current.reduce((
                closestHighlightIndex, highlight, highlightIndex
            ) => {
                const distanceToMouse1 = Math.abs(highlight.getBoundingClientRect().top - mousePos.y)
                const closestHighlight = highlightsRef.current[closestHighlightIndex]
                const distanceToMouse2 = Math.abs(closestHighlight.getBoundingClientRect().top - mousePos.y)

                return distanceToMouse1 < distanceToMouse2 ? highlightIndex : closestHighlightIndex
            }, 0)

            if (placedBlocksRef.current.includes("ResultBlock") &&
                closestHighlightIndex === 0) {
                closestHighlightIndex = 1;
            }

            setHighlightedElemIndex(closestHighlightIndex)
        }
    }));

    return <div className="build_zone_wrapper">
        <div className={'build_zone' + (isOver ? ' build_zone_highlight' : '')}
            ref={drop}>
            {!placedBlocks.length ? <Empty /> :
                <>
                    <Highlight
                        shouldBeShown={isOver && highlightedElemIndex === 0}
                        key={'highlight-0'}
                        refCallback={el => highlightsRef.current[0] = el}
                    />

                    {placedBlocks.map((blockName, i) => {
                        const Block = blockComponents[blockName];
                        return <>
                            <Block
                                key={blockName}
                                section="BuildZoneSection"
                            />
                            <Highlight
                                shouldBeShown={isOver && highlightedElemIndex === i + 1}
                                key={'highlight-' + (i + 1)}
                                refCallback={el => highlightsRef.current[i + 1] = el}
                            />
                        </>
                    })}
                </>
            }
        </div>
    </div>

}

function Highlight({ refCallback, shouldBeShown }) {
    return <div
        className={"highlight" + (shouldBeShown ? " active" : "")}
        ref={refCallback}></div>
}

function Empty() {
    return <>
        <img src={image} alt="image" />
        <span className="build_zone_message_heading">Перетащите сюда</span>
        <span className="build_zone_message_text">любой элемент из левой панели</span>
    </>
}