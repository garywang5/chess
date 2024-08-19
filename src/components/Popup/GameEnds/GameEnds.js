import { Status } from '../../../constant';
import { useAppContext } from '../../../Context';
import { setupNewGame } from '../../../reducer/action/game'
import './GameEnds.css'

const GameEnds = ({onClosePopup}) => {

    const { appState : {status} , dispatch } = useAppContext();
    
    //game is ongoing
    if (status === Status.ongoing || status === Status.promoting)
        return null

    const newGame = () => {
        dispatch(setupNewGame())
    }

    const isWin = status.endsWith('wins')
    
    //if isWin then show that win else it is a draw
    //if not a win then display status (reason for draw)
    //className for css
    //button to create new game
    return <div className="popup--inner popup--inner__center">
        <h1>{isWin ? status : 'Draw'}</h1>
        <p>{!isWin && status}</p>
        <div className={`${status}`}/>
        <button onClick={newGame}>New Game</button>
    </div>
   
}

export default GameEnds