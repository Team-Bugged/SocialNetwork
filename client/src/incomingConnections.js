import { useEffect, useState } from "react";
import { IncomingConnectionCard } from "./components/incomingConnectionCard";
import { acceptConnection, getIncomingConnections } from "./ServerConnection";

export const IncomingConnections = () => {
  
  const [incomingConnection, setIncomingConnection] = useState();
  useEffect(() => {
    getIncomingConnections().then((response) => {
      console.log(response.data);
      setIncomingConnection(response.data);
    });
  }, []);
  return (
    <>
        {incomingConnection?.map((userData) => (
          <IncomingConnectionCard userData = {userData}/>
        ))}
    </>
  );
};
