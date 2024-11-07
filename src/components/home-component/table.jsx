import { useState, useEffect } from "react";
import FilterTransaction from "./filter-transactions";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../store/transaction-slice";
import { Link } from "react-router-dom";

const initialState = {
  transactions: [],
  filter: {
    user_id: null,
    start_date: null,
    end_date: null,
    type: null,
  },
};
export default function TransactionTable() {
  const dispatch = useDispatch();

  const { transactions, isLoading, hasError } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]); //Get transactions from API

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (hasError) {
    return <div>Error</div>;
  }
  //   console.log(transactions);
  return (
    <div>
      <h1 className="table-">Transaction Table</h1>
      <div className="flex flex-col gap-2 shrink-0 sm:flex-row mb-5 float-end">
        <Link to="/filtered">
          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Filter Transactions
          </button>
        </Link>

        <button
          className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
          </svg>
          Add Transaction
        </button>
      </div>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th
                scope="col"
                className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
              >
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Transaction ID
                </p>
              </th>
              <th
                scope="col"
                className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
              >
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Transaction Date
                </p>
              </th>
              <th
                scope="col"
                className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
              >
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Transaction Type
                </p>
              </th>
              <th
                scope="col"
                className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
              >
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Actions
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="hover:bg-slate-50">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {transaction.transaction_id}
                    </p>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {transaction.transaction_date}
                    </p>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {transaction.transaction_type}
                    </p>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <button
                      className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
