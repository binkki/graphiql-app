import { useState } from "react";
import PropTypes from "prop-types";

const InputField: React.FC<{
  placeholder: string;
  handleChange: (value: string) => void;
  type: string;
}> = ({ placeholder, handleChange, type }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    handleChange(event.target.value);
  };

  return (
    <input
      className="p-2 text-base mb-4 border rounded-lg border-gray-300 outline-none"
      value={inputValue}
      type={type}
      placeholder={placeholder}
      onChange={handleChangeEvent}
    />
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputField;
