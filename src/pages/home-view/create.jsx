// /**
//  * Create Transaction
//  */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createTransaction } from "../../store/transaction-slice";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
// import { createTransaction } from "../features/transactions/transactionSlice";
// import { useAuth } from "../hooks/useAuth";

//TODO:Set user id to current user by default using Auth State
const initialState = {
  user_id: 0,
  amount: 0,
  transaction_type: 0,
};
export default function CreateTransaction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState(initialState);

  //handle form input change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  }

  // Update the amount in the formData state
  const handleAmountChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      amount: Number(value),
    }));
  };

  console.log(FormData);
  //handle form submit
  function onSubmit(e) {
    e.preventDefault();
    dispatch(createTransaction(FormData)).then((data) => {
      console.log(data);
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
      if (data.payload) {
        Toast.fire({
          icon: "success",
          title: "Successfully Created Transaction",
        });
        navigate("/");
      } else {
        Toast.fire({
          icon: "error",
          title: message,
        });
      }
    });
  }
  return (
    <section>
      <div className="relative items-center min-h-screen flex flex-col rounded-xl bg-transparent">
        <Link to="/">
          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </button>
        </Link>
        <h4 className="block text-xl font-medium text-slate-800">
          Create Transaction
        </h4>
        <p className="text-slate-500 font-light">
          Nice to meet you! Enter transacion details.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 mb-2 align-middle w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <label
                htmlFor="user_id"
                className="block mb-2 text-left text-sm text-slate-600"
              >
                User ID
              </label>
              <input
                id="user_id"
                type="number"
                name="user_id"
                min={0}
                value={FormData.user_id}
                onChange={handleInputChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label
                htmlFor="transaction_amount"
                className="block mb-2 text-sm text-left text-slate-600"
              >
                Transaction Amount
              </label>
              <CurrencyInput
                name="amount"
                defaultValue={FormData.amount}
                min={0}
                prefix="$"
                // onChange={handleInputChange}
                onValueChange={handleAmountChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
              {/* <input
                type="number"
                name="amount"
                value={FormData.amount}
                min={0}
                onChange={handleInputChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              /> */}
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label
                htmlFor="transaction_type"
                className="block mb-2 text-sm text-left text-slate-600"
              >
                Transaction Type
              </label>
              <select
                id="transaction_type"
                name="transaction_type"
                defaultValue="Select Type"
                onChange={handleInputChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              >
                <option value="Select Type">Select Type</option>
                <option value="0">Deposit</option>
                <option value="1">Withdrawal</option>
              </select>
            </div>
          </div>
          <div className="inline-flex items-center mt-2"></div>
          <button
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </section>
  );
}
