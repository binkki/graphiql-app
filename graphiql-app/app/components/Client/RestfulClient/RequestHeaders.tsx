import { useState } from "react";
import { ClientProps, RequestHeader } from "~/types";
import HeaderItem from "./HeaderItem";
import { defaultHeaders } from "~/utils/constants";
import { useTranslation } from "react-i18next";

const RequestHeaders = (props: ClientProps) => {
  const [items, setItems] = useState<RequestHeader[]>([]);
  const { t } = useTranslation();

  const createHeader = () => {
    setItems([
      ...items,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const addHeader = (index: number, key: string, value: string) => {
    const newItems = items;
    newItems[index].key = key;
    newItems[index].value = value;
    setHeader(newItems);
  };

  const deleteHeader = (index: number) => {
    const newItems = items.filter(
      (x: RequestHeader) => items.indexOf(x) !== index,
    );
    setHeader(newItems);
  };

  const setHeader = (newItems: RequestHeader[]) => {
    setItems(newItems);
    props.setRequest({
      ...props.request,
      headers: [...defaultHeaders, ...newItems],
    });
  };

  return (
    <div id={props.id} className="flex flex-col gap-2">
      <button
        className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
        onClick={createHeader}
      >
        {t("create-header")}
      </button>
      {items.length > 0 &&
        items.map((x: RequestHeader, index: number) => (
          <div key={`header-${index}`}>
            <HeaderItem
              index={index}
              headerKey={x.key}
              headerValue={x.value}
              addHeader={addHeader}
              deleteHeader={deleteHeader}
            />
          </div>
        ))}
    </div>
  );
};

export default RequestHeaders;
