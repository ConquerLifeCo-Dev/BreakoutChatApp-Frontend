import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
// import { useSelector } from "react-redux";

import KindnessCoin from "../assets/KindnessCoin.png";
import LoveBag from "../assets/LoveBag.png";
import bottomModalStyle from "./bottomModalStyle";
import { Entypo } from "@expo/vector-icons";
import squareDot from "../assets/squareDot.png";
import squareDotfilled from "../assets/squareDotfilled.png";
import { Tooltip } from "react-native-elements";
import { Octicons } from "@expo/vector-icons";

// Define TypeScript interfaces
export interface BreakoutCoinsProps {
  visible: boolean;
  eventId: string;
  onCancel: () => void;
  onSendConfirm: (totalSendCoins: number, numberOfLovePoints: number) => void;
  userToken: string;
  breakoutChatId: string;
  loggedInUserId?: number;
}

interface User {
  userId: string;
  sessionData?: {
    idToken: {
      jwtToken: string;
    };
  };
}

interface RootState {
  user: {
    user: User;
  };
}

interface KindnessCoinsUser {
  userName: string;
  receiverUserId: number;
  sackOfHearts: number;
  coinsGivenCount: number;
  profileColor: string;
}

interface UsersCoinsData {
  loggedInUserKindnessCoins: number;
  eventUserKindnessCoinsInfoList: KindnessCoinsUser[];
}

interface ExpandedItemsState {
  [userName: string]: boolean;
}

interface UserDetailsState {
  [userName: string]: {
    receiverUserId: number;
    pointsToGive: number;
    category: string;
  };
}

interface SelectedUserDetailsState {
  [userName: string]: {
    receiverUserId: number;
    category: string;
  };
}

interface KindnessCoinsCategoryState {
  [userName: string]: string;
}

interface SelectedButtonState {
  [userName: string]: string;
}

interface ReadyToGiveState {
  [userName: string]: boolean;
}

interface Expanded1KCState {
  [userName: string]: boolean;
}

interface Expanded8KCState {
  [userName: string]: boolean;
}

type KindnessCoinsCategory =
  | "MADE_ME_SMILE"
  | "MADE_ME_LAUGH"
  | "SHOWED_KINDNESS"
  | "MADE_MY_DAY"
  | "SAID_SOMETHING_RELATABLE"
  | "SHOWED_I_AM_NOT_ALONE"
  | "GAVE_ME_COURAGE"
  | "ENRICHED_THE_BREAKOUT";

