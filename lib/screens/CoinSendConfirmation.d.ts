import React from "react";
export interface CoinSendConfirmationProps {
    visible: boolean;
    onCancel: () => void;
}
declare const CoinSendConfirmation: React.FC<CoinSendConfirmationProps>;
export default CoinSendConfirmation;
