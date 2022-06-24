import { useEffect, useState } from "react";
import { SuggestionCard } from "./components/SuggestionCard";
import { getSuggestions } from "./ServerConnection";

export const GetSuggestions = (props) => {
  const [getSuggestion, setGetSuggestion] = useState([]);

  const handleSendConnection = (username)=>{
      let suggestionList = getSuggestion;
      console.log(suggestionList);
      suggestionList.filter((element)=>
        element.username != username
      )
      console.log("check");
      setGetSuggestion(suggestionList);
  }
  useEffect(() => {
    getSuggestions().then((response) => {
      console.log(response.data);
      setGetSuggestion(response.data);
    });
  }, []);
  return (
    <>

        {getSuggestion?.map((userData) => (
          <SuggestionCard userData = {userData} handleSendConnection={handleSendConnection}
          handleProfileOnClick={props.handleProfileOnClick}/>
        ))}
    </>
  );
};
