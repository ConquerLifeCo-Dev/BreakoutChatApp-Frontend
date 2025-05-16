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
const axios_1 = __importDefault(require("axios"));
// import { useSelector } from "react-redux";
const KindnessCoin_png_1 = __importDefault(require("../assets/KindnessCoin.png"));
const LoveBag_png_1 = __importDefault(require("../assets/LoveBag.png"));
const bottomModalStyle_1 = __importDefault(require("./bottomModalStyle"));
const vector_icons_1 = require("@expo/vector-icons");
const squareDot_png_1 = __importDefault(require("../assets/squareDot.png"));
const squareDotfilled_png_1 = __importDefault(require("../assets/squareDotfilled.png"));
const BreakoutCoins = ({ visible, eventId, onCancel, onSendConfirm, userToken, breakoutChatId, loggedInUserId, }) => {
    var _a;
    const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get("window");
    // Dynamically calculate the size
    const tooltipWidth = screenWidth * 0.4;
    const tooltipHeight = screenHeight * 0.05;
    const fontSize = screenWidth * 0.03;
    // const user = useSelector((state: RootState) => state.user.user);
    const [isloading, setIsloading] = (0, react_1.useState)(false);
    const [searchInput, setSearchInput] = (0, react_1.useState)("");
    const [usersCoinsData, setUsersCoinsData] = (0, react_1.useState)({
        loggedInUserKindnessCoins: 0,
        eventUserKindnessCoinsInfoList: [],
    });
    const resetAll = () => {
        setSelectedButton({});
        setkindnessCoinsCategory({});
        setReadyToGive({});
        setExpanded1KC({});
        setExpanded8KC({});
        fetchUsersCoinsData();
        setSendDisabled(false);
    };
    const [coinsGivenCount, setCoinsGivenCount] = (0, react_1.useState)(0);
    const [sendDisabled, setSendDisabled] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (coinsGivenCount < 8) {
            setSendDisabled(false); // enable the send button
        }
        else {
            setSendDisabled(false); // disable the send button otherwise
        }
    }, [coinsGivenCount]); // Re-run effect when item.coinsGivenCount changes
    (0, react_1.useEffect)(() => {
        fetchUsersCoinsData();
    }, []);
    const fetchUsersCoinsData = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setIsloading(true);
            console.log("Fetching Users Coins Data");
            const response = yield axios_1.default.get("https://alb.api-dev-conquerlifeco.com/api/chat/breakout/get-event-kindness-coins-dashboard" +
                "/" +
                breakoutChatId, {
                headers: {
                    Authorization: userToken,
                },
            });
            console.log("Users Coins API response:", response);
            console.log("Users Coins API status:", response.status);
            console.log("Users Coins API data:", response.data);
            if (response.status === 200) {
                setUsersCoinsData(response.data);
            }
            else {
                console.log("Failed to fetch Users Coins list:", response);
            }
        }
        catch (error) {
            console.error("Error fetching Users Coins data: ", error);
        }
        finally {
            setIsloading(false);
        }
    });
    let totalSendCoins = 0;
    let numberOfLovePoints = 0;
    const SendCoins = () => __awaiter(void 0, void 0, void 0, function* () {
        for (const userName of Object.keys(kindnessCoinsCategory)) {
            if (kindnessCoinsCategory[userName] && selectedUserDetails[userName]) {
                const { receiverUserId, category } = selectedUserDetails[userName];
                let pointsToGive = 0;
                // Determine points based on the category
                if ([
                    "MADE_ME_SMILE",
                    "MADE_ME_LAUGH",
                    "SHOWED_KINDNESS",
                    "MADE_MY_DAY",
                ].includes(category)) {
                    pointsToGive = 1;
                }
                else {
                    pointsToGive = 8;
                }
                // Check if the logged-in user has enough kindness coins
                if (usersCoinsData.loggedInUserKindnessCoins >= pointsToGive) {
                    try {
                        const response = yield axios_1.default.put("https://alb.api-dev-conquerlifeco.com/api/chat/breakout/give-kindness-coins-in-event", {
                            pointsToGive: pointsToGive,
                            chatRoomId: breakoutChatId,
                            kindnessCoinsCategory: kindnessCoinsCategory[userName],
                            receiverUserId: receiverUserId,
                        }, {
                            headers: { Authorization: userToken },
                        });
                        if (response.status === 200) {
                            console.log(`Sent kindness coins successfully to ${userName}: `, response.data);
                            totalSendCoins = totalSendCoins + pointsToGive;
                            numberOfLovePoints = numberOfLovePoints + 1;
                            onSendConfirm(totalSendCoins, numberOfLovePoints);
                        }
                        else {
                            console.error(`Failed to send kindness coins to ${userName}: Unexpected status code:`, response.status);
                        }
                    }
                    catch (error) {
                        console.error(`Error sending kindness coins to ${userName}:`, error);
                    }
                }
                else {
                    console.error(`Not enough kindness coins to send to ${userName}`);
                }
            }
        }
        console.log("All coin sends processed.");
        resetAll();
    });
    const [expandedItems, setExpandedItems] = (0, react_1.useState)({});
    const [userDetails, setUserDetails] = (0, react_1.useState)({});
    const toggleItemExpansion = (userName, receiverUserId) => {
        const newExpandedState = Object.assign({}, expandedItems);
        const newUserDetails = Object.assign({}, userDetails);
        if (newExpandedState[userName]) {
            delete newExpandedState[userName];
            delete newUserDetails[userName];
        }
        else {
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
    const [expanded1KC, setExpanded1KC] = (0, react_1.useState)({});
    const [expanded8KC, setExpanded8KC] = (0, react_1.useState)({});
    const toggle1KCExpansion = (userName) => {
        setExpanded8KC((prev) => (Object.assign(Object.assign({}, prev), { [userName]: false })));
        setExpanded1KC((prev) => (Object.assign(Object.assign({}, prev), { [userName]: !prev[userName] })));
    };
    const toggle8KCExpansion = (userName) => {
        setExpanded1KC((prev) => (Object.assign(Object.assign({}, prev), { [userName]: false })));
        setExpanded8KC((prev) => (Object.assign(Object.assign({}, prev), { [userName]: !prev[userName] })));
    };
    const [kindnessCoinsCategory, setkindnessCoinsCategory] = (0, react_1.useState)({});
    const [selectedUserDetails, setSelectedUserDetails] = (0, react_1.useState)({});
    const handleCategorySelection = (userName, category, receiverUserId) => {
        setSelectedButton((prevState) => {
            const isAlreadySelected = prevState[userName] === category;
            return Object.assign(Object.assign({}, prevState), { [userName]: isAlreadySelected ? "" : category });
        });
        setkindnessCoinsCategory((prevState) => {
            const newState = Object.assign({}, prevState);
            if (prevState[userName] === category) {
                delete newState[userName];
            }
            else {
                newState[userName] = category;
            }
            return newState;
        });
        setReadyToGive((prevState) => {
            const isAlreadySelected = Boolean(prevState[userName]);
            return Object.assign(Object.assign({}, prevState), { [userName]: !isAlreadySelected });
        });
        setSelectedUserDetails((prevState) => {
            var _a;
            const newState = Object.assign({}, prevState);
            if (((_a = prevState[userName]) === null || _a === void 0 ? void 0 : _a.category) === category) {
                delete newState[userName];
            }
            else {
                newState[userName] = { receiverUserId, category };
            }
            return newState;
        });
    };
    (0, react_1.useEffect)(() => {
        const hasSelectedCategories = Object.keys(kindnessCoinsCategory).length > 0;
        setSendDisabled(hasSelectedCategories);
    }, [kindnessCoinsCategory]);
    const [selectedButton, setSelectedButton] = (0, react_1.useState)({});
    const [ReadyToGive, setReadyToGive] = (0, react_1.useState)({});
    const windowWidth = react_native_1.Dimensions.get("window").width;
    const getFontSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 16;
        }
        else {
            return 18;
        }
    };
    const getSubCategoryFontSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 12;
        }
        else {
            return 14;
        }
    };
    const getBagSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 24;
        }
        else {
            return 26;
        }
    };
    const getDotFilledSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 7;
        }
        else {
            return 10;
        }
    };
    const getDotSize = () => {
        if (windowWidth >= 320 && windowWidth < 355) {
            return 7;
        }
        else {
            return 10;
        }
    };
    const renderItem = ({ item, index, }) => {
        const fontSize = getFontSize();
        const bagSize = getBagSize();
        const DotFilledSize = getDotFilledSize();
        const DotSize = getDotSize();
        const SubCategoryFontSize = getSubCategoryFontSize();
        const userColorMap = {
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
        return (<react_native_1.TouchableOpacity onPress={() => toggleItemExpansion(item.userName, item.receiverUserId)} disabled={item.coinsGivenCount === 8 ||
                usersCoinsData.loggedInUserKindnessCoins <= 0}>
        <react_native_1.View style={[
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
            ]}>
          {isExpanded ? (<react_native_1.View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
              <react_native_1.View style={{ flex: 1, marginHorizontal: 8 }}>
                <react_native_1.View style={{
                    borderWidth: expanded1KC[item.userName] ? 1.5 : 0,
                    borderRadius: expanded1KC[item.userName] ? 26 : 0,
                    borderColor: expanded1KC[item.userName]
                        ? currentColorIndex
                        : "transparent",
                    backgroundColor: expanded1KC[item.userName]
                        ? currentColorIndex
                        : "transparent",
                }}>
                  <react_native_1.TouchableOpacity style={{}} onPress={() => toggle1KCExpansion(item.userName)}>
                    <react_native_1.View style={[
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
                ]}>
                      <react_native_1.Image source={KindnessCoin_png_1.default} style={{ width: 22, height: 32, marginRight: 2 }}/>
                      <react_native_1.Text style={[
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
                ]}>
                        1KC
                      </react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.TouchableOpacity>
                  {expanded1KC[item.userName] && (<react_native_1.ScrollView style={{ maxHeight: "100%" }} showsVerticalScrollIndicator={false} contentContainerStyle={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: 5,
                    }}>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "MADE_ME_SMILE", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] === "MADE_ME_SMILE"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] === "MADE_ME_SMILE"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Made Me Smile
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "MADE_ME_LAUGH", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] === "MADE_ME_LAUGH"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] === "MADE_ME_LAUGH"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Made Me Laugh
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "SHOWED_KINDNESS", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] === "SHOWED_KINDNESS"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] ===
                            "SHOWED_KINDNESS"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Showed Kindness
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "MADE_MY_DAY", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] === "MADE_MY_DAY"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] === "MADE_MY_DAY"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Made My Day
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                    </react_native_1.ScrollView>)}
                </react_native_1.View>
              </react_native_1.View>

              <react_native_1.View style={{ flex: 1, marginHorizontal: 8 }}>
                <react_native_1.View style={{
                    borderWidth: expanded8KC[item.userName] ? 1.5 : 0,
                    borderRadius: expanded8KC[item.userName] ? 26 : 0,
                    borderColor: expanded8KC[item.userName]
                        ? currentColorIndex
                        : "transparent",
                    backgroundColor: expanded8KC[item.userName]
                        ? currentColorIndex
                        : "transparent",
                }}>
                  <react_native_1.TouchableOpacity style={{}} onPress={() => toggle8KCExpansion(item.userName)}>
                    <react_native_1.View style={[
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
                ]}>
                      <react_native_1.Image source={KindnessCoin_png_1.default} style={{ width: 22, height: 32, marginRight: 2 }}/>
                      <react_native_1.Text style={[
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
                ]}>
                        8KC
                      </react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.TouchableOpacity>
                  {expanded8KC[item.userName] && (<react_native_1.ScrollView style={{ maxHeight: "100%" }} showsVerticalScrollIndicator={false} contentContainerStyle={{
                        flexDirection: "column",
                        alignItems: "flex-end",
                        padding: 5,
                    }}>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "SAID_SOMETHING_RELATABLE", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] ===
                            "SAID_SOMETHING_RELATABLE"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] ===
                            "SAID_SOMETHING_RELATABLE"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Said Something Relatable
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "SHOWED_I_AM_NOT_ALONE", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] ===
                            "SHOWED_I_AM_NOT_ALONE"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] ===
                            "SHOWED_I_AM_NOT_ALONE"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Showed I'm Not Alone
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "GAVE_ME_COURAGE", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] === "GAVE_ME_COURAGE"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] ===
                            "GAVE_ME_COURAGE"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Gave Me Courage
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                      <react_native_1.TouchableOpacity onPress={() => handleCategorySelection(item.userName, "ENRICHED_THE_BREAKOUT", item.receiverUserId)} style={{
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
                        backgroundColor: selectedButton[item.userName] ===
                            "ENRICHED_THE_BREAKOUT"
                            ? currentColorIndex
                            : "white",
                    }}>
                        <react_native_1.Text style={{
                        fontSize: SubCategoryFontSize,
                        fontWeight: "bold",
                        color: selectedButton[item.userName] ===
                            "ENRICHED_THE_BREAKOUT"
                            ? "white"
                            : currentColorIndex,
                        fontFamily: "MontBold",
                        textAlign: "center",
                    }}>
                          Enriched The Breakout
                        </react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                    </react_native_1.ScrollView>)}
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>) : (<react_native_1.View style={styles.flatlisticonContainer}>
              <react_native_1.View style={[styles.itemContent, { height: "100%" }]}>
                <react_native_1.View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 8,
                }}>
                  <react_native_1.View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                }}>
                    <react_native_1.Text style={[
                    styles.UsernameStyling,
                    {
                        color: currentColorIndex,
                        marginLeft: 5,
                        fontSize: fontSize,
                    },
                ]}>
                      {`${item.userName}`}
                    </react_native_1.Text>

                    <react_native_1.Text style={[
                    styles.lovePointsStyling,
                    {
                        color: currentColorIndex,
                        fontSize: fontSize,
                    },
                ]}>
                      {`${item.sackOfHearts}LP`}
                    </react_native_1.Text>

                    <react_native_1.Image source={LoveBag_png_1.default} style={{
                    width: bagSize,
                    height: bagSize,
                    marginRight: 5,
                }}/>
                  </react_native_1.View>
                  <react_native_1.View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                    flex: 1,
                    justifyContent: "flex-end",
                    position: "relative",
                }}>
                    <react_native_1.View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                }}>
                      {[...Array(item.coinsGivenCount || 0)].map((_, index) => (<react_native_1.Image key={index} source={squareDotfilled_png_1.default} style={{
                        height: DotFilledSize,
                        width: DotFilledSize,
                        marginHorizontal: 1,
                    }}/>))}

                      {[...Array(8 - item.coinsGivenCount || 0)].map((_, index) => (<react_native_1.Image key={index} source={squareDot_png_1.default} style={{
                        height: DotSize,
                        width: DotSize,
                        marginHorizontal: 1,
                    }}/>))}
                    </react_native_1.View>

                    <react_native_1.View style={{
                    position: "absolute",
                    right: -15,
                }}>
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
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>)}
        </react_native_1.View>
      </react_native_1.TouchableOpacity>);
    };
    const filteredData = ((_a = usersCoinsData === null || usersCoinsData === void 0 ? void 0 : usersCoinsData.eventUserKindnessCoinsInfoList) === null || _a === void 0 ? void 0 : _a.filter((item) => item.userName.toLowerCase().includes(searchInput.toLowerCase()) &&
        item.receiverUserId !== loggedInUserId)) || [];
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
          <react_native_1.View style={[bottomModalStyle_1.default.crossButton, { marginRight: 30 }]}>
            <react_native_1.TouchableOpacity onPress={() => {
            onCancel();
            resetAll();
        }}>
              <vector_icons_1.Entypo name="cross" size={28} color="#FFFFFF"/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
        {isloading && (<react_native_1.View style={Object.assign(Object.assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: "center", alignItems: "center", zIndex: 1000 })}>
            <react_native_1.ActivityIndicator size="large" color="#707070"/>
          </react_native_1.View>)}
        <react_native_1.View style={{
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
        }}>
          <react_native_1.View style={{
            maxWidth: 710,
            width: "100%",
            height: "100%",
            opacity: isloading ? 0.2 : 1,
        }}>
            <react_native_1.View style={{
            flex: 1,
        }}>
              <react_native_1.View style={{
            alignItems: "center",
            marginTop: 20,
            flexDirection: "column",
        }}>
                <react_native_1.Text style={{
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 28,
            fontFamily: "MontBold",
            color: "#5EA5ED",
            marginBottom: 14,
        }}>
                  PLAYERS
                </react_native_1.Text>

                <react_native_1.View style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
        }}>
                  <react_native_1.Text numberOfLines={2} ellipsizeMode="tail" style={{
            textAlign: "center",
            fontSize: 18,
            fontFamily: "MontSemiBold",
            color: "#192D6F",
        }}>
                    Remaining Coins:{" "}
                  </react_native_1.Text>
                  <react_native_1.Text style={{
            fontSize: 18,
            fontFamily: "MontSemiBold",
            color: "#192D6F",
        }}>
                    {usersCoinsData.loggedInUserKindnessCoins}KC{" "}
                  </react_native_1.Text>

                  <react_native_1.Image source={KindnessCoin_png_1.default} resizeMode="contain" style={{
            width: 24,
            height: 28,
        }}/>
                </react_native_1.View>

                <react_native_1.TextInput style={styles.searchBar} placeholder="Search Players" placeholderTextColor="#555555" value={searchInput} onChangeText={(text) => setSearchInput(text)}/>
              </react_native_1.View>

              <react_native_1.ScrollView style={{ marginBottom: 2 }} showsVerticalScrollIndicator={false}>
                <react_native_1.View>
                  <react_native_1.FlatList style={{ flex: 1, marginTop: 5, marginBottom: 5 }} data={filteredData} renderItem={renderItem} keyExtractor={(item) => item.receiverUserId.toString()}/>
                </react_native_1.View>
              </react_native_1.ScrollView>
              <react_native_1.View style={{
            backgroundColor: "#F8F8F8",
            height: "15%",
            justifyContent: "center",
        }}>
                <react_native_1.View style={{
            alignItems: "center",
        }}>
                  <react_native_1.TouchableOpacity onPress={() => {
            {
                console.log("sendDisabled", sendDisabled);
                console.log("ReadyToGive", ReadyToGive);
            }
            if (sendDisabled) {
                SendCoins();
            }
        }} style={[
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
        ]} disabled={!sendDisabled}>
                    <react_native_1.Text style={[
            {
                fontSize: 24,
                fontWeight: "bold",
                color: "#192D6F",
                fontFamily: "MontBold",
            },
            !sendDisabled && {
                color: "#ADADAD",
            },
        ]}>
                      Send
                    </react_native_1.Text>
                  </react_native_1.TouchableOpacity>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
};
const styles = react_native_1.StyleSheet.create({
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
exports.default = BreakoutCoins;
