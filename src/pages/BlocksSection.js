import { useRef } from 'react'
import { useDrag } from 'react-dnd'
import {
  getPlacedBlocks,
  remove,
  getResult,
  performMath,
  calculate,
  inputDigit,
  getMode
} from '../store'
import { useSelector, useDispatch } from 'react-redux'

function Block ({ name, section, canDrag = true, children }) {
  const dispatch = useDispatch()
  const canDragRef = useRef()
  canDragRef.current = canDrag

  const mode = useSelector(getMode)
  const modeRef = useRef()
  modeRef.current = mode

  const [, drag] = useDrag(() => ({
    type: 'block',
    item: { blockName: name, dragOrigin: section },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: (monitor) => {
      return canDragRef.current
    }
  }))

  return (
    <div
      onDoubleClick={() => {
        if (section === 'BuildZoneSection' && modeRef.current === 'build') {
          dispatch(remove({ blockName: name }))
        }
      }}
      ref={drag}
      className={'calc_block' + (canDrag ? '' : ' disabled')}
    >
      {children}
    </div>
  )
}

export function ResultBlock (props) {
  const result = useSelector(getResult)

  return (
    <Block name='ResultBlock' {...props}>
      <div className='calc_result'>
        {result === Infinity ? 'Не определено' : result}
      </div>
    </Block>
  )
}

function Button ({ onClick, children, className = 'calc_button', ...props }) {
  const mode = useSelector(getMode)
  const modeRef = useRef()
  modeRef.current = mode

  const onClick_ = () => {
    if (modeRef.current !== 'build') {
      onClick()
    }
  }

  return (
    <button
      onClick={onClick_}
      className={className}
      {...props}
    >{children}
    </button>
  )
}

export function OperationsBlock (props) {
  const dispatch = useDispatch()
  const onClick = (mathOperation) => () =>
    dispatch(performMath({ mathOperation }))

  return (
    <Block name='OperationsBlock' {...props}>
      <div className='row'>
        <div className='col-3 button_wrapper'>
          <Button onClick={onClick('/')}>/</Button>
        </div>
        <div className='col-3 button_wrapper'>
          <Button onClick={onClick('*')}>x</Button>
        </div>
        <div className='col-3 button_wrapper'>
          <Button onClick={onClick('-')}>-</Button>
        </div>
        <div className='col-3 button_wrapper'>
          <Button onClick={onClick('+')}>+</Button>
        </div>
      </div>
    </Block>
  )
}

export function DigitsBlock (props) {
  const dispatch = useDispatch()
  const onClick = (digit) => () => dispatch(inputDigit({ digit }))

  return (
    <Block name='DigitsBlock' {...props}>
      <div className='row'>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('7')}>7</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('8')}>8</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('9')}>9</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('4')}>4</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('5')}>5</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('6')}>6</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('1')}>1</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('2')}>2</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('3')}>3</Button>
        </div>
        <div className='col-8 button_wrapper'>
          <Button onClick={onClick('0')}>0</Button>
        </div>
        <div className='col-4 button_wrapper'>
          <Button onClick={onClick('.')}>,</Button>
        </div>
      </div>
    </Block>
  )
}

export function CalculateBlock (props) {
  const dispatch = useDispatch()

  return (
    <Block name='CalculateBlock' {...props}>
      <div className='calculate_block'>
        <Button
          onClick={() => dispatch(calculate())}
          className='calculate_button'
        >=
        </Button>
      </div>
    </Block>
  )
}

export default function BlocksSection () {
  const placedBlocks = useSelector(getPlacedBlocks)

  return (
    <>
      <ResultBlock
        section='BlocksSection'
        canDrag={!placedBlocks.includes('ResultBlock')}
      />
      <OperationsBlock
        section='BlocksSection'
        canDrag={!placedBlocks.includes('OperationsBlock')}
      />
      <DigitsBlock
        section='BlocksSection'
        canDrag={!placedBlocks.includes('DigitsBlock')}
      />
      <CalculateBlock
        section='BlocksSection'
        canDrag={!placedBlocks.includes('CalculateBlock')}
      />
    </>
  )
}
