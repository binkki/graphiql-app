import { Link } from "@remix-run/react";

export default function Signup() {
  return (
    <>
      <h2 className="text-center text-3xl m-2">Sign Up</h2>
      <p className="text-center text-xl m-2">
        Already have an account?
        <Link className="text-blue-800 ml-2" to={"/signin"}>
          Sign In!
        </Link>
      </p>
      <form className="flex flex-col items-center">
        <div className="flex justify-center m-2">
          <label className="text-2xl" htmlFor="email">
            Email
          </label>
          <input
            className="border-solid border-2 rounded-2xl ml-11"
            type="email"
            formNoValidate={true}
          />
        </div>
        <div className="flex justify-center m-2">
          <label className="text-2xl" htmlFor="password">
            Password
          </label>
          <input
            className="border-solid border-2 rounded-2xl mx-2"
            type="password"
          />
        </div>
        <button
          className="text-2xl mt-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
}
