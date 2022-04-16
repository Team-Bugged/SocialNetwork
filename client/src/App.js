import { Route, Routes } from "react-router-dom";
import { Welcome } from "./Welcome";
import { Login } from "./Login";
import { Register } from "./Register";
import { Home } from "./Home";

function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<Welcome/>}/>
      <Route exact path="/login" element = {<Login/>}/>
      <Route exact path="/register" element = {<Register/>}/>
      <Route exact path="/home" element = {<Home/>}/>
    </Routes>
  );
}

export default App;
