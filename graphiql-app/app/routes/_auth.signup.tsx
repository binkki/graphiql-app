import { Form } from "@remix-run/react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import InputField from "../components/Input/Input";
import { auth } from "../firebase";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    email: string;
    error: string;
    emailVerified: boolean;
  } | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",
      );
    } else {
      setPasswordError(null);
    }
  };

  const signUpAction = async () => {
    if (emailError || passwordError) return;

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCred.user;

      await sendEmailVerification(user);
      console.log("Success");

      // Clear the input fields
      setEmail("");
      setPassword("");

      // Optionally refresh the page
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during registration:", error.message);
        setPasswordError("Registration failed. Please try again.");
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
    <div className="register w-screen h-screen flex items-center justify-center">
      <div className="register_container w-80 flex flex-col items-center text-center p-8 border border-gray-300 rounded-lg">
        <Form
          action="/signup"
          method="post"
          className="form-control flex flex-col items-center text-center"
        >
          <div
            className={`input-container ${emailError ? "error" : email ? "success" : ""}`}
          >
            <InputField
              placeholder={"E-mail Address"}
              handleChange={handleEmailChange}
              type={"email"}
            />
            {emailError && (
              <div className="text-red-500 text-xs mt-2">{emailError}</div>
            )}
          </div>
          <div
            className={`input-container ${passwordError ? "error" : password ? "success" : ""}`}
          >
            <InputField
              placeholder={"Password"}
              handleChange={handlePasswordChange}
              type={"password"}
            />
            {passwordError && (
              <div className="text-red-500 text-xs mt-2">{passwordError}</div>
            )}
          </div>
          <button
            className="mt-7 p-2 text-lg mb-4 border-none text-white bg-orange-500 rounded-lg transition duration-300 hover:bg-orange-700"
            type="button"
            onClick={signUpAction}
          >
            Sign Up
          </button>
        </Form>
        <div className="text-sm">
          Already have an account?{" "}
          <a className="text-orange-500 hover:text-orange-900" href="/signin">
            Login
          </a>{" "}
          now.
        </div>
        {user && (
          <div className="text-sm">
            <p>{user?.email}</p>
            <p>
              {user?.emailVerified ? "Email verified!" : "Email not verified!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
