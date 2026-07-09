import { useState, useEffect, createContext, useContext } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from '../../config'

interface SignalRContextType {
  connection: HubConnection | null;
}

export const SignalRContext = createContext<SignalRContextType>( {connection: null} );

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  //const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/gameHub`, { /*accessTokenFactory: () => token*/ })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => setConnection(newConnection))
      .catch(console.error);
    
    return () => { newConnection.stop(); };
  }, []);
  
  return (
    <SignalRContext.Provider value={ {connection} }>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);