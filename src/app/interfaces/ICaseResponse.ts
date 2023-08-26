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
    physExam: string
}