import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Text,
  View,
  Image,
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
export default class OrderDeliveredComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completedOrders: [],
      loading: false,
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.setState({
      lan: navigation.getParam("lan"),
    });
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({ loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_completed_order_requests",
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
            console.log(responseJson);
            this.setState({
              loading: false,
              completedOrders: responseJson.Orders,
            });
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
            text: "Something went wrong please try again later!",
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
                this.props.navigation.navigate("MyProfile");
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
            {this.state.lan == "en"
              ? "Delivered Orders"
              : "الطلبات التي تم توصيلها"}
          </Title>
          <Right />
        </Header>
        <>
          {/* Content */}
          <Spinner visible={this.state.loading} textContent={""} />
          {this.state.completedOrders &&
            this.state.completedOrders.map(
              function (order, index) {
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() =>
                      this.props.navigation.navigate("OngoingOrder", {
                        isCompleted: true,
                        completedOrder: order,
                      })
                    }
                  >
                    <View
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
