export interface ISimpleGameResponse {
    id: number;
    startTime: Date;
    endTime: Date;
    estimatedEndTime: Date;
    testDuration: number;
    status: string;
    score: number;
    caseId: number;
}
