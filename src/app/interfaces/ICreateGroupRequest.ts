import { GroupType } from "../enums/groupType.enum"
export interface ICreateGroupRequest {
    groupNumber: string
    groupType: GroupType
}  