import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Form, Input } from "antd";

//Constants
import { FIELD_TYPES, RULES } from "../Constants";
//Helper
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicPassword({
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

  const FORM_NAME_TRIMMER = /^\s+/;

  const [consolidatedRules, setConsolidatedRules] = useState({});

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const InputPassword = (
    <Input.Password
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      placeholder={placeholder || t("ENTER")}
      defaultValue={defaultValueString}
      disabled={consolidatedRules?.[RULES.IS_DISABLED] || false}
      maxLength={consolidatedRules?.[RULES.MAX_LENGTH]}
      minLength={consolidatedRules?.[RULES.MIN_LENGTH]}
    />
  );

  return (
    <>
      <label>
        {t(name)}
        {consolidatedRules?.[RULES.IS_REQUIRED] && (
          <span className="required">*</span>
        )}
      </label>
      <Form.Item
        name={dataKey}
        hidden={isHidden}
        validateTrigger={"onBlur"}
        normalize={(value) => value.replace(FORM_NAME_TRIMMER, "")}
        rules={consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey,
          FIELD_TYPES.PASSWORD,
          isHidden,
        )}>
        {InputPassword}
      </Form.Item>
    </>
  );
}

export default DynamicPassword;
