import { useEffect, useState } from 'react';
import './MazeEditor.css';
import { Maze } from '../../models/Maze';
import { useSignalR } from '../../models/SignalRContext.tsx';
import { Direction } from '../../enums/Direction';

const WALL_HIT = 10;

export default function MazeEditor() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [sending, setSending] = useState(false);
  const { connection } = useSignalR();
  const [, forceUpdate] = useState({});

  useEffect(() => {

    if (!connection) {
      return;
    }

    (async () => {
      await connection.invoke<number[]>("GetMazeSize")
        .then(size => setMaze(new Maze(size[0], size[1])))
        .catch(e => console.log(e))
    })()
  }, [connection]);

  const handleCell = (index: number) => {
    maze!.treasure = index;
    maze!.treasure = 0;
    forceUpdate({});
  };

  const handleSaveMaze = async () => {
    if (!connection) {
      return;
    }

    setSending(true);
    await connection.invoke('SaveMaze', maze);
  };

  return (
    <div className="editor">
      { maze &&
        <div className="maze" style={ { '--sizeX': maze.sizeX, '--sizeY': maze.sizeY } as React.CSSProperties }>
          { Array.from({ length: maze.sizeX * maze.sizeY }, (_, index) => (
            <div
              id={ String(index) }
              key={ index }
              className="cell"
              onClick={() => handleCell(index) }
            >
              { maze.treasure === index && <div className="treasure" /> }
              { maze.hasWall(index, Direction.RIGHT) && <div className="wall wall--right" /> }
              { maze.hasWall(index, Direction.DOWN) && <div className="wall wall--bottom" /> }

              { (index + 1) % maze.sizeX !== 0 && (
                <div
                  className="hit-zone hit-zone--right"
                  style={ { width: WALL_HIT } }
                  onClick={ () => { maze.addOrRemoveWall(index, Direction.RIGHT); forceUpdate({}); } }
                />
              ) }
              { index < maze.sizeX * (maze.sizeY - 1) && (
                <div
                  className="hit-zone hit-zone--bottom"
                  style={ { height: WALL_HIT } }
                  onClick={ () => { maze.addOrRemoveWall(index, Direction.DOWN); forceUpdate({}); } }
                />
              )}
            </div>
          ))}
        </div>
      }
      <div className="buttons">
        <button type="button" onClick={ () => maze && setMaze(new Maze(maze.sizeX, maze.sizeY)) } disabled={ sending }>
          Очистить
        </button>
        <button type="button" onClick={ handleSaveMaze } disabled={ sending }>
          { sending ? 'Отправка...' : 'Сохранить лабиринт' }
        </button>
      </div>
    </div>
  );
}
