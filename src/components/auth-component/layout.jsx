/**
 * Auth Layout
 */

import { Outlet } from "react-router-dom";


export function AuthLayout() {
  return (
    <div className="auth-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
