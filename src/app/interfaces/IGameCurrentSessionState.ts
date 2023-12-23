import { Pages } from '../enums/pages'
import { SavedUserAnswerResponse } from './SavedUserAnswerResponse'

export interface IGameCurrentSessionState {
    gameId: number,
    status: string,
    currentPage: Pages
}