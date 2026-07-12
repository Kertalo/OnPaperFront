import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import './Game.css';
import { useSignalR } from '../../models/SignalRContext.tsx';
import MazeEditor from '../../components/MazeEditor/MazeEditor.tsx';

interface GameRouteParams extends Record<string, string | undefined> {
  gameId: string;
}

function Game() {
  const { gameId } = useParams<GameRouteParams>();
  const [isMazeBuild, setIsMazeBuild] = useState<boolean | null>(null);
  const { connection } = useSignalR();

  useEffect(() => {
    console.log("Game ID:", gameId);
  }, [gameId]);
  
  useEffect(() => {
    if (!connection) {
      return;
    }

    setIsMazeBuild(false);

    connection.invoke<string>("GetConnectionId")
      .then(id => console.log('Connection ID:', id));
  }, [connection]);

  return (
    <>
      { !isMazeBuild && <MazeEditor/> }
      { isMazeBuild && 123 }
    </>
  );
}

export default Game;
