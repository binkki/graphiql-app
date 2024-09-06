import { Form, Link, useNavigate } from "@remix-run/react";
import {
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validateEmail } from "~/components/DataHandling/DataHandling";
import { auth } from "~/firebase";
import InputField from "../components/Input/Input";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    email: string;
    error: string;
    emailVerified: boolean;
  } | null>(null);
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

  const navigate = useNavigate();
  const { t } = useTranslation();

  const validatePassword = (password: string) => {
    const unicodeRegex = /[\p{L}\p{N}\p{P}\p{S}]/u;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

    return passwordRegex.test(password) && unicodeRegex.test(password);
  };

  const handleEmailChange = (data: string) => {
    setEmail(data);
    if (!validateEmail(data)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (data: string) => {
    setPassword(data);
    if (!validatePassword(data)) {
      setPasswordError(
        "Password must include at least one letter, one digit and one special symbol",
      );
    } else {
      setPasswordError(null);
    }
  };

  const signInAction = async () => {
    if (emailError || passwordError) return;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await sendEmailVerification(user);
      setEmail(" ");
      setPassword(" ");
      // console.log("Success");
      navigate("/"); // Redirect to the main page
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error when logging into the account:", error.message);
        setPasswordError(
          "Sorry, your account was not found. Please check if the data you entered is correct or re-register.",
        );
        setPassword("");
      } else {
        console.error("Unexpected error:", error);
        setPasswordError("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const { email, emailVerified } = userCred;
        setUser({
          email: email ?? "",
          emailVerified: emailVerified ?? false,
          error: "",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {authUser ? (
        <>
          <h2 className="text-center mb-12">
            {t("you_are_already_logged_in")}
          </h2>
        </>
      ) : (
        <>
          <h2 className="text-center text-3xl m-2">{t("signin")}</h2>
          <p className="text-center text-xl m-2">
            {t("noaccount")}
            <Link className="text-blue-800 ml-2" to={"/signUp"}>
              {" "}
              {t("signup")}!
            </Link>
          </p>
          <Form className="flex flex-col items-center" action="/signup">
            <div
              className={`w-80 ${emailError ? "error" : email ? "success" : ""}`}
            >
              <div className="flex justify-between m-2 w-80">
                <label className="text-2xl" htmlFor="email">
                  {" "}
                  Email{" "}
                </label>
                <InputField
                  placeholder={"E-mail Address"}
                  handleChange={handleEmailChange}
                  type={"email"}
                  autoComplete={"email"}
                  id={"email"}
                />
              </div>
              {emailError && (
                <div className="text-red-500 text-xs mt-2">{emailError}</div>
              )}
            </div>
            <div
              className={`w-80 ${passwordError ? "error" : password ? "success" : ""}`}
            >
              <div className="flex justify-between m-2 w-80">
                <label className="text-2xl" htmlFor="password">
                  {" "}
                  Password{" "}
                </label>
                <InputField
                  placeholder={"Password"}
                  handleChange={handlePasswordChange}
                  type={"password"}
                  autoComplete={"current-password"}
                  id={"password"}
                />
              </div>
              {passwordError && (
                <div className="text-red-500 text-xs mt-2">{passwordError}</div>
              )}
            </div>
            <button
              className="text-2xl mt-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center"
              type="button"
              onClick={signInAction}
            >
              {t("submit")}
            </button>
          </Form>
          {user && (
            <div className="text-sm flex flex-col items-center mt-10">
              {/* <p>{user?.email}</p> */}
              <p>
                {user?.emailVerified
                  ? "Email verified!"
                  : "Email not verified!"}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SignIn;
