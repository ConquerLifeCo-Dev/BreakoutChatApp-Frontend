import React from "react";
import { ViewStyle, TextStyle } from "react-native";
export interface SimpleScreenProps {
    title?: string;
    message?: string;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    titleStyle?: TextStyle;
    messageStyle?: TextStyle;
}
export declare const SimpleScreen: React.FC<SimpleScreenProps>;
