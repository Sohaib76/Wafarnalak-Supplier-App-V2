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
            {this.state.lan == "en" ? "Financials" : "المعلومات المالية"}
          </Title>
          <Right />
        </Header>
        <>
          {/* Content */}
          <View
            style={{
              backgroundColor: "#283a97",
              alignSelf: "center",
              marginTop: 30,
            }}
          >
            <Text
              style={{
                fontSize: 18,
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

          <View style={{ alignSelf: "center" }}>
            <Text
              style={{ fontSize: 60, color: "#283a97", fontWeight: "bold" }}
            >
              {this.state.lan == "en" ? "SAR" : "ريال"}{" "}
              {this.state.reports.pending_balance}
            </Text>
          </View>
          <View style={{ alignSelf: "center", marginTop: 4 }}>
            <Text>
              {this.state.lan == "en"
                ? "Make the payment before"
                : "قم بالدفع قبل"}{" "}
              {this.state.reports.due_date}
            </Text>
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
                        marginTop: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        // flex: 1,
                        justifyContent: "space-between",
                        width: Dimensions.get("screen").width,
                        height: 60,
                        backgroundColor: "lightgray",
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text>
                          {this.state.lan == "en" ? "Invoice for" : "فاتورة"}{" "}
                          {invoice.month} {invoice.year}
                        </Text>
                      </View>
                      <View style={{ marginRight: 12 }}>
                        <Ionicons name={"ios-arrow-forward"} size={30} />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }.bind(this)
            )}
        </>
        {/* Content */}
      </Container>
    );
  }
}
