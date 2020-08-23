export class Tile {
    constructor(board, pos, piece = null) {
        this.board = board;
        this.pos = pos;
        this.piece = piece;
        if ((pos[0] + pos[1]) % 2 === 0) {
            this.color = "black-tile";
        } else {
            this.color = "white-tile";
        }
    }
}

export class Piece {
    constructor(pos, symbol, color = null) {
        this.pos = pos;
        this.symbol = symbol;
        this.color = color;
        this.moves = [];
    }
}

export class Board {
    constructor() {
        this.board = [];
        this.whiteCaptures = [];
        this.blackCaptures = [];
        this.currentPieces = {};
        this.kings = {};
        this.kings['white'] = null;
        this.kings['black'] = null
        this.kings['white']['direct'] = {}; this.kings['white']['indirect'] = {};
        this.kings['black']['direct'] = {}; this.kings['black']['indirect'] = {};
        this.kings['white']['saves'] = {}; this.kings['black']['saves'] = {};
        // { indirect => {piece.pos => [movePos' leading to king] }  direct => {piece.pos => [movePos' leading to king] } }
        this.currentTurnColor = 'white';
        this.generateBoard();
    }

    generateBoard() {
        for (let i = 0; i < 8; i++) {
            this.board.push([]);
            for (let j = 0; j < 8; j++) {
                let piece = null;
                if (i === 1 || i === 6) {
                    piece = new Piece([i, j], 'P');
                } else if (i === 0 || i === 7) {
                    if (j === 0 || j === 7) {
                        piece = new Piece([i, j], 'R');
                    } else if (j === 1 || j === 6) {
                        piece = new Piece([i, j], 'N');
                    } else if (j === 2 || j === 5) {
                        piece = new Piece([i, j], 'B');
                    } else if (j === 3) {
                        piece = new Piece([i, j], 'K');
                    } else {
                        piece = new Piece([i, j], 'Q');
                    }
                }
                if (piece) {
                    if (piece.pos[0] > 5) {
                        piece.color = 'white';
                        if (piece.symbol === 'K') {this.kings['white'] = piece;}
                    } else {
                        piece.color = 'black';
                        if (piece.symbol === 'K') { this.kings['black'] = piece; }
                    }
                    this.currentPieces[piece.pos] = piece;
                }
                const tile = new Tile(this, [i, j], piece);
                this.board[i].push(tile);
            }
        }
    }

    oppColor(color) {
        switch (color) {
            case 'white':
                return 'black';
            case 'black':
                return 'white';
            default:
                console.log('idk what that color was man');
        }
    }

    onBoard(pos) {
        return (
            pos[0] >= 0 && pos[0] < 8 &&
            pos[1] >= 0 && pos[1] < 8
        );
    }

    singleMoveDirs(piece, dirs) {
        const moves = [];
        let movePos;
        for (let i = 0; i < dirs.length; i++) {
            movePos = [piece.pos[0] + dirs[i][0], piece.pos[1] + dirs[i][1]];
            if (this.onBoard(movePos)) {
                if (this.currentPieces[movePos] && this.currentPieces[movePos].color !== piece.color) {
                    moves.push(movePos);
                } else if (!(this.currentPieces[movePos])) {
                    moves.push(movePos);
                }
            }
        }
        return moves;
    }

    moveDirs(piece, dirs) {
        const moves = [];
        for (let i = 0; i < dirs.length; i++) {
            let currentPos = [piece.pos[0] + dirs[i][0], piece.pos[1] + dirs[i][1]];
            console.log(this.currentPieces[currentPos]);
            const movesForTheKing = [];
            while (!(this.currentPieces[currentPos]) && this.onBoard(currentPos)) {
                const tempPush = currentPos.slice();
                movesForTheKing.push(tempPush);
                currentPos[0] += dirs[i][0];
                currentPos[1] += dirs[i][1];
            }
            moves.push(movesForTheKing);
            if (this.onBoard(currentPos) && this.currentPieces[currentPos]) {
                const currentPiece = this.currentPieces[currentPos];
                if (currentPiece.color !== piece.color) {
                    moves.push(currentPos);
                }
            }
        }
        return moves;
    }

