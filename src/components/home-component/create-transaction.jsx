/**
 * Create transaction modal
 */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
              <label className="block mb-2 text-left text-sm text-slate-600">
                User ID
              </label>
              <input
                type="number"
                name="user_id"
                min={0}
                value={FormData.user_id}
                onChange={handleInputChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-left text-slate-600">
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
              <label className="block mb-2 text-sm text-left text-slate-600">
                Transaction Type
              </label>
              <select
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
          <div className="inline-flex items-center mt-2">
            {/* <label
              className="flex items-center cursor-pointer relative"
              htmlFor="check-2"
            >
              <span className="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label> */}
          </div>
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
