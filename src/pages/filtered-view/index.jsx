/**
 * Filtered Table Page
 */

import { Outlet } from "react-router-dom";
import FilterTransaction from "../../components/home-component/filter-transactions";

export default function Filtered() {
  return (
    <div>
      <FilterTransaction />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
