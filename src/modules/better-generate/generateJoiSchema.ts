import { StructureSchema } from "./types";
import joi, { StringSchema, NumberSchema, ArraySchema, ObjectSchema } from "joi";

export const createDto = (schema: StructureSchema, optionalValues = false, count = 0): ObjectSchema => {
  const dto = Object.entries(schema).reduce((prevProps, [property, { type, required = false, isArray = false }]) => {
    let currentProp: StringSchema | NumberSchema | ArraySchema | ObjectSchema;

    if (typeof type === 'object') {
      currentProp = createDto(type, optionalValues, count + 1);
    } else {
      currentProp = joi[type]();
    }

    if (isArray) {
      currentProp = joi.array().items(currentProp);
    } else if (!optionalValues && required) {
      currentProp = currentProp.required();
    }

    return {
      ...prevProps,
      [property]: currentProp
    }
  }, {});

  const object = joi.object(dto);

  if (optionalValues) {
    return object.or(...Object.keys(schema))
  } else if (count === 0) {
    return object.required();
  } else {
    return object;
  }
}