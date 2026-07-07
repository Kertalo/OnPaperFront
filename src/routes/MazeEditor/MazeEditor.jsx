import { useState } from 'react';
import './MazeEditor.css';

const SIZE = 6;
const CELL = 34;
const WALL_HIT = 10;

function emptyMaze() {
  return Array(SIZE * SIZE).fill(0);
}

// биты: 1 - стена справа, 2 - стена снизу
function toggleRight(value) {
  return value ^ 1;
}

function toggleBottom(value) {
  return value ^ 2;
}

function hasRightWall(value) {
  return (value & 1) === 1;
}

function hasBottomWall(value) {
  return (value & 2) === 2;
}

export default function MazeEditor({ onSubmit }) {
  const [maze, setMaze] = useState(emptyMaze);
  const [sending, setSending] = useState(false);
  const [scale, setScale] = useState(1);
  const [treasure, setTreasure] = useState(-1);

  const handleWheel = (e) => {
    // Предотвращаем прокрутку страницы
    e.preventDefault();
    
    // Изменяем масштаб (шаг 0.1)
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => {
      const newScale = Math.max(0.3, Math.min(2, prev + delta)); // ограничения 0.3x - 2x
      return Math.round(newScale * 10) / 10; // округляем до 1 знака
    });
  };

  const handleCell = (index) => {
    console.log(index);
    setTreasure(index);
  };

  const handleToggleRight = (index) => {
    setMaze((prev) => {
      const next = [...prev];
      next[index] = toggleRight(next[index]);
      return next;
    });
  };

  const handleToggleBottom = (index) => {
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
      await onSubmit?.(maze);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="maze-editor">
      <div 
        className="maze-editor-grid-wrapper"
        onWheel={handleWheel}
        style={{ 
          '--cols': SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease'
        }}
      >
        <div className="maze-editor-grid">
          {maze.map((value, index) => (
            <div id={index} key={index} className="maze-editor-cell" onClick={() => handleCell(index)}>
              {treasure == index && <div className="treasure" />}
              {hasRightWall(value) && <div className="wall wall--right" />}
              {hasBottomWall(value) && <div className="wall wall--bottom" />}

              {(index + 1) % SIZE != 0 &&
                <div
                  className="hit-zone hit-zone--right"
                  style={{ width: WALL_HIT }}
                  onClick={() => handleToggleRight(index)}
                />
              }
              {Math.trunc(index / SIZE) != SIZE - 1 &&
                <div
                  className="hit-zone hit-zone--bottom"
                  style={{ height: WALL_HIT }}
                  onClick={() => handleToggleBottom(index)}
                />
              }
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
