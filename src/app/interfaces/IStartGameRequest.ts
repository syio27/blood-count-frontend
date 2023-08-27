import { Language } from "../enums/language.enum"

export interface IStartGameRequest {
    caseId: number
    userId: string
    language: Language
}