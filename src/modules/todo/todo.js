import generateApi from "../generate-api/generate-api";
import { createDto, patchDto } from './todo-dto';
import todoModel from "./todo-model";
import authenticated from '../generate-api/authenticated';

export default generateApi({ 
  model: todoModel,
  createUpdateDto: createDto,
  patchDto,
  authenticated
});