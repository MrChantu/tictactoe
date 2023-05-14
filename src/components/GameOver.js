const GameOver = (props) => {
    let winner = null;
    if (props.winner === "tie") {
        winner = "TIE";
    } else {
        winner = `${props.winner} WINS!`
    }
    return (
        <div id="game-over-container">
            <h1>{winner}</h1>
            <button onClick={props.handleClick}>Restart</button>
        </div>
    )
}

export default GameOver;