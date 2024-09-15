import { defaultRestfulResponseState, restMethods } from "~/utils/constants";
import { decodeUrlFromBase64, generateRequest } from "~/utils/utils";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { i18nCookie } from "~/cookie";
import RestfulClient from "~/components/Client/RestfulClient/RestfulClient";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "~/firebase";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const locale = (await i18nCookie.parse(cookieHeader)) || "en";
  const url = request.url;
  const restRequest = JSON.parse(decodeUrlFromBase64(url));
  let restResponse = defaultRestfulResponseState;

  try {
    if (restMethods.indexOf(restRequest.method) === -1) return redirect("/404");
    const options = generateRequest(restRequest);

    await fetch(restRequest.endpointUrl, options.body)
      .then((response) => {
        restResponse = {
          ...restResponse,
          status: `${response.status}`,
        };
        return response.text();
      })
      .then((value) => {
        restResponse = {
          ...restResponse,
          body: value,
        };
      });
  } catch (e) {
    return json({ locale, e });
  }
  return json({ locale, restRequest, restResponse });
};

export default function Restful() {
  const { restRequest, restResponse } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        return navigate("/");
      }
    });
    return () => listen();
  }, []);

  return (
    <RestfulClient
      restfulRequest={restRequest}
      restfulResponse={restResponse}
    />
  );
}
