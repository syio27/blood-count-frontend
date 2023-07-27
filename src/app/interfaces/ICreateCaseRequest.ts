import { AffectedGenders } from "../enums/affectedGender.enum"
import { AnemiaType } from "../enums/anemiaType.enum"

export interface ICreateCaseRequest {
    firstMinAge: number
    firstMaxAge: number
    secondMinAge?: number
    secondMaxAge?: number
    affectedGender: AffectedGenders
    anemiaType: AnemiaType
    diagnosis: string
    hr: string
    rr: string
    physExam: string
    infoCom: string
}