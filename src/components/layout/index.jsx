import Header from "../header";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import Navbar from "../navbar";
import FloatButton from "../floatButton";

function Layout() {
  return (
    <>
      <Header />
      <Navbar />
      <Outlet />
      <FloatButton />
      <Footer />
    </>
  );
}

export default Layout;
