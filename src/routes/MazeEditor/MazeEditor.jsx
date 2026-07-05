import { useState } from 'react';
import './MazeEditor.css';

const SIZE = 10;
const CELL = 34;
const WALL_HIT = 10; // ширина кликабельной зоны стены в пикселях

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

  const handleToggleRight = (index) => {
    // нет смысла ставить стену справа у последнего столбца
    if ((index + 1) % SIZE === 0) return;

    setMaze((prev) => {
      const next = [...prev];
      next[index] = toggleRight(next[index]);
      return next;
    });
  };

  const handleToggleBottom = (index) => {
    // нет смысла ставить стену снизу у последней строки
    if (index + SIZE >= SIZE * SIZE) return;

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
      <div className="maze-editor-grid">
        {maze.map((value, index) => (
          <div key={index} className="maze-editor-cell">
            {hasRightWall(value) && <div className="wall wall--right" />}
            {hasBottomWall(value) && <div className="wall wall--bottom" />}

            <div
              className="hit-zone hit-zone--right"
              style={{ width: WALL_HIT }}
              onClick={() => handleToggleRight(index)}
            />
            <div
              className="hit-zone hit-zone--bottom"
              style={{ height: WALL_HIT }}
              onClick={() => handleToggleBottom(index)}
            />
          </div>
        ))}
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
