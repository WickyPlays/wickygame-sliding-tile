import { useState, useEffect } from "react";
import { MdInfo } from "react-icons/md";
import "./PageTitle.scss";
import PageTitleBackground from "./PageTitleBackground";
import { getCookie, setCookie } from "../../utils/util_cookie";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function PageTitle() {
  const [tileNumber, setTileNumber] = useState<number>(3);

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
  }, []);

  const handleTileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTileNumber = parseInt(event.target.value);
    setTileNumber(newTileNumber);
    setCookie("tileNumber", newTileNumber.toString(), 30);
  };

  return (
    <div className="page-title">
      <PageTitleBackground />
      <button className="info-button">
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
        <p>
          <a href="https://github.com/WickyPlays/wicky-game-sliding-tile">
            Github
          </a>
        </p>
      </div>
    </div>
  );
}
