import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Col, Divider, Empty, Form, Input, Row, Select, Tooltip } from "antd";
import useDropdownSearch from "../SearchDropdownHook";
import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
  sortArray,
  dynamicTranslation
} from "../DynamicFormHandler/HelperFunctions";

const { Option } = Select;

function Dropdown({
  name,
  dataKey,
  showSearch,
  placeholder,
  entityType,
  options,
  onChange,
  allowClear,
  defaultValueInt,
  allowAddMore,
  rules,
  loading,
  validator,
  validateTrigger,
  disabled,
  tooltip,
  sortingProp,
  form,
  setFormValues,
  formValues,
  reduxKey,
  isHidden,
  allDropdownValuesLoaded,
  formFieldId,
  doNotConsolidateRules = false,
  propConsolidatedRules = {},
  rulesWithMessage,
  visibilityRules,
  
  apiForAddingItem,
  addDynamicFormRecordService,
  reduxStates: REDUX_STATES
}) {

  const sortBy = [{ prop: sortingProp ? sortingProp : "name", direction: 1 }];
  const { t } = useTranslation();

  const { [reduxKey + dataKey + REDUX_STATES.DYNAMIC_FORM_ADD]: addResponse } =
    useSelector((state) => state?.DynamicFormReducer);

  const [itemName, setName] = React.useState("");
  const [inpError, setInputError] = React.useState("");
  const inputRef = React.useRef(null);

  const { selectionValues, setSelectionValues, handleSearch } =
    useDropdownSearch(allDropdownValuesLoaded, options, formFieldId);
  let sortedOption = sortArray(selectionValues, sortBy);

  const [consolidatedRules, setConsolidatedRules] = useState(propConsolidatedRules);

  useEffect(() => {
    if(!doNotConsolidateRules){
      setConsolidatedRules(consolidateRulesHelper(rules));
    }
  }, [rules, doNotConsolidateRules]);

  useEffect(() => {
    setSelectionValues(options);
  }, [options]);

  const onNameChange = (event) => {
    const regexExp = consolidatedRules?.[RULES.REGULAR_EXP];
    const minLength = consolidatedRules?.[RULES.MIN_LENGTH];
    setName(event.target.value);
    validateInput(event.target.value, regexExp, minLength);
  };

  const validateInput = (value, regexExp, minLength) => {
    //Remove the leading and trailing slashes from regexExp
    const modifiedRegexPattern = regexExp?.slice(1, -1);
    const modifiedRegex = new RegExp(modifiedRegexPattern);
    if (value && !modifiedRegex.test(value)) {
      setInputError(t("VALIDATION_" + [dataKey] + "_" + RULES.REGULAR_EXP));
    } else if (!value) {
      setInputError(t("REQUIRED"));
    } else if (typeof minLength !== "undefined" && value.length < minLength) {
      setInputError(dynamicTranslation(t("ACTIVITY_MINLENGTH"), [minLength]));
    } else {
      setInputError("");
    }
  };

  const navigateFunc = (data) => {
    const newItem = {
      id: data?.result?.id, //addResponse?.id,
      name: itemName,
      selected: false,
    };
    // Update the selectionValues array
    setSelectionValues([...selectionValues, newItem]);
  };

  const addNewDropDownItem = (e) => {
    const exists = options?.some(
      (item) => item?.name?.toLowerCase() === itemName?.toLocaleLowerCase(),
    );
    if (exists) {
      setInputError(dynamicTranslation(t("ITEM_ALREADY_EXISTS", [name])));
    } else {
      const name = itemName;
      e.preventDefault();
      addDynamicFormRecordService(
        {
          name: name,
          enumType: entityType,
        },
        apiForAddingItem,
        reduxKey + dataKey,
        navigateFunc,
      );
      setName("");
      setTimeout((itemName) => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  if (!!validator) {
    rules.push({ validator: validator });
  }

  const validateFieldsOnChange =()=>{
    form?.validateFields([dataKey]);
  }

  const DropdownList = (
    <Select
      onChange={(e, val) => {
        form?.setFieldsValue({ [dataKey]: e });
        setFormValues && setFormValues({ ...formValues, [dataKey]: e });
        validateFieldsOnChange();
        onChange && onChange(e);
      }}
      notFoundContent={
        <>
          {
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <span>
                    {t("NO") +
                      " " +
                      (t(name) || t("RECORD")) +
                      " " +
                      t("FOUND")}{" "}
                  </span>
                </div>
              }
            />
          }
        </>
      }
      getPopupContainer={(trigger) => trigger.parentNode}
      showSearch={showSearch === false ? false : true}
      allowClear={allowClear === false ? false : true}
      onClear={()=>setSelectionValues(options)}
      defaultValue={defaultValueInt}
      placeholder={t(placeholder)}
      onSearch={handleSearch}
      filterOption={false}
      disabled={disabled}
      loading={loading}
      optionFilterProp="title"
      suffixIcon={<i className="icon-drop-down-fill"></i>}
      showArrow={!disabled}
      dropdownRender={
        allowAddMore
          ? (menu) => (
              <>
                {menu}
                <Divider className="my-2" />

                <div className="add-btn-group">
                  <Row className="align-center" gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Input
                        placeholder={dynamicTranslation(
                          t("SELECT_PLACEHOLDER"),
                          [t(name) || t("RECORD")],
                        )}
                        ref={inputRef}
                        value={itemName}
                        onChange={onNameChange}
                        maxLength={consolidatedRules?.[RULES.MAX_LENGTH]}
                        className={`${!!inpError ? "has-input-error" : ""}`}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Button
                        disabled={inpError || !itemName}
                        type="primary"
                        onClick={addNewDropDownItem}>
                        {dynamicTranslation(t("DROPDOWN_ADD_ITEM"), [t(name)])}
                      </Button>
                    </Col>
                  </Row>
                </div>
                {inpError && (
                  <div className="ant-form-item-explain mb-0 mx-4 txt-danger">
                    {inpError}
                  </div>
                )}
              </>
            )
          : ""
      }>
      {sortedOption &&
        sortedOption.map((data, index) => {
          return (
            <Option
              key={index}
              title={data.name}
              value={data.id}
              data={data}
            >
              {data.name}
            </Option>
          );
        })}
    </Select>
  );

  return (
    <Tooltip title = {
      disabled ? t('TOOLTIP_DISABLED_FIELD_'+ dataKey?.replace(/[0-9]/g, '') + '_' + visibilityRules?.[0]?.dataKey)
        :null} placement="top">
    <div>
      {!isHidden && (
        <label>
          {t(name)}
          {consolidatedRules?.[RULES.IS_REQUIRED] && (
            <span className="required">*</span>
          )}
        </label>
      )}
      <Form.Item
        name={dataKey}
        hidden={isHidden}
        required={
          disabled ? false :
            consolidatedRules?.[RULES.IS_REQUIRED] ||
            consolidatedRules?.[RULES.REQUIRED] ||
            false
        }
        validateTrigger={validateTrigger || "onBlur"}
        rules={disabled? 
          null :
          rulesWithMessage || consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey?.replace(/[0-9]/g, ''),
          FIELD_TYPES.DROPDOWN,
          isHidden,
        )}
        >
        {DropdownList}
      </Form.Item>
    </div>
    </Tooltip>
  );
}

export default Dropdown;
