import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ClientProps, FormField } from "~/types";

const MethodSelector = (props: ClientProps) => {
  const { register, handleSubmit } = useForm<FormField>();
  const { t } = useTranslation();

  const [defaultMethod, setDefaultMethod] = useState("DEFAULT");

  const changeMethod: SubmitHandler<FormField> = async (data) => {
    props.setRequest({
      ...props.request,
      method: data.value === "DEFAULT" ? "" : data.value,
    });
  };

  useEffect(() => {
    if (props.request.method === "") {
      setDefaultMethod("DEFAULT");
    } else if (
      props.request.method &&
      props.methods &&
      props.methods.indexOf(props.request.method) !== -1
    ) {
      setDefaultMethod(props.request.method);
    }
  }, [props.request.method]);

  return (
    <form
      onChange={handleSubmit(changeMethod)}
      className="flex justify-start items-center gap-2"
    >
      <label htmlFor={props.id} className="block h-fit">
        {t("method")}
      </label>
      <select
        id={props.id}
        className="border border-gray-500 rounded-lg text-gray-600 text-base py-2.5 px-4 w-fit focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-pointer hover:cursor-pointer"
        value={defaultMethod}
        {...register("value")}
      >
        <option value="DEFAULT">{t("choose-method")}</option>
        {props.methods &&
          props.methods.map((x: string) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
      </select>
    </form>
  );
};

export default MethodSelector;
