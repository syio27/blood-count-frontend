import { IBCAssessmentQuestionResponse } from "./IBCAssessmentQuestionResponse"
import { IPatientResponse } from "./IPatientResponse"
import { IGameCaseDetailsResponse } from "./IGameCaseResponse"
import { IMSQuestionResponse } from "./IMSQuestionResponse"
import { SavedUserAnswerResponse } from "./SavedUserAnswerResponse"
import { Pages } from "../enums/pages"
export interface IGameResponse {
    id: number
    startTime: string
    endTime: any
    estimatedEndTime: string
    currentServerTime: string
    testDuration: number
    status: string
    score: number
    patient: IPatientResponse
    gameCaseDetails: IGameCaseDetailsResponse,
    bcAssessmentQuestions: IBCAssessmentQuestionResponse[],
    msQuestions: IMSQuestionResponse[],
    savedUserAnswers: SavedUserAnswerResponse[],
    currentPage: Pages
}