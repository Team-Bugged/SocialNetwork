import { useEffect, useState } from "react";
import { SuggestionCard } from "./components/SuggestionCard";
import { getSuggestions } from "./ServerConnection";

export const GetSuggestions = () => {
  const [getSuggestion, setGetSuggestion] = useState([]);
  useEffect(() => {
    getSuggestions().then((response) => {
      console.log(response.data);
      setGetSuggestion(response.data);
    });
  }, []);
  return (
    <>

        {getSuggestion?.map((userData) => (
          <SuggestionCard userData = {userData}/>
        ))}
    </>
  );
};
