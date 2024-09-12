import React, { useEffect, useState } from "react";
//Translation
import { useTranslation } from "react-i18next";

//Ant Design
import { Checkbox, Form, Row } from "antd";

//Helper
import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";

function DynamicCheckBox({
  name,
  dataKey,
  onChange,
  rules,
  tooltip,
  selectionValues,
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
    <Checkbox.Group
      name={dataKey}
      disabled={consolidatedRules?.[RULES.IS_DISABLED]}
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}>
      {
        <Row>
          {selectionValues?.map((opt, index) => {
            const { id, name, selected } = opt || {};
            return (
              <Checkbox key={index} value={id} selected={selected}>
                {name}
              </Checkbox>
            );
          })}
        </Row>
      }
    </Checkbox.Group>
  );

  return (
    <Form.Item
      name={dataKey}
      hidden={isHidden}
      // rules={[
      //   {
      //     required: consolidatedRules?.[RULES.IS_REQUIRED],
      //     message: t("REQUIRED"),
      //   },
      // ]}
      rules={consolidatedRulesWithMessageHelper(
        rules,
        t,
        dataKey,
        FIELD_TYPES.CHECKBOX,
        isHidden,
      )}
      tooltip={tooltip}>
      {Buttons}
    </Form.Item>
  );
}

export default DynamicCheckBox;
