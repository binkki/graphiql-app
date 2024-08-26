import { Outlet } from "@remix-run/react";

export default function AuthIndex() {
  return (
    <>
      <h1 className="text-4xl text-center m-4">Welcome</h1>
      <div className="flex flex-col mx-auto ">
        <Outlet />
      </div>
    </>
  );
}
