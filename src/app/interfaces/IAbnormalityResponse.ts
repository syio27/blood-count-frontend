import { LevelTypes } from "../enums/levelType.enum"

export interface IAbnormalityResponse {
    id: number
    parameter: string
    unit: string
    minValue: number
    maxValue: number
    type: LevelTypes
}