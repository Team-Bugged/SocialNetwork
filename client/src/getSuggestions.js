import { useEffect, useState } from "react";
import { getSuggestions } from "./ServerConnection";

export const GetSuggestions = () => {
  const [getSuggestion, setGetSuggestion] = useState();
  useEffect(() => {
    getSuggestions().then((response) => {
      console.log(response.data);
      setGetSuggestion(response.data);
    });
  }, []);
  return (
    <>
      <div>
        <h1>Suggestions</h1>
        {getSuggestion?.map((username) => (
          <div>{username}</div>
        ))}
      </div>
    </>
  );
};
