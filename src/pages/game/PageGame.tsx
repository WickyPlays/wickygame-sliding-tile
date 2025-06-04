import { useEffect, useRef, useState, useCallback } from "react";
import "./PageGame.scss";
import { GameCore } from "../../cores/GameCore";
import video from "../../assets/bg.mp4";
import { globalEvents } from "../../cores/GlobalEventHandler";
import DigitDisplay from "../../components/DigitDisplay/DigitDisplay";
import { GrRefresh } from "react-icons/gr";
import { TiArrowBackOutline } from "react-icons/ti";
import DigitClockDisplay from "../../components/DigitClockDisplay/DigitClockDisplay";
import board_image from "../../assets/image.jpg";
import { getCookie, setCookie } from "../../utils/util_cookie";
import { IoEye, IoEyeOff } from "react-icons/io5";
import logo from "../../assets/logo.png";

export default function PageGame() {
  const gameRef = useRef<GameCore | null>(null);
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [tileNumber, setTileNumber] = useState(3);
  const [movableTiles, setMovableTiles] = useState<GameTile[]>([]);
  const [toggleNumber, setToggleNumber] = useState(
    getCookie("toggleNumber") === "true"
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTileMoved = useCallback((e: any) => {
    setTiles([...e.board]);
    setMovableTiles(e.game.getMovableTiles());
  }, []);

  useEffect(() => {
    const savedTileNumberCookie = getCookie("tileNumber");
    let newTileNumber = 3;
    if (savedTileNumberCookie && !isNaN(parseInt(savedTileNumberCookie))) {
      newTileNumber = parseInt(savedTileNumberCookie);
    }
    setTileNumber(newTileNumber);
    gameRef.current = new GameCore(newTileNumber);
    gameRef.current.setupBoard();
    gameRef.current.shuffleBoard();
    setTiles(gameRef.current.getTiles());

    globalEvents.on("tileMoved", handleTileMoved);

    return () => {
      globalEvents.off("tileMoved", handleTileMoved);
      gameRef.current = null;
    };
  }, []);

  const getElapsedTime = () => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - gameRef.current?.getStartTime().getTime()) / 1000
    );

    let hours = Math.floor(diffInSeconds / 3600);
    let remaining = diffInSeconds % 3600;
    let minutes = Math.floor(remaining / 60);
    let seconds = remaining % 60;

    // Cap at 99:59:59
    if (hours > 99) {
      hours = 99;
      minutes = 59;
      seconds = 59;
    }

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const renderTiles = () => {
    if (!tiles || tiles.length === 0) return null;
    return (
      <div className="tiles">
        {tiles.map((tile, index) => (
          <div
            key={tile.id}
            className={`tile ${tile.attribute.empty ? "empty" : ""}`}
            style={{
              gridColumn: tile.attribute.col + 1,
              gridRow: tile.attribute.row + 1,
              backgroundImage: tile.attribute.empty
                ? "none"
                : `url(${board_image})`,
              cursor: movableTiles.includes(tile) ? "pointer" : "no-drop",
              ...tile.attribute.style,
            }}
            onClick={() => {
              const newTiles = gameRef.current?.selectTile(tile);
              if (newTiles) {
                setTiles([...newTiles]);
              }
            }}
          >
            {!tile.attribute.empty && toggleNumber && (
              <p className="tile-num">{tile.attribute.num}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-game">
      <video ref={videoRef} className="video-background" autoPlay loop muted>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className="btn-back" onClick={() => window.location.replace("/")}>
        <TiArrowBackOutline />
      </button>
      <div className="page-grid">
        <div className="left-panel">
          <div className="title-container">
            <img src={logo} alt="logo" className="logo" />
            <p>Sliding Tile Game</p>
            <p className="subtitle">A creation by Wicky</p>
          </div>
          <div>
            <div className="stat-move-container">
              <p className="label">Moves</p>
              <DigitDisplay
                value={gameRef.current?.getMoves() || 0}
                sx={{ border: "3px solid #fff" }}
              />
            </div>
            <div className="stat-time-container">
              <p className="label">Time</p>
              <DigitClockDisplay
                startTime={gameRef.current?.getStartTime() || new Date()}
                paused={gameRef.current?.status !== "playing"}
                sx={{ border: "3px solid #fff" }}
              />
            </div>
          </div>
        </div>
        <div className="board-container">
          <div
            className="board"
            style={{ "--tile-number": tileNumber } as React.CSSProperties}
          >
            {gameRef.current?.status == "finished" && (
              <div className="board-win">
                <p className="win-title">Congratulations!</p>
                <p className="win-subtitle">You did great!</p>
                <p className="win-time">Time completed: {getElapsedTime()}</p>
                <p>Moves: {gameRef.current?.getMoves()}</p>
                <button
                  className="btn-retry"
                  onClick={() => {
                    gameRef.current?.resetGame();
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            {renderTiles()}
          </div>
        </div>
        <div className="right-panel">
          <div>
            <button
              className="btn-reset"
              onClick={() => {
                gameRef.current?.resetGame();
              }}
            >
              <GrRefresh />
            </button>
            <button
              className="btn-toggle-num"
              onClick={() => {
                let mode = !toggleNumber;
                setToggleNumber(mode);
                setCookie("toggleNumber", mode.toString(), 30);
              }}
            >
              {toggleNumber ? <IoEye /> : <IoEyeOff />}
            </button>
          </div>
          <div>
            <div className="stat-tile-container">
              <p className="label">Tile Size</p>
              <DigitDisplay
                value={tileNumber || 0}
                digits={2}
                sx={{ border: "3px solid #fff" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
