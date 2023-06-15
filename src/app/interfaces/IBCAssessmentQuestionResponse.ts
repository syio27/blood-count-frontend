import { IAnswerResponse } from "./IAnswerResponse"

export interface IBCAssessmentQuestionResponse {
    id: number
    correctAnswerId: number
    parameter: string
    unit: string
    value: number
    answers: IAnswerResponse[]
}