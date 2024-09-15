import { Form, Link, useNavigate } from "@remix-run/react";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  validateEmail,
  validatePassword,
} from "~/components/DataHandling/DataHandling";
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

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleEmailChange = (data: string) => {
    setEmail(data);
    if (!validateEmail(data)) {
      setEmailError(t("error_invalid_email_format"));
    } else {
      setEmailError(null);
    }
  };
  const handlePasswordChange = (data: string) => {
    setPassword(data);
    if (!validatePassword(data)) {
      setPasswordError(t("error_password_validation"));
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
      return navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(t("error_account_not_found"));
        setPassword("");
      } else {
        setPasswordError(t("error_unexpected"));
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
      <h2 className="text-center text-3xl m-2">{t("signin")}</h2>
      <p className="text-center text-xl m-2">
        {t("noaccount")}{" "}
        <Link className="text-blue-800 ml-2" to={"/signUp"}>
          {" "}
          {t("signup")}!
        </Link>
      </p>
      <Form className="flex flex-col items-center" action="/signup">
        {" "}
        <div
          className={`w-80 ${emailError ? "error" : email ? "success" : ""}`}
        >
          <div className="flex justify-between m-2 w-80">
            <label className="text-2xl" htmlFor="email">
              {" "}
              Email{" "}
            </label>
            <InputField
              placeholder={t("email_placeholder")}
              handleChange={handleEmailChange}
              type={"email"}
              autoComplete={"email"}
              id={"email"}
            />
          </div>
          {emailError && (
            <div className="text-red-500 text-xs mt-2">{emailError}</div>
          )}{" "}
        </div>
        <div
          className={`w-80 ${passwordError ? "error" : password ? "success" : ""}`}
        >
          {" "}
          <div className="flex justify-between m-2 w-80">
            {" "}
            <label className="text-2xl" htmlFor="password">
              {" "}
              {t("password")}{" "}
            </label>
            <InputField
              placeholder={t("password_placeholder")}
              handleChange={handlePasswordChange}
              type={"password"}
              autoComplete={"current-password"}
              id={"password"}
            />
          </div>
          {passwordError && (
            <div className="text-red-500 text-xs mt-2">{passwordError}</div>
          )}
        </div>{" "}
        <button
          className="mb-6 bg-blue-500 mx-auto rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
          type="button"
          onClick={signInAction}
        >
          {" "}
          {t("submit")}{" "}
        </button>{" "}
      </Form>{" "}
      {user && (
        <div className="text-sm flex flex-col items-center mt-10">
          {" "}
          <p>
            {" "}
            {user?.emailVerified
              ? t("email_verified")
              : t("email_not_verified")}{" "}
          </p>{" "}
        </div>
      )}{" "}
    </>
  );
};
export default SignIn;
