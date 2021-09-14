//"plugins": [
//       [
//         "expo-notifications",
//         {
//           "sounds": ["./assets/notification.wav"]
//         }
//       ]
//     ],

import * as Permissions from "expo-permissions";
import * as WebBrowser from "expo-web-browser";

import {
  AsyncStorage,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native";
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Icon,
  Input,
  Item,
  Thumbnail,
  Toast,
} from "native-base";
let persianNumbers = [
  /۰/g,
  /۱/g,
  /۲/g,
  /۳/g,
  /۴/g,
  /۵/g,
  /۶/g,
  /۷/g,
  /۸/g,
  /۹/g,
];
let arabicNumbers = [
  /0/g,
  /1/g,
  /2/g,
  /3/g,
  /4/g,
  /5/g,
  /6/g,
  /7/g,
  /8/g,
  /9/g,
];
import CountDown from "react-native-countdown-component";
import { Ionicons } from "@expo/vector-icons";
import { Notifications } from "expo";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

export default class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      modalVisible: false,
      otp: "",
      otpid: "",
      loading: false,
      otpentered: "",
      resendCode: false,
      iAgree: false,
      token: "",
      spid: {},
    };
  }
  saveState = (label, value) => {
    this.setState({ [label]: value.replace(/[^0-9]/g, "") });
  };
  hideModal = () => {
    this.setState({ modalVisible: false });
  };
  openPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync("https://xn--mgbt1ckekl.com/privacy-policy/");
  };
  openTermsAndCondition = () => {
    WebBrowser.openBrowserAsync("https://xn--mgbt1ckekl.com/terms-conditions/");
  };
  loginUser = () => {
    if (
      this.state.mobile !== "" &&
      this.state.mobile.charAt(0) == 0 &&
      this.state.mobile.charAt(1) == 5 &&
      this.state.mobile.length == 10
    ) {
      if (this.state.iAgree === true) {
        this.setState({ loading: true });
        fetch(
          "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mobile: this.state.mobile,
              spdeviceid: this.state.token,
            }),
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("login --------- fdd --------", responseJson);

            this.setState({ spid: responseJson.sp, loading: false });
            if (responseJson.error === false) {
              this.saveUser(responseJson.sp);
            } else {
              Toast.show({
                text: responseJson.message,
                buttonText: "",
                position: "bottom",
              });
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            Toast.show({
              text: "Something went wrong please try again later!",
              buttonText: "",
              position: "bottom",
            });
          });
      } else {
        this.setState({ loading: false });

        Toast.show({
          text: "Check the terms and condition & provacy policy",
          buttonText: "",
          position: "bottom",
        });
      }
    } else {
      this.setState({ loading: false });

      Toast.show({
        text: "Please enter your valid phone number!",
        position: "bottom",
      });
    }
  };
  saveUser = async (user) => {
    await AsyncStorage.setItem("sp", JSON.stringify(user));

    this.getUser();
  };
  verifyLogin = () => {
    if (this.state.otpentered !== "") {
      if (this.state.iAgree === true) {
        this.setState({ loading: true });
        fetch(
          "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/verify_sp_activation_otp",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              otpid: this.state.otpid,
              otpentered: this.state.otpentered,
            }),
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.error === false) {
              this.setState({ loading: false, modalVisible: false });
              this.saveUser(responseJson);
            } else {
              Toast.show({
                text: responseJson.message,
                buttonText: "",
                position: "bottom",
              });
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            Toast.show({
              text: "Something went wrong please try again later!",
              buttonText: "",
              position: "bottom",
            });
          });
      } else {
        Toast.show({
          text: "Check the terms and condition & provacy policy",
          buttonText: "",
          position: "bottom",
        });
      }
    } else {
      Toast.show({
        text: "Enter 4 digit OTP Code!",
        buttonText: "",
        position: "bottom",
      });
    }
  };
  resendVerficationCode = () => {};

  getUser = async () => {
    let user = await AsyncStorage.getItem("sp");
    if (user !== null && user !== "") {
      let spUser = JSON.parse(user);
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_sp_details",
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
          console.log("user log", responseJson);
          if (responseJson.error === false) {
            let spUser = responseJson;
            console.log("spuser >> ", spUser);
            this.saveSpId(spUser.spid);
            if (spUser.profilestatus === 1) {
              this.props.navigation.navigate("BusinessCategory", {
                spid: spUser.spid,
              });
            }
            if (spUser.profilestatus === 2) {
              this.props.navigation.navigate("CompanyProfile", {
                spid: spUser.spid,
              });
            }
            if (spUser.profilestatus === 3) {
              this.props.navigation.navigate("ProfileVerification");
            }
            if (spUser.profilestatus === 5) {
              this.props.navigation.navigate("MyProfile");
            }
            if (spUser.profilestatus === 4) {
              this.props.navigation.navigate("DisabledAccount");
            }
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
            text: "Something went wrong please try again later!",
            buttonText: "",
            position: "bottom",
          });
        });
    }
    this.setState({ loading: false });
  };
  saveSpId = async (id) => {
    console.log("saveSpId ", id);
    await AsyncStorage.setItem("SPID", id.toString());
  };
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    this.setState({ loading: true });
    this.getUser();
    this.registerForPushNotificationAsync();
    if (Platform.OS === "android") {
      await Notifications.createChannelAndroidAsync("order-status", {
        //setNotificationChannelAsync
        name: "order",
        //importance: Notifications.AndroidImportance.HIGH, //MAX
        priority: "max",
        vibrate: [0, 250, 500, 250],
        // vibrate: true,
        // sound: true,
        // sound: "../../assets/notification.wav",
        // vibrationPattern: [0, 250, 250, 250],
      });
    }
  };
  registerForPushNotificationAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    this.setState({ token: token });
  };
  requestCode = () => {
    this.setState({ resendCode: true });
  };
  switchAgreement = () => {
    this.setState({ iAgree: !this.state.iAgree });
  };
  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../../assets/background/Sign-in-Screen.png")}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View style={{ marginTop: 50, alignSelf: "center" }}>
            {/* marginTop: 30 */}
            <Image
              source={require("../../assets/icons/Logo.png")}
              style={{ width: Dimensions.get("screen").width - 50, height: 90 }}
              resizeMode="contain"
            />
          </View>
          <>
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            <View
              style={{
                borderWidth: 1,
                height: 50,
                width: 270,
                marginTop: 90,
                flexDirection: "row",
                alignSelf: "center",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  paddingTop: 4,
                  marginLeft: 15,
                  width: 30, // 20
                }}
              >
                <Icon
                  name="ios-person"
                  style={{ color: "#283a97" }}
                  size={40}
                />
              </View>
              <TextInput
                style={{
                  backgroundColor: "white",
                  marginLeft: 32,
                  height: 30,
                  width: 180, //260
                }}
                placeholder={
                  this.state.lan == "en" ? "Mobile No." : "رقم الجوال"
                }
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType={"done"}
                value={this.state.mobile}
                onChangeText={(phone) => {
                  this.saveState("mobile", phone);
                }}

                // onChangeText={phone => {
                //   // fixNumbers = phone => {
                //   if (typeof phone === "string") {
                //     for (var i = 0; i < 10; i++) {
                //       phone = phone.replace(arabicNumbers[i], i);
                //     }
                //   }
                //   // return phone;
                //   this.saveState("phone", phone);
                //   // this.setState({ mobile: phone.replace(/[^0-9]/g, "") });
                //   // };
                // }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 50,
                // flex: 1,  // flex: 1,
                alignSelf: "center",
              }}
            >
              <View style={{ alignItems: "flex-start" }}>
                {this.state.iAgree === false ? (
                  <View>
                    <Ionicons
                      onPress={this.switchAgreement}
                      name="ios-checkbox-outline"
                      size={24}
                      color="white"
                      style={{ backgroundColor: "white", height: 17 }}
                    />
                  </View>
                ) : (
                  <View>
                    <Ionicons
                      onPress={this.switchAgreement}
                      name="ios-checkbox"
                      size={24}
                      color="white"
                    />
                  </View>
                )}
              </View>
              <View style={{ alignSelf: "center", marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "white" }}>
                  {this.state.lan == "en" ? "I accept the" : "أوافق على"}{" "}
                  <TouchableWithoutFeedback
                    onPress={this.openTermsAndCondition}
                  >
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "white",
                        fontSize: 12,
                      }}
                    >
                      {this.state.lan == "en" ? "terms & conditions" : "الشروط"}
                    </Text>
                  </TouchableWithoutFeedback>
                  {"\n"} {this.state.lan == "en" ? "and the" : "وا"}{" "}
                  <TouchableWithoutFeedback onPress={this.openPrivacyPolicy}>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "white",
                        fontSize: 12,
                      }}
                    >
                      {this.state.lan == "en"
                        ? "privacy policy"
                        : "لأحكام وسياسة الخصوصية"}
                    </Text>
                  </TouchableWithoutFeedback>
                </Text>
              </View>
            </View>
            <Button
              onPress={this.loginUser}
              style={{
                justifyContent: "center",
                backgroundColor: "#283a97",
                marginTop: 26,
                borderRadius: 18,
                alignSelf: "center",
                width: 100, //90
                height: 30,
              }}
            >
              <Text style={{ color: "white" }}>
                {this.state.lan == "en" ? "Sign In" : "تسجيل الدخول"}
              </Text>
            </Button>
          </>
          {/* Content */}

          <View
            style={{
              position: "absolute",
              bottom: "10%",
              alignSelf: "center",
            }}
          >
            {/*  marginTop: "10%" */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "lightgray",
                alignSelf: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: "white" }}>
                {this.state.lan == "en"
                  ? "Signup on this application and start providing services."
                  : "قم بتسجيل الدخول على هذا التطبيق وابدأ في تقديم الخدمات."}
              </Text>
            </View>
            <View style={{ marginTop: 1, alignSelf: "center" }}>
              <Text style={{ fontSize: 12, color: "white" }}>
                {this.state.lan == "en"
                  ? "If you don't have an account,"
                  : "إذا لم يكن لديك حساب قم"}{" "}
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.navigate("Signup")}
                >
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    {this.state.lan == "en" ? "Sign-Up" : "بالتسجيل الآن"}
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>
          </View>
        </ImageBackground>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              marginTop: 170,
              alignSelf: "center",
              height: 258,
              borderRadius: 20,
              width: 300,
              backgroundColor: "#293D94",
            }}
          >
            <View style={{ flex: 1, alignSelf: "center", marginTop: -24 }}>
              <Thumbnail
                source={require("../../assets/icons/Language-top-icon.png")}
              />
            </View>
            <View style={{ position: "absolute", right: 6, top: 8 }}>
              <Ionicons
                onPress={this.hideModal}
                name="ios-close-circle-outline"
                size={30}
                color="white"
              />
            </View>
            <View
              style={{ alignSelf: "center", position: "absolute", top: 50 }}
            >
              <Text
                style={{ color: "white", fontSize: 12, alignSelf: "center" }}
              >
                Enter 4-digit code sent to your mobile number
              </Text>
              <Input
                style={{
                  width: 270,
                  textAlign: "center",
                  height: 30,
                  backgroundColor: "white",
                  borderRadius: 15,
                  marginTop: 10,
                }}
                keyboardType="decimal-pad"
                maxLength={4}
                returnKeyType="done"
                value={this.state.otpentered}
                onChangeText={(otp) => {
                  this.setState({ otpentered: otp });
                }}
                placeholder=""
              />
              {this.state.resendCode === true ? (
                <View style={{ alignSelf: "center", marginTop: 10 }}>
                  <TouchableWithoutFeedback
                    onPress={this.resendVerficationCode}
                  >
                    <Text style={{ color: "white" }}>Resend code</Text>
                  </TouchableWithoutFeedback>
                </View>
              ) : (
                <View
                  style={{
                    alignSelf: "center",
                    marginTop: 10,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      marginTop: 1.6,
                      fontWeight: "bold",
                    }}
                  >
                    Resend in{" "}
                  </Text>
                  <CountDown
                    until={60 * 2 + 59}
                    digitStyle={{ backgroundColor: "#283a97" }}
                    digitTxtStyle={{ color: "white" }}
                    timeToShow={["M", "S"]}
                    onFinish={() => this.requestCode()}
                    timeLabelStyle={{ color: "#283a97" }}
                    size={14}
                    style={{ marginTop: this.state.lan === "en" ? -6 : -8 }}
                    timeLabelStyle={{ marginTop: -12, color: "#283a97" }}
                    separatorStyle={{ color: "white" }}
                    showSeparator={true}
                  />
                </View>
              )}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {this.state.iAgree === false ? (
                  <TouchableWithoutFeedback onPress={this.switchAgreement}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderColor: "white",
                        marginTop: 5,
                        borderWidth: 2,
                        marginLeft: 4,
                      }}
                    ></View>
                  </TouchableWithoutFeedback>
                ) : (
                  <View style={{ marginTop: 3, marginLeft: 4 }}>
                    <Ionicons
                      onPress={this.switchAgreement}
                      name="md-checkmark-circle-outline"
                      size={24}
                      color="white"
                    />
                  </View>
                )}
                <Body>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "white",
                      marginLeft: 7,
                      marginTop: 6,
                    }}
                  >
                    I accept the{" "}
                    <TouchableWithoutFeedback
                      onPress={this.openTermsAndCondition}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        terms & conditions
                      </Text>
                    </TouchableWithoutFeedback>{" "}
                    and the{" "}
                    <TouchableWithoutFeedback onPress={this.openPrivacyPolicy}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        privacy policies
                      </Text>
                    </TouchableWithoutFeedback>
                  </Text>
                </Body>
              </View>
              <Button
                onPress={this.verifyLogin}
                style={{
                  borderRadius: 15,
                  height: 32,
                  backgroundColor: "skyblue",
                  top: 15,
                  alignSelf: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginLeft: 12,
                      marginRight: 12,
                    }}
                  >
                    Verify and Log In
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}
