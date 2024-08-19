import { copyPosition } from "../helper"

export const performMove = ({position, piece, rank, file, x, y}) => {
    const newPosition = copyPosition(position)
    //en passant: if piece is a pawn destination is empty
    if(piece.endsWith('p') && newPosition[x][y] === '')
        //remove enemy pawn
        newPosition[rank][y] = ''

    //castling
    if(piece.endsWith('k') && Math.abs(y - file) > 1) {
        if (y === 2) { //castle left
            newPosition[rank][0] = ''
            newPosition[rank][3] = piece.startsWith('w') ? 'wr' : 'br'
        }
        if (y === 6) { //castle right
            newPosition[rank][7] = ''
            newPosition[rank][5] = piece.startsWith('w') ? 'wr' : 'br'
        }
    }

    //make old position empty and set new position with the piece
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}