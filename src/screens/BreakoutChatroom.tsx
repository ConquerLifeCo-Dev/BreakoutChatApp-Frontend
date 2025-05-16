import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  View,
  Dimensions,
  useWindowDimensions,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import profilebg from "../assets/profilebg.png";
import { Stack, router, usePathname } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
import {
  GiftedChat,
  Bubble,
  Time,
  InputToolbar,
  IMessage,
  User,
  BubbleProps,
  InputToolbarProps,
  TimeProps,
} from "react-native-gifted-chat";
import axios from "axios";
import lobo from "../assets/lobo.png";
import loboFace from "../assets/loboFaceWhite.png";
import LoveBag from "../assets/LoveBag.png";
import KindnessCoin from "../assets/KindnessCoin.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { GiphyFetch } from "@giphy/js-fetch-api";
// import BreakoutActions from "../../../../../constants/Enum/BreakoutActions";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
// import { setBreakoutUnreadMsg } from "../../../../../src/features/breakoutUnreadMsgSlice";
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import BreakoutCoinsModal from "./BreakoutCoins";
import CoinSendConfirmation from "./CoinSendConfirmation";
// import { WebSocketContext } from "../../../../../contexts/WebSocketContext";
// import WebSocketSubscriptionTopic from "../../../../../constants/Enum/WebSocketSubscriptionTopic";
// import {
//   setBreakoutChatRemovedFlag,
//   resetBreakoutChat,
// } from "../../../../../src/features/breakoutChatSlice";
import Toast from "react-native-toast-message";
import { KeyboardGestureArea } from "react-native-keyboard-controller";

interface GifImage {
  url: string;
  width: number;
  height: number;
}

interface GifImages {
  fixed_height: GifImage;
}

interface GifItem {
  id: string;
  images: GifImages;
}

// Define type for the message
interface MessageType extends IMessage {
  originaltimestamp?: string;
  image?: string;
}

// Define type for the API message
interface ApiMessage {
  messageId: string;
  message: string;
  messageTimestamp: string;
  messageSenderId: number;
  messageSender: string;
  profileColor: string;
}

// Define type for the socket payload
interface PayloadData {
  breakoutActionType: string;
  senderName: string;
  chatRoomId: string;
  message: string;
  senderId: string;
  messageId: string;
  profileColor: string;
  messageTime: string;
  removedUserId?: string;
}

// Define type for the chat message
interface ChatMessage {
  breakoutActionType: string;
  senderName: string;
  chatRoomId: string;
  message: string;
  senderId: string;
  messageId: string;
  profileColor: string;
  messageTime: string;
}

// Define type for the chat list message
interface ChatListMessage {
  chatRoomId: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadMessagesCount: boolean;
}

// Define type for the breakout coin info
interface BreakoutCoinInfo {
  userName?: string;
  userKindnessCoins?: number;
  sackOfHearts?: number;
  userId?: number;
}

// Define type for WebSocketContext
// interface WebSocketContextType {
//   isConnected: boolean;
//   webSocketService: {
//     subscribe: (topic: string, callback: (payload: any) => void) => void;
//     unsubscribe: (topic: string) => void;
//     stompClient: {
//       send: (destination: string, headers: {}, body: string) => void;
//     } | null;
//   };
//   currentAppState: string;
// }

// Define type for Breakout Data from Redux
interface BreakoutData {
  chatRoomId: string;
  loggedUserId: number;
  receiverUserName: string;
  eventLogoColor: string;
  startTime: string;
  endTime: string;
  isUserRemoved: boolean;
}

// Define type for User from Redux
interface UserState {
  username: string;
  sessionData?: {
    idToken: {
      jwtToken: string;
    };
  };
}

let size = 28;

export interface BreakoutChatroomProps {
  breakoutChatId: string;
  userToken: string;
}

