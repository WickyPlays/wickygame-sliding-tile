import { useState, useEffect } from "react";
import "./PageTitleBackground.scss";

interface Position {
  row: number;
  col: number;
}

interface Square {
  id: number;
  pos: Position;
}

export default function PageTitleBackground() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [emptyPos, setEmptyPos] = useState<Position | null>(null);
  const [squares, setSquares] = useState<Square[]>([]);
  const gap = 5;
  const minRows = 5;

  const rows = Math.max(minRows, Math.floor(dimensions.height / (dimensions.width / minRows)));
  const squareSize = (dimensions.height - gap * (rows - 1)) / rows;
  const cols = Math.floor((dimensions.width + gap) / (squareSize + gap));

  // Calculate board dimensions
  const boardWidth = cols * (squareSize + gap) - gap;
  const boardHeight = rows * (squareSize + gap) - gap;

  useEffect(() => {
    const initialEmptyPos = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols),
    };
    setEmptyPos(initialEmptyPos);

    const initialSquares: Square[] = [];
    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (row === initialEmptyPos.row && col === initialEmptyPos.col) continue;
        initialSquares.push({ id: id++, pos: { row, col } });
      }
    }
    setSquares(initialSquares);
  }, [rows, cols]);

  useEffect(() => {
    if (!emptyPos) return;

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);

    const moveInterval = setInterval(() => {
      const adjacent = getValidAdjacent(emptyPos.row, emptyPos.col);
      if (adjacent) {
        const squareIndex = squares.findIndex(
          (square) => square.pos.row === adjacent.r && square.pos.col === adjacent.c
        );
        if (squareIndex !== -1) {
          const newSquares = [...squares];
          newSquares[squareIndex] = {
            ...newSquares[squareIndex],
            pos: { row: emptyPos.row, col: emptyPos.col },
          };
          setSquares(newSquares);
          setEmptyPos({ row: adjacent.r, col: adjacent.c });
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(moveInterval);
    };
  }, [emptyPos, squares, rows, cols]);

  const getValidAdjacent = (row: number, col: number): Position | null => {
    const directions: Position[] = [
      { r: row - 1, c: col }, // Up
      { r: row + 1, c: col }, // Down
      { r: row, c: col - 1 }, // Left
      { r: row, c: col + 1 }, // Right
    ];
    const valid = directions.filter(
      (dir) => dir.r >= 0 && dir.r < rows && dir.c >= 0 && dir.c < cols
    );
    return valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null;
  };

  const renderedSquares = squares.map((square) => (
    <div
      key={square.id}
      className="square"
      style={{
        transform: `translate(${square.pos.col * (squareSize + gap)}px, ${square.pos.row * (squareSize + gap)}px)`,
        width: `${squareSize}px`,
        height: `${squareSize}px`,
      }}
    />
  ));

  return (
    <div className="page-title-background">
      <div
        className="board"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {renderedSquares}
      </div>
    </div>
  );
}