const BreakoutCoins: React.FC<BreakoutCoinsProps> = ({
  visible,
  eventId,
  onCancel,
  onSendConfirm,
  userToken,
  breakoutChatId,
  loggedInUserId,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Dynamically calculate the size
  const tooltipWidth = screenWidth * 0.4;
  const tooltipHeight = screenHeight * 0.05;
  const fontSize = screenWidth * 0.03;

  // const user = useSelector((state: RootState) => state.user.user);

  const [isloading, setIsloading] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");

  const [usersCoinsData, setUsersCoinsData] = useState<UsersCoinsData>({
    loggedInUserKindnessCoins: 0,
    eventUserKindnessCoinsInfoList: [],
  });

  const resetAll = (): void => {
    setSelectedButton({});
    setkindnessCoinsCategory({});
    setReadyToGive({});
    setExpanded1KC({});
    setExpanded8KC({});
    fetchUsersCoinsData();
    setSendDisabled(false);
  };

  const [coinsGivenCount, setCoinsGivenCount] = useState<number>(0);
  const [sendDisabled, setSendDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (coinsGivenCount < 8) {
      setSendDisabled(false); // enable the send button
    } else {
      setSendDisabled(false); // disable the send button otherwise
    }
  }, [coinsGivenCount]); // Re-run effect when item.coinsGivenCount changes

  useEffect(() => {
    fetchUsersCoinsData();
  }, []);

  const fetchUsersCoinsData = async (): Promise<void> => {
    try {
      setIsloading(true);
      console.log("Fetching Users Coins Data");
      const response = await axios.get(
        "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/get-event-kindness-coins-dashboard" +
          "/" +
          breakoutChatId,
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      console.log("Users Coins API response:", response);
      console.log("Users Coins API status:", response.status);
      console.log("Users Coins API data:", response.data);
      if (response.status === 200) {
        setUsersCoinsData(response.data);
      } else {
        console.log("Failed to fetch Users Coins list:", response);
      }
    } catch (error) {
      console.error("Error fetching Users Coins data: ", error);
    } finally {
      setIsloading(false);
    }
  };

  let totalSendCoins = 0;
  let numberOfLovePoints = 0;

  const SendCoins = async (): Promise<void> => {
    for (const userName of Object.keys(kindnessCoinsCategory)) {
      if (kindnessCoinsCategory[userName] && selectedUserDetails[userName]) {
        const { receiverUserId, category } = selectedUserDetails[userName];
        let pointsToGive = 0;

        // Determine points based on the category
        if (
          [
            "MADE_ME_SMILE",
            "MADE_ME_LAUGH",
            "SHOWED_KINDNESS",
            "MADE_MY_DAY",
          ].includes(category)
        ) {
          pointsToGive = 1;
        } else {
          pointsToGive = 8;
        }

        // Check if the logged-in user has enough kindness coins
        if (usersCoinsData.loggedInUserKindnessCoins >= pointsToGive) {
          try {
            const response = await axios.put(
              "https://alb.api-dev-conquerlifeco.com/api/chat/breakout/give-kindness-coins-in-event",
              {
                pointsToGive: pointsToGive,
                chatRoomId: breakoutChatId,
                kindnessCoinsCategory: kindnessCoinsCategory[userName],
                receiverUserId: receiverUserId,
              },
              {
                headers: { Authorization: userToken },
              }
            );

            if (response.status === 200) {
              console.log(
                `Sent kindness coins successfully to ${userName}: `,
                response.data
              );
              totalSendCoins = totalSendCoins + pointsToGive;
              numberOfLovePoints = numberOfLovePoints + 1;

              onSendConfirm(totalSendCoins, numberOfLovePoints);
            } else {
              console.error(
                `Failed to send kindness coins to ${userName}: Unexpected status code:`,
                response.status
              );
            }
          } catch (error) {
            console.error(
              `Error sending kindness coins to ${userName}:`,
              error
            );
          }
        } else {
          console.error(`Not enough kindness coins to send to ${userName}`);
        }
      }
    }

    console.log("All coin sends processed.");

    resetAll();
  };

  const [expandedItems, setExpandedItems] = useState<ExpandedItemsState>({});
  const [userDetails, setUserDetails] = useState<UserDetailsState>({});

  const toggleItemExpansion = (
    userName: string,
    receiverUserId: number
  ): void => {
    const newExpandedState = { ...expandedItems };
    const newUserDetails = { ...userDetails };

    if (newExpandedState[userName]) {
      delete newExpandedState[userName];
      delete newUserDetails[userName];
    } else {
      newExpandedState[userName] = true;
      newUserDetails[userName] = {
        receiverUserId,
        pointsToGive: 0,
        category: "",
      };
    }

    setExpandedItems(newExpandedState);
    setUserDetails(newUserDetails);
  };

  const [expanded1KC, setExpanded1KC] = useState<Expanded1KCState>({});
  const [expanded8KC, setExpanded8KC] = useState<Expanded8KCState>({});

  const toggle1KCExpansion = (userName: string): void => {
    setExpanded8KC((prev) => ({
      ...prev,
      [userName]: false,
    }));
    setExpanded1KC((prev) => ({
      ...prev,
      [userName]: !prev[userName],
    }));
  };

  const toggle8KCExpansion = (userName: string): void => {
    setExpanded1KC((prev) => ({
      ...prev,
      [userName]: false,
    }));
    setExpanded8KC((prev) => ({
      ...prev,
      [userName]: !prev[userName],
    }));
  };

  const [kindnessCoinsCategory, setkindnessCoinsCategory] =
    useState<KindnessCoinsCategoryState>({});

  const [selectedUserDetails, setSelectedUserDetails] =
    useState<SelectedUserDetailsState>({});

  const handleCategorySelection = (
    userName: string,
    category: KindnessCoinsCategory,
    receiverUserId: number
  ): void => {
    setSelectedButton((prevState) => {
      const isAlreadySelected = prevState[userName] === category;
      return {
        ...prevState,
        [userName]: isAlreadySelected ? "" : category,
      };
    });

    setkindnessCoinsCategory((prevState) => {
      const newState = { ...prevState };
      if (prevState[userName] === category) {
        delete newState[userName];
      } else {
        newState[userName] = category;
      }
      return newState;
    });

    setReadyToGive((prevState) => {
      const isAlreadySelected = Boolean(prevState[userName]);
      return {
        ...prevState,
        [userName]: !isAlreadySelected,
      };
    });

    setSelectedUserDetails((prevState) => {
      const newState = { ...prevState };
      if (prevState[userName]?.category === category) {
        delete newState[userName];
      } else {
        newState[userName] = { receiverUserId, category };
      }
      return newState;
    });
  };

  useEffect(() => {
    const hasSelectedCategories = Object.keys(kindnessCoinsCategory).length > 0;
    setSendDisabled(hasSelectedCategories);
  }, [kindnessCoinsCategory]);

  const [selectedButton, setSelectedButton] = useState<SelectedButtonState>({});
  const [ReadyToGive, setReadyToGive] = useState<ReadyToGiveState>({});

  const windowWidth = Dimensions.get("window").width;

  const getFontSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 16;
    } else {
      return 18;
    }
  };

  const getSubCategoryFontSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 12;
    } else {
      return 14;
    }
  };

  const getBagSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 24;
    } else {
      return 26;
    }
  };

  const getDotFilledSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 7;
    } else {
      return 10;
    }
  };

  const getDotSize = (): number => {
    if (windowWidth >= 320 && windowWidth < 355) {
      return 7;
    } else {
      return 10;
    }
  };

  type UserColorMap = {
    [key: string]: string;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: KindnessCoinsUser;
    index: number;
  }) => {
    const fontSize = getFontSize();
    const bagSize = getBagSize();
    const DotFilledSize = getDotFilledSize();
    const DotSize = getDotSize();
    const SubCategoryFontSize = getSubCategoryFontSize();

    const userColorMap: UserColorMap = {
      LOBO: "#5EA5ED",
      CANI: "#FE9D8A",
      WOLFDOG: "#7FD7C9",
    };

    // const findMatchingColor = (userName: string): string => {
    //   const partialMatches = Object.keys(userColorMap).filter((color) =>
    //     userName.includes(color)
    //   );
    //   return partialMatches.length > 0
    //     ? userColorMap[partialMatches[0]]
    //     : "defaultColor";
    // };

    // const currentColorIndex = findMatchingColor(item.userName);
    const currentColorIndex = item.profileColor || "#5EA5ED";

    setCoinsGivenCount(item.coinsGivenCount);

    const isExpanded = expandedItems[item.userName];

    return (
      <TouchableOpacity
        onPress={() => toggleItemExpansion(item.userName, item.receiverUserId)}
        disabled={
          item.coinsGivenCount === 8 ||
          usersCoinsData.loggedInUserKindnessCoins <= 0
        }
      >
        <View
          style={[
            !expanded1KC[item.userName] ||
            !expanded8KC[item.userName] ||
            !isExpanded
              ? {
                  borderRadius: 28,
                  marginVertical: 8,
                  margin: 10,
                }
              : {},

            !isExpanded
              ? {
                  borderWidth: 1.5,
                  borderColor: currentColorIndex,
                  backgroundColor: "white",

                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.62,
                  // elevation: 4,
                }
              : {
                  borderWidth: 0,
                },
          ]}
        >
          {isExpanded ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <View
                  style={{
                    borderWidth: expanded1KC[item.userName] ? 1.5 : 0,
                    borderRadius: expanded1KC[item.userName] ? 26 : 0,
                    borderColor: expanded1KC[item.userName]
                      ? currentColorIndex
                      : "transparent",
                    backgroundColor: expanded1KC[item.userName]
                      ? currentColorIndex
                      : "transparent",
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => toggle1KCExpansion(item.userName)}
                  >
                    <View
                      style={[
                        styles.expandedbackground,
                        {
                          backgroundColor: expanded1KC[item.userName]
                            ? currentColorIndex
                            : "white",
                          flexDirection: "row",
                          alignItems: "center",
                          borderColor: currentColorIndex,
                          borderWidth: 2,
                        },
                      ]}
                    >
                      <Image
                        source={KindnessCoin}
                        style={{ width: 22, height: 32, marginRight: 2 }}
                      />
                      <Text
                        style={[
                          {
                            fontWeight: "bold",
                            fontSize: fontSize,
                            fontFamily: "MontBold",
                            marginLeft: 8,
                          },
                          {
                            color: expanded1KC[item.userName]
                              ? "white"
                              : currentColorIndex,
                          },
                        ]}
                      >
                        1KC
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {expanded1KC[item.userName] && (
                    <ScrollView
                      style={{ maxHeight: "100%" }}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "MADE_ME_SMILE",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded1KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] === "MADE_ME_SMILE"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] === "MADE_ME_SMILE"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Made Me Smile
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "MADE_ME_LAUGH",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded1KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] === "MADE_ME_LAUGH"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] === "MADE_ME_LAUGH"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Made Me Laugh
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "SHOWED_KINDNESS",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded1KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] === "SHOWED_KINDNESS"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] ===
                              "SHOWED_KINDNESS"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Showed Kindness
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "MADE_MY_DAY",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded1KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] === "MADE_MY_DAY"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] === "MADE_MY_DAY"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Made My Day
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>

              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <View
                  style={{
                    borderWidth: expanded8KC[item.userName] ? 1.5 : 0,
                    borderRadius: expanded8KC[item.userName] ? 26 : 0,
                    borderColor: expanded8KC[item.userName]
                      ? currentColorIndex
                      : "transparent",
                    backgroundColor: expanded8KC[item.userName]
                      ? currentColorIndex
                      : "transparent",
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => toggle8KCExpansion(item.userName)}
                  >
                    <View
                      style={[
                        styles.expandedbackground,
                        {
                          backgroundColor: expanded8KC[item.userName]
                            ? currentColorIndex
                            : "white",
                          flexDirection: "row",
                          alignItems: "center",
                          borderColor: currentColorIndex,
                          borderWidth: 2,
                        },
                      ]}
                    >
                      <Image
                        source={KindnessCoin}
                        style={{ width: 22, height: 32, marginRight: 2 }}
                      />
                      <Text
                        style={[
                          {
                            fontWeight: "bold",
                            fontSize: fontSize,
                            fontFamily: "MontBold",
                            marginLeft: 8,
                          },
                          {
                            color: expanded8KC[item.userName]
                              ? "white"
                              : currentColorIndex,
                          },
                        ]}
                      >
                        8KC
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {expanded8KC[item.userName] && (
                    <ScrollView
                      style={{ maxHeight: "100%" }}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        flexDirection: "column",
                        alignItems: "flex-end",
                        padding: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "SAID_SOMETHING_RELATABLE",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded8KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] ===
                            "SAID_SOMETHING_RELATABLE"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] ===
                              "SAID_SOMETHING_RELATABLE"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Said Something Relatable
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "SHOWED_I_AM_NOT_ALONE",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded8KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] ===
                            "SHOWED_I_AM_NOT_ALONE"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] ===
                              "SHOWED_I_AM_NOT_ALONE"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Showed I'm Not Alone
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "GAVE_ME_COURAGE",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded8KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] === "GAVE_ME_COURAGE"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] ===
                              "GAVE_ME_COURAGE"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Gave Me Courage
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCategorySelection(
                            item.userName,
                            "ENRICHED_THE_BREAKOUT",
                            item.receiverUserId
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 6,
                          marginBottom: 5,
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 30,
                          borderWidth: 1.5,
                          borderColor: expanded8KC[item.userName]
                            ? "white"
                            : currentColorIndex,
                          backgroundColor:
                            selectedButton[item.userName] ===
                            "ENRICHED_THE_BREAKOUT"
                              ? currentColorIndex
                              : "white",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: SubCategoryFontSize,
                            fontWeight: "bold",
                            color:
                              selectedButton[item.userName] ===
                              "ENRICHED_THE_BREAKOUT"
                                ? "white"
                                : currentColorIndex,
                            fontFamily: "MontBold",
                            textAlign: "center",
                          }}
                        >
                          Enriched The Breakout
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.flatlisticonContainer}>
              <View style={[styles.itemContent, { height: "100%" }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 8,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[
                        styles.UsernameStyling,
                        {
                          color: currentColorIndex,
                          marginLeft: 5,
                          fontSize: fontSize,
                        },
                      ]}
                    >
                      {`${item.userName}`}
                    </Text>

                    <Text
                      style={[
                        styles.lovePointsStyling,
                        {
                          color: currentColorIndex,
                          fontSize: fontSize,
                        },
                      ]}
                    >
                      {`${item.sackOfHearts}LP`}
                    </Text>

                    <Image
                      source={LoveBag}
                      style={{
                        width: bagSize,
                        height: bagSize,
                        marginRight: 5,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 10,
                      flex: 1,
                      justifyContent: "flex-end",
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      {[...Array(item.coinsGivenCount || 0)].map((_, index) => (
                        <Image
                          key={index}
                          source={squareDotfilled}
                          style={{
                            height: DotFilledSize,
                            width: DotFilledSize,
                            marginHorizontal: 1,
                          }}
                        />
                      ))}

                      {[...Array(8 - item.coinsGivenCount || 0)].map(
                        (_, index) => (
                          <Image
                            key={index}
                            source={squareDot}
                            style={{
                              height: DotSize,
                              width: DotSize,
                              marginHorizontal: 1,
                            }}
                          />
                        )
                      )}
                    </View>

                    <View
                      style={{
                        position: "absolute",
                        right: -15,
                      }}
                    >
                      {/* <Tooltip
                        pointerColor="grey"
                        width={tooltipWidth}
                        height={tooltipHeight}
                        containerStyle={{
                          borderColor: "black",
                          borderWidth: 1,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        backgroundColor={"white"}
                        popover={
                          <Text
                            style={{
                              color: "black",
                              fontFamily: "MontBook",
                              fontSize: fontSize,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            Sending Limit: 8
                          </Text>
                        }
                      >
                        <View style={{ marginHorizontal: 2 }}>
                          <Octicons name="info" size={15} color="#555555" />
                        </View>
                      </Tooltip> */}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const filteredData =
    usersCoinsData?.eventUserKindnessCoinsInfoList?.filter(
      (item) =>
        item.userName.toLowerCase().includes(searchInput.toLowerCase()) &&
        item.receiverUserId !== loggedInUserId
    ) || [];

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
          <View style={[bottomModalStyle.crossButton, { marginRight: 30 }]}>
            <TouchableOpacity
              onPress={() => {
                onCancel();
                resetAll();
              }}
            >
              <Entypo name="cross" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {isloading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <ActivityIndicator size="large" color="#707070" />
          </View>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: 710,
            width: "100%",
            maxHeight: "81%",
            backgroundColor: "white",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderWidth: 1,
            borderColor: "#aaa",
          }}
        >
          <View
            style={{
              maxWidth: 710,
              width: "100%",
              height: "100%",
              opacity: isloading ? 0.2 : 1,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 28,
                    fontFamily: "MontBold",
                    color: "#5EA5ED",
                    marginBottom: 14,
                  }}
                >
                  PLAYERS
                </Text>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontFamily: "MontSemiBold",
                      color: "#192D6F",
                    }}
                  >
                    Remaining Coins:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "MontSemiBold",
                      color: "#192D6F",
                    }}
                  >
                    {usersCoinsData.loggedInUserKindnessCoins}KC{" "}
                  </Text>

                  <Image
                    source={KindnessCoin}
                    resizeMode="contain"
                    style={{
                      width: 24,
                      height: 28,
                    }}
                  />
                </View>

                <TextInput
                  style={styles.searchBar}
                  placeholder="Search Players"
                  placeholderTextColor="#555555"
                  value={searchInput}
                  onChangeText={(text) => setSearchInput(text)}
                />
              </View>

              <ScrollView
                style={{ marginBottom: 2 }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <FlatList
                    style={{ flex: 1, marginTop: 5, marginBottom: 5 }}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.receiverUserId.toString()}
                  />
                </View>
              </ScrollView>
              <View
                style={{
                  backgroundColor: "#F8F8F8",
                  height: "15%",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      {
                        console.log("sendDisabled", sendDisabled);
                        console.log("ReadyToGive", ReadyToGive);
                      }
                      if (sendDisabled) {
                        SendCoins();
                      }
                    }}
                    style={[
                      {
                        padding: 15,
                        margin: 10,
                        justifyContent: "center",
                        width: "65%",
                        alignItems: "center",
                        borderRadius: 24,
                        borderWidth: 1.5,
                        borderColor: "#192D6F",
                        backgroundColor: "white",
                      },
                      !sendDisabled && {
                        borderWidth: 2,
                        borderColor: "#ADADAD",
                        opacity: 0.5,
                      },
                    ]}
                    disabled={!sendDisabled}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#192D6F",
                          fontFamily: "MontBold",
                        },
                        !sendDisabled && {
                          color: "#ADADAD",
                        },
                      ]}
                    >
                      Send
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  checkIcon: {
    position: "absolute",
    zIndex: 1000,
    opacity: 0.6,
  },
  parentImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  profileImageContainer: {
    width: 115,
    height: 115,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  usersToAddParentImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    marginStart: 5,
    marginEnd: 5,
  },
  searchBar: {
    width: "85%",
    alignSelf: "center",
    padding: 5,
    paddingLeft: 10,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: "#BEBEBE",
    fontFamily: "MontBook",
  },
  usersToAddprofileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "80%",
    height: "60%",
  },
  plusSign: {
    position: "absolute",
    bottom: 1,
    right: 1,
    backgroundColor: "#5EA5ED",
    borderRadius: 15,
    padding: 3,
  },
  headinglabel: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginBottom: 0,
    padding: 5,
  },
  breakoutDescriptionHeading: {
    marginTop: 20,
    marginBottom: 2,
    marginHorizontal: 8,
    fontSize: 20,
    fontWeight: "normal",
    color: "#aaa",
  },
  inviteFriendsHeading: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#aaa",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginHorizontal: 8,
  },
  expandedaddstyle: {
    height: 23,
    width: 23,
  },
  adduserstyle: {
    height: 28,
    width: 28,
  },
  heartstyle: {
    margin: 10,
    height: 25,
    width: 25,
  },
  expandedbackground: {
    height: 42,
    borderRadius: 32,
    justifyContent: "center",
  },
  listItem: {
    borderRadius: 25,
    marginLeft: 15,
    marginRight: 15,
  },
  flatlisticonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  buttonBackground: {
    marginRight: 10,
    height: 50,
    width: 50,
  },
  itemContent: {
    flex: 1,
  },
  UsernameStyling: {
    fontWeight: "bold",
    fontFamily: "MontBold",
  },
  ExpandedtextStyling: {
    fontWeight: "bold",
    fontSize: 22,
    fontFamily: "MontBold",
    marginLeft: 8,
  },
  lovePointsStyling: {
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "MontBold",
    margin: 5,
    marginHorizontal: 8,
  },
  flatlistdescriptionheading: {
    fontSize: 15,
    color: "black",
  },
  descriptionText: {
    marginTop: 8,
  },
  numberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  numberText: {
    fontWeight: "bold",
    fontSize: 35,
    marginRight: 5,
  },
  smallIcon: {
    width: 46,
    height: 46,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 0,
  },
  button: {
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 20,
    marginRight: 6,
  },
  fireIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    marginRight: 0,
  },
  eventnamestyle: {
    fontWeight: "bold",
    fontSize: 10,
    fontFamily: "MontBold",
    marginRight: 5,
    lineHeight: 10,
  },
  infinitydatestyle: {
    fontWeight: "bold",
    fontSize: 10,
    fontFamily: "MontBold",
  },
  dateTimeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginTop: 2,
    position: "absolute",
    right: 0,
  },
  InfinitydateContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    position: "absolute",
    right: 0,
    marginTop: 5,
  },
  firestyle: {
    height: 30,
    width: 30,
  },
  lobostyling: {
    height: 50,
    width: 50,
    marginLeft: 5,
    marginRight: 10,
  },
  eventdatestyle: {
    fontWeight: "bold",
    fontSize: 21,
    fontFamily: "MontBold",
    lineHeight: 20,
    marginRight: 5,
  },
  infinitystyle: {
    height: 35,
    width: 35,
    marginRight: 5,
  },
  filterbutton: {
    height: 20,
    width: 20,
    marginRight: 15,
  },
  squareDotfilledStyle: {
    height: 10,
    width: 10,
    marginHorizontal: 1,
  },
});

export default BreakoutCoins;
