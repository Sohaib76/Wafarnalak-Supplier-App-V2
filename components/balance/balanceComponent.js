import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
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
  Footer,
} from "native-base";
export default class BalanceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      spUser: {},
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.setState({
      lan: navigation.getParam("lan"),
    });
    let user = await AsyncStorage.getItem("sp");
    console.log("suuuuu", user);
    if (user !== null) {
      let spUser = JSON.parse(user);
      console.log("sp user uu", spUser);

      this.setState({ loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_monthly_reports",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spid: spUser.spid,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            console.log("Response", responseJson);
            this.setState({ reports: responseJson, spUser: spUser });
          } else {
            this.setState({ loading: false });
            Toast.show({
              text: responseJson.message,
              buttonText: "",
              position: "bottom",
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
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
  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../../assets/icons/Background.png")}
          resizeMode="fill" //cover
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <Header style={{ backgroundColor: "white", height: 80 }}>
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
              {this.state.lan == "en" ? "Financials" : "المعلومات المالية"}
            </Title>
            <Right />
          </Header>
          <>
            {/* Content */}
            <View
              style={{
                backgroundColor: "#00203b",
                height: "30%",
                borderBottomEndRadius: 40,
                borderBottomLeftRadius: 40,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 15, //18
                    color: "white",
                    paddingLeft: 6,
                    paddingRight: 6,
                  }}
                >
                  {this.state.lan == "en"
                    ? "Your due amount is"
                    : "المبلغ المستحق هو"}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  borderRadius: 80,
                  borderWidth: 5,
                  borderColor: "white",
                  width: 130,
                  height: 130,
                  marginTop: "4%",
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "#fff", alignSelf: "center" }}
                >
                  {this.state.lan == "en" ? "SAR" : "ريال"}
                </Text>
                <Text
                  style={{
                    fontSize: 50,
                    color: "#fff",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {this.state.reports.pending_balance}
                </Text>
              </View>
              <View style={{ alignSelf: "center", marginTop: 15 }}>
                <Text style={{ color: "white" }}>
                  {this.state.lan == "en"
                    ? "Make the payment before"
                    : "قم بالدفع قبل"}{" "}
                  {this.state.reports.due_date}
                </Text>
              </View>
            </View>
            {/* 
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("ComessionCalculator", {
                spUser: this.state.spUser
              });
            }}
          >
            <View
              style={{
                marginTop: 20,
                borderRadius: 6,
                backgroundColor: "#283a97",
                alignSelf: "center"
              }}
            >
              <Text style={{ margin: 10, color: "white" }}>
                Calculation Model
              </Text>
            </View>
          </TouchableWithoutFeedback> */}
            {this.state.reports.invoices &&
              this.state.reports.invoices.map(
                function (invoice, index) {
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() =>
                        this.props.navigation.navigate("InvoiceTable", {
                          invoice: invoice,
                        })
                      }
                    >
                      <View
                        style={{
                          marginTop: 30,
                          flexDirection: "row",
                          alignItems: "center",
                          // flex: 1,
                          // justifyContent: "space-between",
                          width: Dimensions.get("screen").width,
                          height: 60,
                          backgroundColor: "white",
                          borderRadius: 20,
                          width: "90%",
                          alignSelf: "center",
                          borderColor: "grey",
                          borderWidth: 0.5,
                        }}
                      >
                        <View style={{ marginLeft: 20 }}>
                          <Text style={{ color: "gray" }}>
                            {this.state.lan == "en" ? "Invoice for" : "فاتورة"}{" "}
                            {invoice.month} {invoice.year}
                          </Text>
                        </View>
                        <View
                          style={{
                            // marginRight: 12,
                            backgroundColor: "#00203b",
                            // alignContent: "flex-end",
                            position: "absolute",
                            right: 0,

                            // borderTopLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            borderTopRightRadius: 20,
                            height: 60,
                            width: "20%",
                            alignItems: "center",
                            justifyContent: "center",
                            // borderBottomStartRadius: 20,
                          }}
                        >
                          <Ionicons
                            name={"ios-arrow-forward"}
                            size={30}
                            color={"white"}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }.bind(this)
              )}
          </>
          {/* Content */}
        </ImageBackground>
      </Container>
    );
  }
}
