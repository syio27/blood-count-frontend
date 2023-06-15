import { IBloodCountResponse } from "./IBloodCountResponse"

export interface IPatientResponse {
    id: number
    gender: string
    age: number
    bloodCounts: IBloodCountResponse[]
}