import React from "react";
export interface BreakoutCoinsProps {
    visible: boolean;
    eventId: string;
    onCancel: () => void;
    onSendConfirm: (totalSendCoins: number, numberOfLovePoints: number) => void;
    userToken: string;
    breakoutChatId: string;
    loggedInUserId?: number;
}
declare const BreakoutCoins: React.FC<BreakoutCoinsProps>;
export default BreakoutCoins;
