import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Platform,
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
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
import { ScrollView } from "react-navigation";
export default class OngoingOrderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialCost: "",
      serviceCost: "",
      servicecharges: "initial",
      comments: "",
      materialsUsed: "",
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
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    // alert(navigation.getParam("lan"));
    let completedOrders = navigation.getParam("completedOrder");
    console.log(completedOrders);
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      this.setState({
        user: spUser,
        ongoingOrder: completedOrders,
        mlCost: completedOrders.materialcost, //materialCost
        isCompleted: navigation.getParam("isCompleted"),
        servicecharges: completedOrders.spservicecost,
        sp_feedback: completedOrders.sp_feedback,
        materialcost_details: completedOrders.materialcost_details,
      });
    }

    // if (this.state.isCompleted) {
    //   fetch(
    //     "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/sp_finishes_job",
    //     {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         spid: this.state.user.spid,
    //       }),
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       console.log(responseJson);

    //       //          console.log(responseJson.Orders);
    //     });
    // }
  };
  finsihJob = () => {
    if (
      //this.state.comments !== "" &&
      //this.state.materialCost !== ""
      // this.state.materialsUsed !== ""

      this.state.serviceCost !== ""
    ) {
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
            sp_feedback: this.state.comments,
            materialcost_details: this.state.materialsUsed,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            console.log(responseJson, "Job Finished Log");
            this.setState({ loading: false });
            this.props.navigation.navigate("OrderDelivered");
          } else {
            console.log(responseJson);
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
    } else {
      Toast.show({
        text:
          this.state.lan == "en"
            ? "please enter the required fields!"
            : "الرجاء إدخال الحقول المطلوبة",
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
              {this.state.isCompleted === true
                ? this.state.lan == "en"
                  ? "Completed Order"
                  : "الطلب المكتمل"
                : this.state.lan == "en"
                ? "Ongoing Orders"
                : "الطلبات مستمرة"}
            </Title>
            <Right />
          </Header>
          <ScrollView style={{ marginBottom: Platform.OS == "android" && 100 }}>
            {/* 80 */}
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            {(this.state.ongoingOrder &&
              this.state.ongoingOrder.length === 0) ||
            this.state.ongoingOrder === undefined ||
            this.state.ongoingOrder === null ? (
              <View style={{ alignSelf: "center", marginTop: 90 }}>
                <Text>
                  {this.state.lan == "en"
                    ? "you haven't started any work yet"
                    : "لم تبدأ أي عمل بعد"}
                  !
                </Text>
              </View>
            ) : (
              <View>
                {/* <View
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
                      {this.state.ongoingOrder &&
                        this.state.ongoingOrder.orderid}
                    </Text>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "#283a97",
                        fontSize: 14,
                      }}
                    >
                      {this.state.lan == "en" ? "Category Name" : "اسم التصنيف"}
                      :{" "}
                      {this.state.ongoingOrder && this.state.lan == "en"
                        ? this.state.ongoingOrder.servicename
                        : this.state.ongoingOrder.servicename_ar}
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
                      {this.state.lan == "en" ? "Customer Name" : "اسم العميل"}:{" "}
                      {this.state.ongoingOrder &&
                        this.state.ongoingOrder.customername}{" "}
                    </Text>
                  </View>
                </View> */}

                <View
                  style={{
                    marginTop: 10,
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
                      flex: 1.5,
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
                      flex: 5,
                      marginLeft: "5%", //10
                      alignSelf: "center",
                      // justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={{ color: "#00203b", fontWeight: "bold" }}>
                      Order # {this.state.ongoingOrder.orderid}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.ongoingOrder.orderdetails &&
                        this.state.ongoingOrder.orderdetails[0].servicename}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.ongoingOrder.orderdetails &&
                        this.state.ongoingOrder.orderdetails[0]
                          .productname}{" "}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.ongoingOrder.orderdetails &&
                        this.state.ongoingOrder.orderdetails[0].jobname}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(0, 32, 59, 0.8)",
                        fontSize: 12,
                      }}
                    >
                      {this.state.ongoingOrder.appointmentdate}
                    </Text>
                  </View>
                </View>
                {this.state.ongoingOrder.orderdetails &&
                  this.state.isCompleted &&
                  this.state.ongoingOrder.orderdetails.map(
                    function (service, index) {
                      return (
                        <View
                          key={index}
                          style={{
                            // marginTop: 8,
                            margin: 20,
                            marginTop: 30,
                            backgroundColor: "#fff",
                            // flex: 1,
                            flexDirection: "column",
                            elevation: 2,
                            shadowColor: "black",
                            shadowOpacity: 0.26,
                            shadowOffset: { width: 0, height: 1 },
                            shadowRadius: 6,
                            height: 70, //55
                            borderRadius: 10,
                            // borderWidth: 1,
                            // borderColor: "black",
                          }}
                        >
                          <Text
                            style={{
                              color: "rgba(0, 32, 59, 1)",
                              alignSelf: "flex-start",
                              marginLeft: 10,
                              marginTop: 15,
                              // marginRight: 6,
                              fontWeight: "bold",
                              fontSize: 15,
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
                                marginLeft: 10,
                                marginRight: 6,
                                fontSize: 15,
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
                                <Text style={{ color: "gray", fontSize: 15 }}>
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
                              {this.state.lan == "en" ? "Meters" : "أمتار"}:{" "}
                              {service.meters ? service.meters : ""}
                            </Text>
                          ) : (
                            <View></View>
                          )}
                          {/* <View
                            style={{
                              width: Dimensions.get("screen").width,
                              height: 1,
                              backgroundColor: "#ece8e8",
                            }}
                          ></View> */}
                        </View>
                      );
                    }.bind(this)
                  )}
                <View
                  style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}
                >
                  <Text
                    style={{
                      color: "rgba(0, 32, 59, 1)",
                      marginLeft: "20%",
                      marginBottom: 10,
                    }}
                  >
                    {this.state.lan == "en"
                      ? "Cost of Materials Used (SAR)"
                      : "تكلفة استخدام المواد"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 0,
                        height: this.state.isCompleted ? 42 : 35,
                        backgroundColor: this.state.isCompleted
                          ? "rgba(0, 32, 59, 1)"
                          : "white",
                        justifyContent: "center",
                        // borderTopLeftRadius: 20,
                        // borderBottomLeftRadius: 20,
                      }}
                    >
                      <Image
                        source={require("../../assets/icons/Riyal-grey.png")}
                        style={{
                          marginLeft: this.state.isCompleted ? 7 : 0,
                          width: this.state.isCompleted ? 63 : 70,
                          height: this.state.isCompleted ? 32 : 35,
                          backgroundColor: this.state.isCompleted
                            ? "rgba(0, 32, 59, 1)"
                            : "white",
                          tintColor: this.state.isCompleted
                            ? "white"
                            : "rgba(0, 32, 59, 1)",
                          borderTopLeftRadius: this.state.isCompleted ? 20 : 0,
                          borderBottomLeftRadius: this.state.isCompleted
                            ? 20
                            : 0,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Input
                      placeholder={
                        this.state.lan == "en" ? "0.00" : "0000 ريال"
                      }
                      placeholderTextColor="rgba(0, 32, 59, 1)"
                      value={
                        !this.state.isCompleted
                          ? this.state.materialCost
                          : `${this.state.mlCost}`
                      }
                      // keyboardType="decimal-pad"
                      editable={!this.state.isCompleted}
                      style={{
                        backgroundColor: this.state.isCompleted
                          ? "white"
                          : "lightgray",
                        height: this.state.isCompleted ? 42 : 35, //35
                        marginLeft: this.state.isCompleted ? 0 : 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0, 32, 59, 1)",
                        borderWidth: this.state.isCompleted ? 0.5 : 0,
                        borderTopRightRadius: this.state.isCompleted ? 20 : 0,
                        borderBottomRightRadius: this.state.isCompleted
                          ? 20
                          : 0,
                        color: this.state.isCompleted
                          ? "gray"
                          : "rgba(0, 32, 59, 1)",
                      }}
                      onChangeText={(mCost) => {
                        this.saveState("materialCost", mCost);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}
                >
                  <Text
                    style={{
                      color: "rgba(0, 32, 59, 1)",
                      marginLeft: "20%",
                      marginBottom: 10,
                    }}
                  >
                    {this.state.lan == "en"
                      ? "Price of the Service (SAR)"
                      : "سعر الخدمة:"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 0,
                        height: this.state.isCompleted ? 42 : 35,
                        backgroundColor: this.state.isCompleted
                          ? "rgba(0, 32, 59, 1)"
                          : "white",
                        justifyContent: "center",
                        // borderTopLeftRadius: 20,
                        // borderBottomLeftRadius: 20,
                      }}
                    >
                      <Image
                        source={require("../../assets/icons/Riyal-grey.png")}
                        style={{
                          marginLeft: this.state.isCompleted ? 7 : 0,
                          width: this.state.isCompleted ? 63 : 70,
                          height: this.state.isCompleted ? 32 : 35,
                          backgroundColor: this.state.isCompleted
                            ? "rgba(0, 32, 59, 1)"
                            : "white",
                          // backgroundColor: "red",

                          tintColor: this.state.isCompleted
                            ? "white"
                            : "rgba(0, 32, 59, 1)",
                          borderTopLeftRadius: this.state.isCompleted ? 20 : 0,
                          borderBottomLeftRadius: this.state.isCompleted
                            ? 20
                            : 0,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Input
                      placeholder={
                        this.state.lan == "en" ? "0.00" : "0000 ريال"
                      }
                      placeholderTextColor={
                        this.state.isCompleted
                          ? "lightgray"
                          : "rgba(0, 32, 59, 1)"
                      }
                      editable={!this.state.isCompleted}
                      value={
                        !this.state.isCompleted
                          ? this.state.serviceCost
                          : `${this.state.servicecharges}`
                      }
                      // keyboardType="decimal-pad"
                      style={{
                        backgroundColor: this.state.isCompleted
                          ? "white"
                          : "lightgray",
                        height: this.state.isCompleted ? 42 : 35, //35
                        marginLeft: this.state.isCompleted ? 0 : 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0, 32, 59, 1)",
                        borderWidth: this.state.isCompleted ? 0.5 : 0,
                        borderTopRightRadius: this.state.isCompleted ? 20 : 0,
                        borderBottomRightRadius: this.state.isCompleted
                          ? 20
                          : 0,
                        color: this.state.isCompleted
                          ? "gray"
                          : "rgba(0, 32, 59, 1)",
                      }}
                      onChangeText={(sCost) => {
                        this.saveState("serviceCost", sCost);
                      }}
                    />
                  </View>
                </View>

                <View
                  style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}
                >
                  <Text
                    style={{
                      color: "rgba(0, 32, 59, 1)",
                      marginLeft: "20%",
                      marginBottom: 10,
                    }}
                  >
                    {this.state.lan == "en" ? "Order Feedback" : "سعر الخدمة:"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 0,
                        height: this.state.isCompleted ? 48 : 0, //58
                        backgroundColor: this.state.isCompleted
                          ? "rgba(0, 32, 59, 1)"
                          : "white",
                        justifyContent: this.state.isCompleted
                          ? "center"
                          : "flex-start",
                      }}
                    >
                      <Image
                        source={require("../../assets/icons/Comment2-min.png")}
                        style={{
                          width: 70,
                          height: 30,
                          backgroundColor: this.state.isCompleted
                            ? "rgba(0, 32, 59, 1)"
                            : "white",
                          tintColor: this.state.isCompleted
                            ? "white"
                            : "rgba(0, 32, 59, 1)",
                          borderTopLeftRadius: this.state.isCompleted ? 20 : 0,
                          borderBottomLeftRadius: this.state.isCompleted
                            ? 20
                            : 0,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Input
                      placeholder={
                        this.state.lan == "en" ? "Comments" : "تعليقات"
                      }
                      placeholderTextColor="rgba(0, 32, 59, 1)"
                      editable={!this.state.isCompleted}
                      value={
                        !this.state.isCompleted
                          ? this.state.comments
                          : this.state.sp_feedback
                      }
                      // // keyboardType="decimal-pad"
                      style={{
                        backgroundColor: this.state.isCompleted
                          ? "white"
                          : "lightgray",
                        height: 48, //35 58
                        marginLeft: this.state.isCompleted ? 0 : 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0, 32, 59, 1)",
                        borderWidth: this.state.isCompleted ? 0.5 : 0,
                        borderTopRightRadius: this.state.isCompleted ? 20 : 0,
                        borderBottomRightRadius: this.state.isCompleted
                          ? 20
                          : 0,
                        color: this.state.isCompleted
                          ? "gray"
                          : "rgba(0, 32, 59, 1)",
                      }}
                      onChangeText={(sComment) => {
                        this.saveState("comments", sComment);
                      }}
                    />
                  </View>
                </View>

                <View
                  style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}
                >
                  <Text
                    style={{
                      color: "rgba(0, 32, 59, 1)",
                      marginLeft: "20%",
                      marginBottom: 10,
                    }}
                  >
                    {this.state.lan == "en"
                      ? "Details of Materials used"
                      : "تفاصيل المواد المستخدمة"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 0,
                        height: this.state.isCompleted ? 48 : 0,
                        backgroundColor: this.state.isCompleted
                          ? "rgba(0, 32, 59, 1)"
                          : "white",
                        justifyContent: this.state.isCompleted
                          ? "center"
                          : "flex-start",
                      }}
                    >
                      <Image
                        source={require("../../assets/icons/Detail-of-Material2-min.png")}
                        style={{
                          width: 70,
                          height: 30, //58 35
                          backgroundColor: this.state.isCompleted
                            ? "rgba(0, 32, 59, 1)"
                            : "white",

                          tintColor: this.state.isCompleted
                            ? "white"
                            : "rgba(0, 32, 59, 1)",
                          // borderTopLeftRadius: this.state.isCompleted ? 20 : 0,
                          // borderBottomLeftRadius: this.state.isCompleted
                          //   ? 20
                          //   : 0,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    {/* <KeyboardAvoidingView
                      behavior="position"
                      keyboardVerticalOffset={100}
                    > */}
                    <Input
                      multiline={true}
                      placeholder={
                        this.state.lan == "en"
                          ? "Material Name 1, \nMaterial Name 2"
                          : "اسم المادة 1, \n اسم المادة 2"
                      }
                      placeholderTextColor="rgba(0, 32, 59, 1)"
                      editable={!this.state.isCompleted}
                      value={
                        !this.state.isCompleted
                          ? this.state.materialsUsed
                          : this.state.materialcost_details
                      }
                      // keyboardType="decimal-pad"
                      style={{
                        backgroundColor: this.state.isCompleted
                          ? "white"
                          : "lightgray",
                        height: 48, //35
                        marginLeft: this.state.isCompleted ? 0 : 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0, 32, 59, 1)",
                        borderWidth: this.state.isCompleted ? 0.5 : 0,
                        borderTopRightRadius: this.state.isCompleted ? 20 : 0,
                        borderBottomRightRadius: this.state.isCompleted
                          ? 20
                          : 0,
                        color: this.state.isCompleted
                          ? "gray"
                          : "rgba(0, 32, 59, 1)",
                      }}
                      onChangeText={(sUsed) => {
                        this.saveState("materialsUsed", sUsed);
                      }}
                    />
                    {/* </KeyboardAvoidingView> */}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          {/* Content */}
          {this.state.isCompleted === false ? (
            (this.state.ongoingOrder && this.state.ongoingOrder.length === 0) ||
            this.state.ongoingOrder === undefined ||
            this.state.ongoingOrder === null ? (
              <View></View>
            ) : (
              // <Button
              //   onPress={this.finsihJob}
              //   rounded
              //   style={{
              //     marginBottom: 20,
              //     justifyContent: "center",
              //     backgroundColor: "#283a97",
              //     width: 270,
              //     height: 40,
              //     alignSelf: "center",
              //     position: "absolute",
              //     bottom: 0,
              //     // marginTop: "40%",
              //   }}
              // >
              //   <Text
              //     style={{
              //       color: "white",
              //       fontWeight: "bold",
              //       textAlign: "center",
              //     }}
              //   >
              //     {this.state.lan == "en" ? "Job Finished" : "انتهى العمل "}
              //   </Text>
              // </Button>
              <Button
                onPress={this.finsihJob} // rounded
                style={{
                  marginTop: 0, //20%
                  backgroundColor: "#283a97",
                  justifyContent: "center",
                  width: "82%",
                  height: "7.2%", //7.2%
                  alignSelf: "center",
                  backgroundColor: "rgba(0, 32, 59, 1)",
                  borderRadius: 12,
                  position: "absolute",
                  bottom: 100, //30
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
                  {this.state.lan == "en" ? "Job Finish" : "انتهى العمل "}
                </Text>
              </Button>
            )
          ) : (
            <View></View>
          )}
        </ImageBackground>
      </Container>
    );
  }
}
