import { useState, useEffect, useRef } from "react";
import { MdInfo, MdClose } from "react-icons/md";
import "./PageTitle.scss";
import PageTitleBackground from "./PageTitleBackground";
import { getCookie, setCookie } from "../../utils/util_cookie";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { GrGithub } from "react-icons/gr";
import video from "../../assets/bg.mp4";

export default function PageTitle() {
  const [tileNumber, setTileNumber] = useState<number>(3);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTileNumber = getCookie("tileNumber");
    if (
      savedTileNumber &&
      !isNaN(parseInt(savedTileNumber)) &&
      parseInt(savedTileNumber) >= 3 &&
      parseInt(savedTileNumber) <= 10
    ) {
      setTileNumber(parseInt(savedTileNumber));
    }
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTileNumber = parseInt(event.target.value);
    setTileNumber(newTileNumber);
    setCookie("tileNumber", newTileNumber.toString(), 30);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className={`page-title ${mounted ? "mounted" : ""}`}>
      <video className="video" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <PageTitleBackground />
      <button className="info-button" onClick={toggleInfo}>
        <MdInfo size={24} />
        <span>How to play</span>
      </button>
      <div className="text-container">
        <div className="title-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="main-title">Sliding Tile Game</h1>
          <p className="subtitle">A creation by Wicky</p>
        </div>
        <div className="tile-selection">
          <p>Playing with </p>
          <select value={tileNumber} onChange={handleTileChange}>
            {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <p>x{tileNumber} tiles</p>
        </div>
        <Link to="/game">
          <button className="play-button">Play Now</button>
        </Link>
      </div>
      <div className="footer">
        <div className="footer-left">
          <GrGithub />
          <p>
            <a href="https://github.com/WickyPlays/wicky-game-sliding-tile">
              Github
            </a>
          </p>
        </div>
        <>
          <a href="https://ko-fi.com/Wicky">Consider donating via my ko.fi!</a>
        </>
      </div>

      {/* Info Dialog */}
      <div className={`info-dialog ${showInfo ? "visible" : ""}`} ref={dialogRef}>
        <div className="info-dialog-header">
          <h2>How to Play</h2>
          <button className="close-button" onClick={toggleInfo}>
            <MdClose size={24} />
          </button>
        </div>
        <div className="info-dialog-content">
          <ol>
            <li>The game consists of a grid with numbered tiles in random order.</li>
            <li>One space is empty so that tiles can be moved around.</li>
            <li>Click on any adjacent tile (left, right, top, or bottom) to slide it into the empty space.</li>
            <li>The goal is to arrange the tiles in numerical order from left to right, top to bottom.</li>
            <li>The empty space should be in the bottom-right corner when the puzzle is solved.</li>
            <li>You can select different grid sizes (3x3 to 10x10) from the menu.</li>
          </ol>
          <p className="tip">Tip: Start by solving the first row, then the second row, and so on.</p>
        </div>
      </div>
    </div>
  );
}