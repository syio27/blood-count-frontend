import { LevelTypes } from "../enums/levelType.enum"

export interface ICreateAbnormalityRequest {
    parameter: string
    unit: string
    minValue: number
    maxValue: number
    type: LevelTypes;
}