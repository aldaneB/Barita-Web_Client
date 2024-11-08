import { Outlet } from "react-router-dom";
import CreateTransaction from "../../components/home-component/create-transaction";

/**
 * Create Transaction
 */
export default function AddTransaction() {
  return (
    <div>
      <CreateTransaction />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
