import React, { useEffect, useState } from "react";

import { Button, Col, Divider, Form, Row } from "antd";
import moment from "moment";

import { FIELD_TYPES } from "../Constants";
import {
  DynamicCheckBox,
  DynamicDropdown,
  DynamicEmail,
  DynamicMultiSelect,
  DynamicNumber,
  DynamicPassword,
  DynamicPicker,
  DynamicRadioButton,
  DynamicRangePicker,
  DynamicText,
  DynamicTextArea,
} from "../DynamicFormElements";
import { checkVisibilityRules, getAllDefaultValues } from "./HelperFunctions";

const renderFieldsInAGroup = (
  fieldsInAGroup,
  formValues,
  setFormValues,
  form,
  reduxKey,
) => {
  return fieldsInAGroup?.map((formItem, index) => {
    const { fieldType } = formItem;
    switch (fieldType) {
      case FIELD_TYPES.TEXT:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className={
                formItem?.isHidden
                  ? "form-group custom-group d-none"
                  : "form-group custom-group"
              }>
              <DynamicText
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                defaultValueString={formItem?.defaultValueString}
                rules={formItem?.rules}
                visibilityRules={formItem?.visibilityRules}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.NUMBER:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className={
                formItem?.isHidden
                  ? "form-group custom-group d-none"
                  : "form-group custom-group"
              }>
              <DynamicNumber
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                rules={formItem?.rules}
                tooltip={formItem?.tooltip}
                suffix={formItem?.fieldSuffix}
                step={formItem?.step}
                precision={formItem?.precision}
                defaultValueInt={formItem?.defaultValueInt}
                isInteger={true}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.DECIMAL:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className={
                formItem?.isHidden
                  ? "form-group custom-group d-none"
                  : "form-group custom-group"
              }>
              <DynamicNumber
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                rules={formItem?.rules}
                tooltip={formItem?.tooltip}
                suffix={formItem?.fieldSuffix}
                step={formItem?.step}
                precision={formItem?.precision}
                defaultValueDouble={formItem?.defaultValueDouble}
                isInteger={false}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.TEXTAREA:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={24}
              md={24}
              sm={24}
              xs={24}
              className="form-group custom-group mt-8">
              <DynamicTextArea
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                defaultValueString={formItem?.defaultValueString}
                rules={formItem?.rules}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.PASSWORD:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className="form-group custom-group">
              <DynamicPassword
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                rules={formItem?.rules}
                visibilityRules={formItem?.visibilityRules}
                isDisabled={formItem?.isDisabled}
                regexExpression={formItem?.regexExpression}
                defaultValueString={formItem?.defaultValueString}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.CHECKBOX:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={24}
              sm={24}
              xs={24}
              className="form-group custom-checkbox">
              <DynamicCheckBox
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                rules={formItem?.rules}
                tooltip={formItem?.tooltip}
                selectionValues={formItem?.selectionValues}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.RADIO_BUTTON:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={24}
              sm={24}
              xs={24}
              className="form-group custom-radio">
              <DynamicRadioButton
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                rules={formItem?.rules}
                defaultValueInt={formItem?.defaultValueInt}
                selectionValues={formItem?.selectionValues}
                tooltip={formItem?.tooltip}
                form={form}
                setFormValues={setFormValues}
                formValues={formValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.RANGE_PICKER:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className="form-group custom-group dual-space">
              <DynamicRangePicker
                key={index}
                name={formItem?.name}
                placeholder={formItem?.placeholder}
                dataKey={formItem?.dataKey}
                rules={formItem?.rules}
                defaultValueDateArray={formItem?.defaultValueDateArray}
                format={formItem?.format}
                disabledArray={formItem?.disabledArray}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.DATE:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className={
                formItem?.isHidden
                  ? "form-group custom-group d-none"
                  : "form-group custom-group dual-space"
              }>
              <DynamicPicker
                key={index}
                name={formItem?.name}
                placeholder={formItem?.placeholder}
                dataKey={formItem?.dataKey}
                rules={formItem?.rules}
                //defaultValueDate={formItem?.defaultValueDate}
                defaultValueDate={moment(new Date())}
                format={formItem?.format}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
                setCurrentDate={true}
              />
            </Col>
          )
        );
      case FIELD_TYPES.DROPDOWN:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className="form-group custom-group">
              <DynamicDropdown
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                rules={formItem?.rules}
                placeholder={formItem?.placeholder}
                options={formItem?.selectionValues}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                allowAddMore={formItem?.allowAddMore}
                entityType={formItem?.entityType}
                reduxKey={reduxKey}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.EMAIL:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className="form-group custom-group">
              <DynamicEmail
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                defaultValueString={formItem?.defaultValueString}
                rules={formItem?.rules}
                visibilityRules={formItem?.visibilityRules}
                form={form}
                formValues={formValues}
                setFormValues={setFormValues}
                isHidden={formItem?.isHidden}
              />
            </Col>
          )
        );
      case FIELD_TYPES.MULTISELECT:
        return (
          checkVisibilityRules(formItem?.visibilityRules, formValues) && (
            <Col
              lg={8}
              md={12}
              sm={12}
              xs={24}
              className={
                formItem?.isHidden
                  ? "form-group custom-group d-none"
                  : "form-group custom-group"
              }>
              <DynamicMultiSelect
                key={index}
                name={formItem?.name}
                dataKey={formItem?.dataKey}
                placeholder={formItem?.placeholder}
                rules={formItem?.rules}
                visibilityRules={formItem?.visibilityRules}
                form={form}
                setFormValues={setFormValues}
                options={formItem?.selectionValues}
                allowAddMore={formItem?.allowAddMore}
                formValues={formValues}
                entityType={formItem?.entityType}
                isHidden={formItem?.isHidden}
                reduxKey={reduxKey}
              />
            </Col>
          )
        );
      default:
        return null;
    }
  });
};

function DynamicFormHandler({ data, form, onFinish, reduxKey, isWrapInForm }) {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setFormValues(form.getFieldsValue());
  }, []);

  return (
    <>
      {isWrapInForm ? (
        <>
          <Form
            onFinish={onFinish}
            form={form}
            initialValues={getAllDefaultValues(data)}>
            {data?.map((fieldsInAGroup, index) => (
              <React.Fragment key={index}>
                <Row gutter={[16, 0]}>
                  {renderFieldsInAGroup(
                    fieldsInAGroup,
                    formValues,
                    setFormValues,
                    form,
                    reduxKey,
                  )}
                  {index !== data.length - 1 && <Divider />}
                </Row>
              </React.Fragment>
            ))}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          {data?.map((fieldsInAGroup, index) => (
            <React.Fragment key={index}>
              <Row gutter={[16, 0]}>
                {renderFieldsInAGroup(
                  fieldsInAGroup,
                  formValues,
                  setFormValues,
                  form,
                  reduxKey,
                )}
                {index !== data.length - 1 && <Divider />}
              </Row>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}

export default DynamicFormHandler;
