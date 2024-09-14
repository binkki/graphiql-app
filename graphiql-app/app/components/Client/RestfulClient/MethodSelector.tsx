import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField, MethodSelectorProps } from "~/types";

const MethodSelector = (props: MethodSelectorProps) => {
  const { register, handleSubmit } = useForm<FormField>();
  const { t } = useTranslation();

  const [defaultMethod, setDefaultMethod] = useState("DEFAULT");

  const changeMethod: SubmitHandler<FormField> = async (data) => {
    props.setMethod(data.value === "DEFAULT" ? "" : data.value);
  };

  useEffect(() => {
    if (props.value && props.methods.indexOf(props.value) !== -1) {
      setDefaultMethod(props.value);
    }
  }, [props.value]);

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
        value={defaultMethod ?? "DEFAULT"}
        {...register("value")}
      >
        <option value="DEFAULT">{t("choose-method")}</option>
        {props.methods.map((x: string) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </form>
  );
};

export default MethodSelector;