const BreakoutChatroom: React.FC<BreakoutChatroomProps> = ({
  breakoutChatId,
  userToken,
}) => {
  const isFirstRender = useRef(true);
  // const { isConnected, webSocketService, currentAppState } = useContext(
  //   WebSocketContext as React.Context<WebSocketContextType>
  // );
  const [messages, setMessages] = useState<MessageType[]>([]);
  // const breakoutData = useSelector(
  //   (state: any) => state.breakoutChat.breakoutChat
  // ) as BreakoutData;

  // const [firstMessage, setFirstMessage] = useState<MessageType[]>([]);

  const receiverName = "receiverUserName";
  const eventLogoColor = "red";
  const startTime = "2:00 PM";
  const endTime = "3:00 PM";
  const [isUserRemoved, setIsUserRemoved] = useState<boolean>(false);
  // const dispatch = useDispatch();
  // const user = useSelector((state: any) => state.user.user) as UserState;
  // const username = user.username;
  const [showGifList, setShowGifList] = useState<boolean>(false);
  const [isBreakoutInfoModalVisible, setIsBreakoutInfoModalVisible] =
    useState<boolean>(false);

  const isStartTimeFuture = isBreakoutStartTimeFuture(startTime);
  const isEndTimePast = isBreakoutEndTimePast(endTime);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState<boolean>(false);

  // initial lmt state (null) is used to set rmt on the 1st api call
  const [lmt, setLmt] = useState<string | null>(null);
  const [rmt, setRmt] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

  const [userData, setUserData] = useState({
    username: "username",
    receivername: "",
    connected: false,
    message: "",
  });

  const senderUser: User = {
    _id: 2446,
    name: "Lobo_2",
    avatar: lobo,
    color: "#ed1c23",
  };

  useEffect(() => {
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

  const updateLastMessageTimestamp = async (): Promise<void> => {
    try {
      const url =
        "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/Update-user-last-read-message-timestamp";
      const response = await axios.post(
        url + "/" + breakoutChatId,
        {},
        {
          headers: { Authorization: userToken },
        }
      );
      console.log("updateLastMessageTimestamp response", response);
    } catch (error) {
      console.error("Error deleting unread messages count:", error);
    }
  };

  const [isCoinsLoading, setIsCoinsLoading] = useState<boolean>(false);
  const [breakoutCoinInfo, setBreakoutCoinInfo] = useState<BreakoutCoinInfo>(
    {}
  );
  const characterName = breakoutCoinInfo.userName;
  const [userKindnessCoins, setUserKindnessCoins] = useState<number>(0);
  const [lovePoints, setlovePoints] = useState<number>(0);

  const fetchBreakoutChatroomInfo = async (): Promise<void> => {
    try {
      setIsCoinsLoading(true);
      console.log("Fetching breakout coin info data");
      const response = await axios.get(
        "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/get-user-kindness-coins-info-for-event" +
          "/" +
          breakoutChatId,
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      console.log("breakout coin info API response:", response);

      if (response.status === 200) {
        setBreakoutCoinInfo(response.data);
        setUserKindnessCoins(response.data.userKindnessCoins);
        setlovePoints(response.data.sackOfHearts);
      } else {
        console.log("Failed to fetch breakout coin info data:", response);
      }
    } catch (error) {
      console.error("Error fetching breakout coin info data: ", error);
    } finally {
      setIsCoinsLoading(false);
    }
  };

  useEffect(() => {
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

  const getMessages = async (lmt: string | null): Promise<void> => {
    try {
      let query = `?size=${size}&lmt=${lmt}`;
      console.log("breakout query", query);
      const response = await axios.get(
        "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/messages/event" +
          "/" +
          breakoutChatId +
          query,
        {
          headers: { Authorization: userToken },
        }
      );

      if (
        response.status === 200 &&
        !response.data?.validEventNamePolicyDto?.failedValidationFlag
      ) {
        console.log("Get breakout message response", response);

        const apiMessages: MessageType[] = response.data.map(
          (apiMessage: ApiMessage) => {
            const apiMessageUTCtimestamp = apiMessage.messageTimestamp;
            const localTimestamp = new Date(apiMessageUTCtimestamp);
            const adjustedLocalTimestamp = new Date(
              localTimestamp.getTime() -
                localTimestamp.getTimezoneOffset() * 60000
            );

            const formattedMessage: MessageType = {
              _id: apiMessage.messageId,
              text: apiMessage.message.includes("https://media")
                ? ""
                : apiMessage.message,
              createdAt: adjustedLocalTimestamp,
              originaltimestamp: apiMessageUTCtimestamp,
              user: {
                _id: apiMessage.messageSenderId,
                name: apiMessage.messageSender,
                avatar: lobo,
                color: apiMessage.profileColor,
              },
              image: apiMessage.message.includes("https://media")
                ? apiMessage.message
                : "",
            };

            return formattedMessage;
          }
        );

        //setFirstMessage(apiMessages.pop());
        //console.log(firstMessage);

        if (lmt === null) {
          setMessages(apiMessages);
        } else {
          setMessages((previousMessages) =>
            GiftedChat.prepend(previousMessages, apiMessages)
          );
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
      } else {
        console.log("Failed to Get breakout message response", response.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message,
        position: "top",
      });
    } finally {
      // setLoading(false);
    }
  };

  function isBreakoutStartTimeFuture(dateTimeString: string): boolean {
    const currentDateTime = new Date().toISOString().slice(0, -8);
    console.log("startDateTimeString", dateTimeString);
    console.log("currentDateTime", currentDateTime);
    console.log("Comparison Result:", dateTimeString > currentDateTime);

    return dateTimeString > currentDateTime;
  }

  function isBreakoutEndTimePast(endDateTimeString: string | null): boolean {
    console.log("endDateTimeString", endDateTimeString);
    if (!endDateTimeString) {
      return false;
    }

    const currentDateTime = new Date().toISOString().slice(0, -8);
    console.log("currentDateTime", currentDateTime);
    console.log("Comparison Result:", endDateTimeString < currentDateTime);

    return endDateTimeString < currentDateTime;
  }

  const onSend = useCallback(
    async (messages: IMessage[] = []): Promise<void> => {
      try {
        console.log("new messages.......", messages);

        // if (webSocketService.stompClient) {
        const response = await axios.post(
          "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/send-message",
          {
            userId: loggedUserId,
            // receiverUserName: receiverName,
            // receiverChatRoomId: chatRoomId,
            chatRoomId: breakoutChatId,
            lastMessage: messages[0].text,
          },
          {
            headers: {
              Authorization: userToken,
            },
          }
        );
        if (
          response.status === 200 &&
          !response.data?.validEventNamePolicyDto?.failedValidationFlag
        ) {
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
        } else {
          console.log("Message sent unsuccessfully:", response.data);
        }
        // }
      } catch (error) {
        console.error("Error: ", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: (error as Error).message,
          position: "top",
        });
      }
    },
    []
  );

  function GifGrid({ searchTerm }: { searchTerm: string }) {
    const [gifs, setGifs] = useState<GifItem[]>([]);
    const [width, setWidth] = useState<number>(Dimensions.get("window").width);
    const [offset, setOffset] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    const giphyFetch = new GiphyFetch("4uLG7igzj7B5RsmPGAKrjCTeNZhvD4BN");

    const fetchGifs = async (newOffset: number): Promise<void> => {
      setLoadingMore(true);
      const { data } = searchTerm
        ? await giphyFetch.search(searchTerm, { offset: newOffset, limit: 20 })
        : await giphyFetch.trending({ offset: newOffset, limit: 20 });

      // Use type assertion to make TypeScript happy
      setGifs((prevGifs) => [...prevGifs, ...(data as unknown as GifItem[])]);
      setLoadingMore(false);
    };

    useEffect(() => {
      fetchGifs(offset);
      const updateWidth = () => {
        setWidth(Dimensions.get("window").width);
      };
      const dimensionListener = Dimensions.addEventListener(
        "change",
        updateWidth
      );
      return () => {
        dimensionListener.remove();
      };
    }, [offset, searchTerm]);

    const handleGifPress = (gifUrl: string): void => {
      const newMessage: IMessage = {
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
        Keyboard.dismiss();
        setShowGifList(false);
        setIsSearchFocused(false);
        setSearchTerm1("");
      });
    };

    const renderGifItem = ({ item }: { item: GifItem }): React.ReactElement => (
      <TouchableOpacity
        onPress={() => handleGifPress(item.images.fixed_height.url)}
      >
        <Image
          source={{ uri: item.images.fixed_height.url }}
          style={{ width: width / 3 - 10, height: width / 3 - 10, margin: 5 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );

    const handleLoadMore = (): void => {
      if (!loadingMore) {
        setOffset((prevOffset) => prevOffset + 10); // Increment the offset to load more GIFs
      }
    };

    return (
      <FlatList
        data={gifs}
        renderItem={renderGifItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger the fetch when the list is 50% from the bottom
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color="#5EA5ED" />
          ) : null
        }
      />
    );
  }

  const handleGifButtonClick = (): void => {
    Keyboard.dismiss();
    // Use a small delay to ensure keyboard is fully dismissed
    setTimeout(() => {
      setShowGifList(true);
      setIsSearchFocused(false);
      setSearchTerm1(""); // Reset search term
    }, 50);
  };

  const [searchTerm1, setSearchTerm1] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const handleSearch = (): void => {
    setShowSearchResults(true);
  };

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const renderGifButton = (): React.ReactElement => {
    return (
      <View
        style={[
          styles.parentImageContainer,
          { marginLeft: 10, marginBottom: 4 },
        ]}
      >
        <TouchableOpacity onPress={handleGifButtonClick}>
          <View
            style={[
              styles.profileImageContainer,
              { backgroundColor: "#5EA5ED" },
            ]}
          >
            <MaterialIcons name="gif" size={36} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAvatar = (props: any): React.ReactElement => {
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
      width: "80%" as any, // Type assertion to any
      height: "60%" as any, // Type assertion to any
    };

    return (
      <View style={avatarContainerStyle}>
        <Image source={loboFace} style={avatarImageStyle} />
      </View>
    );
  };

  const renderBubble = (props: BubbleProps<IMessage>): React.ReactElement => {
    console.log("props", props);
    const { currentMessage, previousMessage } = props;
    const isFirstInSequence =
      !(currentMessage?.user && currentMessage.user._id === loggedUserId) && // Check if the current message is sent by the logged-in user
      (!previousMessage || // Check if there is no previous message
        (!previousMessage.user && currentMessage?.user) || // Check if previousMessage.user is undefined and currentMessage.user is defined
        (previousMessage.user &&
          currentMessage?.user &&
          previousMessage.user._id !== currentMessage.user._id)); // Check if the user in the previous message is different from the current message

    return (
      <Bubble
        {...props}
        textStyle={{
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
        }}
        wrapperStyle={{
          left: {
            borderRadius: 15,
            maxWidth: "75%",
            backgroundColor: `${currentMessage?.user?.color}19`,
            borderWidth: 1,
            marginVertical: 1.5,
          },
          right: {
            borderRadius: 15,
            maxWidth: "75%",
            backgroundColor: `${currentMessage?.user?.color}19`,
            borderWidth: 1,
            marginVertical: 1.5,
          },
        }}
        renderCustomView={() => (
          <>
            {isFirstInSequence && (
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: -2,
                  color: "black",
                  paddingHorizontal: 10,
                  paddingTop: 2,
                  fontFamily: "MontBold",
                }}
              >
                {currentMessage?.user?.name}
              </Text>
            )}
          </>
        )}
      />
    );
  };

  const renderTime = (props: TimeProps<IMessage>): React.ReactElement => {
    const { position } = props;
    return (
      <View style={{ flexDirection: "row" }}>
        {position === "right" && (
          <Text
            style={{
              fontSize: 12,
              color: "grey",
              paddingLeft: 5,
              textAlignVertical: "bottom",
              bottom: 2,
              fontFamily: "MontBook",
            }}
          ></Text>
        )}
        <Time {...props} />
        {position === "left" && (
          <Text
            style={{
              fontSize: 12,
              color: "grey",
              paddingRight: 10,
              textAlignVertical: "bottom",
              bottom: 2,
              fontFamily: "MontBook",
            }}
          ></Text>
        )}
      </View>
    );
  };

  const handleBackPress = (): void => {
    if (Platform.OS === "ios") {
      router.back();
    } else {
      Keyboard.dismiss();
      setTimeout(() => {
        router.back();
      }, 0);
    }
  };

  const HeaderTitile = (): React.ReactElement => {
    return (
      <View
        style={{
          width: "100%",
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 0.9,
          borderBottomColor: "#808080",
          backgroundColor: "#FFFFFF",
          ...Platform.select({
            android: {
              marginTop: StatusBar.currentHeight
                ? StatusBar.currentHeight * -1.0
                : 0,
            },
          }),
        }}
      >
        <TouchableOpacity
          style={{
            padding: 15, // Increase padding all around
            marginLeft: -5, // Offset the extra padding on the left
            paddingVertical: 10,
          }}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={26} color="#00000" />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginLeft: -15,
            paddingRight: 15,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
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
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: eventLogoColor,
                  fontSize: 20,
                  maxWidth: 250,
                  fontFamily: "MontBold",
                  marginBottom: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {breakoutCoinInfo.userName}
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  color: "#505050",
                  fontFamily: "MontSemiBold",
                  marginTop: 1,
                  marginBottom: -2,
                }}
              >
                {characterName}
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              <FontAwesome5 name="info-circle" size={14} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [coinsbreakoutModalVisible, setcoinsbreakoutModalVisible] =
    useState<boolean>(false);

  const handleCancelCoinsbreakoutModal = (): void => {
    setcoinsbreakoutModalVisible(false);
  };

  const handleOnConfirmCoinsSendModal = (
    totalSendCoins: number,
    numberOfLovePoints: number
  ): void => {
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

  const [
    coinsSendConfirmationModalVisible,
    setcoinsSendConfirmationModalVisible,
  ] = useState<boolean>(false);

  const handleCancelcoinsSendConfirmationModal = (): void => {
    setcoinsSendConfirmationModalVisible(false);
  };

  const renderInputToolbar = (
    props: InputToolbarProps<IMessage>
  ): React.ReactElement | null => {
    if (isUserRemoved) {
      return (
        <View
          style={{
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
          }}
        >
          <Text
            style={{
              fontFamily: "MontBold",
              textAlign: "center",
              marginTop: 2,
              fontSize: 14,
              color: "#D66B6B",
            }}
          >
            YOU HAVE BEEN REMOVED FROM THIS BREAKOUT
          </Text>
        </View>
      );
    }

    return <InputToolbar {...props} />;
  };

  const onLoadEarlier = async (): Promise<void> => {
    setIsLoadingEarlier(true);
    await getMessages(lmt);
    setIsLoadingEarlier(false);
  };

  const gifSearchInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!showGifList) {
      setIsSearchFocused(false);
    }
  }, [showGifList]);

  const { height: windowHeight } = useWindowDimensions();

  // Calculate dynamic bottom offset based on screen height
  const getBottomOffset = (): number | undefined => {
    if (Platform.OS === "android") {
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
  const getInputToolbarHeight = (): number | undefined => {
    if (Platform.OS === "android") {
      // Scale the input toolbar height based on screen size
      return Math.max(44, Math.floor(windowHeight * 0.06)); // Minimum 44, or 6% of screen height
    }
    return undefined; // Default iOS behavior
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop:
          Platform.OS === "android"
            ? StatusBar.currentHeight
              ? StatusBar.currentHeight + 10
              : 10
            : 0,
      }}
    >
      <ImageBackground
        source={profilebg}
        resizeMode="cover"
        style={styles.bgContainer}
        imageStyle={styles.bgImage}
      >
        <HeaderTitile />
        <>
          {console.log("messages.........", messages)}

          {isUserRemoved ? (
            <View></View>
          ) : isCoinsLoading ? (
            <ActivityIndicator
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                backgroundColor: "#F8F8F8",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "black",
                borderBottomColor: "black",
              }}
              size="large"
              color="black"
            />
          ) : (
            <View
              style={{
                paddingVertical: 10,
                backgroundColor: "#F8F8F8",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "black",
                borderBottomColor: "black",
              }}
            >
              <View
                style={{
                  //flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  maxWidth: 500,
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setcoinsbreakoutModalVisible(true);
                  }}
                >
                  <View
                    style={[
                      styles.CoinsButtonViewbackground,
                      {
                        backgroundColor: "white",
                        marginRight: 7.5,
                        paddingHorizontal: 20,
                        paddingVertical: 6,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#5EA5ED",
                        fontFamily: "MontSemiBold",
                        // marginTop: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        marginVertical: 10,
                        //marginTop: 10,
                      }}
                    >
                      USERS
                    </Text>
                  </View>

                  {coinsbreakoutModalVisible && (
                    <BreakoutCoinsModal
                      visible={coinsbreakoutModalVisible}
                      eventId={breakoutChatId}
                      onCancel={handleCancelCoinsbreakoutModal}
                      onSendConfirm={handleOnConfirmCoinsSendModal}
                      userToken={userToken}
                      breakoutChatId={breakoutChatId}
                      loggedInUserId={breakoutCoinInfo.userId}
                    />
                  )}

                  {coinsSendConfirmationModalVisible && (
                    <CoinSendConfirmation
                      visible={coinsSendConfirmationModalVisible}
                      onCancel={handleCancelcoinsSendConfirmationModal}
                    />
                  )}
                </TouchableOpacity>

                <View
                  style={{
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
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      fontFamily: "MontBook",
                      marginTop: 2,
                      textAlignVertical: "center",
                      fontWeight: "bold",
                      marginRight: 5,
                      marginLeft: 10,
                    }}
                  >
                    {userKindnessCoins}KC
                  </Text>
                  <Image
                    source={KindnessCoin}
                    resizeMode="contain"
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      fontFamily: "MontBook",
                      marginTop: 2,
                      textAlignVertical: "center",
                      fontWeight: "bold",
                      marginRight: 5,
                      marginLeft: 20,
                    }}
                  >
                    {lovePoints}LP
                  </Text>
                  <Image
                    source={LoveBag}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                </View>
              </View>
            </View>
          )}

          <KeyboardGestureArea
            interpolator="linear"
            offset={0}
            style={{ flex: 1 }}
          >
            <GiftedChat
              // bottomOffset={Platform.OS === "android" ? 300 : null}
              // minInputToolbarHeight={Platform.OS === "android" ? 44 : undefined}
              bottomOffset={getBottomOffset()}
              minInputToolbarHeight={getInputToolbarHeight()}
              renderInputToolbar={renderInputToolbar}
              placeholder={
                isStartTimeFuture
                  ? "Breakout event hasn't started yet."
                  : isEndTimePast
                  ? "Breakout event has ended."
                  : "Saying positive things..."
              }
              messages={messages}
              onSend={(messages) => {
                onSend(messages);
              }}
              textInputProps={{
                editable: isStartTimeFuture || isEndTimePast ? false : true,
                // onFocus: () => setShowGifList(false),
                onFocus: () => {
                  if (!isSearchFocused) {
                    setShowGifList(false);
                    setIsSearchFocused(false);
                  }
                },
              }}
              user={senderUser}
              renderAvatarOnTop={false}
              renderAvatar={renderAvatar}
              renderActions={() => {
                return isStartTimeFuture || isEndTimePast
                  ? null
                  : renderGifButton();
              }}
              showUserAvatar={true}
              onPressAvatar={(message) => {
                // Type definition for onPressAvatar is missing in the original code
                console.log("Avatar pressed:", message);
              }}
              renderBubble={renderBubble}
              isTyping={undefined}
              renderTime={renderTime}
              timeTextStyle={{
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
              }}
              keyboardShouldPersistTaps="never"
              loadEarlier={hasMoreMessages}
              isLoadingEarlier={isLoadingEarlier}
              onLoadEarlier={onLoadEarlier}
            />
          </KeyboardGestureArea>

          {showGifList && (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#E8E8E8",
                  }}
                >
                  <TextInput
                    ref={gifSearchInputRef}
                    placeholder="Search GIF's"
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderRadius: 7,
                      padding: 10,
                      marginRight: 10,
                      fontFamily: "MontBook",
                    }}
                    value={searchTerm1}
                    onChangeText={(text) => setSearchTerm1(text)}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    onFocus={() => {
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
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: "#5EA5ED",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      setShowGifList(false);
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={{ color: "white", fontFamily: "MontBook" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                <GifGrid searchTerm={searchTerm1} />
              </View>
            </TouchableWithoutFeedback>
          )}
        </>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BreakoutChatroom;

const styles = StyleSheet.create({
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
