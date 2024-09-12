import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { dropdownData } from "./DynamicFormHandler/HelperFunctions";

const useDropdownSearch = (allDropdownValuesLoaded, options, formFieldId) => {

  const [selectionValues, setSelectionValues] = React.useState(options);

  const typingTimer = useRef(null);

  // on destroy
  useEffect(() => {
    return () => {
      clearTimeout(typingTimer.current);
    };
  }, []);

  const searchNav = (response) => {
    setSelectionValues(dropdownData(response, "id", "name", null, null, null, "id").concat(options));
  };

  const handleSearch = (value) => {
    if (allDropdownValuesLoaded) {
      const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase()),
      );
      setSelectionValues(filteredOptions);
    } 
  };

  return { selectionValues, setSelectionValues, handleSearch };
};

export default useDropdownSearch;
