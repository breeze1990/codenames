import { createAction, props } from '@ngrx/store';

export const roomUpdate = createAction('[Room] Update', props<any>());
