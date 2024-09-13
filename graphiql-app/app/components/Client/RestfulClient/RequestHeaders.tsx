import { useState } from "react";
import { HeadersProps, RequestHeader } from "~/types";
import HeaderItem from "./HeaderItem";
import { defaultHeaders } from "~/utils/constants";

const RequestHeaders = (props: HeadersProps) => {
  const [items, setItems] = useState<RequestHeader[]>([]);

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
    setItems(newItems);
    props.setHeader([...defaultHeaders, ...newItems]);
  };

  const deleteHeader = (index: number) => {
    const newItems = items.filter(
      (x: RequestHeader) => items.indexOf(x) !== index,
    );
    setItems(newItems);
    props.setHeader([...defaultHeaders, ...newItems]);
  };

  return (
    <div id={props.id} className="flex flex-col gap-2">
      <button
        className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
        onClick={createHeader}
      >
        Create Header
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
