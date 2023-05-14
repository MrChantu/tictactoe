const Cell = (props) => {
    const handleClick = (e) => {
        console.log(props.currentGame)
        // console.log(`y: ${e.target.dataset.y} x: ${e.target.dataset.x}`);
        if (e.target.dataset.value === "" && !props.isGameOver) {
            props.getPlayerTurn(e.target.dataset.y, e.target.dataset.x);
        }
    };

    return (
        <div
            className="cell"
            data-y={props.y}
            data-x={props.x}
            data-value={props.value}
            onClick={handleClick}
        >
            <div className="cell-content">{props.value}</div>
        </div>
    );
};

export default Cell;
