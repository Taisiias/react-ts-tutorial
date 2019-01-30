import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
    value?: string;
    onClick: () => void;
}

class Square extends React.Component<SquareProps> {
    render() {
        return (
            <button
                className="square"
                onClick={() => {
                    this.props.onClick();
                }}
            >
                {this.props.value}
            </button>
        );
    }
}

type SquareValue = string | undefined;
type AllSquaresValues = [
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue,
    SquareValue
];

interface BoardState {
    squares: AllSquaresValues;
}

class Board extends React.Component<{}, BoardState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            squares: Array(9).fill(undefined) as AllSquaresValues,
        };
    }

    renderSquare(i: number) {
        return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
    }

    handleClick(i: number) {
        const squares = this.state.squares.slice() as AllSquaresValues;
        squares[i] = "X";
        this.setState({ squares });
    }

    render() {
        const status = "Next player: X";

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
