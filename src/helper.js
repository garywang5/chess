export const getCharacter = file => String.fromCharCode(file + 96);

export const createPosition = () => {
    const position = new Array(8).fill('').map(x => new Array(8).fill(''))

//     for(let i = 0; i < 8; i++)  {
//         position[1][i] = 'wp'
//         position[6][i] = 'bp'
//     }
     position[0][0] = 'wr'
//     position[0][1] = 'wb'
//     position[0][2] = 'wn'
//     position[0][3] = 'wq'
     position[0][4] = 'wk'
//     position[0][5] = 'wn'
//     position[0][6] = 'wb'
     position[0][7] = 'wr'

//     position[7][0] = 'br'
//     position[7][1] = 'bb'
//     position[7][2] = 'bn'
//     position[7][3] = 'bq'
    position[7][4] = 'bk'
//     position[7][5] = 'bn'
//     position[7][6] = 'bb'
//     position[7][7] = 'br'

    return position
}

export const copyPosition = (position) => {
    const newPosition = new Array(8).fill("").map((x) => new Array(8).fill(""));

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            newPosition[rank][file] = position[rank][file]
        }
    }

  return newPosition
}

export const areSameColorTiles = (coords1, coords2) =>
    (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2
  
export const findPieceCoords = (position, type) => {
    let results = []
    position.forEach((rank, i) => {
      rank.forEach((pos, j) => {
        if (pos === type) results.push({ x: i, y: j })
      })
    })
    return results
}

export const getNewMoveNotation = ({piece, rank, file, x, y, position, promotesTo, status}) => {
    let note = ""
  
    rank = Number(rank)
    file = Number(file)

    //castling
    if(piece[1] === "k" && Math.abs(file - y) === 2) {
      if(file < y) return "O-O"
      else return "O-O-O"
    }
  
    //if piece not a pawn, add the piece initial
    if(piece[1] !== "p") {
        note += piece[1].toUpperCase()
        //if destination has something, add x to represent a capture
        if(position[x][y]) {
            note += "x"
        }
    //capture for pawn
    } else if(rank !== x && file !== y) {
        note += getCharacter(file + 1) + "x"
    }
  
    //destination tile
    note += getCharacter(y + 1) + (x + 1)
  
    //promotion
    if(promotesTo)
        note += "=" + promotesTo.toUpperCase()
  
    //check or checkmate
    if(status === 'check')
        note += '+'
    if(status === 'checkmate')
        note += '#'
    return note
  }