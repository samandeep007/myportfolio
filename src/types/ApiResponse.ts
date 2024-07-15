import {Message} from '@/models/User';

export interface ApiResponse {
    success: boolean;
    message: string;
    messages?: Array<Message>;
}