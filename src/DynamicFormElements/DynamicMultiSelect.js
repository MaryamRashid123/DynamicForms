/*
  Multi Select Dropdown
*/
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
//Services
import { useSelector } from "react-redux";

// Antd
import { Button, Col, Divider, Empty, Form, Input, Row, Select, Tooltip } from "antd";

import { DROPDOWN_SEARCH_TIMEOUT } from "../../../../constants/General";
import { REDUX_STATES } from "../../../../constants/ReduxStates";
import { APIS } from "../../../../constants/apis";
import { dropdownData, sortArray } from "../../../../helpers/GeneralHelper";
import { dynamicTranslation } from "../../../../helpers/dynamic-translation";
import { viewRecordService } from "../../../../services/CRUD-service";
import { addDynamicFormRecordService } from "../../../../services/DynamicForm-service";
import { FIELD_TYPES, RULES } from "../Constants";
import {
  consolidateRulesHelper,
  consolidatedRulesWithMessageHelper,
} from "../DynamicFormHandler/HelperFunctions";
import useDropdownSearch from "../../../../hooks/searchHook/SearchDropdownHook";

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
  visibilityRules
}) {
  const { t } = useTranslation();
  const sortBy = [{ prop: "name", direction: 1 }];
  // let sortedOption = sortArray(options, sortBy);
  // sortedOption = options;


  const [itemName, setName] = React.useState("");
  const [inpError, setInputError] = React.useState("");

  const inputRef = useRef(null);

  //Redux State
  const { [reduxKey + dataKey + REDUX_STATES.DYNAMIC_FORM_ADD]: addResponse } =
    useSelector((state) => state?.DynamicFormReducer);

  const { selectionValues, setSelectionValues, handleSearch } =
  useDropdownSearch(allDropdownValuesLoaded, options, formFieldId);
  let sortedOption = sortArray(selectionValues, sortBy);
  //sortedOption = selectionValues;

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
        APIS.DROPDOWN_ITEMS.ADD_ITEM,
        REDUX_STATES.ENUM + "_" + dataKey,
        navigateFunc,
      );
      setName("");
      setTimeout((itemName) => {
        inputRef.current?.focus();
      }, 0);
    }
    // onNewItemAdd(
    //   paginated
    //     ? {
    //         ranchId,
    //         name,
    //         PageNo: 1,
    //         PerPage: MAX_DROPDOWN_LOAD_SIZE,
    //         sortBy: SORT_BY_FIELDS.MODIFIED_ON,
    //       }
    //     : { ranchId, name },
    //   setURL,
    //   setKey,
    //   getURL,
    //   getKey,
    //   navigateFunc,
    // );
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
                  {/* {emptyMessage && <p>{emptyMessage}</p>} */}
                </div>
              }
            />
          }
        </>
      }
      getPopupContainer={(trigger) => trigger.parentNode}
      mode="multiple"
      //showArrow
      showArrow={true}
      showSearch={showSearch}
      onSearch={handleSearch}
      filterOption={false}
      suffixIcon={<i className="icon-drop-down-fill"></i>}
      allowClear={allowClear}
      defaultValue={defaultValue}
      placeholder={t(placeholder)}
      // placeholder={dynamicTranslation(t("SELECTDROPDOWN_PLACEHOLDER"), [
      //   placeholder?.toLowerCase() || label?.toLowerCase() || t("RECORDS"),
      // ])}
      onChange={(e) => {
        setFormValues({ ...formValues, [dataKey]: e });
        onChange && onChange(e);
      }}
      // onKeyUp={onKeyUp}
      // onKeyDown={onKeyDown}
      disabled={disabled}
      loading={loading}
      // onClear={onClear && onClear}
      autoClearSearchValue={true}
      // onBlur={onClear && onClear}
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
                        {/* {dynamicTranslation(t("DROPDOWN_ADD_ITEM"), [t(name)])} */}
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
            // <Tooltip title={data?.name} key={data?.value}>
            <Option
              key={index}
              title={data?.name}
              name={data?.name}
              value={data?.id}>
              {data.name}
            </Option>
            // </Tooltip>
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
