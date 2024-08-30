import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import UserSingOut from "~/components/UserSingOut/UserSingOut";
import { auth } from "~/firebase";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => listen();
  }, []);

  return (
    <>
      {authUser ? (
        <>
          <h2>Welcome back, {authUser.email}!</h2>
          <div>
            <Link to={"/restful"}>Restful Client</Link>
            <Link to={"/graphiql"}>Graphiql Client</Link>
          </div>
          <UserSingOut />
        </>
      ) : (
        <>
          <h1>Welcome!</h1>
          <p>
            Please <Link to={"/signin"}>Sign In</Link>
            or <Link to={"/signup"}>Sign Up</Link>
          </p>
        </>
      )}
    </>
  );
}
