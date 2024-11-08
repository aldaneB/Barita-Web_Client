import "./App.css";
import Home from "./pages/home-view";
import { Routes, Route } from "react-router-dom";
import Filtered from "./pages/filtered-view";
import { AuthLayout } from "./components/auth-component/layout";
import AuthLogin from "./pages/auth-view/login";
import AddTransaction from "./pages/home-view/create";
import { CheckAuth } from "./components/auth-component/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "./store/auth-slice";

//TODO:Install tailwind css and other packages

function App() {
  // const [count, setCount] = useState(0);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (!isExpired) {
          dispatch(loginSuccess(true));
        } else {
          localStorage.removeItem("token");
          dispatch(loginSuccess(false));
        }
      } catch (ex) {
        console.log("Invalid token", ex);
        dispatch(loginSuccess(false));
      }
    }
  }, [dispatch]);

  console.log(isAuthenticated);
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
