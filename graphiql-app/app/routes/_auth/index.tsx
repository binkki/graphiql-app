import { Outlet } from "@remix-run/react";

export default function AuthIndex() {
  return (
    <>
      <h1>Welcome</h1>
      <Outlet />
    </>
  );
}
