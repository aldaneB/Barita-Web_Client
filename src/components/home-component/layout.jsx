/**
 * Home Page Layout for table and filter
 */

import { Outlet } from "react-router-dom";
import TransactionTable from "./table";

export default function HomeLayout() {
  return (
    <div className="container">
      <TransactionTable />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
