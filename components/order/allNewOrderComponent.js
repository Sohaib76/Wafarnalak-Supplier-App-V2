import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Text,
  View,
  Image,
  ImageBackground,
  PlatformColor,
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
export default class AllNewOrderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrders: [],
      loading: false,
      user: {},
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    // this.setState({
    //   lan: navigation.getParam("lan"),
    // });
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({ loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_new_order_requests",
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
              loading: false,
              user: spUser,
              newOrders: responseJson.Orders,
            });
          } else {
            this.setState({ loading: false });
            Toast.show({
              text:
                this.state.lan == "en" ? "No New Order" : "لا توجد طلبات جديدة", // No New Order  responseJson.message
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
              {this.state.lan == "en" ? "New Orders" : "كل الطلبات الجديدة"}
            </Title>
            <Right />
          </Header>
          <>
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            {this.state.newOrders &&
              this.state.newOrders.map(
                function (order, index) {
                  console.log("order", order);
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() =>
                        this.props.navigation.navigate("NewOrder", {
                          newOrder: order,
                        })
                      }
                    >
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                          // alignItems: "center",
                          // flex: 1,
                          justifyContent: "space-between",
                          width: Dimensions.get("screen").width,
                          height: Platform.OS == "ios" ? "10%" : "14%", //60
                          backgroundColor: "#e9edf2",
                          flexDirection: "row",
                          marginRight: 10,
                        }}
                      >
                        {/* <View style={{ marginLeft: 20 }}>
                          <Text>
                            {this.state.lan == "en" ? "order" : "طلبيةرقم #"}{" "}
                            {order.orderid}
                          </Text>
                        </View>
                        <View style={{ marginRight: 12 }}>
                          <Ionicons name={"ios-arrow-forward"} size={30} />
                        </View> */}
                        <View
                          style={{
                            // justifyContent: "flex-start",
                            alignItems: "flex-start",
                            // backgroundColor: "blue",
                            flex: 0.8,
                            marginLeft: 10,
                          }}
                        >
                          <Image
                            source={require("../../assets/icons/New-Tag.png")}
                            style={{
                              width: 30, //55
                              height: 30,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                        <View
                          style={{
                            flex: 2,
                            alignSelf: "center",
                            justifyContent: "center",
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
                            marginLeft: "5%",
                            alignSelf: "center",
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
                        <View style={{ flex: 1.5, alignSelf: "center" }}>
                          <Image
                            source={require("../../assets/icons/Call-Icon2.png")}
                            style={{
                              width: 40, //55
                              height: 40,
                              backgroundColor: "#ece8e8",
                              borderRadius: 35,
                              padding: 20,
                            }}
                            resizeMode="contain"
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
