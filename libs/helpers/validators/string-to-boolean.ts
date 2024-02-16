import { TransformFnParams } from 'class-transformer';

export const formDatasStringBooleanParse = ({ value }: TransformFnParams) =>
  isNaN(Number(value)) ? String(value) === 'true' : Number(value) === 1;
