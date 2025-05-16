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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const profilebg_png_1 = __importDefault(require("../assets/profilebg.png"));
const expo_router_1 = require("expo-router");
// import { useDispatch, useSelector } from "react-redux";
const react_native_gifted_chat_1 = require("react-native-gifted-chat");
const axios_1 = __importDefault(require("axios"));
const lobo_png_1 = __importDefault(require("../assets/lobo.png"));
const loboFaceWhite_png_1 = __importDefault(require("../assets/loboFaceWhite.png"));
const LoveBag_png_1 = __importDefault(require("../assets/LoveBag.png"));
const KindnessCoin_png_1 = __importDefault(require("../assets/KindnessCoin.png"));
const vector_icons_1 = require("@expo/vector-icons");
const js_fetch_api_1 = require("@giphy/js-fetch-api");
// import BreakoutActions from "../../../../../constants/Enum/BreakoutActions";
const vector_icons_2 = require("@expo/vector-icons");
// import { setBreakoutUnreadMsg } from "../../../../../src/features/breakoutUnreadMsgSlice";
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";
const BreakoutCoins_1 = __importDefault(require("./BreakoutCoins"));
const CoinSendConfirmation_1 = __importDefault(require("./CoinSendConfirmation"));
// import { WebSocketContext } from "../../../../../contexts/WebSocketContext";
// import WebSocketSubscriptionTopic from "../../../../../constants/Enum/WebSocketSubscriptionTopic";
// import {
//   setBreakoutChatRemovedFlag,
//   resetBreakoutChat,
// } from "../../../../../src/features/breakoutChatSlice";
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
let size = 28;
const BreakoutChatroom = ({ breakoutChatId, userToken, }) => {
    const isFirstRender = (0, react_1.useRef)(true);
    // const { isConnected, webSocketService, currentAppState } = useContext(
    //   WebSocketContext as React.Context<WebSocketContextType>
    // );
    const [messages, setMessages] = (0, react_1.useState)([]);
    // const breakoutData = useSelector(
    //   (state: any) => state.breakoutChat.breakoutChat
    // ) as BreakoutData;
    // const [firstMessage, setFirstMessage] = useState<MessageType[]>([]);
    const receiverName = "receiverUserName";
    const eventLogoColor = "red";
    const startTime = "2:00 PM";
    const endTime = "3:00 PM";
    const [isUserRemoved, setIsUserRemoved] = (0, react_1.useState)(false);
    // const dispatch = useDispatch();
    // const user = useSelector((state: any) => state.user.user) as UserState;
    // const username = user.username;
    const [showGifList, setShowGifList] = (0, react_1.useState)(false);
    const [isBreakoutInfoModalVisible, setIsBreakoutInfoModalVisible] = (0, react_1.useState)(false);
    const isStartTimeFuture = isBreakoutStartTimeFuture(startTime);
    const isEndTimePast = isBreakoutEndTimePast(endTime);
    const [isLoadingEarlier, setIsLoadingEarlier] = (0, react_1.useState)(false);
    // initial lmt state (null) is used to set rmt on the 1st api call
    const [lmt, setLmt] = (0, react_1.useState)(null);
    const [rmt, setRmt] = (0, react_1.useState)(null);
    const [hasMoreMessages, setHasMoreMessages] = (0, react_1.useState)(true);
    const [userData, setUserData] = (0, react_1.useState)({
        username: "username",
        receivername: "",
        connected: false,
        message: "",
    });
    const senderUser = {
        _id: 2446,
        name: "Lobo_2",
        avatar: lobo_png_1.default,
        color: "#ed1c23",
    };
    (0, react_1.useEffect)(() => {
        console.log("Fetching breakout chatroom msgs");
        getMessages(lmt);
        return () => {
            // dispatch(
            //   setBreakoutUnreadMsg({
            //     chatroomid: chatRoomId,
            //     unreadMessage: false,
            //   })
            // );
            // dispatch(resetBreakoutChat());
            updateLastMessageTimestamp();
        };
    }, []);
    //replace it with chatroom id
    // useEffect(() => {
    //   if (isConnected && !isUserRemoved) {
    //     webSocketService.subscribe(
    //       WebSocketSubscriptionTopic.Chatroom + chatRoomId,
    //       onChatRoomMessageReceivedFromServer
    //     );
    //   }
    //   return () => {
    //     webSocketService.unsubscribe(
    //       WebSocketSubscriptionTopic.Chatroom + chatRoomId
    //     );
    //   };
    // }, [isConnected]);
    // get updated data when app comes into focus from background
    // useEffect(() => {
    //   if (isFirstRender.current) {
    //     // Skip first render
    //     isFirstRender.current = false;
    //   } else if (currentAppState === "active") {
    //     // if its a newChat no need to call it cause there won't be any new msgs
    //     console.log(
    //       "Fetching breakout chat msg on app becoming active from background"
    //     );
    //     getMessagesAscendingOrder();
    //   }
    // }, [currentAppState]);
    const updateLastMessageTimestamp = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/Update-user-last-read-message-timestamp";
            const response = yield axios_1.default.post(url + "/" + breakoutChatId, {}, {
                headers: { Authorization: userToken },
            });
            console.log("updateLastMessageTimestamp response", response);
        }
        catch (error) {
            console.error("Error deleting unread messages count:", error);
        }
    });
    const [isCoinsLoading, setIsCoinsLoading] = (0, react_1.useState)(false);
    const [breakoutCoinInfo, setBreakoutCoinInfo] = (0, react_1.useState)({});
    const characterName = breakoutCoinInfo.userName;
    const [userKindnessCoins, setUserKindnessCoins] = (0, react_1.useState)(0);
    const [lovePoints, setlovePoints] = (0, react_1.useState)(0);
    const fetchBreakoutChatroomInfo = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setIsCoinsLoading(true);
            console.log("Fetching breakout coin info data");
            const response = yield axios_1.default.get("https://alb.api-dev-conquerlifeco.com/api/chat/breakout/get-user-kindness-coins-info-for-event" +
                "/" +
                breakoutChatId, {
                headers: {
                    Authorization: userToken,
                },
            });
            console.log("breakout coin info API response:", response);
            if (response.status === 200) {
                setBreakoutCoinInfo(response.data);
                setUserKindnessCoins(response.data.userKindnessCoins);
                setlovePoints(response.data.sackOfHearts);
            }
            else {
                console.log("Failed to fetch breakout coin info data:", response);
            }
        }
        catch (error) {
            console.error("Error fetching breakout coin info data: ", error);
        }
        finally {
            setIsCoinsLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        fetchBreakoutChatroomInfo();
        console.log("breakoutCoinInfo", breakoutCoinInfo);
    }, []);
    const loggedUserId = 2446;
    // const onChatRoomMessageReceivedFromServer = async (
    //   payload: any
    // ): Promise<void> => {
    //   try {
    //     console.log("onChatRoomMessageReceivedFromServer called");
    //     console.log("payload.body", payload.body);
    //     let payloadData: PayloadData = JSON.parse(payload.body);
    //     console.log("Payload data: ", payloadData);
    //     if (
    //       payloadData &&
    //       payloadData.breakoutActionType === BreakoutActions.MESSAGE
    //     ) {
    //       const apiMessageUTCtimestamp = payloadData.messageTime;
    //       console.log("apiMessageUTCtimestamp....", apiMessageUTCtimestamp);
    //       const localTimestamp = new Date(apiMessageUTCtimestamp);
    //       const adjustedLocalTimestamp = new Date(
    //         localTimestamp.getTime() - localTimestamp.getTimezoneOffset() * 60000
    //       );
    //       console.log("adjustedLocalTimestamp....", adjustedLocalTimestamp);
    //       const newMessage: MessageType = {
    //         _id: payloadData.messageId,
    //         text: payloadData.message.includes("https://media")
    //           ? ""
    //           : payloadData.message,
    //         createdAt: adjustedLocalTimestamp,
    //         originaltimestamp: apiMessageUTCtimestamp,
    //         user: {
    //           _id: parseInt(payloadData.senderId, 10),
    //           name: payloadData.senderName,
    //           avatar: lobo,
    //           color: payloadData.profileColor,
    //         },
    //         image: payloadData.message.includes("https://media")
    //           ? payloadData.message
    //           : "",
    //       };
    //       console.log("onChatRoomMessageReceivedFromServer", newMessage);
    //       setRmt(apiMessageUTCtimestamp);
    //       setMessages((previousMessages) =>
    //         GiftedChat.append(previousMessages, [newMessage])
    //       );
    //     } else if (
    //       payloadData &&
    //       payloadData.breakoutActionType === BreakoutActions.REMOVE &&
    //       payloadData.removedUserId === String(loggedUserId)
    //     ) {
    //       console.log("User removed....");
    //       setIsUserRemoved(true);
    //       dispatch(setBreakoutChatRemovedFlag(true));
    //       webSocketService.unsubscribe(
    //         WebSocketSubscriptionTopic.Chatroom + chatRoomId
    //       );
    //     }
    //   } catch (error) {
    //     console.error(
    //       "Caught error onChatRoomMessageReceivedFromServer: ",
    //       error
    //     );
    //   }
    // };
    // used for getting the msg which were missed when the app was in background
    // const getMessagesAscendingOrder = async (): Promise<void> => {
    //   try {
    //     let query = `?size=${size}&lmt=${rmt}`;
    //     console.log("getMessagesAscendingOrder query", query);
    //     const response = await axios.get(
    //       "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/messages-asc/event" +
    //         "/" +
    //         chatRoomId +
    //         query,
    //       {
    //         headers: { Authorization: user?.sessionData?.idToken.jwtToken },
    //       }
    //     );
    //     console.log("Get breakout chat message response", response);
    //     // when missed msgs are 28 or more, no need to append we just reload
    //     if (response.data.length === size) {
    //       isFirstRender.current = true;
    //       setIsLoadingEarlier(false);
    //       setLmt(null);
    //       setRmt(null);
    //       setHasMoreMessages(true);
    //       getMessages(null);
    //       return;
    //     }
    //     const apiMessages: MessageType[] = response.data
    //       .map((apiMessage: ApiMessage) => {
    //         const apiMessageUTCtimestamp = apiMessage.messageTimestamp;
    //         const localTimestamp = new Date(apiMessageUTCtimestamp);
    //         const adjustedLocalTimestamp = new Date(
    //           localTimestamp.getTime() -
    //             localTimestamp.getTimezoneOffset() * 60000
    //         );
    //         const formattedMessage: MessageType = {
    //           _id: apiMessage.messageId,
    //           text: apiMessage.message.includes("https://media")
    //             ? ""
    //             : apiMessage.message,
    //           createdAt: adjustedLocalTimestamp,
    //           originaltimestamp: apiMessageUTCtimestamp,
    //           user: {
    //             _id: apiMessage.messageSenderId,
    //             name: apiMessage.messageSender,
    //             avatar: lobo,
    //             color: apiMessage.profileColor,
    //           },
    //           image: apiMessage.message.includes("https://media")
    //             ? apiMessage.message
    //             : "",
    //         };
    //         return formattedMessage;
    //       })
    //       .reverse();
    //     console.log("apiMessages.....", apiMessages);
    //     setMessages((previousMessages) =>
    //       GiftedChat.append(previousMessages, apiMessages)
    //     );
    //     // set most recent timestamp
    //     if (response.data.length > 0) {
    //       setRmt(response.data[response.data.length - 1].messageTimestamp);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching messages:", error);
    //     Alert.alert("Failed to load messages.");
    //   }
    // };
    const getMessages = (lmt) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let query = `?size=${size}&lmt=${lmt}`;
            console.log("breakout query", query);
            const response = yield axios_1.default.get("https://alb.api-dev-conquerlifeco.com/api/chat/breakout/messages/event" +
                "/" +
                breakoutChatId +
                query, {
                headers: { Authorization: userToken },
            });
            if (response.status === 200 &&
                !((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.validEventNamePolicyDto) === null || _b === void 0 ? void 0 : _b.failedValidationFlag)) {
                console.log("Get breakout message response", response);
                const apiMessages = response.data.map((apiMessage) => {
                    const apiMessageUTCtimestamp = apiMessage.messageTimestamp;
                    const localTimestamp = new Date(apiMessageUTCtimestamp);
                    const adjustedLocalTimestamp = new Date(localTimestamp.getTime() -
                        localTimestamp.getTimezoneOffset() * 60000);
                    const formattedMessage = {
                        _id: apiMessage.messageId,
                        text: apiMessage.message.includes("https://media")
                            ? ""
                            : apiMessage.message,
                        createdAt: adjustedLocalTimestamp,
                        originaltimestamp: apiMessageUTCtimestamp,
                        user: {
                            _id: apiMessage.messageSenderId,
                            name: apiMessage.messageSender,
                            avatar: lobo_png_1.default,
                            color: apiMessage.profileColor,
                        },
                        image: apiMessage.message.includes("https://media")
                            ? apiMessage.message
                            : "",
                    };
                    return formattedMessage;
                });
                //setFirstMessage(apiMessages.pop());
                //console.log(firstMessage);
                if (lmt === null) {
                    setMessages(apiMessages);
                }
                else {
                    setMessages((previousMessages) => react_native_gifted_chat_1.GiftedChat.prepend(previousMessages, apiMessages));
                }
                if (response.data.length > 0) {
                    // only update rmt if it's the first render
                    if (lmt === null) {
                        console.log("first render, updating rmt to the last message time");
                        setRmt(response.data[0].messageTimestamp);
                    }
                    setLmt(response.data[response.data.length - 1].messageTimestamp);
                }
                if (response.data.length < size) {
                    setHasMoreMessages(false);
                }
            }
            else {
                console.log("Failed to Get breakout message response", response.status);
            }
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            react_native_toast_message_1.default.show({
                type: "error",
                text1: "Error",
                text2: error.message,
                position: "top",
            });
        }
        finally {
            // setLoading(false);
        }
    });
    function isBreakoutStartTimeFuture(dateTimeString) {
        const currentDateTime = new Date().toISOString().slice(0, -8);
        console.log("startDateTimeString", dateTimeString);
        console.log("currentDateTime", currentDateTime);
        console.log("Comparison Result:", dateTimeString > currentDateTime);
        return dateTimeString > currentDateTime;
    }
    function isBreakoutEndTimePast(endDateTimeString) {
        console.log("endDateTimeString", endDateTimeString);
        if (!endDateTimeString) {
            return false;
        }
        const currentDateTime = new Date().toISOString().slice(0, -8);
        console.log("currentDateTime", currentDateTime);
        console.log("Comparison Result:", endDateTimeString < currentDateTime);
        return endDateTimeString < currentDateTime;
    }
    const onSend = (0, react_1.useCallback)((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (messages = []) {
        var _a, _b;
        try {
            console.log("new messages.......", messages);
            // if (webSocketService.stompClient) {
            const response = yield axios_1.default.post("https://alb.api-dev-conquerlifeco.com/api/chat/breakout/send-message", {
                userId: loggedUserId,
                // receiverUserName: receiverName,
                // receiverChatRoomId: chatRoomId,
                chatRoomId: breakoutChatId,
                lastMessage: messages[0].text,
            }, {
                headers: {
                    Authorization: userToken,
                },
            });
            if (response.status === 200 &&
                !((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.validEventNamePolicyDto) === null || _b === void 0 ? void 0 : _b.failedValidationFlag)) {
                console.log("Message sent successfully:", response.data);
                // let chatMessage: ChatMessage = {
                //   breakoutActionType: BreakoutActions.MESSAGE,
                //   senderName: response.data.messageSender,
                //   chatRoomId: chatRoomId,
                //   message: response.data.message,
                //   senderId: response.data.messageSenderId,
                //   //receiverName: receiverName,
                //   messageId: response.data.messageId,
                //   profileColor: response.data.profileColor,
                //   messageTime: response.data.messageTimestamp,
                // };
                // console.log("chatMessage....", chatMessage);
                // let chatListMessage: ChatListMessage = {
                //   chatRoomId: chatRoomId,
                //   lastMessage: response.data.message,
                //   lastMessageTimestamp: response.data.messageTimestamp,
                //   unreadMessagesCount: true,
                //   //breakoutActionType: BreakoutActions.MESSAGE,
                // };
                // await webSocketService.stompClient.send(
                //   "/app/group-message",
                //   {},
                //   JSON.stringify(chatMessage)
                // );
                // await webSocketService.stompClient.send(
                //   "/app/breakout-home-page",
                //   {},
                //   JSON.stringify(chatListMessage)
                // );
            }
            else {
                console.log("Message sent unsuccessfully:", response.data);
            }
            // }
        }
        catch (error) {
            console.error("Error: ", error);
            react_native_toast_message_1.default.show({
                type: "error",
                text1: "Error",
                text2: error.message,
                position: "top",
            });
        }
    }), []);
    function GifGrid({ searchTerm }) {
        const [gifs, setGifs] = (0, react_1.useState)([]);
        const [width, setWidth] = (0, react_1.useState)(react_native_1.Dimensions.get("window").width);
        const [offset, setOffset] = (0, react_1.useState)(0);
        const [loadingMore, setLoadingMore] = (0, react_1.useState)(false);
        const giphyFetch = new js_fetch_api_1.GiphyFetch("4uLG7igzj7B5RsmPGAKrjCTeNZhvD4BN");
        const fetchGifs = (newOffset) => __awaiter(this, void 0, void 0, function* () {
            setLoadingMore(true);
            const { data } = searchTerm
                ? yield giphyFetch.search(searchTerm, { offset: newOffset, limit: 20 })
                : yield giphyFetch.trending({ offset: newOffset, limit: 20 });
            // Use type assertion to make TypeScript happy
            setGifs((prevGifs) => [...prevGifs, ...data]);
            setLoadingMore(false);
        });
        (0, react_1.useEffect)(() => {
            fetchGifs(offset);
            const updateWidth = () => {
                setWidth(react_native_1.Dimensions.get("window").width);
            };
            const dimensionListener = react_native_1.Dimensions.addEventListener("change", updateWidth);
            return () => {
                dimensionListener.remove();
            };
        }, [offset, searchTerm]);
        const handleGifPress = (gifUrl) => {
            const newMessage = {
                _id: Math.random().toString(),
                text: gifUrl,
                createdAt: new Date(),
                user: senderUser,
            };
            // const newMessage = { text: gifUrl };
            onSend([newMessage]);
            // setShowGifList(false);
            // Then clean up states and dismiss keyboard
            requestAnimationFrame(() => {
                react_native_1.Keyboard.dismiss();
                setShowGifList(false);
                setIsSearchFocused(false);
                setSearchTerm1("");
            });
        };
        const renderGifItem = ({ item }) => (<react_native_1.TouchableOpacity onPress={() => handleGifPress(item.images.fixed_height.url)}>
        <react_native_1.Image source={{ uri: item.images.fixed_height.url }} style={{ width: width / 3 - 10, height: width / 3 - 10, margin: 5 }} resizeMode="cover"/>
      </react_native_1.TouchableOpacity>);
        const handleLoadMore = () => {
            if (!loadingMore) {
                setOffset((prevOffset) => prevOffset + 10); // Increment the offset to load more GIFs
            }
        };
        return (<react_native_1.FlatList data={gifs} renderItem={renderGifItem} keyExtractor={(item) => item.id} numColumns={3} onEndReached={handleLoadMore} onEndReachedThreshold={0.5} // Trigger the fetch when the list is 50% from the bottom
         ListFooterComponent={loadingMore ? (<react_native_1.ActivityIndicator size="large" color="#5EA5ED"/>) : null}/>);
    }
    const handleGifButtonClick = () => {
        react_native_1.Keyboard.dismiss();
        // Use a small delay to ensure keyboard is fully dismissed
        setTimeout(() => {
            setShowGifList(true);
            setIsSearchFocused(false);
            setSearchTerm1(""); // Reset search term
        }, 50);
    };
    const [searchTerm1, setSearchTerm1] = (0, react_1.useState)("");
    const [showSearchResults, setShowSearchResults] = (0, react_1.useState)(false);
    const handleSearch = () => {
        setShowSearchResults(true);
    };
    const [isSearchFocused, setIsSearchFocused] = (0, react_1.useState)(false);
    const renderGifButton = () => {
        return (<react_native_1.View style={[
                styles.parentImageContainer,
                { marginLeft: 10, marginBottom: 4 },
            ]}>
        <react_native_1.TouchableOpacity onPress={handleGifButtonClick}>
          <react_native_1.View style={[
                styles.profileImageContainer,
                { backgroundColor: "#5EA5ED" },
            ]}>
            <vector_icons_2.MaterialIcons name="gif" size={36} color="white"/>
          </react_native_1.View>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    };
    const renderAvatar = (props) => {
        const { currentMessage } = props;
        const avatarContainerStyle = [
            styles.newchatBgContainer,
            {
                marginRight: -1.5,
                marginLeft: -2,
                marginVertical: 5,
                backgroundColor: currentMessage.user.color,
            },
        ];
        const avatarImageStyle = {
            width: "80%", // Type assertion to any
            height: "60%", // Type assertion to any
        };
        return (<react_native_1.View style={avatarContainerStyle}>
        <react_native_1.Image source={loboFaceWhite_png_1.default} style={avatarImageStyle}/>
      </react_native_1.View>);
    };
    const renderBubble = (props) => {
        var _a, _b;
        console.log("props", props);
        const { currentMessage, previousMessage } = props;
        const isFirstInSequence = !((currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user) && currentMessage.user._id === loggedUserId) && // Check if the current message is sent by the logged-in user
            (!previousMessage || // Check if there is no previous message
                (!previousMessage.user && (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user)) || // Check if previousMessage.user is undefined and currentMessage.user is defined
                (previousMessage.user &&
                    (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user) &&
                    previousMessage.user._id !== currentMessage.user._id)); // Check if the user in the previous message is different from the current message
        return (<react_native_gifted_chat_1.Bubble {...props} textStyle={{
                left: {
                    margin: 0,
                    padding: 5,
                    paddingBottom: 2,
                    fontFamily: "MontBook",
                },
                right: {
                    margin: 0,
                    padding: 5,
                    paddingBottom: 2,
                    color: "#000000",
                    fontFamily: "MontBook",
                },
            }} wrapperStyle={{
                left: {
                    borderRadius: 15,
                    maxWidth: "75%",
                    backgroundColor: `${(_a = currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user) === null || _a === void 0 ? void 0 : _a.color}19`,
                    borderWidth: 1,
                    marginVertical: 1.5,
                },
                right: {
                    borderRadius: 15,
                    maxWidth: "75%",
                    backgroundColor: `${(_b = currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user) === null || _b === void 0 ? void 0 : _b.color}19`,
                    borderWidth: 1,
                    marginVertical: 1.5,
                },
            }} renderCustomView={() => {
                var _a;
                return (<>
            {isFirstInSequence && (<react_native_1.Text style={{
                            fontWeight: "bold",
                            marginBottom: -2,
                            color: "black",
                            paddingHorizontal: 10,
                            paddingTop: 2,
                            fontFamily: "MontBold",
                        }}>
                {(_a = currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user) === null || _a === void 0 ? void 0 : _a.name}
              </react_native_1.Text>)}
          </>);
            }}/>);
    };
    const renderTime = (props) => {
        const { position } = props;
        return (<react_native_1.View style={{ flexDirection: "row" }}>
        {position === "right" && (<react_native_1.Text style={{
                    fontSize: 12,
                    color: "grey",
                    paddingLeft: 5,
                    textAlignVertical: "bottom",
                    bottom: 2,
                    fontFamily: "MontBook",
                }}></react_native_1.Text>)}
        <react_native_gifted_chat_1.Time {...props}/>
        {position === "left" && (<react_native_1.Text style={{
                    fontSize: 12,
                    color: "grey",
                    paddingRight: 10,
                    textAlignVertical: "bottom",
                    bottom: 2,
                    fontFamily: "MontBook",
                }}></react_native_1.Text>)}
      </react_native_1.View>);
    };
    const handleBackPress = () => {
        if (react_native_1.Platform.OS === "ios") {
            expo_router_1.router.back();
        }
        else {
            react_native_1.Keyboard.dismiss();
            setTimeout(() => {
                expo_router_1.router.back();
            }, 0);
        }
    };
    const HeaderTitile = () => {
        return (<react_native_1.View style={Object.assign({ width: "100%", height: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 0.9, borderBottomColor: "#808080", backgroundColor: "#FFFFFF" }, react_native_1.Platform.select({
                android: {
                    marginTop: react_native_1.StatusBar.currentHeight
                        ? react_native_1.StatusBar.currentHeight * -1.0
                        : 0,
                },
            }))}>
        <react_native_1.TouchableOpacity style={{
                padding: 15, // Increase padding all around
                marginLeft: -5, // Offset the extra padding on the left
                paddingVertical: 10,
            }} onPress={handleBackPress}>
          <vector_icons_2.Ionicons name="arrow-back" size={26} color="#00000"/>
        </react_native_1.TouchableOpacity>

        <react_native_1.View style={{
                flex: 1,
                alignItems: "center",
                marginLeft: -15,
                paddingRight: 15,
            }}>
          <react_native_1.TouchableOpacity style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }} onPress={() => {
                console.log("Header clicked");
                // router.push({
                //   pathname: "/breakoutInfo",
                //   params: {
                //     eventId: chatRoomId,
                //     isUserRemoved: isUserRemoved,
                //     hasMessages: messages.length > 0,
                //     currentUserId: loggedUserId,
                //   },
                // });
            }}>
            <react_native_1.View style={{ flexDirection: "column" }}>
              <react_native_1.Text style={{
                color: eventLogoColor,
                fontSize: 20,
                maxWidth: 250,
                fontFamily: "MontBold",
                marginBottom: 1,
            }} numberOfLines={1} ellipsizeMode="tail">
                {breakoutCoinInfo.userName}
              </react_native_1.Text>

              <react_native_1.Text style={{
                textAlign: "center",
                color: "#505050",
                fontFamily: "MontSemiBold",
                marginTop: 1,
                marginBottom: -2,
            }}>
                {characterName}
              </react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={{ marginLeft: 5 }}>
              <vector_icons_1.FontAwesome5 name="info-circle" size={14} color="black"/>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>);
    };
    const [coinsbreakoutModalVisible, setcoinsbreakoutModalVisible] = (0, react_1.useState)(false);
    const handleCancelCoinsbreakoutModal = () => {
        setcoinsbreakoutModalVisible(false);
    };
    const handleOnConfirmCoinsSendModal = (totalSendCoins, numberOfLovePoints) => {
        setcoinsbreakoutModalVisible(false);
        setcoinsSendConfirmationModalVisible(true);
        console.log("totalSendCoins", totalSendCoins);
        console.log("numberOfLovePoints", numberOfLovePoints);
        const updatedUserKindnessCoins = userKindnessCoins - totalSendCoins;
        const updatedLovePoints = lovePoints + numberOfLovePoints;
        setUserKindnessCoins(updatedUserKindnessCoins);
        setlovePoints(updatedLovePoints);
        fetchBreakoutChatroomInfo();
    };
    const [coinsSendConfirmationModalVisible, setcoinsSendConfirmationModalVisible,] = (0, react_1.useState)(false);
    const handleCancelcoinsSendConfirmationModal = () => {
        setcoinsSendConfirmationModalVisible(false);
    };
    const renderInputToolbar = (props) => {
        if (isUserRemoved) {
            return (<react_native_1.View style={{
                    marginHorizontal: 10,
                    marginBottom: 10,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    borderRadius: 25,
                    borderWidth: 1.5,
                    borderColor: "#D66B6B",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    paddingVertical: 7,
                    paddingHorizontal: 7,
                }}>
          <react_native_1.Text style={{
                    fontFamily: "MontBold",
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 14,
                    color: "#D66B6B",
                }}>
            YOU HAVE BEEN REMOVED FROM THIS BREAKOUT
          </react_native_1.Text>
        </react_native_1.View>);
        }
        return <react_native_gifted_chat_1.InputToolbar {...props}/>;
    };
    const onLoadEarlier = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoadingEarlier(true);
        yield getMessages(lmt);
        setIsLoadingEarlier(false);
    });
    const gifSearchInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!showGifList) {
            setIsSearchFocused(false);
        }
    }, [showGifList]);
    const { height: windowHeight } = (0, react_native_1.useWindowDimensions)();
    // Calculate dynamic bottom offset based on screen height
    const getBottomOffset = () => {
        if (react_native_1.Platform.OS === "android") {
            // Extra small screens
            if (windowHeight < 600) {
                return windowHeight * 0.45;
            }
            // Small screens (600-700px) - e.g. medium phones
            else if (windowHeight < 700) {
                return windowHeight * 0.42; // 42% of screen height
            }
            // Medium screens (700-800px) - e.g. larger phones
            else if (windowHeight < 800) {
                return windowHeight * 0.38; // 38% of screen height
            }
            // Large screens (800-900px) - e.g. small tablets
            else if (windowHeight < 900) {
                return windowHeight * 0.33; // 35% of screen height
            }
            // Extra large screens (≥ 900px) - e.g. larger tablets
            else {
                return windowHeight * 0.32; // 33% of screen height
            }
        }
        return undefined; // Default iOS behavior
    };
    // Calculate dynamic input toolbar height
    const getInputToolbarHeight = () => {
        if (react_native_1.Platform.OS === "android") {
            // Scale the input toolbar height based on screen size
            return Math.max(44, Math.floor(windowHeight * 0.06)); // Minimum 44, or 6% of screen height
        }
        return undefined; // Default iOS behavior
    };
    return (<react_native_1.SafeAreaView style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: react_native_1.Platform.OS === "android"
                ? react_native_1.StatusBar.currentHeight
                    ? react_native_1.StatusBar.currentHeight + 10
                    : 10
                : 0,
        }}>
      <react_native_1.ImageBackground source={profilebg_png_1.default} resizeMode="cover" style={styles.bgContainer} imageStyle={styles.bgImage}>
        <HeaderTitile />
        <>
          {console.log("messages.........", messages)}

          {isUserRemoved ? (<react_native_1.View></react_native_1.View>) : isCoinsLoading ? (<react_native_1.ActivityIndicator style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                backgroundColor: "#F8F8F8",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "black",
                borderBottomColor: "black",
            }} size="large" color="black"/>) : (<react_native_1.View style={{
                paddingVertical: 10,
                backgroundColor: "#F8F8F8",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "black",
                borderBottomColor: "black",
            }}>
              <react_native_1.View style={{
                //flex: 1,
                flexDirection: "row",
                width: "100%",
                maxWidth: 500,
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
            }}>
                <react_native_1.TouchableOpacity style={{}} onPress={() => {
                setcoinsbreakoutModalVisible(true);
            }}>
                  <react_native_1.View style={[
                styles.CoinsButtonViewbackground,
                {
                    backgroundColor: "white",
                    marginRight: 7.5,
                    paddingHorizontal: 20,
                    paddingVertical: 6,
                },
            ]}>
                    <react_native_1.Text style={{
                fontSize: 16,
                color: "#5EA5ED",
                fontFamily: "MontSemiBold",
                // marginTop: 2,
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                marginVertical: 10,
                //marginTop: 10,
            }}>
                      USERS
                    </react_native_1.Text>
                  </react_native_1.View>

                  {coinsbreakoutModalVisible && (<BreakoutCoins_1.default visible={coinsbreakoutModalVisible} eventId={breakoutChatId} onCancel={handleCancelCoinsbreakoutModal} onSendConfirm={handleOnConfirmCoinsSendModal} userToken={userToken} breakoutChatId={breakoutChatId} loggedInUserId={breakoutCoinInfo.userId}/>)}

                  {coinsSendConfirmationModalVisible && (<CoinSendConfirmation_1.default visible={coinsSendConfirmationModalVisible} onCancel={handleCancelcoinsSendConfirmationModal}/>)}
                </react_native_1.TouchableOpacity>

                <react_native_1.View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 5,
                paddingVertical: 6,
                borderRadius: 22,
                borderWidth: 1.3,
                borderColor: "#5EA5ED",
                marginLeft: 7.5,
                backgroundColor: "white",
            }}>
                  <react_native_1.Text style={{
                fontSize: 15,
                color: "black",
                fontFamily: "MontBook",
                marginTop: 2,
                textAlignVertical: "center",
                fontWeight: "bold",
                marginRight: 5,
                marginLeft: 10,
            }}>
                    {userKindnessCoins}KC
                  </react_native_1.Text>
                  <react_native_1.Image source={KindnessCoin_png_1.default} resizeMode="contain" style={{ width: 22, height: 22 }}/>
                  <react_native_1.Text style={{
                fontSize: 15,
                color: "black",
                fontFamily: "MontBook",
                marginTop: 2,
                textAlignVertical: "center",
                fontWeight: "bold",
                marginRight: 5,
                marginLeft: 20,
            }}>
                    {lovePoints}LP
                  </react_native_1.Text>
                  <react_native_1.Image source={LoveBag_png_1.default} resizeMode="contain" style={{ width: 20, height: 20, marginRight: 10 }}/>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>)}

          <react_native_keyboard_controller_1.KeyboardGestureArea interpolator="linear" offset={0} style={{ flex: 1 }}>
            <react_native_gifted_chat_1.GiftedChat 
    // bottomOffset={Platform.OS === "android" ? 300 : null}
    // minInputToolbarHeight={Platform.OS === "android" ? 44 : undefined}
    bottomOffset={getBottomOffset()} minInputToolbarHeight={getInputToolbarHeight()} renderInputToolbar={renderInputToolbar} placeholder={isStartTimeFuture
            ? "Breakout event hasn't started yet."
            : isEndTimePast
                ? "Breakout event has ended."
                : "Saying positive things..."} messages={messages} onSend={(messages) => {
            onSend(messages);
        }} textInputProps={{
            editable: isStartTimeFuture || isEndTimePast ? false : true,
            // onFocus: () => setShowGifList(false),
            onFocus: () => {
                if (!isSearchFocused) {
                    setShowGifList(false);
                    setIsSearchFocused(false);
                }
            },
        }} user={senderUser} renderAvatarOnTop={false} renderAvatar={renderAvatar} renderActions={() => {
            return isStartTimeFuture || isEndTimePast
                ? null
                : renderGifButton();
        }} showUserAvatar={true} onPressAvatar={(message) => {
            // Type definition for onPressAvatar is missing in the original code
            console.log("Avatar pressed:", message);
        }} renderBubble={renderBubble} isTyping={undefined} renderTime={renderTime} timeTextStyle={{
            right: {
                color: "#AAAAAA",
                fontWeight: "bold",
                fontFamily: "MontSemiBold",
            },
            left: {
                color: "#AAAAAA",
                fontWeight: "bold",
                fontFamily: "MontSemiBold",
            },
        }} keyboardShouldPersistTaps="never" loadEarlier={hasMoreMessages} isLoadingEarlier={isLoadingEarlier} onLoadEarlier={onLoadEarlier}/>
          </react_native_keyboard_controller_1.KeyboardGestureArea>

          {showGifList && (<react_native_1.TouchableWithoutFeedback onPress={react_native_1.Keyboard.dismiss}>
              <react_native_1.View style={{
                justifyContent: "center",
                bottom: 0,
                left: 0,
                right: 0,
                height: isSearchFocused ? "100%" : "50%", // Adjust height based on focus
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderWidth: 1,
                borderColor: "#E8E8E8",
                paddingTop: 10,
            }}>
                <react_native_1.View style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#E8E8E8",
            }}>
                  <react_native_1.TextInput ref={gifSearchInputRef} placeholder="Search GIF's" style={{
                flex: 1,
                borderWidth: 1,
                borderRadius: 7,
                padding: 10,
                marginRight: 10,
                fontFamily: "MontBook",
            }} value={searchTerm1} onChangeText={(text) => setSearchTerm1(text)} returnKeyType="done" onSubmitEditing={() => react_native_1.Keyboard.dismiss()} onFocus={() => {
                // Ensure GIF list is visible before changing focus state
                if (showGifList) {
                    requestAnimationFrame(() => {
                        setIsSearchFocused(true);
                        // Add focus management within the same animation frame
                        setTimeout(() => {
                            if (gifSearchInputRef.current) {
                                gifSearchInputRef.current.focus();
                            }
                        }, 50);
                    });
                }
            }}/>
                  <react_native_1.TouchableOpacity style={{
                padding: 10,
                backgroundColor: "#5EA5ED",
                borderRadius: 5,
            }} onPress={() => {
                setShowGifList(false);
                setIsSearchFocused(false);
                react_native_1.Keyboard.dismiss();
            }}>
                    <react_native_1.Text style={{ color: "white", fontFamily: "MontBook" }}>
                      Cancel
                    </react_native_1.Text>
                  </react_native_1.TouchableOpacity>
                </react_native_1.View>

                <GifGrid searchTerm={searchTerm1}/>
              </react_native_1.View>
            </react_native_1.TouchableWithoutFeedback>)}
        </>
      </react_native_1.ImageBackground>
    </react_native_1.SafeAreaView>);
};
exports.default = BreakoutChatroom;
const styles = react_native_1.StyleSheet.create({
    parentImageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    profileImageContainer: {
        width: 35,
        height: 35,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    bgContainer: {
        flex: 1,
    },
    bgImage: {
        width: "100%",
        height: "100%",
    },
    newchatBgContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 17,
        width: 40,
        height: 40,
        maxWidth: 40,
        maxHeight: 40,
    },
    CoinsButtonViewbackground: {
        borderRadius: 22,
        borderWidth: 1.3,
        borderColor: "#5EA5ED",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    userButtonStyle: {
        paddingVertical: 5,
        borderRadius: 8,
        marginTop: 20,
        marginRight: 8,
    },
});
