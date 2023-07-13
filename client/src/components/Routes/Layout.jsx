import { Header } from "../templates";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
    </main>
  );
};

export default HomePage;
