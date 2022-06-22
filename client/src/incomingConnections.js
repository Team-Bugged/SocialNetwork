import { useEffect, useState } from "react";
import { acceptConnection, getIncomingConnections } from "./ServerConnection";

const acceptConnectionFrom = "";

const handleAcceptConnection = (event) => {
  console.log(event.target.value);
  acceptConnection(event.target.value);
  console.log("Accept");
};

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
      <div>
        <h1>IncomingConnections</h1>
        {incomingConnection?.map((username) => (
          <div>
            {username}
            <button value={username} onClick={handleAcceptConnection}>
              Accept
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
