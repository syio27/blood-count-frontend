import { Language } from "../enums/language.enum"
import { IAbnormalityResponse } from "./IAbnormalityResponse"

export interface ICaseResponse {
    id: number
    firstMinAge: number
    firstMaxAge: number
    secondMinAge: number
    secondMaxAge: number
    affectedGender: string
    anemiaType: string
    diagnosis: string
    abnormalities: IAbnormalityResponse[]
    vitalSigns: string
    hr: string
    rr: string
    infoCom: string
    description: string
    caseName: string
    language: Language
    bodyMass: string
    height: string
    bmi: string
}