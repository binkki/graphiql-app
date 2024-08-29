import { Outlet } from "@remix-run/react";
// import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AuthIndex() {
  return (
    <>
      {/* <Header /> */}
      <h1 className="text-4xl text-center m-4">Welcome</h1>
      <div className="flex flex-col mx-auto ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
