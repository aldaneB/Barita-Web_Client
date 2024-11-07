/**
 * This is the Home Page
 */

import { Outlet } from "react-router-dom";
import HomeLayout from "../../components/home-component/layout";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <HomeLayout />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
