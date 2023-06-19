import { IAnswerResponse } from "./IAnswerResponse"

export interface IBCAssessmentQuestionResponse {
    id: number
    parameter: string
    unit: string
    value: number
    answers: IAnswerResponse[]
}