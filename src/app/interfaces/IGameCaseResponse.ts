import { Language } from "../enums/language.enum"

export interface IGameCaseDetailsResponse {
    id: number
    anActualCaseId: number
    anemiaType: string
    diagnosis: string
    details: string
    hr: string
    rr: string
    description: string
    infoCom: string
    caseName: string
    language: Language
    bodyMass: string
    height: string
    bmi: string
}