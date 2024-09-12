import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Form, InputNumber, Tooltip } from "antd";

import "../../../common/FormElements/Number/style.scss";
import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicNumber({
  name,
  dataKey,
  placeholder,
  visibilityRules,
  hidden,
  rules,
  suffix, //represents the unit/currency of the number
  step,
  precision,
  defaultValueInt,
  defaultValueDouble,
  isInteger, // if the fieldType is "Number" isInteger is true, if the fieldType is "Decimal" isInteger is false
  form,
  formValues,
  setFormValues,
  onChange,
  isHidden,
  doNotConsolidateRules = false,
  propConsolidatedRules = {},
  rulesWithMessage,
  disabled
}) {
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState(propConsolidatedRules);

  useEffect(() => {
    if(!doNotConsolidateRules){
      setConsolidatedRules(consolidateRulesHelper(rules));
    }
  }, [rules, doNotConsolidateRules]);
  
  // Input Field
  const Field = (
    <InputNumber
      hidden={isHidden}
      placeholder={t(placeholder)}
      onChange={(e) => {
        setFormValues && setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      disabled={disabled || consolidatedRules?.[RULES.IS_DISABLED] || false}
      min={consolidatedRules?.[RULES.MIN]}
      max={consolidatedRules?.[RULES.MAX]}
      step={step}
      precision={precision}
      formatter={(value) => {
        // Split the value into integer and decimal parts
        const [integerPart, decimalPart] = value.split(".");

        // Format the integer part with commas
        const formattedIntegerPart = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ",",
        );

        // If there is a decimal part, add it back
        const formattedValue = decimalPart
          ? `${formattedIntegerPart}.${decimalPart}`
          : formattedIntegerPart;

        return isInteger ? value && parseInt(value) : formattedValue;
      }}
      parser={(value) => {
        // Remove commas before parsing
        return isInteger
          ? parseInt(value.replace(/\D/g, ""), 10)
          : value?.replace(/,/g, "");
      }}
      className="inputNumberCont"
      value={isInteger ? defaultValueInt : defaultValueDouble}
    />
  );

  return (
    <Tooltip title = {
      disabled ? t('TOOLTIP_DISABLED_FIELD_'+ dataKey?.replace(/[0-9]/g, '') + '_' + visibilityRules?.[0]?.dataKey)
        :null} placement="top">
    <div className="fieldCont">
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
        rules={disabled? 
          null :
          rulesWithMessage || consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey?.replace(/[0-9]/g, ''),
          isInteger ? FIELD_TYPES.NUMBER : FIELD_TYPES.DECIMAL,
          isHidden,
        )}
        validateTrigger={"onBlur"}
        className={"inputNumber"}
        //tooltip={tooltip}
        >
        {Field}
      </Form.Item>
      {suffix && !isHidden && <div className="rulesValue">{suffix}</div>}
    </div>
    </Tooltip>
  );
}

export default DynamicNumber;
