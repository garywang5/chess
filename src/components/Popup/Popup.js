import React from 'react'
import { Status } from '../../constant'
import { useAppContext } from '../../Context'
import { closePopup } from '../../reducer/action/popup'
import './Popup.css'

const Popup = ({children}) => {
    const {appState, dispatch} = useAppContext()

    if(appState.status === Status.ongoing)
        return null

    const onClosePopup = () => {
        dispatch(closePopup())
    }

    //for all children, make a clone of it with the prop 'onClosePopup'
    return <div className='popup'>
        {React.Children
            .toArray(children)
            .map (child => React.cloneElement(child, {onClosePopup}))}
    </div>
}

export default Popup