import { createReducer, on } from '@ngrx/store';
import { addAbnormality, removeAbnormality } from '../actions/abnormalities.action';
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';

export interface AbnormalitiesState {
  addedValues: ICreateAbnormalityRequest[];
}

export const initialState: AbnormalitiesState = {
  addedValues: []
};

export const abnormalitiesReducer = createReducer(
  initialState,
  on(addAbnormality, (state, { abnormality }) => ({
    ...state,
    addedValues: [...state.addedValues, abnormality]
  })),
  on(removeAbnormality, (state, { parameter }) => ({
    ...state,
    addedValues: state.addedValues.filter(abnormality => abnormality.parameter !== parameter)
  }))
);
