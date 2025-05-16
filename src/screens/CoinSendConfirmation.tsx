import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import bottomModalStyle from "./bottomModalStyle";

// Define the props interface
export interface CoinSendConfirmationProps {
  visible: boolean;
  onCancel: () => void;
}

const CoinSendConfirmation: React.FC<CoinSendConfirmationProps> = ({
  visible,
  onCancel,
}) => {
  useEffect(() => {
    // Set a timeout to call onCancel after 3 seconds when the component mounts
    const timeout = setTimeout(() => {
      onCancel();
    }, 3000);
    // Clear the timeout when visibility changes
    return () => clearTimeout(timeout);
  }, [visible, onCancel]); // Trigger effect when visibility changes, added onCancel to dependencies

  const windowWidth: number = Dimensions.get("window").width;

  const getFontSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 20;
    } else {
      return 28;
    }
  };

  const FontSize: number = getFontSize();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <View
          style={{
            maxWidth: 710,
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <View style={bottomModalStyle.crossButton}>
            <TouchableOpacity
              onPress={() => {
                onCancel();
              }}
            >
              <Entypo name="cross" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            bottomModalStyle.modalStyle,
            {
              paddingVertical: 35,
              paddingHorizontal: 95,
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#5EA5ED",
              fontSize: FontSize,
              fontFamily: "MontBold",
              paddingHorizontal: 5,
              width: "150%",
              marginTop: 20,
            }}
          >
            KINDNESS COINS HAVE BEEN SENT!
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#B3B3B3",
              fontSize: 10,
              fontFamily: "MontBook",
              paddingHorizontal: 5,
              marginTop: 10,
              width: "200%",
            }}
          >
            (This will close automatically in 3 seconds)
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default CoinSendConfirmation;
