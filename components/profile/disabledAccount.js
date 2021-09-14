import React from "react";
import {
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
  Text,
  View,
  Image,
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
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack(); // works best when the goBack is async
      return true;
    });
  }
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
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
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
            Account Status
          </Title>
          <Right />
        </Header>
        <>
          <View
            style={{
              marginTop: 60,
              alignSelf: "center",
              borderWidth: 1,
              height: 190,
              width: Dimensions.get("screen").width - 120,
              borderColor: "lightgray",
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
                source={require("../../assets/icons/Disabled.png")}
                style={{ width: 140, height: 110 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={this.makeCall}>
            <View style={{ marginTop: 20, alignSelf: "center" }}>
              <Image
                source={require("../../assets/icons/Call.png")}
                style={{ width: 40, height: 35 }}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </>
      </Container>
    );
  }
}
