import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Form } from "antd";

//Helper
import { consolidateRulesHelper } from "../DynamicFormHandler/HelperFunctions";

function DynamicCheckTag({
  name,
  dataKey,
  onChange,
  isDisabled,
  rules,
  notwrapInForm,
  tooltip,
  options,
}) {
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState({});
  const [selectedTags, setSelectedTags] = React.useState([]);

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  // Input Text
  const Buttons = (
    <Checkbox.Group name={name} disabled={isDisabled} onChange={onChange}>
      {options?.map((opt, index) => {
        const { name, value } = opt || {};

        return (
          <CheckableTag
            key={index}
            value={value}
            checked={selectedTags.indexOf(value) > -1}
            onChange={(checked) => handleChange(value, checked)}>
            {name}
          </CheckableTag>
        );
      })}
    </Checkbox.Group>
  );

  return !!notwrapInForm ? (
    <>{Buttons}</>
  ) : (
    <Form.Item name={dataKey} rules={consolidatedRules} tooltip={tooltip}>
      {Buttons}
    </Form.Item>
  );
}

export default DynamicCheckTag;
