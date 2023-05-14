import { useState } from "react";

const Cell = (props) => {
    const [mousePos, setMousePos] = useState({});

    const handleClick = (e) => {
        if (
            e.target.dataset.value === "" &&
            !props.isGameOver &&
            props.canPlayerClick
        ) {
            props.getPlayerTurn(e.target.dataset.y, e.target.dataset.x);
        }
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePos({ x, y });
    };

    return (
        <div
            className="cell"
            data-y={props.y}
            data-x={props.x}
            data-value={props.value}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            style={
                props.canPlayerClick
                    ? {
                          "--mouse-x": `${mousePos.x}px`,
                          "--mouse-y": `${mousePos.y}px`,
                          cursor: "pointer",
                      }
                    : {}
            }
        >
            <div className="cell-content">{props.value}</div>
        </div>
    );
};

export default Cell;
