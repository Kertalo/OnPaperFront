import { useEffect, useState } from 'react';
import './MazeEditor.css';
import { Maze } from '../../models/Maze';

const CELL = 34;
const WALL_HIT = 10;

function toggleRight(value: number): number {
  return value ^ 1;
}

function toggleBottom(value: number): number {
  return value ^ 2;
}

function hasRightWall(value: number): boolean {
  return (value & 1) === 1;
}

function hasBottomWall(value: number): boolean {
  return (value & 2) === 2;
}

interface MazeEditorProps {
  size_x: number;
  size_y: number;
  onSubmit?: (maze: MazeGrid, treasure: number) => Promise<void> | void;
}

export default function MazeEditor({ size_x, size_y, onSubmit }: MazeEditorProps) {
  const [maze, setMaze] = useState<Maze>(new Maze(size_x, size_y));
  const [sending, setSending] = useState(false);
  const [scale, setScale] = useState(1);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Предотвращаем прокрутку страницы
    e.preventDefault();

    // Изменяем масштаб (шаг 0.1)
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => {
      const newScale = Math.max(0.3, Math.min(2, prev + delta)); // ограничения 0.3x - 2x
      return Math.round(newScale * 10) / 10; // округляем до 1 знака
    });
  };

  const handleCell = (index: number) => {
    console.log(index);
    setTreasure(index);
  };

  const handleToggleRight = (index: number) => {
    setMaze((prev) => {
      const next = [...prev];
      next[index] = toggleRight(next[index]);
      return next;
    });
  };

  const handleToggleBottom = (index: number) => {
    setMaze((prev) => {
      const next = [...prev];
      next[index] = toggleBottom(next[index]);
      return next;
    });
  };

  const handleReset = () => setMaze(emptyMaze());

  const handleSubmit = async () => {
    setSending(true);
    try {
      await onSubmit?.(maze, treasure);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="maze-editor">
      <div
        className="maze-editor-grid-wrapper"
        onWheel={handleWheel}
        style={
          {
            '--cols': size_x,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease',
          } as React.CSSProperties
        }
      >
        <div className="maze-editor-grid">
          {Array.from({ length: maze.sizeX * maze.sizeY }, (_, index) => (
            <div
              id={String(index)}
              key={index}
              className="maze-editor-cell"
              onClick={() => handleCell(index)}
            >
              {maze.treasure === index && <div className="treasure" />}
              {hasRightWall(value) && <div className="wall wall--right" />}
              {hasBottomWall(value) && <div className="wall wall--bottom" />}

              {(index + 1) % maze.sizeX !== 0 && (
                <div
                  className="hit-zone hit-zone--right"
                  style={{ width: WALL_HIT }}
                  onClick={() => handleToggleRight(index)}
                />
              )}
              {Math.trunc(index / SIZE) !== SIZE - 1 && (
                <div
                  className="hit-zone hit-zone--bottom"
                  style={{ height: WALL_HIT }}
                  onClick={() => handleToggleBottom(index)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: '14px', color: '#888' }}>
        Масштаб: {Math.round(scale * 100)}%
      </div>
      <div className="maze-editor-actions">
        <button type="button" onClick={handleReset} disabled={sending}>
          Очистить
        </button>
        <button type="button" onClick={handleSubmit} disabled={sending}>
          {sending ? 'Отправка...' : 'Сохранить лабиринт'}
        </button>
      </div>
    </div>
  );
}