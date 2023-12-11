import React, { useState, useCallback, useEffect } from "react";
import "./index.css";
import { v4 as uuidv4 } from "uuid";

const Tile = (props) => {
  const { content, onClick, className, isActive = false } = props;

  return (
    <div className={className} onClick={onClick}>
      {isActive ? content : ""}
    </div>
  );
};

export const MatchGame = (props) => {
  const { rows = 4, columns = 4, matchSize = 2 } = props;
  const [gameState, setGameState] = useState([]);
  const [tileVisibility, setTileVisibility] = useState({});
  const [activeTile, setActiveTile] = useState(null);

  useEffect(() => {
    // initialize the game state
    const totalTiles = rows * columns;
    const totalSets = Math.floor(totalTiles / matchSize);
    const tiles = [];
    const tileVisibility = {};
    for (let i = 0; i < totalSets; i++) {
      const stateObj = {
        tileType: i,
        isMatched: false,
      };
      const id1 = uuidv4();
      const id2 = uuidv4();

      tiles.push({ ...stateObj, id: id1 });
      tiles.push({ ...stateObj, id: id2 });

      tileVisibility[id1] = false;
      tileVisibility[id2] = false;
    }
    // randomising the tiles
    tiles.sort(() => Math.random() - 0.5);
    setGameState(tiles);
    setTileVisibility(tileVisibility);
  }, [rows, columns, matchSize]);

  // generating game
  const gridDOM = [];
  if (gameState.length) {
    for (var i = 0; i < rows; i++) {
      const cols = [];
      for (var j = 0; j < columns; j++) {
        const gameObj = gameState[i * columns + j];
        cols.push(
          <Tile
            key={i * columns + j}
            content={gameObj.tileType}
            onClick={() => {
              if (gameObj.isMatched) {
                return;
              }

              // checking last active tile
              if (activeTile && activeTile.tileType != gameObj.tileType) {
                // flip both digits
                setTimeout(() => {
                  const newVis = {
                    ...tileVisibility,
                    [activeTile.id]: false,
                    [gameObj.id]: false,
                  };
                  setActiveTile(null);
                  setTileVisibility(newVis);
                }, 1000);
                return;
              }

              // if match exists
              if (activeTile && activeTile.tileType === gameObj.tileType) {
                const newVis = {
                  ...tileVisibility,
                  [activeTile.id]: true,
                  [gameObj.id]: true,
                };

                // set isMatched in gameState
                const newGameState = [...gameState];
                const ind1 = newGameState.findIndex(
                  (obj) => obj.id === gameObj.id
                );
                const ind = newGameState.findIndex(
                  (obj) => obj.id === activeTile.id
                );
                newGameState[ind1].isMatched = true;
                newGameState[ind].isMatched = true;
                setTileVisibility(newVis);
                setActiveTile(null);
                setGameState(newGameState);
              }

              // first pick
              const newTileVis = {
                ...tileVisibility,
              };
              newTileVis[gameObj.id] = !newTileVis[gameObj.id];
              setActiveTile(gameObj);
              setTileVisibility(newTileVis);
            }}
            className={`tile ${gameObj.isMatched ? "disabled" : ""}`}
            isActive={tileVisibility[gameObj.id]}
          />
        );
      }
      gridDOM.push(<div className="match-game-row">{cols}</div>);
    }
  }
  return <div className="match-game">{gridDOM}</div>;
};
