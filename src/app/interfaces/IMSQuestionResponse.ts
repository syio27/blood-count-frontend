import { IAnswerResponse } from "./IAnswerResponse"

export interface IMSQuestionResponse {
    id: number
    text: string
    answers: IAnswerResponse[]
}