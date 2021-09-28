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
          this.setState({ tableData: array });
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
            {this.state.lan == "en" ? "Invoice" : "فاتورة"}
          </Title>
          <Right />
        </Header>
        <View style={{ height: "100%" }}>
          {/* Content */}
          <View style={styles.container}>
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
          </View>
        </View>
        {/* Content */}
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
