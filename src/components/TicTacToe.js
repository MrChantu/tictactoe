import { useEffect, useState } from "react";
import game from "../classes/game";

import Cell from "./Cell";

const TicTacToe = () => {
    const [currentGame, setGame] = useState(new game());
    const [playerTurnFinished, setPlayerTurnFinished] = useState(false);
    const [computerTurnFinished, setComputerTurnFinished] = useState(false);
    const [isGameOver, setGameOver] = useState(false);

    const checkWinner = (board) => {
        // console.log(board);
        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0].value === board[i][1].value &&
                board[i][1].value === board[i][2].value
            ) {
                return board[i][0].value;
            }
        }
        // Vertical
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i].value === board[1][i].value &&
                board[1][i].value === board[2][i].value
            ) {
                return board[0][i].value;
            }
        }
        // Diagonal
        if (
            board[0][0].value === board[1][1].value &&
            board[1][1].value === board[2][2].value
        ) {
            return board[0][0].value;
        }
        if (
            board[0][2].value === board[1][1].value &&
            board[1][1].value === board[2][0].value
        ) {
            return board[0][2].value;
        }

        let isTie = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].value === "") {
                    isTie = false;
                    break;
                }
            }
            if (!isTie) {
                break;
            }
        }

        if (isTie) return "tie";

        return null; // No winner or tie
    };
    // Pass into cell
    const getPlayerTurn = (y, x) => {
        const updatedBoard = [...currentGame.board];
        updatedBoard[y][x].value = "O";
        console.log(updatedBoard);
        setGame((prevGame) => {
            return { ...prevGame, board: updatedBoard };
        });
        const winner = checkWinner(updatedBoard);
        if (winner) setGameOver(true);
        console.log(winner);
        // This might not work depending on how fast it executes, might need to use a hook
        setPlayerTurnFinished(true);
    };

    const minimax = (board, isPlayer) => {
        let scores = {
            X: 1,
            O: -1,
            tie: 0,
        };
        return 1;
    };

    const getComputerTurn = () => {
        const copyBoard = [...currentGame.board];
        let bestScore = -Infinity;
        let bestMove = null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (copyBoard[i][j].value === "") {
                    copyBoard[i][j].value = "X";
                    let score = minimax(copyBoard, true);
                    copyBoard[i][j].value = ""; // Set it back to blank so that it can check other scenarios
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }
        return bestMove;
    };

    useEffect(() => {
        if (playerTurnFinished && !isGameOver) {
            const bestMove = getComputerTurn();
            const updatedBoard = [...currentGame.board];
            updatedBoard[bestMove[0]][bestMove[1]].value = "X";

            setGame((prevGame) => ({ ...prevGame, board: updatedBoard }));

            const winner = checkWinner(updatedBoard);
            if (winner) {
                setGameOver(true);
                console.log(winner);
            }

            setComputerTurnFinished(true);
        }
    }, [playerTurnFinished, isGameOver]);

    return (
        <div id="game-board-container">
            {currentGame.board.map((row, rowIndex) =>
                row.map((cell, columnIndex) => (
                    <Cell
                        key={`${rowIndex}-${columnIndex}`}
                        y={rowIndex}
                        x={columnIndex}
                        value={cell.value}
                        getPlayerTurn={getPlayerTurn}
                        isGameOver={isGameOver}
                        currentGame={currentGame}
                        // Did computer turn finish, same with player, don't let any event listeners execute if false
                    />
                ))
            )}
        </div>
    );
};

export default TicTacToe;
