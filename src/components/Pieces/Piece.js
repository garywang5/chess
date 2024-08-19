import arbiter from '../../arbiter/arbiter'
import { useAppContext } from '../../Context'
import { generateCandidateMoves } from '../../reducer/action/move'
const Piece = ({rank, file, piece}) => {

    const {appState, dispatch} = useAppContext()
    const {turn, position, castleDirection} = appState

    const onDragStart = e => {
        //removes green + sign when dragging
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`)
        //makes original piece not display when dragging/moving
        setTimeout(() => {
            e.target.style.display = 'none'
        }, 0)

        //if turn is same as first char of piece (piece is '' or 'w_' or 'b_')
        if(turn === piece[0]) {
            const candidateMoves = arbiter.getValidMoves({
                position: position[position.length - 1],
                prevPosition: position[position.length - 2],
                castleDirection: castleDirection[turn],
                piece,
                rank,
                file})
            dispatch(generateCandidateMoves({candidateMoves}))
        }
    }

    //prevent dragging outside chessboard from keeping display 'none'
    const onDragEnd = e => e.target.style.display = 'block'

    return (
        <div 
            className={`piece ${piece} p-${file}${rank}`}
            draggable={true}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}

        />
    )
}

export default Piece