import { createPosition } from "./helper";

export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material',
}

//initial game state
export const initGameState = {
    //initial position is a array of 1 element which is the initial board
    position: [createPosition()],
    turn: 'w',
    movesList: [],
    candidateMoves: [],
    status : Status.ongoing,
    promotionSquare : null,
    castleDirection: {
        w: 'both',
        b: 'both',
        prev_w: 'both',
        prev_b: 'both'
    }
}