import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
    value?: string;
    onClick: () => void;
}

function Square(props: SquareProps): JSX.Element {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

type SquareValue = "X" | "O" | undefined;
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

interface BoardProps {
    squares: AllSquaresValues;
    onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
    renderSquare(i: number) {
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        let rows: JSX.Element[] = [];
        for (let i = 0; i < 3; i++) {
            const squares: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                squares.push(this.renderSquare(i * 3 + j));
            }
            rows.push(<div key={i} className="board-row">{squares}</div>);
        }
        return (<div>{rows}</div>);
    }
}

interface GameHistoryStep {
    squares: AllSquaresValues,
    col: number | undefined;
    row: number | undefined;
    xIsCurrent: boolean;
}

type GameHistory = GameHistoryStep[];

interface GameState {
    history: GameHistory;
    xIsNext: boolean;
    stepNumber: number;
}

class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            history: [
                {
                    squares: Array(9).fill(undefined) as AllSquaresValues,
                    col: undefined,
                    row: undefined,
                    xIsCurrent: true,
                },
            ],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : "Go to game start";
            const span = move ? `${step.xIsCurrent ? "X : " : "0 : " }[${step.col}, ${step.row}]` : "";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}
                        style={move === this.state.stepNumber ? { fontWeight: "bold" } : { fontWeight: "normal" }}>
                        {desc}
                    </button>
                    <span style={{ marginLeft: "10px" }}>{span}</span>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={i => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    handleClick(i: number): void {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice() as AllSquaresValues;
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([
                {
                    squares,
                    col: i % 3 + 1,
                    row: Math.floor(i / 3 + 1),
                    xIsCurrent: this.state.xIsNext,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
}

function calculateWinner(squares: AllSquaresValues): SquareValue {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return undefined;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
