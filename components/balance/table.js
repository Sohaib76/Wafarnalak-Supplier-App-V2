import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  Text,
  View,
  Image,
  Toast,
  ImageBackground,
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
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Col,
} from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
const SPACING = (height / width) * 9;
const AVATAR_SIZE = (height / width) * 40;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
export default class InvoiceTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Order#", "Order date", "Service name", "Charges"],
      tableHear_ar: ["رقم الطلب", "تاريخ الطلب", "اسم الخدمة", "التكلفة"],
      tableData: [],
    };
  }
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    const { navigation } = this.props;
    let invoices = navigation.getParam("invoice");
    let user = await AsyncStorage.getItem("sp");
    let spUser = JSON.parse(user);
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_this_reports",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spid: spUser.spid,
          year: invoices.year,
          month: invoices.month,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error === false) {
          let array = ([] = []);
          responseJson.order.forEach((element) => {
            let objArray = [
              element.orderid,
              element.deliverydate,
              this.state.lan == "en"
                ? element.servicename
                : element.servicename_ar,
              element.spservicecharges,
            ];
            array.push(objArray);
          });
          console.log("array", array);
          var total = 0;
          array.map(function (service, index) {
            total = total + service[3];
          });
          console.log("total", total);
          this.setState({
            tableData: array,
            total,
            year: invoices.year,
            month: invoices.month,
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
  render() {
    return (
      <>
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
              {this.state.lan == "en" ? "Invoice" : "فاتورة"}
            </Title>
            <Right />
          </Header>

          {/* <View> */}
          {/* Content */}
          {/* <View style={styles.container}>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={
                    this.state.lan == "en"
                      ? this.state.tableHead
                      : this.state.tableHear_ar
                  }
                  // flexArr={[1.5, 2, 3, 1.5]}
                  style={styles.head}
                  textStyle={styles.headerText}
                />

                <Rows
                  data={this.state.tableData}
                  // flexArr={[1.5, 2, 3, 1.5]}
                  style={{ height: 60, backgroundColor: "white" }}
                  // textStyle={styles.text}
                  textStyle={[
                    styles.text,
                    styles.timeText,
                    styles.text,
                    styles.text,
                  ]}
                />
              </Table>
            </View> */}
          {/* </View> */}
          <ScrollView style={{ marginBottom: Platform.OS == "android" && 80 }}>
            <View style={{ paddingBottom: 30 }}>
              {this.state.tableData &&
                this.state.tableData.map(function (service, index) {
                  return (
                    // <View
                    //   key={index}
                    //   style={{
                    //     backgroundColor: "red",

                    //     // justifyContent: "space-around",
                    //   }}
                    // >
                    <View
                      key={index}
                      style={{
                        width: "90%",
                        marginLeft: 20,
                        marginRight: 20,
                        borderWidth: 0.5,
                        height: 90,
                        borderRadius: 8,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                        shadowColor: "black",
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 1 },
                        shadowRadius: 2,
                        backgroundColor: "white",
                        borderColor: "grey",
                        marginTop: 15,
                      }}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{
                            color: "rgba(0, 32, 59, 1)",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}
                        >
                          Order# {service[0]}
                        </Text>
                        <Text style={{ color: "rgba(0, 32, 59, 0.8)" }}>
                          {service[2]}
                        </Text>
                        <Text style={{ color: "rgba(0, 32, 59, 0.8)" }}>
                          {service[1]}
                        </Text>
                      </View>
                      <View style={{ margin: 5, justifyContent: "center" }}>
                        <Text style={{ color: "rgba(0, 32, 59, 0.8)" }}>
                          Charges
                        </Text>
                        <Text
                          style={{
                            color: "rgba(0, 32, 59, 1)",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}
                        >
                          SAR {service[3]}
                        </Text>
                      </View>
                    </View>
                    // <View
                    //   style={{ height: 10, width: 200, backgroundColor: "black" }}
                    // ></View>
                    // </View>
                  );
                })}

              <View
                style={{
                  borderColor: "grey",
                  borderWidth: 0.5,
                  height: 25, //20
                  width: "77%",
                  marginTop: "15%",
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 2,
                  // paddingBottom: 5,
                }}
              >
                <Text style={{ color: "rgba(0, 32, 59, 0.8)" }}>
                  {this.state.month} {this.state.year}{" "}
                  {this.state.lan == "en"
                    ? "Total Charges"
                    : "الكلفة الاجماليه"}
                </Text>
                <Text
                  style={{ color: "rgba(0, 32, 59, 1)", fontWeight: "bold" }}
                >
                  SAR {this.state.total}
                </Text>
              </View>
              <Button
                //onPress={this.startJob}
                // rounded
                style={{
                  marginTop: "0%",
                  backgroundColor: "#283a97",
                  justifyContent: "center",
                  width: "82%",
                  height: 60,
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
                  {this.state.lan == "en" ? "Download" : "تحميل"}
                </Text>
              </Button>
            </View>
          </ScrollView>
          {/* Content */}
        </ImageBackground>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    flex: 1,
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, fontSize: SPACING / 2 },
  headerText: { margin: 6, fontSize: SPACING / 2 },
  timeText: { margin: 6, fontSize: SPACING / 12 },
});
