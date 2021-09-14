import React from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Content,
  Button,
  Header,
  Left,
  Right,
  Title,
} from "native-base";
export default class ViewDocumentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount = () => {
    const { navigation } = this.props;
    let user = navigation.getParam("user");
    let lan = navigation.getParam("lan");
    this.setState({ user: user, lan: lan });
  };
  render() {
    return (
      <Container style={{ backgroundColor: "lightgray" }}>
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
            {this.state.lan == "en" ? "My Documents" : "مستنداتي"}
          </Title>
          <Right />
        </Header>
        {/* style={{ backgroundColor: "lightgray" }} */}
        {/* Content */}
        <>
          <View style={{ marginTop: 80, alignSelf: "center" }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate("DisplayDocuments", {
                  images: this.state.user.national_ids,
                })
              }
            >
              <View
                style={{
                  marginTop: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  //   flex: 1,
                  justifyContent: "space-between",
                  width: Dimensions.get("screen").width - 40,
                  height: 60, // height : 60
                  backgroundColor: "white",
                }}
              >
                <View style={{ marginLeft: 20 }}>
                  <Text>
                    {this.state.lan == "en" ? "ID Pictures" : "صورة الهوية"}
                  </Text>
                </View>
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={"ios-arrow-forward"} size={30} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate("DisplayDocuments", {
                  images: this.state.user.company_reg_pictures,
                })
              }
              style={{ marginTop: 2 }}
            >
              <View
                style={{
                  marginTop: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  //   flex: 1,
                  justifyContent: "space-between",
                  width: Dimensions.get("screen").width - 40,
                  height: 60,
                  backgroundColor: "white",
                }}
              >
                <View style={{ marginLeft: 20 }}>
                  <Text>{this.state.lan == "en" ? "CR" : "سجل تجاري"}</Text>
                </View>
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={"ios-arrow-forward"} size={30} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate("DisplayDocuments", {
                  images: this.state.user.license_pictures,
                })
              }
              style={{ marginTop: 2 }}
            >
              <View
                style={{
                  marginTop: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  //   flex: 1,
                  justifyContent: "space-between",
                  width: Dimensions.get("screen").width - 40,
                  height: 60,
                  backgroundColor: "white",
                }}
              >
                <View style={{ marginLeft: 20 }}>
                  <Text>
                    {this.state.lan == "en" ? "Licenses" : "التراخيص"}
                  </Text>
                </View>
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={"ios-arrow-forward"} size={30} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate("DisplayDocuments", {
                  images: this.state.user.pictures_shop,
                })
              }
              style={{ marginTop: 2 }}
            >
              <View
                style={{
                  marginTop: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  //   flex: 1,
                  justifyContent: "space-between",
                  width: Dimensions.get("screen").width - 40,
                  height: 60,
                  backgroundColor: "white",
                }}
              >
                <View style={{ marginLeft: 20 }}>
                  <Text>
                    {this.state.lan == "en" ? "Shop Pictures" : "صور المحل"}
                  </Text>
                </View>
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={"ios-arrow-forward"} size={30} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </>
        {/* Content */}
      </Container>
    );
  }
}
