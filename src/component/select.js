import { useEffect, useState } from "react";
import Select from "react-select";

const SelectField = ({
  field,
  setFieldValue,
  defaultValue = "",
  options,
  ...props
}) => {
  const [selectedVal, setSelectedVal] = useState("");
  useEffect(() => {
    if (selectedVal === null) {
      if (typeof defaultValue === "string") {
        setSelectedVal(options.find((e) => e.value === defaultValue) || null);
      }
    }

    if (!defaultValue) {
      setSelectedVal(options.find((e) => e.value === defaultValue) || null);
    }
  }, [defaultValue, options, selectedVal]);
  return (
    <Select
      {...props}
      name={field}
      id={field}
      value={selectedVal}
      placeholder={`Select ${field}`}
      options={options}
      // defaultValue={options.find((e: any) => defaultValue == e.value)}
      // defaultInputValue={defaultValue}
      isSearchable={false}
      onChange={(selectedOption) => {
        console.log("here", selectedOption, field);
        setSelectedVal(selectedOption);
        setFieldValue(field, selectedOption?.value);
      }}
      styles={{
        control: (provided, state) => ({
          ...provided,
          padding: "2px", // Add your desired padding here
          //   borderColor: "#E9E9E9",
          borderWidth: "2px",
          "&:hover": {
            borderColor: "#B9B9B9",
          },
          borderColor: "#E9E9E9", // Set focus border color
          "&:focus": {
            borderColor: "'#C4C4C4", // Set focus border color to blue
          },
          "&:active": {
            borderColor: "darkgray", // Set active border color to desired color
          },
          boxShadow: state.isFocused ? "0 0 0 0 darkgray" : "none", // Optional: add box shadow when focused
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: "200px", // Adjust the maximum height of the dropdown menu
          overflowY: "auto", // Enable vertical scrolling
          borderRadius: "4px", // Optional: add border radius to the dropdown
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: "200px", // Set the maximum height for the dropdown list
          overflowY: "auto", // Enable vertical scrolling
        }),
      }}
      isClearable
    />
  );
};

export default SelectField;
