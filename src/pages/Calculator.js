import { useSelector } from 'react-redux'
import BlocksSection from './BlocksSection'
import BuildZoneSection from './BuildZoneSection'
import Switch from './Switch'
import { getMode } from '../store'

export default function Calculator () {
  const mode = useSelector(getMode)

  return (
    <>
      <div className='row'>
        <div className='col-md-4' />
        <div className='col-md-4'>
          <Switch />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-4'>
          {mode === 'build' ? <BlocksSection /> : <></>}
        </div>
        <div className='col-md-4'>
          <BuildZoneSection />
        </div>
      </div>
    </>
  )
}
