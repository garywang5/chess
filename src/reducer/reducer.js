//reducer is a function that changes the state based on a given action

import { Status } from "../constant"
import actionTypes from "./actionType"

//allows you to make all types of state changes in a single function
export const reducer = (state, action) => {
    switch(action.type) {
        case actionTypes.NEW_MOVE: {
            let {turn, position, movesList} = state
            //change the turn for each move
            turn = (turn === 'w') ? 'b' : 'w'
            //position is an array of chessboard states (to allow for undos)
            //original array plus newPosition
            position = [
                ...position,
                action.payload.newPosition
            ]
            //moves list
            movesList = [
                ...movesList,
                action.payload.newMove
            ]
            //return the state as is except with changes to turn and position
            return {
                ...state,
                turn,
                position,
                movesList
            }
        }

        case actionTypes.GENERATE_CANDIDATE_MOVES: {
            return {
                ...state,
                candidateMoves: action.payload.candidateMoves
            }
        }

        case actionTypes.CLEAR_CANDIDATE_MOVES: {
            return {
                ...state,
                candidateMoves: []
            }
        }

        case actionTypes.TAKE_BACK: {
            let {position, movesList, turn} = state

            if(position.length > 1) {
                position = position.slice(0, position.length - 1)
                movesList = movesList.slice(0, movesList.length - 1)
                turn = (turn === 'w') ? 'b' : 'w'
            }

            return {
                ...state,
                position,
                movesList,
                turn
            }
        }

        case actionTypes.PROMOTION_OPEN: {
            return {
                ...state,
                status : Status.promoting,
                promotionSquare: {...action.payload}
            }
        }

        case actionTypes.PROMOTION_CLOSE: {
            return {
                ...state,
                status: Status.ongoing,
                promotionSquare: null
            }
        }

        case actionTypes.CAN_CASTLE: {
            let {turn, castleDirection} = state
            castleDirection[turn] = action.payload
            return {
                ...state,
                castleDirection
            }
        }

        case actionTypes.STALEMATE: {
            return {
                ...state,
                status: Status.stalemate
            }
        }

        case actionTypes.INSUFFICIENT_MATERIAL: {
            return {
                ...state,
                status: Status.insufficient
            }
        }

        case actionTypes.WIN: {
            return {
                ...state,
                status: (action.payload === 'w') ? Status.white : Status.black
            }
        }
        
        case actionTypes.NEW_GAME: {
            return {
                ...action.payload
            }
        }

        default:
            return state
    }
}