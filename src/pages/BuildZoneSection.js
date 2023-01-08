import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDrop } from 'react-dnd'

import * as blockComponents from './BlocksSection'
import { getPlacedBlocks, place, getMode } from '../store'

export default function BuildZone () {
  const [highlightedElemIndex, setHighlightedElemIndex] = useState()
  const highlightedElemIndexRef = useRef()
  highlightedElemIndexRef.current = highlightedElemIndex

  const dispatch = useDispatch()
  const highlightsRef = useRef([])

  const placedBlocks = useSelector(getPlacedBlocks)
  const placedBlocksRef = useRef()
  placedBlocksRef.current = placedBlocks

  const mode = useSelector(getMode)

  const handleDrop = ({ blockName, dragOrigin }) => {
    dispatch(place({
      blockName,
      dragOrigin,
      position: highlightedElemIndexRef.current
    }))
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      handleDrop(item)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover (item, monitor) {
      const mousePos = monitor.getClientOffset()
      highlightsRef.current = highlightsRef.current.filter(e => e !== null)

      if (item.blockName === 'ResultBlock') {
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

      if (placedBlocksRef.current.includes('ResultBlock') &&
        closestHighlightIndex === 0) {
        closestHighlightIndex = 1
      }

      setHighlightedElemIndex(closestHighlightIndex)
    }
  }))

  const empty = mode === 'build' ? <Empty /> : <></>
  const buildZoneClass = mode === 'build'
    ? 'build_zone' + (isOver ? ' build_zone_highlight' : '')
    : 'build_zone build_zone_runtime'

  return (
    <div className='build_zone_wrapper'>
      <div
        className={buildZoneClass}
        ref={drop}
      >
        {!placedBlocks.length
          ? empty
          : <>
            <Highlight
              shouldBeShown={isOver && highlightedElemIndex === 0}
              key='highlight-0'
              refCallback={el => {
                highlightsRef.current[0] = el
              }}
            />

            {placedBlocks.map((blockName, i) => {
              const Block = blockComponents[blockName]
              return (
                <React.Fragment key={blockName}>
                  <Block
                    key={blockName}
                    section='BuildZoneSection'
                  />
                  <Highlight
                    shouldBeShown={isOver && highlightedElemIndex === i + 1}
                    key={'highlight-' + (i + 1)}
                    refCallback={el => {
                      highlightsRef.current[i + 1] = el
                    }}
                  />
                </React.Fragment>
              )
            })}
          </>}
      </div>
    </div>
  )
}

function Highlight ({ refCallback, shouldBeShown }) {
  return (
    <div
      className={'highlight' + (shouldBeShown ? ' active' : '')}
      ref={refCallback}
    />
  )
}

function Empty () {
  return (
    <div className='build_zone_message'>
      <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M18.7778 1V5.44444' stroke='black' strokeWidth='2' strokeLinecap='round' />
        <path d='M21 3.22222L16.5556 3.22222' stroke='black' strokeWidth='2' strokeLinecap='round' />
        <path d='M12.3889 3.22222H5C2.79086 3.22222 1 5.01309 1 7.22223V16.2778M18.7778 9.61111V17C18.7778 19.2091 16.9869 21 14.7778 21H5C2.79086 21 1 19.2091 1 17V16.2778M1 16.2778L4.83824 12.4395C6.40034 10.8774 8.93298 10.8774 10.4951 12.4395C11.8961 13.8406 13.5664 15.5108 14.8889 16.8333' stroke='black' strokeWidth='2' strokeLinecap='round' />
        <path d='M18.7778 14.6111L18.2729 14.1062C16.7108 12.5441 14.1781 12.5441 12.616 14.1062L12.3889 14.3333' stroke='black' strokeWidth='2' strokeLinecap='round' />
        <circle cx='12.1111' cy='7.66667' r='0.555556' fill='black' />
      </svg>
      <span className='build_zone_message_heading'>Перетащите сюда</span>
      <span className='build_zone_message_text'>любой элемент<br/>из левой панели</span>
    </div>
  )
}
