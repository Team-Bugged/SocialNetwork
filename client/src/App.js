import { Route, Routes } from "react-router-dom";
import { Welcome } from "./Welcome";
import { Login } from "./Login";
import { Register } from "./Register";
import { Home } from "./Home";
import { UserPage } from "./UserPage";
import {Profile} from "./Profile";

function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<Welcome/>}/>
      <Route exact path="/login" element = {<Login/>}/>
      <Route exact path="/register" element = {<Register/>}/>
      <Route exact path="/home" element = {<Home/>}/>
      <Route exact path="/user/:username" element = {<UserPage/>}/>
      <Route exact path="/profile" element={<Profile/>}/>
    </Routes>
  );
}

export default App;
