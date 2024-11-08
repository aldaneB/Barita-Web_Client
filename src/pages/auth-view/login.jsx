/**
 * Login User form
 */
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid"; // Import the icon
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

//Set initial user state
const initialState = {
  email: "",
  password: "",
};

/**
 *
 * @returns Component
 */
export default function AuthLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState(initialState);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  //   const { isLoading } = useSelector((state) => state.auth);

  //handle form input change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(FormData)).then((data) => {
      // console.log(data);
      // const message = data.payload.message;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          (toast.onmouseenter = Swal.stopTimer),
            (toast.onmouseleave = Swal.resumeTimer);
        },
      });
      if (data.payload) {
        Toast.fire({
          icon: "success",
          title: "Login successfully",
        });
        navigate("/");
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to login",
        });
      }
    });
  }
  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>
        <form onSubmit={onSubmit} className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 px-3 py-2 border border-gray-300 rounded-md "
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <input
              size="lg"
              placeholder="********"
              className="w-full placeholder:opacity-100 px-3 py-2 border border-gray-300 rounded-md pr-10 sm:pr-12 lg:pr-14"
              type={passwordShown ? "text" : "password"}
              name="password"
              onChange={handleInputChange}
              required
            ></input>
            <i
              className="absolute right transform -translate-x-7 translate-y-3 cursor-pointer"
              onClick={togglePasswordVisiblity}
            >
              {passwordShown ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </i>
          </div>
          <button
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            Sign In
          </button>
          {/* <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div> */}
          {/* <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            sign in with google
          </Button> */}
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Not registered?{" "}
            <a href="#" className="font-medium text-gray-900">
              Create account
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
}
