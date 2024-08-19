import { useAppContext }from '../../../Context'
import './MovesList.css'

const MovesList = () => {
    const {appState: {movesList}} = useAppContext()

    //return a mapping of every element of moveslist
    return <div className='moves-list'>
        {movesList.map((move,i) => 
        //data-number used for css
            <div key={i} data-number={Math.floor(i/2)+1}>{move}</div>
        )}
    </div>
}

export default MovesList