    pawnMoves(piece) {
        const dirs = [];
        if (piece.color === 'white') {
            if (!(this.currentPieces[piece.pos[0] - 1, piece.pos[1]])) {
                dirs.push([-1, 0]);
                if (piece.pos[0] === 6 && !(this.currentPieces[piece.pos[0] - 2, piece.pos[1]])) {dirs.push([-2, 0])}
            }
            if (this.currentPieces[piece.pos[0] - 1, piece.pos[1] - 1]) {dirs.push([-1, -1])}
            if (this.currentPieces[piece.pos[0] - 1, piece.pos[1] + 1]) { dirs.push([-1, 1]) }
        } else {
            if (!(this.currentPieces[piece.pos[0] + 1, piece.pos[1]])) {
                dirs.push([1, 0]);
                if (piece.pos[0] === 1 && !(this.currentPieces[piece.pos[0] + 2, piece.pos[1]])) {dirs.push([2, 0])}
            }
            if (this.currentPieces[piece.pos[0] + 1, piece.pos[1] - 1]) { dirs.push([1, -1]) }
            if (this.currentPieces[piece.pos[0] + 1, piece.pos[1] + 1]) { dirs.push([1, 1]) }
        }
        return this.singleMoveDirs(piece, dirs);
    }

    rookMoves(piece) {
        const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        return (this.moveDirs(piece, dirs));
    }

    bishopMoves(piece) {
        const dirs = [[1, 1], [-1, -1], [1, -1], [-1, 1]];
        return (this.moveDirs(piece, dirs));
    }

