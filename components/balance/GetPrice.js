import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  Text,
  View,
  AsyncStorage,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

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
  Footer,
  Radio,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

export class GetPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrder: {},
      user: {},
      loading: false,
      value: "",
      priceCalculated: false,
      // gender: "",
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.setState({
      lan: navigation.getParam("lan"),
    });
    let user = await AsyncStorage.getItem("sp");
  };

  onValueChange(value) {
    this.setState({
      gender: value,
    });
  }

  getPrice = () => {
    if (
      this.state.materialPrice &&
      this.state.servicePrice &&
      this.state.gender
    ) {
      console.log("Get Price");
      let wCharges;
      let mPurchase;
      if (this.state.gender == "0") {
        this.setState({ wafarnalakCharges: 50 });
        console.log("materialPrice", this.state.materialPrice);
        this.setState({
          materialPurchase: Math.round(this.state.materialPrice * 0.1),
        });
        wCharges = 50;
        mPurchase = this.state.materialPrice * 0.1;
      } else if (this.state.gender == "1") {
        this.setState({ wafarnalakCharges: 30 });
        this.setState({
          materialPurchase: Math.round(this.state.materialPrice * 0.05),
        });
        wCharges = 30;
        mPurchase = this.state.materialPrice * 0.05;
      }
      let total =
        +this.state.materialPrice +
        +this.state.servicePrice +
        +wCharges +
        +mPurchase;
      this.setState({ total: total, priceCalculated: true });
    }
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
                  this.props.navigation.goBack();
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
              {this.state.lan == "en" ? "Price Calculator" : "حاسبة الأسعار"}
            </Title>
            <Right />
          </Header>
          <ScrollView style={{ marginBottom: 80 }}>
            <Text
              style={{
                color: "rgba(0, 32, 59, 1)",

                marginBottom: 10,
                //marginTop: 5,
                marginLeft: 20,
                fontSize: 16,
                alignSelf: "flex-start",
              }}
            >
              {this.state.lan == "en"
                ? "Please enter the below details:"
                : "الرجاء إدخال التفاصيل"}
            </Text>
            <View
              style={{
                marginBottom: 20, //40
                marginTop: 5, //20
                marginLeft: 18,
                marginRight: 35,
              }}
            >
              <Text
                style={{
                  color: "rgba(0, 32, 59, 1)",

                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                {this.state.lan == "en" ? "Service Price" : " سعر الخدمة"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  // marginLeft: 18,
                  // marginRight: 35,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginTop: 0,
                    height: 42,
                    backgroundColor: "rgba(0, 32, 59, 1)",
                    // backgroundColor: "red",
                    justifyContent: "center",
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Riyal-grey.png")}
                    style={{
                      marginLeft: 7,
                      width: 70, //70
                      height: 33, //58 35
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      tintColor: "white",
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Input
                  multiline={true}
                  placeholder={
                    this.state.lan == "en" ? "Enter service price" : "125"
                  }
                  //placeholderTextColor="rgba(0, 32, 59, 1)"
                  editable={!this.state.isCompleted}
                  value={this.state.servicePrice}
                  // keyboardType="decimal-pad"
                  style={{
                    backgroundColor: "white",
                    alignItems: "center",
                    height: 42, //35 48
                    marginLeft: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0, 32, 59, 1)",
                    borderWidth: 0.5,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    color: "gray",
                  }}
                  onChangeText={(sUsed) => {
                    this.setState({ servicePrice: sUsed });
                  }}
                />
              </View>
            </View>

            <View style={{ marginTop: 0, marginLeft: 18, marginRight: 35 }}>
              <Text
                style={{
                  color: "rgba(0, 32, 59, 1)",

                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                {this.state.lan == "en" ? "Material Price" : "سعر المادة"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  // marginLeft: 18,
                  // marginRight: 35,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginTop: 0,
                    height: 42,
                    backgroundColor: "rgba(0, 32, 59, 1)",

                    justifyContent: "center",
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Riyal-grey.png")}
                    style={{
                      marginLeft: 7,
                      width: 70,
                      height: 33, //58 35
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      tintColor: "white",
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Input
                  multiline={true}
                  placeholder={
                    this.state.lan == "en" ? "Enter material price" : "125"
                  }
                  //placeholderTextColor="rgba(0, 32, 59, 1)"
                  editable={!this.state.isCompleted}
                  value={this.state.materialPrice}
                  // keyboardType="decimal-pad"
                  style={{
                    backgroundColor: "white",
                    alignItems: "center",
                    height: 42, //35 48
                    marginLeft: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0, 32, 59, 1)",
                    borderWidth: 0.5,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    color: "gray",
                  }}
                  onChangeText={(sUsed) => {
                    this.setState({ materialPrice: sUsed });
                  }}
                />
              </View>
            </View>
            <Text
              style={{
                color: "rgba(0, 32, 59, 1)",

                marginBottom: 10,
                marginTop: 30,
                marginLeft: 20,
                alignSelf: "flex-start",
              }}
            >
              {this.state.lan == "en" ? "Customer" : "عميل"}
            </Text>
            <Picker
              mode="dropdown"
              selectedValue={this.state.gender}
              style={{
                // backgroundColor: "white", //white
                // borderWidth: 0.5,
                // borderRadius: 20,
                // height: 32,
                // padding: 10,
                marginRight: 10,
                marginLeft: 20,
                // borderBottomColor: "black",
              }}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item label="Select" value="9" />
              <Picker.Item label="W" value="0" />

              <Picker.Item label="NW" value="1" />
            </Picker>
            {/* <Picker
              mode="dropdown"
              //iosHeader={"Customer"}
              iosIcon={<Ionicons name="ios-arrow-down" color={"black"} />}
              placeholderStyle={{
                color: "#bfc6ea",
              }}
              placeholderIconColor="black"
              selectedValue={this.state.gender}
              style={{
                backgroundColor: "red", //white
                borderWidth: 0.5,
                borderRadius: 20,
                height: 32,
                padding: 10,
                marginRight: 10,
                marginLeft: 20,
              }}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item
                label={this.state.lan == "en" ? "W" : "م"}
                value="0"
              />
              <Picker.Item
                label={this.state.lan == "en" ? "NW" : "غ.م"}
                value="1"
              />
            </Picker> */}
            {/* <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={this.state.value}
              onChange={(nextValue) => {
                this.setState({ value: nextValue });
              }}
            >
              <Radio value="one" my={1}>
                One
              </Radio>
              <Radio value="two" my={1}>
                Two
              </Radio>
            </Radio.Group> */}
            {/* <Center>
              <Radio.Group></Radio.Group>
            </Center> */}
            <Button
              onPress={this.getPrice}
              style={{
                marginTop: 15, //20% 30
                backgroundColor: "#283a97",
                justifyContent: "center",
                width: "82%",
                height: 50, //7.2%
                alignSelf: "center",
                backgroundColor: "rgba(0, 32, 59, 1)",
                borderRadius: 12,
                //position: "absolute",
                // top: 500, //30
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
                {this.state.lan == "en" ? "Get Price" : "احصل على السعر "}
              </Text>
            </Button>

            {this.state.priceCalculated && (
              <>
                <Text
                  style={{
                    color: "rgba(0, 32, 59, 1)",

                    marginBottom: 10,
                    marginTop: 20,
                    marginLeft: 20,
                    fontSize: 16,
                    alignSelf: "flex-start",
                  }}
                >
                  {this.state.lan == "en"
                    ? "Below are the Price Details:"
                    : "أدناه تفاصيل السعر"}
                </Text>

                <View
                  style={{
                    marginTop: 5,
                    marginRight: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {this.state.lan == "en" ? "Total:" : "المجموع"}
                    </Text>

                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                        alignSelf: "flex-end",
                      }}
                    >
                      {`SAR ${this.state.total}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {this.state.lan == "en"
                        ? "Service Charges"
                        : "رسوم الخدمات"}
                    </Text>

                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        alignSelf: "flex-end",
                      }}
                    >
                      {`SAR ${this.state.servicePrice}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "95%",
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      marginLeft: 20,
                      marginRight: 20,
                      marginBottom: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {this.state.lan == "en"
                        ? "Material Charges"
                        : "رسوم المواد"}
                    </Text>

                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        alignSelf: "flex-end",
                      }}
                    >
                      {`SAR ${this.state.materialPrice}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "95%",
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      marginLeft: 20,
                      marginRight: 20,
                      marginBottom: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        alignSelf: "flex-end",
                      }}
                    >
                      {this.state.lan == "en"
                        ? "Material Purchase Charges"
                        : "رسوم شراء المواد"}
                    </Text>

                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {`SAR ${this.state.materialPurchase}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "95%",
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      marginLeft: 20,
                      marginRight: 20,
                      marginBottom: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                        alignSelf: "flex-end",
                      }}
                    >
                      {this.state.lan == "en"
                        ? "Wafarnalak Charges"
                        : "رسوم وفرنالك"}
                    </Text>

                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 1)",

                        marginLeft: 20,
                        marginBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {`SAR ${this.state.wafarnalakCharges}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "95%",
                      backgroundColor: "rgba(0, 32, 59, 1)",
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />
                </View>
              </>
            )}
            {/* <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
                marginRight: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "rgba(0, 32, 59, 1)",

                    marginLeft: 20,
                    marginBottom: 10,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {this.state.lan == "en" ? "Total:" : ""}
                </Text>
                <Text
                  style={{
                    color: "rgba(0, 32, 59, 1)",

                    marginLeft: 20,
                    marginBottom: 10,
                    fontSize: 15,
                  }}
                >
                  {this.state.lan == "en" ? "Service Charges" : ""}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "rgba(0, 32, 59, 1)",

                    marginLeft: 20,
                    marginBottom: 10,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {this.state.lan == "en" ? "SAR 315" : ""}
                </Text>
                <Text
                  style={{
                    color: "rgba(0, 32, 59, 1)",

                    marginLeft: 20,
                    marginBottom: 10,
                    fontSize: 15,
                  }}
                >
                  {this.state.lan == "en" ? "SAR 125" : ""}
                </Text>
                
              </View>
            </View> */}
          </ScrollView>
        </ImageBackground>
      </Container>
    );
  }
}

export default GetPrice;
