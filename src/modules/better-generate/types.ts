import { Model, Document } from "mongoose";

export const mongooseTypeMapping = {
  string: String,
  number: Number
}

export type Types = 'string' | 'number' | StructureSchema;
export type CustomRoute = (model: Model<any>) => (req, res, next?) => any;
export type CustomRouteConfig = {
  type: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all',
  path?: string,
  validation?: 'full' | 'partial' | StructureSchema | null,
  route: CustomRoute
}

export type SingleProp = {
  isArray?: boolean,
  type: Types
  required?: boolean
}

export type StructureSchema = {
  [property: string]: SingleProp
};

export type RedefinedRoute = ((req, res) => any) | boolean;

export type Structure = {
  databaseName: string,
  definedRoutes?: {
    getAll?: RedefinedRoute,
    getSingle?: RedefinedRoute,
    post?: RedefinedRoute,
    put?: RedefinedRoute,
    patch?: RedefinedRoute,
    delete?: RedefinedRoute
  }
  schema: StructureSchema,
  authenticated: boolean,
  routes?: CustomRouteConfig[]
}