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

const initialState = {
  email: "",
  password: "",
};
export default function AuthLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState(initialState);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  //handle form input change
  function handleInputChange(e) {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(FormData)).then((data) => {
      const message = data.payload.message;
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
      if (data.payload.success) {
        Toast.fire({
          icon: "success",
          title: "Login successfully",
        });
        navigate("/home");
      } else {
        Toast.fire({
          icon: "error",
          title: message,
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
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              onChange={handleInputChange}
              labelProps={{
                className: "hidden",
              }}
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
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
            ></Input>
            <i onClick={togglePasswordVisiblity}>
              {passwordShown ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </i>
            onChange={handleInputChange}
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth>
            sign in
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>
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
