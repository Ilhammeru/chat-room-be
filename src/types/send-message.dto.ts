export interface SendMessageDto {
    message: string;
    roomName: string;
    targetId: number;
    senderId: number;
}