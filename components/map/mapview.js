import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Marker } from "react-native-maps";
import { Container, Header, Left, Right, Content, Title } from "native-base";
import { Ionicons } from "@expo/vector-icons";
export default class GoogleMapsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
    };
  }
  componentDidMount = () => {
    this.getSpUser();
  };
  getSpUser = async () => {
    this.setState({ loading: true });
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let spUser = JSON.parse(user);
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_sp_details",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: spUser.mobile,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            this.setState({
              loading: false,
              selectedNationality: responseJson.nationality
                ? responseJson.nationality.country_name
                : "",
              user: responseJson,
              crNumber: responseJson.crnumber ? responseJson.crnumber : "",
              iqamaNumber: responseJson.nationaloriqama
                ? responseJson.nationaloriqama
                : "",
              licenseNumber: responseJson.licensenumber
                ? responseJson.licensenumber
                : "",
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
          Toast.show({
            text: "something went wrong try again later!",
            buttonText: "",
            position: "bottom",
          });
        });
    }
  };
  render() {
    if (this.state.location) {
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
              Location
            </Title>
            <Right />
          </Header>
          <>
            {/* <View
            style={{ height: "100%", width: "100%", backgroundColor: "red" }}
          > */}
            <MapView
              style={styles.mapStyle}
              zoomEnabled={true}
              region={this.state.location}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(this.state.location.latitude),
                  longitude: parseFloat(this.state.location.longitude),
                }}
              />
            </MapView>
            {/* </View> */}
          </>
        </Container>
      );
    } else {
      <Text>Loading Google Map...</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
