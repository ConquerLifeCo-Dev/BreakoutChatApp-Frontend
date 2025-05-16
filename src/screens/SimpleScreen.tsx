import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  SafeAreaView,
} from "react-native";

export interface SimpleScreenProps {
  title?: string;
  message?: string;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const SimpleScreen: React.FC<SimpleScreenProps> = ({
  title = "Hello from CLBreakoutChatApp",
  message = "This is a simple screen rendered for testing.",
  containerStyle,
  contentStyle,
  titleStyle,
  messageStyle,
}) => {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={[styles.content, contentStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.message, messageStyle]}>{message}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
