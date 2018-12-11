import { mongooseTypeMapping, SingleProp, StructureSchema, Structure } from "./types";
import mongoose, { SchemaTypeOpts, SchemaDefinition, Schema } from "mongoose";

export const mongooseModelSingleProp = ({ type, isArray = false, required = false }: SingleProp): SchemaTypeOpts<any> => {
  let mongooseType;
  if (typeof type === 'object') {
    mongooseType = mongooseModelObject(type);
  } else {
    mongooseType = mongooseTypeMapping[type];
  }
  
  if (isArray) {
    mongooseType = [mongooseType];
  }

  return {
    type: mongooseType,
    required
  }
}

export const mongooseModelObject = (object: StructureSchema): SchemaDefinition => {
  return Object.entries(object).reduce((prev, [propName, schema]) => 
    ({ ...prev, [propName]: mongooseModelSingleProp(schema) }),
  {});
}

export const createMongooseModel = (structure: Structure) => {
  return mongoose.model(structure.databaseName, new mongoose.Schema(mongooseModelObject(structure.schema)));
};