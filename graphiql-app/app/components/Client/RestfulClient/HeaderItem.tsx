import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HeaderItemProps, RequestHeader } from "../../../types";

const HeaderItem = (props: HeaderItemProps) => {
  const [add, setAdd] = useState(false);
  const { register, handleSubmit } = useForm<RequestHeader>();
  const { t } = useTranslation();

  const addNewHeader: SubmitHandler<RequestHeader> = async (data) => {
    props.addHeader(props.index, data.key, data.value);
    setAdd(true);
  };

  const deleteHeader = () => {
    props.deleteHeader(props.index);
  };

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit(addNewHeader)}
    >
      <label htmlFor="new-header-key">{t("key")}</label>
      <input
        id="new-header-key"
        placeholder={t("key")}
        className="border border-gray-500 rounded-lg text-gray-600 text-base py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
        {...register("key", { required: true })}
      />
      <label htmlFor="new-header-value">{t("value")}</label>
      <input
        id="new-header-key"
        placeholder={t("value")}
        className="border border-gray-500 rounded-lg text-gray-600 text-base py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
        {...register("value", { required: true })}
      />
      <div className="flex gap-2">
        <button
          className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
          type="submit"
        >
          {!add ? t("add") : t("edit")}
        </button>
        <button
          className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
          type="reset"
          onClick={deleteHeader}
        >
          {t("delete")}
        </button>
      </div>
    </form>
  );
};

export default HeaderItem;
