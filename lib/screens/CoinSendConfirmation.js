"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const vector_icons_1 = require("@expo/vector-icons");
const bottomModalStyle_1 = __importDefault(require("./bottomModalStyle"));
const CoinSendConfirmation = ({ visible, onCancel, }) => {
    (0, react_1.useEffect)(() => {
        // Set a timeout to call onCancel after 3 seconds when the component mounts
        const timeout = setTimeout(() => {
            onCancel();
        }, 3000);
        // Clear the timeout when visibility changes
        return () => clearTimeout(timeout);
    }, [visible, onCancel]); // Trigger effect when visibility changes, added onCancel to dependencies
    const windowWidth = react_native_1.Dimensions.get("window").width;
    const getFontSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 20;
        }
        else {
            return 28;
        }
    };
    const FontSize = getFontSize();
    return (<react_native_1.Modal visible={visible} animationType="slide" transparent>
      <react_native_1.View style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}>
        <react_native_1.View style={{
            maxWidth: 710,
            alignItems: "flex-end",
            width: "100%",
        }}>
          <react_native_1.View style={bottomModalStyle_1.default.crossButton}>
            <react_native_1.TouchableOpacity onPress={() => {
            onCancel();
        }}>
              <vector_icons_1.Entypo name="cross" size={28} color="#FFFFFF"/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.View style={[
            bottomModalStyle_1.default.modalStyle,
            {
                paddingVertical: 35,
                paddingHorizontal: 95,
                alignItems: "center",
            },
        ]}>
          <react_native_1.Text style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#5EA5ED",
            fontSize: FontSize,
            fontFamily: "MontBold",
            paddingHorizontal: 5,
            width: "150%",
            marginTop: 20,
        }}>
            KINDNESS COINS HAVE BEEN SENT!
          </react_native_1.Text>
          <react_native_1.Text style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#B3B3B3",
            fontSize: 10,
            fontFamily: "MontBook",
            paddingHorizontal: 5,
            marginTop: 10,
            width: "200%",
        }}>
            (This will close automatically in 3 seconds)
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
};
exports.default = CoinSendConfirmation;
