import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import { API_URL } from '../../../config';
import './Game.css';
import { useSignalR } from '../../models/SignalRContext.tsx';
//import MazeEditor from '../MazeEditor/MazeEditor.tsx'; // Оставьте .jsx или обновите расширение при переделке редактора
import {Maze} from '../../models/Maze.tsx';

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
  const { gameId } = useParams<GameRouteParams>();
  const [isMazeBuild, setIsMazeBuild] = useState(false);
  const { connection } = useSignalR();

  useEffect(() => {
    console.log("Загружаем игру с id:", gameId);
  }, [gameId]);
  
  useEffect(() => {
    if (!connection)
      return;

    connection.invoke<string>("GetConnectionId")
      .then(id => console.log('Connection ID:', id));
        /*connection.on("GetMazeOption", (x: number, y: number) => {
          setSizeX(x);
          setSizeY(y);
          // Если получение параметров означает старт игры:
          setIsGameStart(true);
        });
      })*/
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
//{ !isMazeBuild && connection && 1234 }
  return (
    <>
      
      { isMazeBuild &&
        123
      }
    </>
  );
}

export default Game;
