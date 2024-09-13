import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";
import {
  getHistoryFromLocalStorage,
  type Requests,
} from "../utils/localStorage";
import { Link } from "@remix-run/react";

export default function History() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Requests[] | null>(null);

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
  const { t } = useTranslation();

  useEffect(() => {
    const history = getHistoryFromLocalStorage();
    if (history) {
      setRequests(history);
    }
  }, []);

  return (
    <>
      {authUser ? (
        <>
          {requests ? (
            <>
              <h1>History</h1>
              <div>
                <ul>
                  {requests.map((request, index) => (
                    <li key={index}>
                      <span>{request.method}</span>
                      <Link to={request.url}>{request.url}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold pt-12 mb-5">
                You have not executed any requests yet. Follow one of the links:
              </h2>
              <div className="flex justify-center mb-[6.25rem]">
                <ul className="flex items-center justify-between h-24 gap-5">
                  <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                    <Link to={"/restful"}>Restful Client</Link>
                  </li>
                  <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                    <Link to={"/GRAPHQL"}>Graphiql Client</Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
