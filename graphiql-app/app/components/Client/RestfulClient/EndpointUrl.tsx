import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField, RestfulEndpointProps } from "~/types";

const EndpointUrl = (props: RestfulEndpointProps) => {
  const { register, handleSubmit } = useForm<FormField>();
  const { t } = useTranslation();

  const changeUrl: SubmitHandler<FormField> = async (data) => {
    props.setEndpointUrl(data.value);
  };

  return (
    <form
      onChange={handleSubmit(changeUrl)}
      onBlur={handleSubmit(changeUrl)}
      className="flex justify-start items-center gap-2"
    >
      <label htmlFor={props.id} className="block h-fit">
        {t("endpoint-url")}
      </label>
      <input
        type="text"
        id={props.id}
        className="border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
        placeholder={t("endpoint-url")}
        defaultValue={props.defaultValue}
        {...register("value")}
      />
    </form>
  );
};

export default EndpointUrl;
