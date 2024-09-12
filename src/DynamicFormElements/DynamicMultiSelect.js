/*
  Multi Select Dropdown
*/
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Antd
import { Button, Col, Divider, Empty, Form, Input, Row, Select, Tooltip } from "antd";

import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
  sortArray,
  dynamicTranslation
} from "../DynamicFormHandler/HelperFunctions";
import useDropdownSearch from "../SearchDropdownHook";

const { Option } = Select;

function DynamicMultiSelect({
  name,
  dataKey,
  showSearch,
  placeholder,
  entityType,
  allowAddMore,
  options,
  onChange,
  defaultValue,
  allowClear,
  disabled = false,
  loading,
  validator,
  validateTrigger,
  isEdit,
  rules,
  isFilter,
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
  const { t } = useTranslation();
  const sortBy = [{ prop: "name", direction: 1 }];


  const [itemName, setName] = React.useState("");
  const [inpError, setInputError] = React.useState("");

  const inputRef = useRef(null);

  const { selectionValues, setSelectionValues, handleSearch } =
  useDropdownSearch(allDropdownValuesLoaded, options, formFieldId);
  let sortedOption = sortArray(selectionValues, sortBy);


  const [consolidatedRules, setConsolidatedRules] = React.useState(propConsolidatedRules);

  useEffect(() => {
    if(!doNotConsolidateRules){
      setConsolidatedRules(consolidateRulesHelper(rules));
    }
  }, [rules, doNotConsolidateRules]);

  const onNameChange = (event) => {
    const isValid = consolidatedRules?.[RULES.REGULAR_EXP];
    const minLength = consolidatedRules?.[RULES.MIN_LENGTH];
    setName(event.target.value);
    validateInput(event.target.value, isValid, minLength);
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

  useEffect(() => {
    setSelectionValues(options);
  }, [options]);

  const navigateFunc = (data) => {
    const newItem = {
      id: data?.result?.id,
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
        REDUX_STATES.ENUM + "_" + dataKey,
        navigateFunc,
      );
      setName("");
      setTimeout((itemName) => {
        inputRef.current?.focus();
      }, 0);
    }
    setName("");
    setTimeout((itemName) => {
      inputRef.current?.focus();
    }, 0);
  };

  const DropdownList = (
    <Select
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
      mode="multiple"
      showArrow={true}
      showSearch={showSearch}
      onSearch={handleSearch}
      filterOption={false}
      suffixIcon={<i className="icon-drop-down-fill"></i>}
      allowClear={allowClear}
      defaultValue={defaultValue}
      placeholder={t(placeholder)}
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      disabled={disabled}
      loading={loading}
      autoClearSearchValue={true}
      optionFilterProp="title"
      maxTagCount="responsive"
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
                        maxLength={50}
                        className={`${!!inpError ? "has-input-error" : ""}`}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Button
                        disabled={inpError || !itemName}
                        type="primary"
                        onClick={addNewDropDownItem}>
                        {t("ADD_MULTISELECTION_ITEM")}
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
              title={data?.name}
              name={data?.name}
              value={data?.id}>
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
        validateTrigger={validateTrigger || "onBlur"}
        required={
          disabled? 
          false :
          consolidatedRules?.[RULES.IS_REQUIRED] ||
          consolidatedRules?.[RULES.REQUIRED] ||
          false
        }
        rules={
          disabled? 
          null :
          rulesWithMessage || consolidatedRulesWithMessageHelper(
          rules,
          t,
          dataKey?.replace(/[0-9]/g, ""),
          FIELD_TYPES.MULTISELECT,
          isHidden,
        )}>
        {DropdownList}
      </Form.Item>
    </div>
    </Tooltip>
  );
}

export default DynamicMultiSelect;
