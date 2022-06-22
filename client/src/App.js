import { Route, Routes } from "react-router-dom";
import { Welcome } from "./Welcome";
import { Login } from "./Login";
import { Register } from "./Register";
import { Home } from "./Home";
import { UserPage } from "./UserPage";
import { Profile } from "./Profile";
import { IncomingConnections } from "./incomingConnections";
import { GetSuggestions } from "./getSuggestions";



function App() {
  return (
    
    <Routes>
      <Route exact path="/" element={<Welcome />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/user/:username" element={<UserPage />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route
        exact
        path="/incomingConnections"
        element={<IncomingConnections />}
      />
      <Route exact path="/getSuggestions" element={<GetSuggestions />} />
    </Routes>
  );
}

export default App;
