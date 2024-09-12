/*
returns an object of the following format:
{
  maxLength: 10,
  minLength: 5,
  isRequired: true,
}
*/
import moment from "moment";

import { FIELD_TYPES, RULES } from "../Constants";

export const consolidateRulesHelper = (rules) => {
  const consolidatedRules = {};

  if (rules?.length > 0) {
    rules.forEach((rule) => {
      let ruleName = rule?.name;
      ruleName = ruleName[0].toLowerCase() + ruleName.slice(1);
      let ruleValue = rule?.[ruleName];

      // If ruleValue exists and is not null or undefined, add it to consolidatedRules
      if (ruleValue !== null && ruleValue !== undefined) {
        consolidatedRules[ruleName] = ruleValue;
      }
    });
  }

  return consolidatedRules;
};

/*
returns an array of the following format:
[
  {
    required: 'true',
    message: 'This field is required',
  },
  {
    minLength: '5',
    message: 'Min length is 5',
  },
]
*/

export const consolidatedRulesWithMessageHelper = (
  rules,
  t,
  dataKey,
  fieldType,
  isHidden
) => {
  const consolidatedRulesWithMessageArray = [];

  if(isHidden){
    return [];
  }

  if (rules?.length > 0) {
    rules.forEach((rule, index) => {
      let ruleName = rule?.name;
      ruleName = ruleName[0].toLowerCase() + ruleName.slice(1);
      let ruleValue = rule?.[ruleName];

      if (ruleValue !== null && ruleValue !== undefined) {
        if (ruleName.includes("max") || ruleName.includes("Max")) {
          fieldType !== FIELD_TYPES.NUMBER &&
            fieldType !== FIELD_TYPES.DECIMAL &&
            consolidatedRulesWithMessageArray.push({
              max: ruleValue,
              message:
                rule?.message || t("VALIDATION_" + [dataKey] + "_" + ruleName),
            });
        } else if (ruleName.includes("min") || ruleName.includes("Min")) {
          fieldType !== FIELD_TYPES.NUMBER &&
            fieldType !== FIELD_TYPES.DECIMAL &&
            consolidatedRulesWithMessageArray.push({
              min: ruleValue,
              message:
                rule?.message || t("VALIDATION_" + [dataKey] + "_" + ruleName),
            });
        } 
        else if (ruleName === "pattern") {
          consolidatedRulesWithMessageArray.push({
            [ruleName]: new RegExp(ruleValue), //?.slice(1, -1)
            message:
              rule?.message || t("VALIDATION_" + [dataKey] + "_" + ruleName),
          });
        } 
        else if (ruleName === RULES.ALLOW_FUTURE_DATES) {
        }else {
          consolidatedRulesWithMessageArray.push({
            [ruleName]: ruleValue,
            message:
              rule?.message || t("VALIDATION_" + [dataKey] + "_" + ruleName),
          });
        }
      }
    });
  }

  return consolidatedRulesWithMessageArray;
};

/*
returns an object of the following format:
{
  MaxLength:{
    value: 10,
    message: 'Max length is 10',
  },
  MinLength:{
    value: 5,
    message: 'Min length is 5',
  },
  required:{
    value: true,
    message: 'This field is required',
  }
}
*/

export const convertRulesToValidation = (rules, dataKey) => {
  const searchString = "name";
  const object = {};
  rules.forEach((obj) => {
    const extractedObject = {};
    for (const key in obj) {
      if (key.includes(searchString)) {
        extractedObject[key] = obj[key];
        object[extractedObject[key]] = {
          value: obj[extractedObject[key]],
          message: `${dataKey}_${extractedObject[key]}`,
        };
      }
    }
  });
  return object;
};

//Renders MultiSelect Selected Values//
export const getMultiSelectSelectedValue = (options) => {
  const selectedIds = options
    .filter((item) => item.selected) // Filter out only the selected items
    .map((item) => item.id);
  return selectedIds;
};
export const getAllDefaultValues = (fields) => {
  const defaultValues = {};
  fields?.forEach((fieldArray) => {
    fieldArray?.forEach((field) => {
      const selectedOptions = field?.selectionValues?.filter((x) => x.selected);
      if (!field?.isSingleValue && selectedOptions?.length > 0) {
        const selectedIds = selectedOptions?.map((x) => x?.id);
        defaultValues[field?.dataKey] =
          selectedIds?.length > 0 ? selectedIds : null;
      } else if (field?.isSingleValue) {
        defaultValues[field?.dataKey] =
          field?.defaultValueInt ||
          field?.defaultValueString ||
          field?.defaultValueBool ||
          //(field?.defaultValueDate && moment(field.defaultValueDate)) ||
          (field?.defaultValueDate && moment(new Date())) ||
          field?.defaultValueDouble;
      }
    });
  });

  return defaultValues;
};

