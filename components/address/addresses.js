import React from "react";
import {
  ScrollView,
  View,
  Platform,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
} from "react-native";
import {
  Header,
  Title,
  Content,
  Toast,
  Left,
  Right,
  Text,
  Container,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
export default class AddressesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({
      user: navigation.getParam("user"),
      lan: navigation.getParam("lan"),
    });
    console.log(">................................................");
  };
  removeAddress = (location) => {
    this.setState({ loading: true });
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/delete_sp_location",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spid: this.state.user.spid,
          addressid: location.locationid,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.error === false) {
          let copyLocations = this.state.user.location;
          let index = copyLocations.findIndex(
            (l) => l.locationid === location.locationid
          );
          if (index > -1) {
            copyLocations.splice(index, 1);
          }
          let user = this.state.user;
          user.location = copyLocations;
          // console.log("Response", user.location.addressname);
          // console.log(copyLocations.addressname);
          this.setState({ loading: false, user: user });
          Toast.show({
            text: "Location has been removed successfully!!",
            buttonText: "",
            position: "bottom",
          });
        } else {
          Toast.show({
            text: responseJson.message,
            buttonText: "",
            position: "bottom",
          });
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show({
          text: "something went wrong try again later!",
          buttonText: "",
          position: "bottom",
        });
      });
  };
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
          <Left
            style={{
              marginTop: Platform.OS === "android" ? 25 : 6,
              marginLeft: 10,
            }}
          >
            <Ionicons
              onPress={() => this.props.navigation.goBack()}
              name={"ios-arrow-back"}
              size={30}
              color={"white"}
            />
          </Left>
          <Title
            style={{
              color: "white",
              position: "absolute",
              top: Platform.OS === "android" ? 40.5 : 40,
              fontSize: 18,
            }}
          >
            {this.state.lan == "en" ? "Add Address" : "اضف عنوان"}
          </Title>
          <Right />
        </Header>
        <>
          <Spinner visible={this.state.loading} textContent={""} />
          {
            <NavigationEvents
              onWillFocus={() => {
                this.componentDidMount();
              }}
            />
          }
          <ScrollView>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "#283a97",
                  marginLeft: 10,
                  alignSelf: "flex-start",
                  // left: 6,
                  // position: "absolute",
                  // flex: 1,
                }}
              >
                {this.state.lan == "en" ? "My Addresses" : "عناويني"}:
              </Text>
            </View>
            {this.state.user &&
              this.state.user.location &&
              this.state.user.location.map(
                function (location, index) {
                  return (
                    <View
                      key={index}
                      style={{
                        marginTop: 6,
                        flexDirection: "row",
                        height: 60,
                        width: Dimensions.get("window").width,
                        backgroundColor: "white",
                      }}
                    >
                      <Left style={{ position: "absolute", flex: 1, left: 6 }}>
                        <Image
                          source={require("../../assets/icons/Location.png")}
                          style={{ width: 27, height: 35 }}
                          resizeMode="contain"
                        />
                      </Left>
                      <View
                        style={{
                          marginLeft: 55,
                          marginRight: 35,
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#283a97",
                            fontSize: 12,
                            textAlign: "left",
                          }}
                        >
                          {this.state.lan == "en"
                            ? location.addressname
                            : location.addressname_ar}
                        </Text>
                        <Text
                          style={{
                            color: "#4a4b4c",
                            fontSize: 11,
                            textAlign: "left",
                          }}
                        >
                          {this.state.lan == "en"
                            ? location.addressdetails
                            : location.addressdetails_ar}
                        </Text>
                      </View>
                      <Right style={{ position: "absolute", right: 10 }}>
                        <Ionicons
                          onPress={() => this.removeAddress(location)}
                          name="ios-trash"
                          color="#283a97"
                          size={21}
                        />
                      </Right>
                    </View>
                  );
                }.bind(this)
              )}
          </ScrollView>
        </>
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            bottom: Platform.OS === "android" ? 60 : 30,
            alignSelf: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("GoogleMap", {
                user: this.state.user,
                route: "Addresses",
              })
            }
          >
            <View
              style={{
                alignSelf: "center",
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#283a97",
              }}
            >
              <View style={{ alignSelf: "center", marginTop: 7 }}>
                <Ionicons name="md-add" size={34} color="white" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Container>
    );
  }
}
