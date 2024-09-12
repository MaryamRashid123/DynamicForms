import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DatePicker, Form, Tooltip } from 'antd';
//Ant Design
//Helper
import moment from 'moment';

import { DATE_FORMAT } from '../../../../constants/DateFormatConstants';
import { FIELD_TYPES, RULES } from '../Constants';
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from '../DynamicFormHandler/HelperFunctions';

function DynamicPicker({
  placeholder,
  allowClear,
  format,
  allowDefault,
  defaultValueDate,
  type,
  id,
  value,
  name,
  dataKey,
  onChange,
  isDisabled,
  rules,
  initialValue,
  formValues,
  setFormValues,
  isHidden,
  setCurrentDate,
  form,
  doNotConsolidateRules = false,
  propConsolidatedRules = {},
  rulesWithMessage,
  visibilityRules
}) {
  const { t } = useTranslation();
  const [consolidatedRules, setConsolidatedRules] = useState(propConsolidatedRules);

  useEffect(() => {
    if(!doNotConsolidateRules){
      setConsolidatedRules(consolidateRulesHelper(rules));
    }
  }, [rules, doNotConsolidateRules]);

  const disableDatesFunction = (current) => {
    if (consolidatedRules?.[RULES.ALLOW_FUTURE_DATES]) {
      return false;
    } else {
      return current && current > new Date();
    }
  };

  return (
    <Tooltip title = {
      isDisabled ? t('TOOLTIP_DISABLED_FIELD_'+ dataKey?.replace(/[0-9]/g, '') + '_' + visibilityRules?.[0]?.dataKey)
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
        initialValue={
          setCurrentDate
            ? moment(new Date())
            : defaultValueDate && moment(defaultValueDate)
        }

        rules={
          isDisabled? 
          null :
          [
          ...(rulesWithMessage ? rulesWithMessage : consolidatedRulesWithMessageHelper(
            rules,
            t,
            dataKey?.replace(/[0-9]/g, ''),
            FIELD_TYPES.DATE,
            isHidden,
          )),
          ...(consolidatedRules?.[RULES.ALLOW_FUTURE_DATES] ? [] : [
            {
              validator(_, value) {
                if (value && value.isAfter(moment().endOf('day'))) {
                  return Promise.reject(new Error(t('FUTURE_DATES_NOT_ALLOWED')));
                }
                return Promise.resolve();
              },
            },
          ]),
        ]}     
      >
        {
          <DatePicker
            format={
              format ||
              (type === 'time'
                ? DATE_FORMAT.HOUR_MINUTE_12F
                : DATE_FORMAT.DD_MMM_YYYY)
            }
            allowClear={allowClear}
            placeholder={t(placeholder)}
            onChange={(e) => {
              setFormValues({ ...formValues, [dataKey]: e });
              onChange && onChange(e);
            }}
            disabled={isDisabled}
            disabledDate={disableDatesFunction}
            picker={type || 'date'}
            id={id}
            value={value}
            suffixIcon={<i className="icon-ct-calender-ico"></i>}
          />
        }
      </Form.Item>
    </div>
    </Tooltip>
  );
}

export default DynamicPicker;
