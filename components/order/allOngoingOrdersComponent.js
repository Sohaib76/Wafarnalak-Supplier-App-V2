import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
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
  Toast,
  Icon,
  Footer,
} from "native-base";
export default class AllOngoingOrderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onGoingOrders: [],
      loading: false,
      user: {},
      isCompleted: false,
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    // this.setState({
    //   lan: navigation.getParam("lan"),
    // });
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    let user = await AsyncStorage.getItem("sp");
    // const { navigation } = this.props;
    let checkCompleted = navigation.getParam("isCompleted");
    if (checkCompleted === false) {
      if (user !== null) {
        let spUser = JSON.parse(user);
        this.setState({ loading: true });
        fetch(
          "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_in_progress_order_requests",
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
              this.setState({
                isCompleted: false,
                loading: false,
                user: spUser,
                isCompleted: checkCompleted,
                onGoingOrders: responseJson.Orders,
              });
            } else {
              this.setState({ loading: false });
              console.log(responseJson);
              Toast.show({
                text:
                  this.state.lan == "en"
                    ? responseJson.message
                    : responseJson.message_ar,
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
    } else {
      let completedOrders = navigation.getParam("completedOrder");
      this.props.navigation.navigate("OngoingOrder", {
        completedOrders: completedOrders,
        isCompleted: checkCompleted,
      });
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
                  this.props.navigation.navigate("MyProfile");
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
              {this.state.lan == "en"
                ? "Ongoing Orders"
                : "جميع الطلبات الجارية"}
            </Title>
            <Right />
          </Header>
          <>
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            {this.state.onGoingOrders &&
              this.state.onGoingOrders.map(
                function (order, index) {
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() =>
                        this.props.navigation.navigate("OngoingOrder", {
                          completedOrder: order,
                          isCompleted: false,
                        })
                      }
                    >
                      {/* <View
                        style={{
                          marginTop: 6,
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
                            {this.state.lan == "en" ? "order#" : "طلبيةرقم #"}{" "}
                            {order.orderid}
                          </Text>
                        </View>
                        <View style={{ marginRight: 12 }}>
                          <Ionicons name={"ios-arrow-forward"} size={30} />
                        </View>
                      </View>
                    </TouchableWithoutFeedback> */}

                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: Dimensions.get("screen").width,
                          height: Platform.OS == "ios" ? "10%" : "12%", //60
                          backgroundColor: "#e9edf2",
                          flexDirection: "row",
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            flex: 1.8,
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <Image
                            source={require("../../assets/icons/icon_order.png")}
                            style={{
                              width: 90, //55
                              height: 90,
                              backgroundColor: "#ece8e8",
                              borderRadius: 35,
                              padding: 20,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                        <View
                          style={{
                            flex: 4.5,
                            marginLeft: 10,
                            alignSelf: "center",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{ color: "#00203b", fontWeight: "bold" }}
                          >
                            Order # {order.orderid}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0, 32, 59, 0.8)",
                              fontSize: 12,
                            }}
                          >
                            {order.orderdetails[0].servicename}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0, 32, 59, 0.8)",
                              fontSize: 12,
                            }}
                          >
                            {order.orderdetails[0].productname}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0, 32, 59, 0.8)",
                              fontSize: 12,
                            }}
                          >
                            {order.orderdetails[0].jobname}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0, 32, 59, 0.8)",
                              fontSize: 12,
                            }}
                          >
                            {order.appointmentdate}
                          </Text>
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
