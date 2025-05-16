import { StyleSheet, ViewStyle } from "react-native";

// Create an interface for the style sheet with all the style properties
export interface BottomModalStyleSheet {
  crossButton: ViewStyle;
  modalStyle: ViewStyle;
  topButtonStyle: ViewStyle;
  bottomButtonStyle: ViewStyle;
}

const bottomModalStyle = StyleSheet.create<BottomModalStyleSheet>({
  crossButton: {
    borderWidth: 1.5,
    paddingHorizontal: 2,
    borderRadius: 14,
    marginHorizontal: 15,
    marginVertical: 5,
    borderColor: "#FFFFFF",
  },
  modalStyle: {
    //flex: 1,
    maxWidth: 710,
    width: "100%",
    height: "auto",
    //height: "25%",
    // height: "auto",
    //maxHeight: "25%",
    minHeight: 178,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  topButtonStyle: {
    //flex: 1,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#D56B6B",
    marginTop: 30,
    marginBottom: 7,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  bottomButtonStyle: {
    //flex: 1,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#555555",
    marginBottom: 30,
    marginTop: 7,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
});

export default bottomModalStyle;
