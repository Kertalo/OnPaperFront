import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router";
import { API_URL } from '../../../config.js'
import './Home.css'
import Search from '../../components/Search/Search.tsx'
import { useSignalR } from '../../models/SignalRContext.tsx';

function Home() {
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);
  const { connection } = useSignalR();

  useEffect(() => {
    async function fetchUser() {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');

      if (id) {
        try {
          const response = await fetch(`${ API_URL }/users/${id}`, {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          const data = await response.json();
          
          if (response.ok) {
            setUser(data.email);
          }
        }
        catch (error) {
          console.error("Unable to connect to the server. Please try again later.");
        }
      }
    }

    fetchUser();
  }, []);

  let navigate = useNavigate();

  const handleSearch = () => {
    setSearching(true);
  };

  useEffect(() => {
    if (!connection) {
      return;
    }

    connection.on("GameFound", (gameId, opponentId) => {
      console.log(`Game found! Game ID: ${gameId}, Opponent: ${opponentId}`);
      navigate(`/game/${gameId}`);
    });

    connection.invoke("FindGame");
  }, [connection]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="home">
        <h1>On Paper</h1>
        {user ? (
          <>
          <p className="username">Signed in as {user}</p>
          <button type="button" onClick={handleSearch}>
            Play
          </button>
          </>
        ) : null}
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <p>No account? <Link to="/register">Sign up</Link></p>
      </div>
      { searching && <Search /> }
    </>
  )
}

export default Home
