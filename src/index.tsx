import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
    value?: string;
    highlighted: boolean;
    onClick: () => void;
}

function Square(props: SquareProps): JSX.Element {
    return (
        <button className={"square" + (props.highlighted ? " highlighted" : "")} onClick={props.onClick}>
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
    winningLine?: [number, number, number];
}

class Board extends React.Component<BoardProps> {
    renderSquare(i: number) {
        let highlighted = false;
        if (this.props.winningLine !== undefined && this.props.winningLine.indexOf(i) >= 0) {
            highlighted = true;
        }
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} highlighted={highlighted} />;
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
    sortedAsc: boolean;
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
            sortedAsc: true,
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        let winner: SquareValue | undefined = undefined;
        let line: [number, number, number] | undefined = undefined;
        if (result !== undefined) {
            [winner, line] = result;
        }

        let moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : "Go to game start";
            const span = move ? `${step.xIsCurrent ?
                "X : " : "0 : "}[${step.col}, ${step.row}]` : "";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}
                        style={move === this.state.stepNumber ?
                            { fontWeight: "bold" } : { fontWeight: "normal" }}>
                        {desc}
                    </button>
                    <span style={{ marginLeft: "10px" }}>{span}</span>
                </li>
            );
        });

        if(!this.state.sortedAsc) {
            moves = moves.reverse();
        }

        let status;
        let isDraw = true;
        for (let i = 0; i < current.squares.length; i++) {
            if (!current.squares[i]) {
                isDraw = false;
                break;
            }
        }
        if (isDraw) {
            status = "It's a draw!"
        } else if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={i => this.handleClick(i)} winningLine={line} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol reversed={this.state.sortedAsc ? false : true}>{moves}</ol>
                    <button onClick={() => this.toggleMoves()}>Toggle moves</button>
                </div>
            </div>
        );
    }

    toggleMoves() {
        this.setState({
            sortedAsc: !this.state.sortedAsc,
        });
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

function calculateWinner(squares: AllSquaresValues): [SquareValue, [number, number, number]] | undefined {
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
            return [squares[a], lines[i] as [number, number, number]];
        }
    }
    return undefined;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
