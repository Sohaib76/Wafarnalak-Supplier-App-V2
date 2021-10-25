import React from "react";
import {
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import call from "react-native-phone-call";
import {
  Input,
  Item,
  Form,
  Container,
  Content,
  Header,
  Left,
  Right,
  Title,
  Button,
  Icon,
  Footer,
} from "native-base";
export default class DisabledAccountComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack(); // works best when the goBack is async
      return true;
    });
  };
  goBack = () => {
    this.props.navigation.navigate("Login");
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  makeCall = () => {
    const args = {
      number: "+966577311430",
      prompt: true,
    };

    call(args);
  };
  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../../assets/icons/Background.png")}
          resizeMode="contain" //cover
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <Header
            style={{
              backgroundColor: "#fff",
              height: 80,
              borderBottomColor: "#00203b",
              borderBottomWidth: 1,
              marginBottom: 30,
            }}
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
                  this.props.navigation.navigate("Login");
                }}
                name={"ios-arrow-back"}
                size={30}
                color={"#00203b"}
              />
            </Left>
            <Title
              style={{
                color: "#00203b",
                position: "absolute",
                top: Platform.OS === "android" ? 38 : 38,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "Account Status" : "حالة الحساب"}
              {/* {"Account Status"} */}
            </Title>
            <Right />
          </Header>
          <>
            <View
              style={{
                marginTop: 60,
                alignSelf: "center",
                borderWidth: 1,
                height: 240, //190
                width: Dimensions.get("screen").width - 80, //120
                borderColor: "lightgray",
                backgroundColor: "rgba(0, 32, 59, 0.2)",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <Image
                  source={require("../../assets/icons/disabled2.png")}
                  style={{ width: 140, height: 110 }}
                  resizeMode="contain"
                />
              </View>

              <View
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    color: "rgba(0,0,0,0.7)",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {this.state.lan == "en"
                    ? "Your Account has been disabled, please contact Wafarnalak for further details."
                    : "تم تعطيل حسابك ، يرجى الاتصال بـ Wafarnalak للحصول على مزيد من التفاصيل."}
                </Text>
              </View>
            </View>
            {/* <TouchableWithoutFeedback onPress={this.makeCall}>
              <View style={{ marginTop: 20, alignSelf: "center" }}>
                <Image
                  source={require("../../assets/icons/Call.png")}
                  style={{ width: 40, height: 35 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback> */}
            <Button
              onPress={this.makeCall}
              style={{
                // marginTop: "0%",
                backgroundColor: "#283a97",
                justifyContent: "center",
                width: "82%",
                height: 55,
                alignSelf: "center",
                backgroundColor: "rgba(0, 32, 59, 1)",
                borderRadius: 12,
                // position: "absolute",
                // bottom: 30,
                marginTop: 60,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                {this.state.lan == "en" ? "Contact" : "اتصل"}
                {/* {"Contact"} */}
              </Text>
            </Button>
          </>
        </ImageBackground>
      </Container>
    );
  }
}
