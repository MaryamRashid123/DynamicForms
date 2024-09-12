/*
  Input Text
*/
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DatePicker, Form } from "antd";

import { FIELD_TYPES, RULES, DATE_FORMAT } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicRangePicker({
  format,
  name,
  dataKey,
  placeholder,
  defaultValueDateArray, // ["2021-09-01", "2021-09-02"]
  rules,
  disabledArray, // [true, false] // represents if start date or end date are disabled
  formValues,
  setFormValues,
  onChange,
  isHidden,
}) {
  const { RangePicker } = DatePicker;
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState({});

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const disableDatesFunction = (current) => {
    return (
      current &&
      current > consolidatedRules?.[RULES.MIN_DATE] &&
      current < consolidatedRules?.[RULES.MAX_DATE]
    );
  };

  return (
    <>
      {!isHidden && (
        <label>
          {name}
          {consolidatedRules?.[RULES.IS_REQUIRED] && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <Form.Item
        name={dataKey}
        hidden={isHidden}
        //rules={[{ required: consolidatedRules?.[RULES.IS_REQUIRED], message: t('REQUIRED') },]}>
        rules={consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey,
          FIELD_TYPES.RADIO_BUTTON,
          isHidden,
        )}>
        <RangePicker
          format={format || DATE_FORMAT.MONTH_SLASH_DAY_SLASH_YEAR_MOMENT}
          onChange={(e) => {
            setFormValues({ ...formValues, [dataKey]: e });
            onChange && onChange(e);
          }}
          allowClear={true}
          defaultValue={defaultValueDateArray}
          placeholder={placeholder}
          disabled={disabledArray}
          disabledDate={disableDatesFunction}
          picker={"date"}
          suffixIcon={<i className="icon-ct-calender-ico"></i>}
        />
      </Form.Item>
    </>
  );
}

export default DynamicRangePicker;
