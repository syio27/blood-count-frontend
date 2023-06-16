import { IBCAssessmentQuestionResponse } from "./IBCAssessmentQuestionResponse"
import { IPatientResponse } from "./IPatientResponse"
import { IGameCaseDetailsResponse } from "./IGameCaseResponse"
export interface IGameResponse {
    id: number
    startTime: string
    endTime: any
    estimatedEndTime: string
    testDuration: number
    status: string
    patient: IPatientResponse
    gameCaseDetails: IGameCaseDetailsResponse
    bcAssessmentQuestions: IBCAssessmentQuestionResponse[]
}