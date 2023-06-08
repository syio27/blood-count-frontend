import { AffectedGenders } from "../enums/affectedGender.enum"

export interface ICreateCaseRequest {
    firstMinAge: number
    firstMaxAge: number
    secondMinAge?: number
    secondMaxAge?: number
    affectedGender: AffectedGenders
    anemiaType: string
    diagnosis: string
}