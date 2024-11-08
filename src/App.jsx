
import "./App.css";
import Home from "./pages/home-view";
import { Routes, Route } from "react-router-dom";
import Filtered from "./pages/filtered-view";
import { AuthLayout } from "./components/auth-component/layout";
import AuthLogin from "./pages/auth-view/login";
import AddTransaction from "./pages/home-view/create";

//TODO:Install tailwind css and other packages

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/filtered" element={<Filtered />} />
      <Route path="/create" element={<AddTransaction />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<AuthLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
