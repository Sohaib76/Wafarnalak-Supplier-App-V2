import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
  View,
  AsyncStorage,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  Toast,
} from "native-base";

export default class ComessionCalculatorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "",
      commission: 0,
      spUser: {},
    };
  }
  saveState = (label, value) => {
    this.setState({ [label]: value });
    this.calculateCommission(value);
  };
  calculateCommission = (price) => {
    console.log("proice ", price.toString());
    if (price !== "") {
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/get_commission",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: price.toString(),
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("success", responseJson);
          if (responseJson.error === false) {
            this.setState({ commission: responseJson.commission });
          } else {
            Toast.show({
              text: responseJson.message,
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
            position: "bottom",
          });
        });
    }
  };
  componentDidMount = () => {
    const { navigation } = this.props;
    let spUser = navigation.getParam("getParam");
    this.setState({ spUser: spUser });
    console.log("spUser", spUser);
  };
  render() {
    return (
      <Container>
        <Header
          style={{
            marginTop: 0,
            backgroundColor: "#283a97",
            height: 80,
            justifyContent: "center",
          }}
        >
          <Left style={{ marginLeft: 5 }}>
            <Ionicons
              onPress={() => {
                this.props.navigation.goBack();
              }}
              name={"ios-arrow-back"}
              size={30}
              color={"white"}
            />
          </Left>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "center",
              position: Platform.OS === "android" ? "absolute" : "relative",
              alignSelf: "center",
            }}
          >
            <Title style={{ color: "white", fontSize: 18 }}>
              Calculate Commission
            </Title>
          </View>
          <Right />
        </Header>
        <Image
          source={require("../../assets/Icon2.png")}
          style={{ width: 40, height: 40, marginTop: -20, alignSelf: "center" }}
          resizeMode="contain"
        />
        <>
          {/* Content */}
          <View style={{ marginTop: 40, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>Commission Calculator</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 3 }}>
                <Image
                  source={require("../../assets/icons/Riyal-grey.png")}
                  style={{ width: 30, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <Input
                placeholder="Enter Price"
                placeholderTextColor="gray"
                returnKeyType="done"
                value={this.state.price}
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(price) => {
                  this.saveState("price", price);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 30, alignSelf: "center" }}>
            <Text style={{ color: "#283a97" }}>Calculated Commission</Text>
          </View>
          <View
            style={{
              marginTop: 5,
              width: 90,
              height: 90,
              borderRadius: 45,
              borderWidth: 4,
              borderColor: "#283a97",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 16,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              SAR
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {this.state.price !== "" ? this.state.commission : 0}
            </Text>
          </View>
        </>
        {/* Content */}
      </Container>
    );
  }
}
