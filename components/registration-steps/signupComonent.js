import * as WebBrowser from "expo-web-browser";

import {
  AsyncStorage,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
} from "react-native";
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Input,
  Item,
  Label,
  Left,
  Right,
  Thumbnail,
  Title,
  Toast,
  Icon,
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
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

export default class SignupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      modalVisible: false,
      otp: "",
      otpid: "",
      loading: false,
      otpentered: "",
      resendCode: false,
      iAgree: false,
    };
  }
  saveState = (label, value) => {
    this.setState({ [label]: value });
  };
  hideModal = () => {
    this.setState({ modalVisible: false });
  };
  registerNewUser = () => {
    if (this.state.name) {
      if (this.state.email !== "") {
        if (
          this.state.phone !== "" &&
          this.state.phone.length == 10 &&
          this.state.phone.charAt(0) == 0 &&
          this.state.phone.charAt(1) == 5
        ) {
          // this.state.phone.charAt(0) == 0 &&
          //   this.state.phone.charAt(1) == 5 &&

          this.setState({ loading: true });
          fetch(
            "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_signup",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                mobile: this.state.phone,
              }),
            }
          )
            .then((response) => response.json())

            .then((responseJson) => {
              console.log("spppp", responseJson);
              if (responseJson.error === false) {
                let s = responseJson.sp.spid.toString();
                this.setState({ loading: false }, async () => {
                  await AsyncStorage.setItem("SPMOB", responseJson.sp.mobile);
                  await AsyncStorage.setItem("SPID", s);
                  await AsyncStorage.setItem("SPNAME", responseJson.sp.name);
                  this.props.navigation.navigate("BusinessCategory", {
                    spid: responseJson.sp,
                  });
                });
              } else {
                console.log("error");
                Toast.show({
                  text:
                    this.state.lan == "en"
                      ? responseJson.message
                      : responseJson.message_ar,
                  buttonText: "",
                  position: "bottom",
                });
                this.setState({ loading: false });
              }
            })
            .catch((error) => {
              console.log("error2", error);

              Toast.show({
                text: "Something went wrong try again later!",
                buttonText: "",
                position: "bottom",
              });
            });
        } else {
          Toast.show({
            text: "Please enter the valid  mobile number!",
            buttonText: "",
            position: "bottom",
          });
        }
      } else {
        Toast.show({
          text: "Please enter the valid email!",
          buttonText: "",
          position: "bottom",
        });
      }
    } else {
      console.log("error3");
      Toast.show({
        text: "Please fill the username!",
        buttonText: "",
        position: "bottom",
      });
    }
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
            } else {
              Toast.show({
                text:
                  this.state.lan == "en"
                    ? responseJson.message
                    : responseJson.message_ar,
                buttonText: "",
                position: "bottom",
              });
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            Toast.show({
              text: "Something went wrong tryagain later!",
              buttonText: "",
              position: "bottom",
            });
          });
      } else {
        Toast.show({
          text:
            this.state.lan == "en"
              ? "Check the terms and condition & privacy policy!"
              : "حدد الشروط والأحكام وسياسة الخصوصية",
          buttonText: "",
          position: "bottom",
        });
      }
    } else {
      Toast.show({
        text: "Enter a valid 4 digit OTP Code!",
        buttonText: "",
        position: "bottom",
      });
    }
  };

  requestCode = () => {
    this.setState({ resendCode: true });
  };
  resendVerficationCode = () => {};
  switchAgreement = () => {
    this.setState({ iAgree: !this.state.iAgree });
  };

  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
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
          <Header
            style={{ backgroundColor: "rgba(255,255,255,0)", height: 80 }}
          >
            <Left
              style={{
                marginTop: Platform.OS === "ios" ? 9 : 24,
                marginLeft: 10,
                flexDirection: "row",
              }}
            >
              <Ionicons
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                name={"ios-arrow-back"}
                size={30}
                color={"white"}
              />
            </Left>
            <Title
              style={{
                color: "white",
                position: "absolute",
                top: Platform.OS === "android" ? 38 : 38,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "User Details" : "بيانات المستخدم"}
            </Title>
            <Right />
          </Header>
          <>
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            {/* <Form>
              <Item stackedLabel>
                <Label style={{ color: "#283a97" }}>
                  {this.state.lan == "en" ? "Full Name" : "اسم الكامل"}
                </Label>
                <Input
                  value={this.state.name}
                  onChangeText={(name) => {
                    this.saveState("name", name);
                  }}
                  keyboardType="default"
                />
              </Item>
              <Item stackedLabel>
                <Label style={{ color: "#283a97" }}>
                  {this.state.lan == "en"
                    ? "Email (Optional)"
                    : "(البريد الإلكتروني(اختياري"}
                </Label>
                <Input
                  value={this.state.email}
                  onChangeText={(email) => {
                    this.saveState("email", email);
                  }}
                  keyboardType="email-address"
                />
              </Item>
              <View style={{ flexDirection: "row" }}>
                <View>
                  <Item stackedLabel>
                    <Label style={{ color: "#283a97" }}>
                      {this.state.lan == "en" ? "Code" : "مفتاح الدولة"}
                    </Label>
                    <Input
                      style={{ width: 90 }}
                      value="+966"
                      editable={false}
                    />
                  </Item>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Item stackedLabel>
                    <Label style={{ color: "#283a97" }}>
                      {this.state.lan == "en" ? "Mobile Number" : "رقم الجوال"}
                    </Label>
                    <Input
                      style={{ width: 250 }}
                      placeholder="05XXXXXXXX"
                      value={this.state.phone}
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
                      onChangeText={(value) => {
                        this.saveState("phone", value.replace(/[^0-9]/g, ""));
                      }}
                      keyboardType="phone-pad"
                    />
                  </Item>
                </View>
              </View>
            </Form>
             */}

            {/* <View style={{ alignSelf: "center", marginTop: 15 }}>
            
            <Button
                full
                onPress={this.registerNewUser} //Change this line
                // onPress={() => this.props.navigation.navigate("BusinessCategory")}
                rounded
                style={{
                  backgroundColor: "#283a97",
                  width: 270, //width: 270,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {this.state.lan == "en" ? "Sign Up" : "اشتراك"}
                </Text>
              </Button>
            </View> */}

            <View style={{ marginTop: 70 }}>
              <View style={{ alignItems: "flex-start" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    marginLeft: 70,
                    marginBottom: 5,
                  }}
                >
                  {this.state.lan == "en" ? "Full Name" : "اسم الكامل"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // alignSelf: "center",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "80%",
                }}
              >
                <View
                  style={{
                    paddingTop: 4,
                    marginLeft: 15,
                    width: 30, // 20
                    alignSelf: "center",
                    // marginTop: 90,
                    marginRight: 10,
                    marginLeft: 30,
                  }}
                >
                  <Icon name="person" style={{ color: "#fff" }} size={40} />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    height: 50,
                    width: 290,
                    // marginTop: 90,
                    flexDirection: "row",
                    alignSelf: "center",
                    backgroundColor: "white",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      marginLeft: 32,
                      height: 30,
                      width: 180, //260
                    }}
                    placeholder={
                      this.state.lan == "en" ? "Abdul Aziz" : "Abdul Aziz"
                    }
                    returnKeyType={"done"}
                    value={this.state.name}
                    onChangeText={(name) => {
                      this.saveState("name", name);
                    }}
                    keyboardType="default"
                  />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 40 }}>
              <View style={{ alignItems: "flex-start" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    marginLeft: 70,
                    marginBottom: 5,
                  }}
                >
                  {this.state.lan == "en"
                    ? "Email (Optional)"
                    : "(البريد الإلكتروني(اختياري"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // alignSelf: "center",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "80%",
                }}
              >
                <View
                  style={{
                    paddingTop: 4,
                    marginLeft: 15,
                    width: 30, // 20
                    alignSelf: "center",
                    // marginTop: 90,
                    marginRight: 10,
                    marginLeft: 30,
                  }}
                >
                  <Icon name="mail" style={{ color: "#fff" }} size={40} />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    height: 50,
                    width: 290,
                    // marginTop: 90,
                    flexDirection: "row",
                    alignSelf: "center",
                    backgroundColor: "white",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      marginLeft: 32,
                      height: 30,
                      width: 180, //260
                    }}
                    placeholder={
                      this.state.lan == "en" ? "abc@gmail.com" : "abc@gmail.com"
                    }
                    returnKeyType={"done"}
                    value={this.state.email}
                    onChangeText={(email) => {
                      this.saveState("email", email);
                    }}
                    keyboardType="email-address"
                  />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 40 }}>
              <View style={{ alignItems: "flex-start" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    marginLeft: 70,
                    marginBottom: 5,
                  }}
                >
                  {this.state.lan == "en"
                    ? "Mobile Number"
                    : "(البريد الإلكتروني(اختياري"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // alignSelf: "center",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "80%",
                }}
              >
                <View
                  style={{
                    paddingTop: 4,
                    marginLeft: 15,
                    width: 30, // 20
                    alignSelf: "center",
                    // marginTop: 90,
                    marginRight: 10,
                    marginLeft: 30,
                  }}
                >
                  <Icon name="call" style={{ color: "#fff" }} size={40} />
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    height: 50,
                    width: 80, //290
                    // marginTop: 90,
                    flexDirection: "row",
                    alignSelf: "center",
                    backgroundColor: "white",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      marginLeft: 32,
                      height: 30,
                      // width: 10, //260
                    }}
                    placeholder={this.state.lan == "en" ? "+966" : "+966"}
                    value={+966}
                    defaultValue={+966}
                    editable={false}
                    // onChangeText={(value) => {
                    //   this.saveState("phone", value.replace(/[^0-9]/g, ""));
                    // }}
                    keyboardType="phone-pad"
                  />
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    height: 50,
                    width: 220, //290
                    // marginTop: 90,
                    flexDirection: "row",
                    alignSelf: "center",
                    backgroundColor: "white",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      marginLeft: 32,
                      height: 30,
                      width: 180, //260
                    }}
                    placeholder={
                      this.state.lan == "en" ? "05xxxxxxxxx" : "05xxxxxxxxx"
                    }
                    returnKeyType={"done"}
                    value={this.state.phone}
                    onChangeText={(value) => {
                      this.saveState("phone", value.replace(/[^0-9]/g, ""));
                    }}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                width: "80%",
                height: "6.5%",
                marginTop: 50,
              }}
            >
              <Button
                onPress={this.registerNewUser}
                style={{
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  marginTop: 26,
                  borderRadius: 12,
                  alignSelf: "center",
                  width: "100%", //90
                  height: "100%",
                }}
              >
                <Text
                  style={{ color: "black", fontSize: 15, textAlign: "center" }}
                >
                  {this.state.lan == "en" ? "Sign Up" : "بالتسجيل الآن"}
                </Text>
              </Button>
            </View>
            <Text
              style={{
                color: "#283a97",
                textAlign: "center",
                marginLeft: 20,
                marginRight: 20,
                marginTop: "15%",
                fontSize: 20,
                color: "white",
              }}
            >
              {this.state.lan == "en"
                ? "By signing up, you agree Wafarnalak's"
                : "بالتسجيل ، أنت توافق على"}
              {"  "}
              <TouchableWithoutFeedback
                onPress={() => {
                  WebBrowser.openBrowserAsync(
                    "https://xn--mgbt1ckekl.com/terms-conditions/"
                  );
                }}
              >
                <Text style={{ textDecorationLine: "underline" }}>
                  {this.state.lan == "en"
                    ? "terms and conditions"
                    : "شروط وأحكام وفرنالك"}
                </Text>
              </TouchableWithoutFeedback>
            </Text>
          </>
        </ImageBackground>
        {/* Content */}
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
                {this.state.lan == "en"
                  ? "Enter 4-digit code sent to your mobile number"
                  : "أدخل الرمز المكون من 4 أرقام المرسل إلى رقم الجوال"}
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
                returnKeyType={"done"}
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
                    <Text style={{ color: "white" }}>
                      {this.state.lan == "en"
                        ? "Resend code"
                        : "إعادة إرسال الرمز"}
                    </Text>
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
                    {this.state.lan == "en" ? "Resend in" : "إعادة الإرسال"}
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
                    {this.state.lan == "en" ? "I accept the" : "أقبل"}
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
                        {this.state.lan == "en"
                          ? "terms & conditions"
                          : "البنود و الظروف"}
                      </Text>
                    </TouchableWithoutFeedback>
                    {this.state.lan == "en" ? "and the" : "و ال"}
                    <TouchableWithoutFeedback onPress={this.openPrivacyPolicy}>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        {this.state.lan == "en"
                          ? "privacy policies"
                          : "سياسات الخصوصية"}
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
                  top: 25,
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
                    {this.state.lan == "en"
                      ? "Verify and Log In"
                      : "تحقق وتسجيل الدخول"}
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
