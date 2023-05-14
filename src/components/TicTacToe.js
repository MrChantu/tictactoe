import { useEffect, useState } from "react";
import game from "../classes/game";

import Cell from "./Cell";
import GameOver from "./GameOver";

const TicTacToe = () => {
    const [currentGame, setGame] = useState(new game());
    const [isGameOver, setGameOver] = useState(false);
    const [gameWinner, setGameWinner] = useState(null);
    const [hasFinishedChecking, setFinishedChecking] = useState(false);
    const [canPlayerClick, setPlayerCanClick] = useState(true);

    const checkWinner = (board) => {
        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0].value !== "" &&
                board[i][0].value === board[i][1].value &&
                board[i][1].value === board[i][2].value
            ) {
                return board[i][0].value;
            }
        }
        // Vertical
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i].value !== "" &&
                board[0][i].value === board[1][i].value &&
                board[1][i].value === board[2][i].value
            ) {
                return board[0][i].value;
            }
        }
        // Diagonal
        if (
            board[0][0].value !== "" &&
            board[0][0].value === board[1][1].value &&
            board[1][1].value === board[2][2].value
        ) {
            return board[0][0].value;
        }
        if (
            board[0][2].value !== "" &&
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
        setGame((prevGame) => {
            return { ...prevGame, board: updatedBoard };
        });
        const winner = checkWinner(updatedBoard);
        setPlayerCanClick(false);
        if (winner) {
            setGameOver(true);
            setGameWinner(winner);
            console.log(winner);
        } else {
            setFinishedChecking(true);
        }
    };

    const minimax = (board, isPlayer) => {
        let scores = {
            X: 1,
            O: -1,
            tie: 0,
        };
        let copyBoard = [...board];
        let winner = checkWinner(copyBoard);
        if (winner) {
            return scores[winner];
        }
        if (isPlayer) {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (copyBoard[i][j].value === "") {
                        copyBoard[i][j].value = "O";
                        let score = minimax(copyBoard, false);
                        copyBoard[i][j].value = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (copyBoard[i][j].value === "") {
                        copyBoard[i][j].value = "X";
                        let score = minimax(copyBoard, true);
                        copyBoard[i][j].value = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    };

    const getComputerTurn = () => {
        let copyBoard = [...currentGame.board];
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

    const handleComputerTurn = () => {
        const bestMove = getComputerTurn();
        const updatedBoard = [...currentGame.board];
        updatedBoard[bestMove[0]][bestMove[1]].value = "X";

        setGame((prevGame) => ({ ...prevGame, board: updatedBoard }));

        const winner = checkWinner(updatedBoard);
        // If computer wins setTimeout so that user can see the board before rendering GameOver
        if (winner) {
            setTimeout(() => {
                setGameOver(true);
                setGameWinner(winner);
                console.log(winner);
            }, 1000);
        }
    };

    useEffect(() => {
        if (hasFinishedChecking && !isGameOver) {
            setTimeout(() => {
                handleComputerTurn();
                setFinishedChecking(false);
                setPlayerCanClick(true);
            }, 500);
        }
    }, [hasFinishedChecking]);

    const handleRestart = () => {
        setGame(new game());
        setFinishedChecking(false);
        setPlayerCanClick(true);
        setGameOver(false);
    };

    return (
        <>
            {isGameOver ? (
                <GameOver winner={gameWinner} handleClick={handleRestart} />
            ) : (
                <div id="game-board-container">
                    {isGameOver ? (
                        <GameOver
                            winner={gameWinner}
                            handleClick={handleRestart}
                        />
                    ) : (
                        currentGame.board.map((row, rowIndex) =>
                            row.map((cell, columnIndex) => (
                                <Cell
                                    key={`${rowIndex}-${columnIndex}`}
                                    y={rowIndex}
                                    x={columnIndex}
                                    value={cell.value}
                                    getPlayerTurn={getPlayerTurn}
                                    isGameOver={isGameOver}
                                    canPlayerClick={canPlayerClick}
                                />
                            ))
                        )
                    )}
                </div>
            )}
        </>
    );
};

export default TicTacToe;
