import './Board.css';
import Files from './bits/Files';
import Ranks from './bits/Ranks';
import Pieces from '../Pieces/Pieces';
import { useAppContext } from '../../Context';
import arbiter from '../../arbiter/arbiter';
import { getKingPosition } from '../../arbiter/getMoves';
import Popup from '../Popup/Popup';
import PromotionBox from '../Popup/PromotionBox/PromotionBox';
import GameEnds from '../Popup/GameEnds/GameEnds'

const Board = () => {
    const ranks = Array(8).fill().map((x,i) => 8-i);
    const files = Array(8).fill().map((x,i) => i+1);

    const {appState} = useAppContext()
    const position = appState.position[appState.position.length - 1]

    //check if king is checked
    const isChecked = () => {
        const isInCheck = arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: appState.turn
        })

        if(isInCheck)
            return getKingPosition(position, appState.turn)
        return null
    }

    const getClassName = (i, j) => {
        //determine grid color
        let c = 'tile'
        c+= ((i+j) % 2 === 0) ? ' tile--dark' : ' tile--light'

        //if there is this tile in possible candidate moves
        if(appState.candidateMoves?.find(m => (m[0] === i && m[1] === j))) {
            //and its an enemy (only enemies are in possible moves)
            if(position[i][j])
                c += ' attacking'
            //or empty
            else
                c += ' highlight'
        }

        //king in check
        const check = isChecked()
        if(check && check[0] === i && check[1] === j)
            c += ' checked'
        return c
    }

    return <div className='board'>
        <Ranks ranks={ranks}/>

        <div className='tiles'>
            {ranks.map((rank, i) => 
                files.map((file, j) =>
                    <div key={file+'-'+rank} className={getClassName(7-i, j)}></div>
                )
            )}
        </div>

        <Pieces/>

        <Popup>
            <PromotionBox/>
            <GameEnds/>
        </Popup>

        <Files files={files}/>
    </div>
}

export default Board;