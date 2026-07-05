import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router";
import { API_URL } from '../../../config.js'
import * as signalR from "@microsoft/signalr";
import './Home.css'

function Home() {
  const [connection, setConnection] = useState(null);
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);

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

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ API_URL }/gameHub`, {
        accessTokenFactory: () => localStorage.getItem('token')
      })
      //.withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  };
  
  useEffect(() => {
    if (!connection)
      return;

    connection.on("GameFound", (matchId, opponentId) => {
      console.log(`Игра найдена! ID матча: ${matchId}, противник: ${opponentId}`);
      navigate(`/game/${matchId}`);
    });

    connection.start()
      .then(() => {
        connection.invoke("FindGame")
      })
      .catch(e => console.log('Connection failed: ', e));
    
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
      {searching && (
        <div className="overlay">
          <div className="modal">
            <h3>Searching for players...</h3>
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
