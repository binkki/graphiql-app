import { Link } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../utils/userSchema";

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ resolver: yupResolver(userSchema), mode: "onChange" });

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
  };
  return (
    <>
      <h2 className="text-center text-3xl m-2">Sign In</h2>
      <p className="text-center text-xl m-2">
        Do not have an account yet?
        <Link className="text-blue-800 ml-2" to={"/signin"}>
          Sign Up!
        </Link>
      </p>
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center m-2">
          <label className="text-2xl" htmlFor="email">
            Email
          </label>
          <input
            {...register("email")}
            className="border-solid border-2 rounded-2xl ml-11 px-2"
            type="email"
            formNoValidate={true}
          />
        </div>
        <div className="text-red-500 min-h-6">{errors.email?.message}</div>
        <div className="flex justify-center m-2">
          <label className="text-2xl" htmlFor="password">
            Password
          </label>
          <input
            {...register("password")}
            className="border-solid border-2 rounded-2xl mx-2 px-2"
            type="password"
          />
        </div>
        <div className="text-red-500 min-h-10">{errors.password?.message}</div>
        <button
          disabled={!isDirty || !isValid}
          className="text-2xl mt-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
}
