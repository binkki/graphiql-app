import { useEffect, useState } from "react";
import { EditedUrlProps } from "~/types";

const EditedURL = (props: EditedUrlProps) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(props.url);
  }, [props.url]);

  return (
    <div className="flex justify-start items-center gap-2">
      <input
        readOnly
        type="text"
        id={props.id}
        className="border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-full focus:outline-none focus:cursor-default hover:cursor-default"
        value={url}
      />
    </div>
  );
};

export default EditedURL;
