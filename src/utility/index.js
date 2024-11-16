/**
 * Utility functions
 */
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
/**
 *
 * @param {number} amount
 * @returns formatted number to dollar
 */

export const convertToDollar = (amount) => {
  const dollar = new Intl.NumberFormat("en-JM", {
    style: "currency",
    currency: "JMD",
  });
  return dollar.format(amount);
};
import { loginSuccess } from "../store/auth-slice";
/**
 *
 * @param {date} date
 * @returns new Date
 */
export function convertDate(date) {
  return format(date, "yyyy-MM-dd");
}

// export const IsUserLoggedIn = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const token = localStorage.getItem("token");
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       const isExpired = decodedToken.exp * 1000 < Date.now();
//       if (!isExpired) {
//         dispatch(loginSuccess(true));
//       } else {
//         localStorage.removeItem("token");
//         dispatch(loginSuccess(false));
//       }
//     } catch (ex) {
//       console.log("Invalid token", ex);
//       dispatch(loginSuccess(false));
//     }
//   }
// };
//Return the sum of all transactions
export function transactionSum(transactions) {
  var sum = 0;
  transactions.forEach((transaction) => {
    sum += transaction.amount;
  });
  return sum;
}

//Return the number of transactions
export function transactionCount(transactions) {
  return transactions.length;
}

/**
 *
 * @param {List} transactions
 * @returns <a></a> for csv download
 */
export function downloadCSV(transactions) {
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
}
