import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Form, Input, Tooltip } from "antd";

//Constants
import { FIELD_TYPES, RULES } from "../Constants";
//Helper
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicText({
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
  doNotConsolidateRules = false,
  propConsolidatedRules = {},
  rulesWithMessage,
  disabled,
  //tooltip
  visibilityRules,
}) {
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState(propConsolidatedRules);

  useEffect(() => {
    if(!doNotConsolidateRules){
      setConsolidatedRules(consolidateRulesHelper(rules));
    }
  }, [rules, doNotConsolidateRules]);

  const InputText = (
    <Input
      placeholder={t(placeholder) || t("ENTER")}
      onChange={(e) => {
        setFormValues && setFormValues({ ...formValues, [dataKey]: e?.target?.value });
        onChange && onChange(e);
      }}
      defaultValue={defaultValueString}
      disabled={disabled || consolidatedRules?.[RULES.IS_DISABLED] || false}
      maxLength={parseInt(consolidatedRules?.[RULES.MAX_LENGTH])}
      minLength={parseInt(consolidatedRules?.[RULES.MIN_LENGTH])}
    />
  );

  return (
    <Tooltip title = {
      disabled ? t('TOOLTIP_DISABLED_FIELD_'+ dataKey?.replace(/[0-9]/g, '') + '_' + visibilityRules?.[0]?.dataKey)
        :null} placement="top">
    <div>
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
          disabled ? false :
          consolidatedRules?.[RULES.IS_REQUIRED] ||
          consolidatedRules?.[RULES.REQUIRED] ||
          false
        }
        rules={
          disabled ? null :
          rulesWithMessage || consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey?.replace(/[0-9]/g, ''),
          FIELD_TYPES.TEXT,
          isHidden,
        )}>
        {InputText}
      </Form.Item>
    </div>
    </Tooltip>
  );
}

export default DynamicText;
