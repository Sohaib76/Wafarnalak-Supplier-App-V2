import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as WebBrowser from "expo-web-browser";

import {
  Alert,
  AsyncStorage,
  Dimensions,
  I18nManager,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Share,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Container,
  Content,
  Header,
  Left,
  Right,
  Text,
  Thumbnail,
  Title,
} from "native-base";
import * as Updates from "expo-updates";
import { NavigationEvents } from "react-navigation";
import { Notifications } from "expo";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { StoreReview } from "expo";
import call from "react-native-phone-call";

export default class MyProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      lan: "en",
      profilePic: "",
      uploading: false,
      loading: false,
    };
  }

  // changeLanguage = () => {
  //   if (this.state.lan == "en") {
  //     this.setState({ lan: "ar", langText: "English" });
  //   } else {
  //     this.setState({ lan: "en", langText: "العربية" });
  //   }
  // };

  changeLanguage = async () => {
    let lan = await AsyncStorage.getItem("lan");
    let previousLan = lan !== null ? lan : "en";
    if (previousLan == "en") {
      this.changetoArabic();
    } else {
      this.changetoEnglish();
    }
  };
  changetoEnglish = async () => {
    await AsyncStorage.setItem("lan", "en");
    I18nManager.isRTL = false;
    I18nManager.forceRTL(false);
    await Updates.reloadAsync();
  };
  changetoArabic = async () => {
    await AsyncStorage.setItem("lan", "ar");
    I18nManager.isRTL = true;
    I18nManager.forceRTL(true);
    await Updates.reloadAsync();
  };

  help = () => {};
  getSpUser = async () => {
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/get_sp_details",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: spUser.mobile,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            this.setState({ user: responseJson });
          } else {
            Toast.show({
              text: responseJson.message,
              buttonText: "",
              position: "bottom",
            });
          }
        })
        .catch((error) => {
          Toast.show({
            text:
              this.state.lan == "en"
                ? "Something went wrong please try again later!"
                : "هناك شئ خاطئ، يرجى المحاولة فى وقت لاحق!",
            buttonText: "",
            position: "bottom",
          });
        });
    }
  };
  likeForense = () => {
    Alert.alert(
      "Would you mind rating Wafarnalak?",
      "It wont take more than a minute and helps to promote our app. Thanks for your support!",
      [
        {
          text: "REMIND ME LATER",

          style: "cancel",
        },
        {
          text: "NO, THANKS",

          style: "cancel",
        },
        { text: "RATE IT NOW", onPress: () => StoreReview.requestReview() },
      ],
      { cancelable: false }
    );
  };
  rateForense = () => {
    Alert.alert(
      "Do you like using Wafarnalak?",
      "",
      [
        {
          text: "Ask me later",
        },
        {
          text: "Not Really",

          style: "cancel",
        },
        {
          text: "Yes!",
          onPress: () => this.likeForense(),
        },
      ],
      { cancelable: false }
    );
  };
  openbrowser = () => {
    WebBrowser.openBrowserAsync("https://xn--mgbt1ckekl.com/terms-conditions/");
  };

  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    this.getPermissionAsync();
    this.getSpUser();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  };
  _handleNotification = (notification) => {
    const { navigation } = this.props;
    if (
      notification.origin === "received" ||
      notification.origin === "selected"
    ) {
      if (notification.data.statusid === "2") {
        navigation.navigate("AllNewOrder");
      }
      if (notification.data.statusid === "4") {
        navigation.navigate("OngoingOrder", { isCompleted: false });
      }
      if (notification.data.statusid === "5") {
        navigation.navigate("OrderDelivered");
      }
    }
  };
  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };
  uploadProfilePic = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };
  updateProfilePic = async (pic) => {
    let user = this.state.user;
    user.profileimage = pic;
    await AsyncStorage.setItem("user", JSON.stringify(user));
    this.setState({ user: user, loading: false });
  };

  _handleImagePicked = async (pickerResult) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ loading: true });
      if (!pickerResult.cancelled) {
        uploadResponse = await this.uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        this.updateProfilePic(uploadResult.file);
      }
    } catch (e) {
    } finally {
      this.setState({ loading: false });
    }
  };
  uploadImageAsync = async (uri) => {
    this.setState({ loading: true });
    let apiUrl =
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/upload.php";

    let uriParts = uri.split(".");
    let fileType = uri[uri.length - 1];

    let formData = new FormData();
    formData.append("file", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    formData.append("actorid", this.state.user.spid);
    formData.append("actortype", 2);
    formData.append("filetype", 1);
    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    return fetch(apiUrl, options);
  };
  logoutuser = async () => {
    try {
      await AsyncStorage.setItem("sp", "");
      this.props.navigation.navigate("Login");
    } catch (error) {}
  };
  makeCall = () => {
    const args = {
      number: "+966530576063", //+966577311430
      prompt: true,
    };

    call(args).catch(console.error);
  };

  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../../assets/background/Category-Background-Image.png")}
          resizeMode="cover"
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <Header style={{ backgroundColor: "#283a97", height: 140 }}>
            <Left
              style={{
                position: "absolute",
                top: Platform.OS == "ios" ? 56 : 16,
                left: 10,
              }}
            >
              {/* top:56 */}
              {/* top: 45, right: 10 */}
              <TouchableWithoutFeedback
                disabled={true}
                onPress={this.changeLanguage}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  {this.state.lan == "en" ? "العربية" : "English"}
                </Text>
              </TouchableWithoutFeedback>
            </Left>
            <Title
              style={{
                color: "white",
                position: "absolute",
                top: Platform.OS == "ios" ? 50 : 10, //50
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "My Profile" : "ملفي"}
            </Title>

            <Right
              style={{
                position: "absolute",
                top: Platform.OS == "ios" ? 56 : 16,
                right: 10,
              }}
            >
              {/* top:56 */}
              {/* top: 45, right: 10 */}
              <TouchableWithoutFeedback onPress={this.logoutuser}>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {this.state.lan == "en" ? "Logout" : "تسجيل الخروج"}
                </Text>
              </TouchableWithoutFeedback>
            </Right>
            <View
              style={{
                position: "absolute",
                left: 20,
                bottom: 5,
                flexDirection: "row",
              }}
            >
              <TouchableWithoutFeedback onPress={this.uploadProfilePic}>
                {this.state.user.profileimage === false ? (
                  <Thumbnail
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/foren-se-customers.appspot.com/o/image-placeholder.png?alt=media&token=10ced05a-f905-4951-9298-ff47e771f070",
                    }}
                  />
                ) : (
                  <Thumbnail
                    source={{
                      uri:
                        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/" +
                        this.state.user.profileimage,
                    }}
                  />
                )}
              </TouchableWithoutFeedback>
              <Text
                style={{
                  position: "absolute",
                  color: "white",
                  bottom: 20,
                  left: 75,
                }}
              >
                {this.state.user.name}
              </Text>
            </View>
          </Header>

          <>
            {
              <NavigationEvents
                onWillFocus={() => {
                  this.getSpUser();
                }}
              />
            }
            <Spinner visible={this.state.loading} textContent={""} />
            <View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("UpdateProfile", {
                    user: this.state.user,
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Profile-Icon.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10, // marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en" ? "Profile" : "ملفي الشخصي"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("Addresses", {
                    user: this.state.user,
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Add-Address-Icon.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en" ? "Add Address" : "أضف عنوان"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("ViewDocuments", {
                    user: this.state.user,
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Document.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en" ? "Documents" : "مستندات"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback onPress={this.makeCall}>
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Help.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en" ? "Help" : "مساعدة"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("Balance", {
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/BalanceAndInvoices.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en"
                      ? "Balance and invoices"
                      : "الرصيد والفواتير"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              {/* <View style={{ width: Dimensions.get('screen').width, height: 1, backgroundColor: 'white' }}></View>
                            <View style={{ backgroundColor: '#EEEEEE', flexDirection: 'row', height: 50, }}>
                                <Image source={require('../../assets/icons/Rate-Forense-Icon.png')}
                                    style={{ width: 30, height: 30, marginLeft: 30, marginTop: 10, resizeMode: 'contain' }} />
                                <Text style={{ color: '#4a4b4c', marginLeft: 40, marginTop: 14 }}>Rate Wafarnalak</Text>
                            </View> */}
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("OrderDelivered", {
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Delivered-Orders.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en"
                      ? "Delivered Orders"
                      : "الطلبات التي تم توصيلها"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("AllNewOrder", {
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/New-Order.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en" ? "New Order" : "طلب جديد"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("AllOngoingOrder", {
                    isCompleted: false,
                    lan: this.state.lan,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Ongoing.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en"
                      ? "Ongoing"
                      : "طلبات مستمرة/أوامر جارية"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
              <TouchableWithoutFeedback onPress={this.openbrowser}>
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/tc.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 30,
                      marginTop: 10,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{ color: "#4a4b4c", marginLeft: 40, marginTop: 14 }}
                  >
                    {this.state.lan == "en"
                      ? "Terms and Conditions"
                      : "الأحكام والشروط"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  height: 1,
                  backgroundColor: "white",
                }}
              ></View>
            </View>
          </>
        </ImageBackground>
      </Container>
    );
  }
}
