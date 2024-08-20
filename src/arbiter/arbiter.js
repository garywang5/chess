import { getBishopMoves, getCastlingMoves, getKingMoves, getKingPosition, getKnightMoves, getPawnCaptures, getPawnMoves, getPieces, getQueenMoves, getRookMoves } from "./getMoves"
import { performMove } from '../arbiter/move'
import { areSameColorTiles, findPieceCoords } from "../helper"
const arbiter = {
    //regular moves
    getRegularMoves: function({position, piece, rank, file}) {
        if(piece.endsWith('r'))
            return getRookMoves({position, piece, rank, file})
        if(piece.endsWith('n'))
            return getKnightMoves({position, piece, rank, file})
        if(piece.endsWith('b'))
            return getBishopMoves({position, piece, rank, file})
        if(piece.endsWith('q'))
            return getQueenMoves({position, piece, rank, file})
        if(piece.endsWith('k'))
            return getKingMoves({position, piece, rank, file})
        if(piece.endsWith('p'))
            return getPawnMoves({position, piece, rank, file})
    },

    getValidMoves: function({position, castleDirection, prevPosition, piece, rank, file}) {
        let moves = this.getRegularMoves({position, piece, rank, file})
        const notInCheckMoves = []
        
        //special moves

        //pawn captures moves (including en passant)
        if(piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getPawnCaptures({position, prevPosition, piece, rank, file})
            ]
        }

        //casting moves
        if(piece.endsWith('k')) {
            moves = [
                ...moves,
                ...getCastlingMoves({position, castleDirection, piece, rank, file})
            ]
        }

        moves.forEach(([x,y]) => {
            const positionAfterMove = performMove({position,piece,rank,file,x,y})
            
            //only moves possible are ones that ensure you are not in check
            if(!this.isPlayerInCheck({positionAfterMove, position, player : piece[0]})){
                notInCheckMoves.push([x,y])
            }
        })
        return notInCheckMoves
    },
    
    isPlayerInCheck : function ({positionAfterMove, position, player}) {
        const enemy = player.startsWith('w') ? 'b' : 'w'
        let kingPos = getKingPosition(positionAfterMove,player)
        const enemyPieces = getPieces(positionAfterMove,enemy)

        //after a move, get all possible enemy taking moves
        const enemyMoves = enemyPieces.reduce((acc,p) => acc = [
            ...acc,
            ...(p.piece.endsWith('p')
            ?   getPawnCaptures({
                    position: positionAfterMove, 
                    prevPosition:  position,
                    ...p
                })
            :   this.getRegularMoves({
                    position: positionAfterMove, 
                    ...p
                })
            )
        ], [])
    
        //if any enemy moves can take our king then we can't make this move
        if(enemyMoves.some(([x,y]) => kingPos[0] === x && kingPos[1] === y))
            return true

        else
            return false
    },

    isStalemate : function(position,player,castleDirection) {
        //can't be stalemate if checked
        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})

        if(isInCheck)
            return false
            
        const pieces = getPieces(position,player)
        const moves = pieces.reduce((acc,p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection, 
                    ...p
                })
            )
        ], [])

        //stalemate if not in check and no possible moves
        return (!isInCheck && moves.length === 0)
    },

    insufficientMaterial : function(position) {
        //get pieces on the board
        const pieces = 
            position.reduce((acc,rank) => 
                acc = [
                    ...acc,
                    ...rank.filter(spot => spot)
                ],[])

        //king vs king
        if (pieces.length === 2)
            return true

        //king and bishop vs king
        //king and knight vs king
        if (pieces.length === 3 && pieces.some(p => p.endsWith('b') || p.endsWith('n')))
            return true

        //king and bishop vs king and bishop (bishops are same color)
        if (pieces.length === 4 && 
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            //set removes same items to ensure that it isn't 1 player with 2 bishops
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position,'wb')[0],
                findPieceCoords(position,'bb')[0]
            )
        )
            return true

        return false
    },

    isCheckMate : function(position,player,castleDirection) {
        //similar to stalemate except it includes being in check

        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})

        if(!isInCheck)
            return false
        
        const pieces = getPieces(position,player)
        const moves = pieces.reduce((acc,p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection, 
                    ...p
                })
            )
        ], [])

        //in check and no moves possible to get out of check
        return (isInCheck && moves.length === 0)
    }
}

export default arbiter