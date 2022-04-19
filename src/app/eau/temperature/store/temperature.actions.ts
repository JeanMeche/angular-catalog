import { createAction, props } from '@ngrx/store';

export const loadTemperatures = createAction(
  '[Temperature] Load Temperatures'
);

export const loadTemperaturesSuccess = createAction(
  '[Temperature] Load Temperatures Success',
  props<{ data: any }>()
);

export const loadTemperaturesFailure = createAction(
  '[Temperature] Load Temperatures Failure',
  props<{ error: any }>()
);
