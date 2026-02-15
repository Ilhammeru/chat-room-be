export interface RetrieveMessageDto {
    id: number;
    text: string;
    senderId: number;
    targetId: number;
    timestamp: string;
}