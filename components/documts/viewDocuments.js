import React from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
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
    console.log("user", user);

    console.log("id", user.national_ids);
  };
  render() {
    return (
      <Container style={{ backgroundColor: "lightgray" }}>
        <ImageBackground
          source={require("../../assets/icons/Background.png")}
          resizeMode="contain" //cover
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <Header style={{ backgroundColor: "white", height: 80 }}>
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
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    //   flex: 1,
                    justifyContent: "space-between",
                    width: Dimensions.get("screen").width - 40,
                    height: 60, // height : 60
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    borderColor: "grey",
                    borderWidth: 0.5,
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text>
                      {this.state.lan == "en" ? "ID Pictures" : "صورة الهوية"}
                    </Text>
                  </View>
                  <View
                    style={{
                      // marginRight: 12,
                      backgroundColor: "#00203b",
                      position: "absolute",
                      right: 0,
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                      height: 60,
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Ionicons
                      name={"ios-arrow-forward"}
                      size={30}
                      color="white"
                    />
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
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    //   flex: 1,
                    justifyContent: "space-between",
                    width: Dimensions.get("screen").width - 40,
                    height: 60,
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    borderColor: "grey",
                    borderWidth: 0.5,
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text>{this.state.lan == "en" ? "CR" : "سجل تجاري"}</Text>
                  </View>
                  <View
                    style={{
                      // marginRight: 12,
                      backgroundColor: "#00203b",
                      position: "absolute",
                      right: 0,
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                      height: 60,
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={"ios-arrow-forward"}
                      size={30}
                      color="white"
                    />
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
                    marginTop: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    //   flex: 1,
                    justifyContent: "space-between",
                    width: Dimensions.get("screen").width - 40,
                    height: 60,
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    borderColor: "grey",
                    borderWidth: 0.5,
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text>
                      {this.state.lan == "en" ? "Licenses" : "التراخيص"}
                    </Text>
                  </View>
                  <View
                    style={{
                      // marginRight: 12,
                      backgroundColor: "#00203b",
                      position: "absolute",
                      right: 0,
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                      height: 60,
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={"ios-arrow-forward"}
                      size={30}
                      color="white"
                    />
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
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    //   flex: 1,
                    justifyContent: "space-between",
                    width: Dimensions.get("screen").width - 40,
                    height: 60,
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    borderColor: "grey",
                    borderWidth: 0.5,
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text>
                      {this.state.lan == "en" ? "Shop Pictures" : "صور المحل"}
                    </Text>
                  </View>
                  <View
                    style={{
                      // marginRight: 12,
                      backgroundColor: "#00203b",
                      position: "absolute",
                      right: 0,
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                      height: 60,
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={"ios-arrow-forward"}
                      size={30}
                      color="white"
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </>
        </ImageBackground>
        {/* Content */}
      </Container>
    );
  }
}
