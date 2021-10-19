import React from "react";
// Dark Blue: #00203b
// Dark Grey Text: #494b4c
// Orders Screen Grey Background: #e9edf2
import {
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  AsyncStorage,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
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
  Icon,
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
    const { navigation } = this.props;
    // this.setState({
    //   lan: navigation.getParam("lan"),
    // });
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan,
    });
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({ user: spUser });
    }
    this.setState({ newOrder: navigation.getParam("newOrder") });
  };
  componentWillReceiveProps = (newProps) => {
    if (newProps.navigation.getParam("newOrder")) {
      console.log("tesla", newProps.navigation.getParam("newOrder"));
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
          text:
            this.state.lan == "en"
              ? "Something went wrong please try again later!"
              : "هناك شئ خاطئ، يرجى المحاولة فى وقت لاحق!",
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
              {this.state.lan == "en" ? "New Order" : "طلبات جديدة"}
            </Title>
            <Right />
          </Header>
          <>
            <Spinner visible={this.state.loading} textContent={""} />
            {(this.state.newOrder && this.state.newOrder.length === 0) ||
            this.state.newOrder === undefined ||
            this.state.newOrder === null ? (
              <View style={{ alignSelf: "center", marginTop: 90 }}>
                <Text>
                  {this.state.lan == "en"
                    ? "Currently No New Order Available!"
                    : "الطلب غير متاح حاليا"}
                </Text>
              </View>
            ) : (
              <View>
                {/* <View
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
                      {this.state.lan == "en" ? "Order#" : "رقم الطلب#"}:{" "}
                      {this.state.newOrder.orderid}
                    </Text>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "#283a97",
                        fontSize: 14,
                      }}
                    >
                      {this.state.lan == "en" ? "Category name" : "اسم التصنيف"}
                      :{" "}
                      {this.state.lan == "en"
                        ? this.state.newOrder.servicename
                        : this.state.newOrder.servicename_ar}
                    </Text>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "#283a97",
                        fontSize: 14,
                      }}
                    >
                      {this.state.lan == "en" ? "Date" : "تاريخ التعيين للخدمة"}
                      : {this.state.newOrder.appointmentdate}
                    </Text>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "#283a97",
                        fontSize: 14,
                      }}
                    >
                      {this.state.lan == "en" ? "Customer Name" : "اسم العميل"}:{" "}
                      {this.state.newOrder.customername}{" "}
                    </Text>
                  </View>
                </View> */}
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: Dimensions.get("screen").width,
                    height: 100, //60
                    backgroundColor: "#e9edf2",
                    flexDirection: "row",
                    marginRight: 10,
                  }}
                >
                  <View
                    style={{
                      flex: 2,
                      alignSelf: "center",
                      justifyContent: "center",
                      marginLeft: 20,
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
                    }}
                  >
                    <Text style={{ color: "#00203b", fontWeight: "bold" }}>
                      Order # {this.state.newOrder.orderid}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.newOrder.orderdetails &&
                        this.state.newOrder.orderdetails[0].servicename}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.newOrder.orderdetails &&
                        this.state.newOrder.orderdetails[0].productname}{" "}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.newOrder.orderdetails &&
                        this.state.newOrder.orderdetails[0].jobname}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.newOrder.appointmentdate}
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
                {/* {this.state.newOrder.orderdetails &&
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
                                <Text style={{ color: "gray" }}>
                                  {this.state.lan == "en" ? "SAR" : "ريال"}{" "}
                                </Text>
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
                  )} */}
                {/* <View
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
                        <Text style={{ color: "gray" }}>
                          {this.state.lan == "en"
                            ? "Customer Location"
                            : "موقع العميل"}
                        </Text>
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
                      <Text>
                        {this.state.newOrder.grandtotalprice}{" "}
                        {this.state.lan == "en" ? "SAR" : "ريال"}
                      </Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Text style={{ color: "gray" }}>
                        {this.state.lan == "en"
                          ? "Estimate price"
                          : "السعر التقديري"}
                      </Text>
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
                        <Text style={{ color: "gray" }}>
                          {this.state.lan == "en" ? "Call" : "إتصل"}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View> */}

                <View style={{ flexDirection: "row", marginBottom: 30 }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      marginTop: 60,
                      flex: 2,
                      backgroundColor: "#494b4c",
                      height: 130,
                      // width: 100,
                      borderRadius: 12,
                      margin: 20,
                    }}
                  >
                    <View>
                      <Icon
                        name="location-outline"
                        style={{
                          color: "#fff",
                          alignSelf: "center",
                          margin: 20,
                          marginBottom: 10,
                        }}
                        size={80}
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Customer {"\n"}Location
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <View
                    style={{
                      flexDirection: "column",
                      marginTop: 60,
                      flex: 2,
                      backgroundColor: "grey",
                      height: 130,
                      // width: 100,
                      borderRadius: 12,
                      margin: 20,
                    }}
                  ></View> */}
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      marginTop: 60,
                      flex: 2,
                      backgroundColor: "#494b4c",
                      height: 130,
                      // width: 100,
                      borderRadius: 12,
                      margin: 20,
                    }}
                  >
                    <View>
                      <Image
                        source={require("../../assets/icons/Riyal-2-min.png")}
                        style={{
                          width: 100,
                          height: 50,
                          alignSelf: "center",
                          margin: 10,
                          tintColor: "white",
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Estimated Price: SAR {this.state.newOrder.totalprice}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
          {this.state.newOrder !== {} && this.state.newOrder !== undefined ? (
            <Button
              onPress={this.startJob}
              // rounded
              style={{
                marginBottom: 20,
                backgroundColor: "#283a97",
                justifyContent: "center",
                width: "82%",
                height: "7.2%",
                alignSelf: "center",
                backgroundColor: "rgba(0, 32, 59, 1)",
                borderRadius: 12,
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
                {this.state.lan == "en" ? "Start Job" : "ابدأ العمل"}
              </Text>
            </Button>
          ) : (
            <View></View>
          )}
        </ImageBackground>
      </Container>
    );
  }
}
