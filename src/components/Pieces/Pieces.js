import './Pieces.css'
import Piece from './Piece'
import { useRef } from 'react'
import { clearCandidates, makeNewMove } from '../../reducer/action/move'
import { useAppContext } from '../../Context'
import { openPromotion } from '../../reducer/action/popup'
import { getCastlingDirections } from '../../arbiter/getMoves'
import { updateCastling, detectStalemate, detectInsufficientMaterial, detectCheckmate } from '../../reducer/action/game'
import { performMove } from '../../arbiter/move'
import { getNewMoveNotation } from '../../helper'
import arbiter from '../../arbiter/arbiter'

//create a separate board (2d array) on top of current board which will have the pieces
const Pieces = () => {
    const ref = useRef()

    const {appState, dispatch} = useAppContext()

    const currentPosition = appState.position[appState.position.length - 1]

    const calculateCoordinates = e => {
        //determine position of cursor (end position) when dropping
        const {left, top, width} = ref.current.getBoundingClientRect()
        const size = width / 8
        const y = Math.floor((e.clientX - left) / size)
        const x = 7 - Math.floor((e.clientY - top) / size)
        return {x, y}
    }

    const openPromotionBox = ({rank, file, x, y}) =>
        dispatch(openPromotion({
            rank: Number(rank),
            file: Number(file),
            x,
            y
        }))

    const updateCastlingState = ({p, rank, file}) => {
        const direction = getCastlingDirections({
            castleDirection: appState.castleDirection,
            p, rank, file
        })
        if(direction) {
            dispatch(updateCastling(direction))
        }
    }

    const onDrop = e => {
        //the starting point (original position of piece)
        const [p, rank, file] = e.dataTransfer.getData('text').split(',')
        //the ending point (position of drop)
        const {x, y} = calculateCoordinates(e)

        //check if move is valid
        if(appState.candidateMoves?.find(m => (m[0] === x && m[1] === y))) {
            //promotion
            if((p === 'wp' && x === 7) || (p === 'bp' && x === 0)) {
                openPromotionBox({rank, file, x, y})
                return
            }

            //update castling directions if king or rook moves
            if (p.endsWith('r') || p.endsWith('k')) {
                updateCastlingState({p,file,rank})
            }

            const newPosition = performMove({
                position: currentPosition,
                piece: p,
                rank, file, x, y
            })
            const newMove = getNewMoveNotation({
                piece: p, rank, file, x, y, position: currentPosition
            })
            
            dispatch(makeNewMove({newPosition, newMove}))

            const opponent = p.startsWith('w') ? 'b' : 'w'
            const castleDirection = appState.castleDirection[`${p.startsWith('b') ? 'white' : 'black'}`]
            
            //check for insufficient material
            if(arbiter.insufficientMaterial(newPosition))
                dispatch(detectInsufficientMaterial())
            //check for stalemate
            if(arbiter.isStalemate(newPosition, opponent, castleDirection))
                dispatch(detectStalemate())
            //check for checkmate
            if(arbiter.isCheckMate(newPosition, opponent, castleDirection))
                dispatch(detectCheckmate(p[0]))
        }

        //need to remove highlighted valid moves
        dispatch(clearCandidates())
    }

    //prevents default dragging action so it doens't interfere with on drop
    const onDragOver = e => e.preventDefault();

    //return a mapping for each grid:
    //if position[rank][file] not empty, render the piece else null
    return <div className='pieces'
    ref = {ref}
    onDrop = {onDrop}
    onDragOver = {onDragOver}
    >
        {currentPosition.map((r, rank) =>
            r.map((f, file) =>
                currentPosition[rank][file]
                ? <Piece 
                    key = {rank+'-'+file}
                    rank={rank} file={file}
                    piece={currentPosition[rank][file]}
                />
                : null
        ))}
    </div>
}

export default Pieces