    knightMoves(piece) {
        const moveDirs = [[2, 1], [1, 2], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
        return this.singleMoveDirs(piece, moveDirs);
    }

    kingMoves(piece) {
        const moveDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]];
        return this.singleMoveDirs(piece, moveDirs);
    }

    findThreatsAndRemove(piece, moves) {
        otherColor = this.oppColor(piece.color);
        for (let i = 0; i < moves.length; i++) {
            if (this.isIncluded(this.kings[otherColor].moves, moves[i])) {
                this.kings[otherColor]['indirect'][piece.pos] ? this.kings[otherColor]['indirect'][piece.pos].push(moves[i]) : [moves[i]];
                // if (!(this.kings[otherColor]['indirect'][piece.pos]['pos'])) {
                //     this.kings[otherColor]['indirect'][piece.pos]['pos'] = piece.pos;
                // }
                this.kings[otherColor].moves.splice(this.kings[otherColor].moves.indexOf(moves[i]), 1);
            } else if (moves[i] === this.kings[otherColor].pos) {
                this.kings[otherColor]['direct'][piece.pos] = moves[i];
            }
        }
    }

    findMatchingThreat(primaryThreat, color) {  // primaryThreat should be a piece object reference
        if (this.kings[color]['indirect'][primaryThreat.pos]) {
            return this.kings[color]['indirect'][primaryThreat.pos][0];  // enemy rook/queen adjacent to king ????
        } else {
            return [-1, -1];
        }
    }

    adjacent(piece1, piece2) {
        const pos1 = piece1.pos;
        const pos2 = piece2.pos;
        if ((pos1[0] + 1 === pos2[0] && pos1[1] === pos2[1])
            || (pos1[0] - 1 === pos2[0] && pos1[1] === pos2[1])
            || (pos1[0] + 1 === pos2[0] && pos1[1] + 1 === pos2[1])
            || (pos1[0] + 1 === pos2[0] && pos1[1] - 1 === pos2[1])
            || (pos1[0] - 1 === pos2[0] && pos1[1] + 1 === pos2[1])
            || (pos1[0] - 1 === pos2[0] && pos1[1] - 1 === pos2[1])
            || (pos1[0] === pos2[0] && pos1[1] + 1 === pos2[1])
            || (pos1[0] === pos2[0] && pos1[1] - 1 === pos2[1])
            ) {
             return true;
        }
        return false;
    }

    findSavesOnMove(piece, moves) {
        if (this.kings[piece.color]['direct']) {
            const threatLocations = Object.keys(this.kings[piece.color]['direct']);
            const threatPieces = [];
            for (let i = 0; i < threatLocations.length; i++) {
                threatPieces.push(this.currentPieces[threatLocations[i]]);  // take the [pos[0], pos[1]] from the keys and find their objects
            }
            for (let i = 0; i < threatPieces.length; i++) {
                for (let j = 0; j < moves.length; j++) {
                    if (moves[j] === threatPieces[i].pos) {
                        this.kings[piece.color]['saves'][piece.pos] = moves[j];
                    } else if (threatPieces[j].symbol !== 'N' && threatPieces[j].symbol !== 'P' && !(this.adjacent(threatPieces[j], this.kings[piece.color]))) {
                        const blockPos = this.findMatchingThreat(threatPieces[j]);
                        if (moves[j] === blockPos) {
                            this.kings[piece.color]['saves'][piece.pos] = moves[j];
                        }
                    }

                }
            }
        }
    }

    potentialMoves(piece) {
        let moves;
        switch (piece.symbol) {
            case 'P':
                moves = (this.pawnMoves(piece)); // add enpausant and promotion
                break;
            case 'R':
                moves = (this.rookMoves(piece));
                break;
            case 'N':
                moves = this.knightMoves(piece);
                break;
            case 'B':
                moves = (this.bishopMoves(piece));
                break;
            case 'Q':
                moves = (this.rookMoves(piece).concat(this.bishopMoves(piece)));
                break;
            case 'K': // add castling and restrictions on moving near enemy kings
                moves = this.kingMoves(piece)
                // this.kings[piece.color].moves = moves; // done in call statement
                break;
            default:
                console.log('that piece doesn\'t exist');
                return;
        }
        piece.moves = moves;
        if (piece.color === this.currentTurnColor) {
            this.findThreatsAndRemove(piece, moves);
        } else {
            this.findSavesOnMove(piece, moves);         // does not exist yet
        }
        return moves;
    }

    isIncluded(positions, pos) {
        for (let i = 0; i < positions.length; i++) {
            if (positions[i][0] === pos[0] && positions[i][1] === pos[1]) {
                return true;
            }
        }
        return false;
    }

    findMovesForColor(color) {
        const pieces = Object.values(this.currentPieces);
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color === color && pieces[i].symbol !== 'K') {
                this.potentialMoves(pieces[i]);
            }
        }
    }

    findAllMoves() {
        this.kings[this.currentTurnColor].moves = this.potentialMoves(this.kings[this.currentTurnColor]);
        this.kings[this.oppColor(this.currentTurnColor)].moves = this.potentialMoves(this.oppColor(this.kings[this.currentTurnColor]));
        this.findMovesForColor(this.currentTurnColor);
        this.findMovesForColor(this.oppColor(this.currentTurnColor));
    }

    validMove(piece, pos) {
        const moves = this.potentialMoves(piece);
        // console.log('potential moves');
        // console.log(moves);
        // console.log('destination pos');
        // console.log(pos);
        if (this.isIncluded(moves, pos)) {
            return true;
        }
        return false;
    }

    movePiece(moveTile, endTile) {
        if (this.validMove(moveTile.piece, endTile.pos)) {
            const piece = moveTile.piece;
            this.currentTurnColor = piece.color;
            if (endTile.piece) {
                if (endTile.piece.color === 'black') {
                    this.whiteCaptures.push(piece);
                } else {
                    this.blackCaptures.push(piece);
                }
            }
            this.findAllMoves(); // find all moves beginning with pieces of current turn player
            endTile.piece = piece;                  // add the piece to the moved to tile
            delete this.currentPieces[piece.pos];       // remove old piece pos from hash
            piece.pos = endTile.pos;                // move the piece's position
            if (piece.symbol === 'K') {
                this.kings[piece.color].pos = piece.pos
            }
            this.currentPieces[piece.pos] = piece;      // update hash piece location
            moveTile.piece = null;                  // remove the piece from its old tile
            return true;
        } else {
            console.log('Invalid move destination');
            return false;
        }
    }

    checkmate(otherTurnCol) {
        if (this.kings[otherTurnCol].moves === [] || this.kings[otherColor]['saves']) {
            return false;
        } else {
            return false;
        }
    }
}