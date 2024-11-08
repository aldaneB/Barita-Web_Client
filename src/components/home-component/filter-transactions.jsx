/**
 * Filter transaction component
 */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredTransactions } from "../../store/transaction-slice";
import { format } from "date-fns";

//TODO:Add total amount and total count to csv file
//TODO:Add navigation to home route
//TODO:Create a new transaction page
//TODO:Redesign CSV file to include total count and amout at footer
export default function FilterTransaction() {
  const dispatch = useDispatch();
  var [isEmpty, setIsEmpty] = useState(false);
  const { transactions, isLoading, hasError } = useSelector(
    (state) => state.transaction
  );

  /**
   * check if transactions are empty before disabling button
   */
  useEffect(() => {
    setIsEmpty(isTransactionEmpty(transactions));
  }, [transactions]);

  const [filter, setFilter] = useState({
    user_id: 0,
    start_date: null,
    end_date: null,
    transaction_type: 0,
  });

  //Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  //Handle date change
  const handleDateChange = (date, field) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: date,
    }));
  };

  //Convert to dollar
  const convertToDollar = (amount) => {
    const dollar = new Intl.NumberFormat("en-JM", {
      style: "currency",
      currency: "JMD",
    });
    return dollar.format(amount);
  };

  const downloadCSV = () => {
    if (transactions.length === 0) return;

    const headers = [
      "Transaction ID",
      "Transaction Date",
      "Transaction Type",
      "Amount",
      "User ID",
      "Total Amount",
      "Total Count",
    ];

    const csvRows = [headers.join(",")];

    transactions.forEach((transaction) => {
      const row = [
        transaction.transaction_id,
        format(transaction.transaction_date, "yyyy-MM-dd"),
        transaction.transaction_type === 0 ? "Deposit" : "Withdrawal",
        transaction.amount,
        transaction.user_id,
      ];
      csvRows.push(row.join(","));
    });

    const totalAmount = transactionSum(transactions);
    const totalCount = transactionCount(transactions);

    const footerRow = ["Total", "", "", "", "", totalAmount];
    csvRows.push(footerRow.join(","));

    // Add final row for total count
    const totalRow = ["", "", "", "", "", "", totalCount];
    csvRows.push(totalRow.join(","));
    const csv = csvRows.join("\n");

    //create downloadable link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  function onSubmit(e) {
    e.preventDefault();
    const { user_id, start_date, end_date, transaction_type } = filter;

    //Dispatch getFilteredTransactions
    dispatch(
      getFilteredTransactions({
        filter: {
          user_id: user_id ? Number(user_id) : 0,
          start_date: start_date ? format(start_date, "yyyy-MM-dd") : null,
          end_date: end_date ? format(end_date, "yyyy-MM-dd") : null,
          transaction_type: Number(transaction_type) || 0,
        },
      })
    );
  }

  //Return the sum of all transactions
  function transactionSum(transactions) {
    var sum = 0;
    transactions.forEach((transaction) => {
      sum += transaction.amount;
    });
    return sum;
  }

  //Return the number of transactions
  function transactionCount(transactions) {
    return transactions.length;
  }

  //Check if transacion is empty
  function isTransactionEmpty(transactions) {
    return transactions.length === 0;
  }

  return (
    <div className="flex flex-col align-middle text-center mx-auto">
      <h2>Filtered Transaction</h2>
      <form
        className="flex flex-col mx-auto my-2 md:flex-row items-center md:space-x-4 bg-white p-4 md:p-6 shadow-md rounded-lg space-y-4 md:space-y-0"
        onSubmit={onSubmit}
      >
        {/* User ID Field */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-600">User ID:</label>
          <input
            type="number"
            name="user_id"
            value={filter.user_id}
            min="0"
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 w-full md:w-24"
          />
        </div>

        {/* Transaction Type Field */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-600">Transaction Type:</label>
          <select
            name="transaction_type"
            defaultValue="Select Type"
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 w-full md:w-36"
          >
            <option value="">Select Type</option>
            <option value="0">Deposit</option>
            <option value="1">Withdrawal</option>
          </select>
        </div>

        {/* Start Date Field */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-600">Start Date:</label>
          <DatePicker
            selected={filter.start_date}
            onChange={(date) => handleDateChange(date, "start_date")}
            dateFormat="yyyy-MM-dd"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 w-full md:w-36"
          />
        </div>

        {/* End Date Field */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-600">End Date:</label>
          <DatePicker
            selected={filter.end_date}
            onChange={(date) => handleDateChange(date, "end_date")}
            dateFormat="yyyy-MM-dd"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 w-full md:w-36"
          />
        </div>
        {/* Submit Button */}
        <div className="flex flex-row mx-auto my-3">
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-blue-600 rounded-md border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          >
            {isLoading ? "Loading..." : "Filter Transactions"}
          </button>
          <button
            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
            disabled={isEmpty}
            onClick={downloadCSV}
          >
            {isEmpty ? "Download CSV" : "Download CSV"}
          </button>
        </div>
      </form>

      {/**Error Message */}
      {hasError && <div style={{ color: "red" }}>{hasError.message}</div>}
      {/**Transaction List */}

      {/* //TODO:Add totals row */}
      {transactions && transactions.length > 0 ? (
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
                    Amount
                  </p>
                </th>
                <th
                  scope="col"
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Date Created
                  </p>
                </th>
                <th
                  scope="col"
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Total Transactions
                  </p>
                </th>
                <th
                  scope="col"
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Total Amount
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
                        {format(
                          new Date(transaction.transaction_date),
                          "yyyy-MM-dd"
                        )}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {transaction.transaction_type}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {convertToDollar(transaction.amount)}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {format(new Date(transaction.created_at), "yyyy-MM-dd")}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {/* <td>{transactionCount(transaction.transaction_id)}</td> */}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {/* <td>{transactionSum(transaction)}</td> */}
                      </p>
                    </td>
                    {/* <td className="p-4 border-b border-blue-gray-50">
                      <button
                        className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        type="button"
                      >
                        Download CSV
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No transactions available</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-top-solid border-spacing-3 bg-neutral-100 border-teal-900  text-lg">
              <tr>
                <td
                  colSpan="6"
                  className="p-2 text-left font-bold text-slate-800 border-t border-slate-300"
                >
                  Totals
                </td>
                <td
                  colSpan="3"
                  className="p-1 p-r-4 text-center font-black text-slate-800 border-t border-slate-300"
                >
                  {convertToDollar(transactionSum(transactions))}
                </td>
                {/* <td
                  colSpan="1"
                  className="p-4 ml font-bold text-slate-800 border-t border-slate-300"
                >
                  {transactionCount(transactions)}
                </td> */}
              </tr>
              <tr>
                <td colSpan="5" className=""></td>
                {/* <td colSpan="" className=""></td> */}
                <td
                  colSpan=""
                  className="p-3 font-black  text-center text-slate-800 "
                >
                  {transactionCount(transactions)}
                </td>
                <td colSpan="5" className=""></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div>No transaction found</div>
      )}
    </div>
  );
}
