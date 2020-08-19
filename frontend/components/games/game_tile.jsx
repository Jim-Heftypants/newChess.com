import React from 'react';

class Tile extends React.Component {

    render () {
        // want to set a second class="this.props.tile.color on head div"
        const piece = this.props.tile.piece;
        let symbol = null;
        if (piece) {
            symbol = piece.symbol;
        }
        // `${this.props.tile.color}`
        return (
            <div className='board-element'>
                <p className='piece-type'>
                    {symbol}  {this.props.tile.color}
                </p>
            </div>
        )
    }
}

export default Tile;