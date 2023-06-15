import { IBCAssessmentQuestionResponse } from "./IBCAssessmentQuestionResponse"
import { IPatientResponse } from "./IPatientResponse"

export interface IGameResponse {
    id: number
    startTime: string
    endTime: any
    estimatedEndTime: string
    testDuration: number
    status: string
    patient: IPatientResponse
    gameCase: IGameResponse
    bcAssessmentQuestions: IBCAssessmentQuestionResponse[]
}