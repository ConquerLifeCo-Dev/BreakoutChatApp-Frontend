"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleScreen = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const SimpleScreen = ({ title = "Hello from CLBreakoutChatApp", message = "This is a simple screen rendered for testing.", containerStyle, contentStyle, titleStyle, messageStyle, }) => {
    return (<react_native_1.SafeAreaView style={[styles.container, containerStyle]}>
      <react_native_1.View style={[styles.content, contentStyle]}>
        <react_native_1.Text style={[styles.title, titleStyle]}>{title}</react_native_1.Text>
        <react_native_1.Text style={[styles.message, messageStyle]}>{message}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
};
exports.SimpleScreen = SimpleScreen;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#2C6BED",
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: "#333",
    },
});
