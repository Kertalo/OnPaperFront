import { useState, useEffect } from 'react'
import { useParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import { API_URL } from '../../../config.js'
import './Game.css'
import MazeEditor from '../MazeEditor/MazeEditor.jsx';

const SIZE = 10;

function generateWalls() {
  return Array.from({ length: SIZE * SIZE }, () => {
    const r = Math.random();
    if (r < 0.75) return 0;
    if (r < 0.85) return 1;
    if (r < 0.95) return 2;
    return 3;
  });
}

function hasRightWall(value) {
  return value === 1 || value === 3;
}

function hasBottomWall(value) {
  return value === 2 || value === 3;
}

function Board({ walls, title }) {
  return (
    <div className="board">
      <span className="board-title">{title}</span>
      <div className="board-grid">
        {walls.map((value, index) => (
          <div
            key={index}
            className={[
              'board-cell',
              hasRightWall(value) && 'board-cell--wall-right',
              hasBottomWall(value) && 'board-cell--wall-bottom',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

function Game() {
  const { gameId } = useParams();
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isGameStart, setIsGameStart] = useState(false);
  const [leftLabyrinth] = useState(generateWalls);
  const [rightLabyrinth] = useState(generateWalls);

  useEffect(() => {
    console.log("Загружаем игру с id:", gameId);
    // тут можно, например, подключиться к SignalR-хабу для конкретной игры
    // или запросить состояние доски с сервера по gameId
  }, [gameId]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ API_URL }/gameHub`, {
        accessTokenFactory: () => localStorage.getItem('token')
      })
      //.withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, []);
  
  useEffect(() => {
      if (connection) {
        connection.start()
          .then(() => {
            connection.invoke("GetConnectionId").then(id => console.log('Connection ID:', id));
            console.log("Connected!");
            connection.on("ReceiveNotification", message => {
              console.log("Received notification:", message);
              setNotifications(notifications => [...notifications, message]);
            });
          })
          .catch(e => console.log('Connection failed: ', e));
      }
  }, [connection]);

  const handleSaveMaze = async (maze) => {
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('Нет соединения с сервером');
    }

    await connection.invoke('SaveMaze', gameId, maze);
  };

  return (
    <>
      { !isGameStart && <MazeEditor onSubmit={handleSaveMaze} /> }
      { isGameStart &&
        <div className="battlefield">
          <Board walls={leftLabyrinth} title="Ваше поле" />
          <Board walls={rightLabyrinth} title="Поле противника" />
        </div>
      }
    </>
  );
}

export default Game
