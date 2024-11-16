import "./App.css";
// import Home from "./pages/home-view";
import { Routes, Route } from "react-router-dom";
// import Filtered from "./pages/filtered-view";
import { AuthLayout } from "./components/auth-component/layout";
import AuthLogin from "./pages/auth-view/login";
// import AddTransaction from "./pages/home-view/create";
import { CheckAuth } from "./components/auth-component/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { checkAuth, loginSuccess } from "./store/auth-slice";
import FilterTransaction from "./pages/home-view/filter";
import CreateTransaction from "./pages/home-view/create";
import HomeLayout from "./components/home-component/layout";
import TransactionTable from "./pages/home-view";

//TODO:Install tailwind css and other packages

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // console.log(isAuthenticated);
  if (isLoading) return <div>Loading...</div>;
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CheckAuth isAuthenticated={isAuthenticated}>
            <HomeLayout />
          </CheckAuth>
        }
      >
        <Route index element={<TransactionTable />} />
        <Route path="filtered" element={<FilterTransaction />} />
        <Route path="create" element={<CreateTransaction />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<AuthLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
