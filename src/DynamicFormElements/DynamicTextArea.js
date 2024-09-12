import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Form, Input } from "antd";

//Helper
import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicTextArea({
  name,
  dataKey,
  placeholder,
  defaultValueString,
  rules,
  form,
  formValues,
  setFormValues,
  onChange,
  isHidden,
}) {
  const { t } = useTranslation();
  const { TextArea } = Input;

  const [consolidatedRules, setConsolidatedRules] = useState({});

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const InputText = (
    <TextArea
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      style={{ height: "100px" }}
      placeholder={t(placeholder) || t("ENTER")}
      defaultValue={defaultValueString}
      disabled={consolidatedRules?.[RULES.IS_DISABLED]}
      maxLength={consolidatedRules?.[RULES.MAX_LENGTH]}
      minLength={consolidatedRules?.[RULES.MIN_LENGTH]}
    />
  );

  return (
    <>
      <label>
        {t(name)}
        {(consolidatedRules?.[RULES.IS_REQUIRED] ||
          consolidatedRules?.[RULES.REQUIRED]) && (
          <span className="required">*</span>
        )}
      </label>

      <Form.Item
        name={dataKey}
        hidden={isHidden}
        validateTrigger={"onBlur"}
        rules={consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey,
          FIELD_TYPES.TEXTAREA,
          isHidden,
        )}>
        {InputText}
      </Form.Item>
    </>
  );
}

export default DynamicTextArea;
