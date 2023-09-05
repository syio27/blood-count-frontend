import { Language } from "../enums/language.enum";

export interface ISimpleGameResponse {
    id: number;
    startTime: Date;
    endTime: Date;
    estimatedEndTime: Date;
    testDuration: number;
    status: string;
    language: Language
    score: number;
    caseId: number;
}