export const getAllTabularDefaultValues =(allFields, form)=>{

  const defaultValues = {};

  allFields?.forEach((fields) => {

    fields?.forEach((fieldArray) => {
      fieldArray?.forEach((field) => {

        const selectedOptions = field?.selectionValues?.filter((x) => x.selected);
        if (!field?.isSingleValue && selectedOptions?.length > 0) { 
          const selectedIds = selectedOptions?.map((x) => x?.id);
          defaultValues[field?.dataKey+ '-' +fieldArray?.[0]?.defaultValueInt] =

            selectedIds?.length > 0 ? selectedIds : null;

        } 
        else if(field?.isSingleValue && field?.selectionValues?.length > 0){
          const selectedOptions = field?.selectionValues?.filter((x) => x.selected);
          if(selectedOptions?.length > 0){
            defaultValues[field?.dataKey+ '-' +fieldArray?.[0]?.defaultValueInt] = selectedOptions?.[0]?.id;
          }
        }
        else if (field?.isSingleValue) {
          defaultValues[field?.dataKey+ '-' +fieldArray?.[0]?.defaultValueInt] =

            field?.defaultValueInt === 0 ? 0 :
              (field?.defaultValueInt ||
            field?.defaultValueString ||
            field?.defaultValueBool ||
            //(field?.defaultValueDate && moment(field.defaultValueDate)) ||
            (field?.defaultValueDate && moment(new Date(field.defaultValueDate?.split('T')?.[0]))) ||
            field?.defaultValueDouble);
        }
      });
    });
  });

  form.setFieldsValue(defaultValues);
  return defaultValues;
}

export const checkVisibilityRules = (visibilityRules, formValues) => {
  let visibility = true;
  if (visibilityRules?.length > 0) {
    visibility = visibilityRules?.every((rule) => {
      const type = typeof formValues?.[rule?.dataKey];
      if (type === "object") {
        //for checkboxes and multiselect
        return formValues?.[rule?.dataKey]?.includes(
          rule?.valueInt || rule?.valueString,
        );
      } else {
        return (
          formValues?.[rule?.dataKey] === rule?.valueInt ||
          rule?.valueBool ||
          rule?.valueString ||
          rule?.valueDate ||
          rule?.valueDouble
        );
      }
    });
  }
  return visibility;
};

export const activitySubmitHelper = (
  ActivityIdentifier,
  ActivityTypeId,
  ActivityAttachmentIds,
  submitValues,
) => {
  // filter those submit values which do not have dataValue or dataValues
  const filteredSubmitValues = submitValues.filter(
    (item) => item?.dataValue === undefined || item?.dataValues === undefined,
  );

  let filteredSubmitValuesWithDataValue = [];

  for (let i = 0; i < filteredSubmitValues?.length; i++) {
    const item = filteredSubmitValues[i];
    if (item?.dataKey === "ActivityIdentifier") {
      filteredSubmitValuesWithDataValue.push({
        dataKey: item.dataKey,
        dataValues: ActivityIdentifier,
      });
    } else if (item?.dataKey === "ActivityAttachmentIds") {
      filteredSubmitValuesWithDataValue.push({
        dataKey: item.dataKey,
        dataValues: ActivityAttachmentIds,
      });
    } else if (item?.dataKey === "ActivityTypeId") {
      filteredSubmitValuesWithDataValue.push({
        dataKey: item.dataKey,
        dataValue: ActivityTypeId,
      });
    }
    else if (item?.dataKey === "ActivityCreatedOn") {
      filteredSubmitValuesWithDataValue.push({
        dataKey: item.dataKey,
        dataValue: new Date().toISOString(),
      });
    }
  }

  return filteredSubmitValuesWithDataValue;
};

export function sortArray(array = [], sortBy) {
  if (array && array?.length > 0) {
    return array?.slice().sort(function (a, b) {
      let i = 0,
        result = 0;
      while (i < sortBy?.length && result === 0) {
        result =
          sortBy[i].direction *
          (a[sortBy[i]?.prop]?.toString().toLowerCase() <
            b[sortBy[i]?.prop]?.toString().toLowerCase()
            ? -1
            : a[sortBy[i]?.prop]?.toString().toLowerCase() >
              b[sortBy[i]?.prop]?.toString().toLowerCase()
              ? 1
              : 0);
        i++;
      }
      return result;
    });
  }

  return array;
}


export function dropdownData(
  list,
  value,
  name,
  sorting,
  key = null,
  parent = null,
  identityKeyToUse = "value",
  idsToExclude = null
) {
  if (!list) {
    return [];
  }
  let data = [];
  let combinedName;
  for (let i = 0; i < list?.length; i++) {
    if (idsToExclude && idsToExclude?.includes(list[i]?.id)) {
      continue; // Skip this iteration if the id is in the idsToExclude array
    }
    if (key) {
      combinedName = `${list[i][name]} - ${list[i][key] || "N/A"}`;
    } else {
      combinedName = parent ? list[i]?.[parent]?.[name] : list[i][name];
    }
    data.push({
      [`${identityKeyToUse}`]: parent ? list[i]?.[parent]?.[value] : list[i][value],
      name: combinedName,
    });
  }

  return data;
}

export function dynamicTranslation(str, replacements) {
  return str.replace(/\${(\d+)}/g, (match, index) => {
    const replacementIndex = parseInt(index, 10);
    return replacements[replacementIndex] !== undefined
      ? replacements[replacementIndex]
      : match;
  });
}