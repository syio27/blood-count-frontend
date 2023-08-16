import { Pages } from '../enums/pages'
import {SavedUserAnswerResponse} from './SavedUserAnswerResponse'

export interface IGameCurrentSessionState {
    gameId: number,
    estimatedEndTime: string,
    status: string,
    savedUserAnswers: SavedUserAnswerResponse[],
    currentPage: Pages
}