import { createAction, props } from "@ngrx/store";
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';

export const addAbnormality = createAction(
  '[Abnormalities] Add Abnormality',
  props<{ abnormality: ICreateAbnormalityRequest }>()
);

export const removeAbnormality = createAction(
  '[Abnormalities] Remove Abnormality',
  props<{ parameter: string }>()
);
