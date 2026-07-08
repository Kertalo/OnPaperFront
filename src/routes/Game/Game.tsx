import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import { API_URL } from '../../../config.js';
import './Game.css';
import MazeEditor from '../MazeEditor/MazeEditor.jsx'; // Оставьте .jsx или обновите расширение при переделке редактора

const SIZE = 10;

// Описываем структуру данных, которую мы отправляем на сервер при сохранении
interface MazePayload {
  maze: number[];
  size: number;
  treasure: Position;
}

interface Position {
  x: number;
  y: number;
}

// Пропсы для компонента игрового поля
interface BoardProps {
  walls: number[];
  title: string;
}

// Типизируем параметры URL из react-router
interface GameRouteParams extends Record<string, string | undefined> {
  gameId: string;
}

function generateWalls(): number[] {
  return Array.from({ length: SIZE * SIZE }, () => {
    const r = Math.random();
    if (r < 0.75) return 0;
    if (r < 0.85) return 1;
    if (r < 0.95) return 2;
    return 3;
  });
}

function hasRightWall(value: number): boolean {
  return value === 1 || value === 3;
}

function hasBottomWall(value: number): boolean {
  return value === 2 || value === 3;
}

function Board({ walls, title }: BoardProps) {
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
  // Указываем тип параметров для useParams
  const { gameId } = useParams<GameRouteParams>();
  
  // Указываем типы для состояний React
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  
  // Добавлено состояние для отслеживания старта игры (в JS-коде этой переменной не было в useState)
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  
  // Пример стейта под будущие данные от SignalR
  const [gameState, setGameState] = useState<any>(null); 
  
  const [leftLabyrinth] = useState<number[]>(generateWalls);
  const [rightLabyrinth] = useState<number[]>(generateWalls);

  // Стейты для размеров (в JS-коде конструкция let size_x, size_y = 0 инициализировала нулем только size_y)
  const [sizeX, setSizeX] = useState<number>(0);
  const [sizeY, setSizeY] = useState<number>(0);

  useEffect(() => {
    console.log("Загружаем игру с id:", gameId);
  }, [gameId]);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/gameHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect() // Хорошая практика для стабильного мультиплеера
      .build();

    setConnection(newConnection);

    // Очистка соединения при размонтировании компонента
    return () => {
      newConnection.stop();
    };
  }, []);
  
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          // Вызываем метод на бэкенде для получения ID подключения
          connection.invoke<string>("GetConnectionId")
            .then(id => console.log('Connection ID:', id));
            
          console.log("Connected!");

          // Подписываемся на событие от сервера
          connection.on("GetMazeOption", (x: number, y: number) => {
            setSizeX(x);
            setSizeY(y);
            // Если получение параметров означает старт игры:
            setIsGameStart(true);
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection]);

  // Типизируем аргументы функции сохранения лабиринта
  const handleSaveMaze = async (maze: number[], treasure: Position): Promise<void> => {
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
       console.error('Нет соединения с сервером');
       return;
    }

    try {
      const payload: MazePayload = {
        maze: maze,
        size: SIZE,
        treasure: treasure
      };

      await connection.invoke('SaveMaze', gameId, payload);
      console.log('Лабиринт успешно отправлен на сервер');
    } catch (error) {
      console.error('Ошибка при отправке лабиринта:', error);
    }
  };

  return (
    <>
      { !isGameStart && connection && <MazeEditor size_x={6} size_y={5} onSubmit={handleSaveMaze} /> }
      { isGameStart &&
        <div className="battlefield">
          <Board walls={leftLabyrinth} title="Ваше поле" />
          <Board walls={rightLabyrinth} title="Поле противника" />
        </div>
      }
    </>
  );
}

export default Game;
