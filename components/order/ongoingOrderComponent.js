import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Platform,
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
  Button,
  Toast,
  Footer,
} from "native-base";
export default class OngoingOrderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialCost: "",
      serviceCost: "",
      ongoingOrder: null,
      isCompleted: false,
      user: {},
      loading: false,
    };
  }
  saveState = (param, value) => {
    this.setState({ [param]: value });
  };
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.setState({
      lan: navigation.getParam("lan"),
    });
    let completedOrders = navigation.getParam("completedOrder");
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({
        user: spUser,
        ongoingOrder: completedOrders,
        materialCost: completedOrders.materialcost,
        serviceCost: completedOrders.spservicecost,
        isCompleted: navigation.getParam("isCompleted"),
      });
    }
  };
  finsihJob = () => {
    if (this.state.serviceCost !== "") {
      this.setState({ loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/sp_finishes_job",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spid: this.state.user.spid,
            orderid: this.state.ongoingOrder.orderid,
            materialcost: this.state.materialCost,
            servicecharges: this.state.serviceCost,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            console.log(responseJson);
            this.setState({ loading: false });
            this.props.navigation.navigate("OrderDelivered");
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
    } else {
      Toast.show({
        text: "please enter the service cost that you received!",
        buttonText: "",
        position: "bottom",
      });
    }
  };
  componentWillReceiveProps = (newProps) => {
    if (newProps.navigation.getParam("isCompleted")) {
      this.setState({
        isCompleted: newProps.navigation.getParam("isCompleted"),
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
            {this.state.isCompleted === true
              ? this.state.lan == "en"
                ? "Completed Order"
                : "الطلب المكتمل"
              : "Ongoing Orders"}
          </Title>
          <Right />
        </Header>
        <>
          {/* Content */}
          <Spinner visible={this.state.loading} textContent={""} />
          {(this.state.ongoingOrder && this.state.ongoingOrder.length === 0) ||
          this.state.ongoingOrder === undefined ||
          this.state.ongoingOrder === null ? (
            <View style={{ alignSelf: "center", marginTop: 90 }}>
              <Text>you haven't started any work yet!</Text>
            </View>
          ) : (
            <View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  height: 110,
                  width: Dimensions.get("screen").width,
                  backgroundColor: "#F5F5F5",
                }}
              >
                <Left
                  style={{ position: "absolute", flex: 1, left: 6, top: 25 }}
                >
                  <Image
                    source={{
                      uri:
                        this.state.ongoingOrder &&
                        this.state.ongoingOrder.serviceseoname,
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
                    marginTop: Platform.OS === "ios" ? 17 : 3,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    {this.state.lan == "en" ? "Order#" : "رقم الطلب #"}:{" "}
                    {this.state.ongoingOrder && this.state.ongoingOrder.orderid}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    {this.state.lan == "en" ? "Category Name" : "اسم التصنيف"}:{" "}
                    {this.state.ongoingOrder &&
                      this.state.ongoingOrder.servicename}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    {this.state.lan == "en" ? "Date:" : "تاريخ:"}{" "}
                    {this.state.ongoingOrder &&
                      this.state.ongoingOrder.appointmentdate}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#283a97",
                      fontSize: 14,
                    }}
                  >
                    {this.state.lan == "en" ? "Customer Name" : ""}:{" "}
                    {this.state.ongoingOrder &&
                      this.state.ongoingOrder.customername}{" "}
                  </Text>
                </View>
              </View>
              {this.state.ongoingOrder.orderdetails &&
                this.state.ongoingOrder.orderdetails.map(
                  function (service, index) {
                    return (
                      <View
                        key={index}
                        style={{
                          marginTop: 8,
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
                          {this.state.lan == "en" ? "Service" : "الخدمة"}:{" "}
                          {index + 1}
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
                              <Text style={{ color: "gray" }}>
                                {this.state.lan == "en" ? "SAR" : "ريال"}{" "}
                              </Text>
                              <Text style={{ color: "gray" }}>
                                {service.price}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {service.meters ? (
                          <Text style={{ color: "gray", marginLeft: 6 }}>
                            Meters: {service.meters ? service.meters : ""}
                          </Text>
                        ) : (
                          <View></View>
                        )}
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
              <View style={{ marginTop: 40, marginLeft: 18, marginRight: 35 }}>
                <Text style={{ color: "#283a97" }}>
                  {this.state.lan == "en"
                    ? "Cost of materials use"
                    : "تكلفة استخدام المواد"}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginTop: 3 }}>
                    <Image
                      source={require("../../assets/icons/Riyal-grey.png")}
                      style={{ width: 30, height: 17 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Input
                    placeholder={
                      this.state.lan == "en" ? "SAR 0000" : "0000 ريال"
                    }
                    placeholderTextColor="gray"
                    value={this.state.materialCost}
                    keyboardType="decimal-pad"
                    editable={!this.state.isCompleted}
                    style={{
                      backgroundColor: "lightgray",
                      height: 28,
                      marginLeft: 5,
                    }}
                    onChangeText={(mCost) => {
                      this.saveState("materialCost", mCost);
                    }}
                  />
                </View>
              </View>
              <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
                <Text style={{ color: "#283a97" }}>
                  {this.state.lan == "en"
                    ? "Price of the service"
                    : "سعر الخدمة:"}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginTop: 3 }}>
                    <Image
                      source={require("../../assets/icons/Riyal-grey.png")}
                      style={{ width: 30, height: 17 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Input
                    placeholder={
                      this.state.lan == "en" ? "SAR 0000" : "0000 ريال"
                    }
                    placeholderTextColor="gray"
                    editable={!this.state.isCompleted}
                    value={this.state.serviceCost}
                    keyboardType="decimal-pad"
                    style={{
                      backgroundColor: "lightgray",
                      height: 28,
                      marginLeft: 5,
                    }}
                    onChangeText={(sCost) => {
                      this.saveState("serviceCost", sCost);
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        </>
        {/* Content */}
        {this.state.isCompleted === false ? (
          (this.state.ongoingOrder && this.state.ongoingOrder.length === 0) ||
          this.state.ongoingOrder === undefined ||
          this.state.ongoingOrder === null ? (
            <View></View>
          ) : (
            <Button
              onPress={this.finsihJob}
              rounded
              style={{
                marginBottom: 20,
                justifyContent: "center",
                backgroundColor: "#283a97",
                width: 270,
                height: 40,
                alignSelf: "center",
                position: "absolute",
                bottom: 0,
                // marginTop: "40%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {this.state.lan == "en" ? "Job Finished" : "انتهى العمل "}
              </Text>
            </Button>
          )
        ) : (
          <View></View>
        )}
      </Container>
    );
  }
}
