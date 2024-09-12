import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Form, Input } from "antd";

import "../../../common/FormElements/Text/style.scss";
//Constants
import { FIELD_TYPES, RULES } from "../Constants";
//Helper
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicEmail({
  name,
  dataKey,
  placeholder,
  defaultValueString,
  rules,
  visibilityRules,
  form,
  formValues,
  setFormValues,
  onChange,
  isHidden,
}) {
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState({});

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const InputText = (
    <Input
      placeholder={t(placeholder) || t("ENTER")}
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      defaultValue={defaultValueString}
      disabled={consolidatedRules?.[RULES.IS_DISABLED] || false}
      maxLength={parseInt(consolidatedRules?.[RULES.MAX_LENGTH])}
      minLength={parseInt(consolidatedRules?.[RULES.MIN_LENGTH])}
    />
  );

  return (
    <>
      {!isHidden && (
        <label>
          {t(name)}
          {(consolidatedRules?.[RULES.IS_REQUIRED] ||
            consolidatedRules?.[RULES.REQUIRED]) && (
            <span className="required">*</span>
          )}
        </label>
      )}
      <Form.Item
        name={dataKey}
        hidden={isHidden}
        validateTrigger={"onBlur"}
        required={
          consolidatedRules?.[RULES.IS_REQUIRED] ||
          consolidatedRules?.[RULES.REQUIRED] ||
          false
        }
        rules={[
          { type: "email", message: t("VALIDATION_" + [dataKey] + "_Email") },
          ...consolidatedRulesWithMessageHelper(
            rules,
            t,
            dataKey,
            FIELD_TYPES.EMAIL,
            isHidden,
          ),
        ]}>
        {InputText}
      </Form.Item>
    </>
  );
}

export default DynamicEmail;
