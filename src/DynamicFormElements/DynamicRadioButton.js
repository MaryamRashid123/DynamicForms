/*
  Radio Buttons
*/
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Form, Radio } from "antd";

import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicRadioButton({
  name,
  dataKey,
  defaultValueInt,
  selectionValues,
  rules,
  tooltip,
  className,
  form,
  setFormValues,
  formValues,
  isHidden,
}) {
  const { t } = useTranslation();

  const [consolidatedRules, setConsolidatedRules] = useState({});

  useEffect(() => {
    setConsolidatedRules(consolidateRulesHelper(rules));
  }, [rules]);

  const Buttons = (
    <Radio.Group
      name={dataKey}
      buttonStyle={"solid"}
      onChange={(e) =>
        setFormValues({ ...formValues, [dataKey]: e.target.value })
      }
      disabled={consolidatedRules?.[RULES.IS_DISABLED] || false}
      defaultValue={defaultValueInt}>
      {selectionValues?.map((opt, index) => {
        const { name, id, selected } = opt || {};
        return (
          <Radio.Button key={index} value={id} selected={selected}>
            {t(name)}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );

  return (
    <Form.Item
      className={className}
      name={dataKey}
      hidden={isHidden}
      //rules={[{ required: consolidatedRules?.[RULES.IS_REQUIRED], message: t('REQUIRED') }]}
      rules={consolidatedRulesWithMessageHelper(
        rules,
        t,
        dataKey,
        FIELD_TYPES.RADIO_BUTTON,
        isHidden,
      )}
      tooltip={tooltip}>
      {Buttons}
    </Form.Item>
  );
}

export default DynamicRadioButton;
