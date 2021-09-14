import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  AsyncStorage,
  Text,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import call from "react-native-phone-call";
import { Linking } from "expo";
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
  Button,
  Toast,
  Footer,
} from "native-base";
export default class NewOrderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrder: {},
      user: {},
      loading: false,
    };
  }
  componentDidMount = async () => {
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({ user: spUser });
    }
    const { navigation } = this.props;
    this.setState({ newOrder: navigation.getParam("newOrder") });
  };
  componentWillReceiveProps = (newProps) => {
    if (newProps.navigation.getParam("newOrder")) {
      this.setState({ newOrder: newProps.navigation.getParam("newOrder") });
    }
  };
  startJob = () => {
    this.setState({ loading: true });
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/sp_start_job",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: this.state.newOrder.orderid,
          spid: this.state.user.spid,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error === false) {
          this.setState({ loading: false });
          this.props.navigation.navigate("AllOngoingOrder", {
            isCompleted: false,
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
  };
  makeCall = () => {
    const args = {
      number: this.state.newOrder.customermobile,
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
            New Order
          </Title>
          <Right />
        </Header>
        <>
          <Spinner visible={this.state.loading} textContent={""} />
          {(this.state.newOrder && this.state.newOrder.length === 0) ||
          this.state.newOrder === undefined ||
          this.state.newOrder === null ? (
            <View style={{ alignSelf: "center", marginTop: 90 }}>
              <Text>Currently No New Order Available!</Text>
            </View>
          ) : (
            <View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  height: 115,
                  width: Dimensions.get("screen").width,
                  backgroundColor: "#F5F5F5",
                }}
              >
                <Left
                  style={{ position: "absolute", flex: 1, left: 6, top: 20 }}
                >
                  <Image
                    source={{
                      uri: this.state.newOrder
                        ? this.state.newOrder.serviceseoname
                        : "https://firebasestorage.googleapis.com/v0/b/foren-se-customers.appspot.com/o/image-placeholder.png?alt=media&token=10ced05a-f905-4951-9298-ff47e771f070",
                    }}
                    style={{
                      width: 55,
                      height: 55,
                      backgroundColor: "#ece8e8",
                    }}
                    resizeMode="contain"
                  />
                </Left>
                <View
                  style={{
                    marginLeft: 75,
                    marginRight: 35,
                    marginTop: Platform.OS === "ios" ? 15 : 3,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    Order#: {this.state.newOrder.orderid}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    Category name: {this.state.newOrder.servicename}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    Date: {this.state.newOrder.appointmentdate}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    Customer Name: {this.state.newOrder.customername}{" "}
                  </Text>
                </View>
              </View>
              {this.state.newOrder.orderdetails &&
                this.state.newOrder.orderdetails.map(
                  function (service, index) {
                    return (
                      <View
                        key={index}
                        style={{
                          height: 55,
                          backgroundColor: "#F5F5F5",
                          flex: 1,
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            color: "#283a97",
                            marginLeft: 6,
                            marginRight: 6,
                          }}
                        >
                          Service: {index + 1}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "left",
                              color: "gray",
                              marginLeft: 6,
                              marginRight: 6,
                              fontSize: 12,
                            }}
                          >
                            ({service.quantity}x){service.jobname};
                          </Text>

                          <View
                            style={{ marginRight: 6, flexDirection: "row" }}
                          >
                            <View
                              style={{ flexDirection: "row", marginRight: 8 }}
                            >
                              <Text style={{ color: "gray" }}>SAR </Text>
                              <Text style={{ color: "gray" }}>
                                {service.price}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          {service.meters ? (
                            <Text style={{ color: "gray", marginLeft: 6 }}>
                              Meters: {service.meters ? service.meters : ""}
                            </Text>
                          ) : (
                            <View></View>
                          )}
                        </View>
                        <View
                          style={{
                            width: Dimensions.get("screen").width,
                            height: 1,
                            backgroundColor: "#ece8e8",
                          }}
                        ></View>
                      </View>
                    );
                  }.bind(this)
                )}
              <View
                style={{
                  marginTop: 60,
                  alignSelf: "center",
                  borderWidth: 1,
                  height: 210,
                  width: Dimensions.get("screen").width - 140,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${this.state.newOrder.latitude},${this.state.newOrder.longitude}`
                    );
                  }}
                >
                  <View
                    style={{
                      marginTop: 20,
                      width: 180,
                      height: 40,
                      backgroundColor: "lightgray",
                      alignSelf: "center",
                    }}
                  >
                    <View style={{ alignSelf: "center", marginTop: 5 }}>
                      <Image
                        source={require("../../assets/icons/Customer-Location.png")}
                        style={{ width: 30, height: 16 }}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Text style={{ color: "gray" }}>Customer Location</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    marginTop: 20,
                    width: 180,
                    height: 40,
                    backgroundColor: "lightgray",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      marginTop: 5,
                      flexDirection: "row",
                    }}
                  >
                    <Text>{this.state.newOrder.grandtotalprice} SAR</Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text style={{ color: "gray" }}>Estimate price</Text>
                  </View>
                </View>
                <TouchableWithoutFeedback onPress={this.makeCall}>
                  <View
                    style={{
                      marginTop: 20,
                      width: 180,
                      height: 40,
                      backgroundColor: "lightgray",
                      alignSelf: "center",
                    }}
                  >
                    <View style={{ alignSelf: "center", marginTop: 5 }}>
                      <Image
                        source={require("../../assets/icons/Call-icon.png")}
                        style={{ width: 30, height: 16 }}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Text style={{ color: "gray" }}>Call</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </>
        {this.state.newOrder !== {} && this.state.newOrder !== undefined ? (
          <Button
            onPress={this.startJob}
            rounded
            style={{
              marginBottom: 20,
              backgroundColor: "#283a97",
              justifyContent: "center",
              width: 270,
              height: 40,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Start Job
            </Text>
          </Button>
        ) : (
          <View></View>
        )}
      </Container>
    );
  }
}
