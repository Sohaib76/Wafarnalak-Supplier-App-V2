import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import {
  Button,
  Container,
  Content,
  Footer,
  Header,
  Input,
  Left,
  Right,
  Spinner,
  Text,
  Thumbnail,
  Title,
  Toast,
} from "native-base";
import { Dimensions, Modal, Platform, View } from "react-native";

import { AsyncStorage } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import React from "react";

export default class GoogleMapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actorId: null,
      x: {
        latitude: 23.8859,
        longitude: 45.0792,
      },
      region: {
        latitude: 23.8859,
        longitude: 45.0792,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      modalVisible: false,
      isMapLoaded: false,
      address: "location",
      title: "",
      user: "",
      route: "",
    };
  }
  async componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam("user")) {
      this.setState({
        user: navigation.getParam("user"),
        route: navigation.getParam("route"),
      });
    }
    this._getLocationAsync();
  }
  hideModal = () => {
    this.setState({ modalVisible: false });
  };
  showModal = () => {
    this.setState({ modalVisible: true });
  };
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
      });
    } else {
      let location = await Location.getCurrentPositionAsync({});

      let obj = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      let obj2 = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };
      this.fetchAddress(obj2);
      this.setState({ region: obj, x: obj2, isMapLoaded: true });
    }
  };
  onRegionChange = (region) => {
    this.setState({ region: region });
  };
  fetchAddress = (lotlng) => {
    let address = "";
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        lotlng.latitude +
        "," +
        lotlng.longitude +
        "&key=" +
        "AIzaSyA4be4vwXO-Zn5IYcxA-trViY3j6LtODjg"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ address: responseJson.results[0].formatted_address });
      });
  };
  saveLocation = (e) => {
    this.fetchAddress(e.nativeEvent.coordinate);
    this.setState({ x: e.nativeEvent.coordinate });
  };
  saveAddress = async () => {
    await AsyncStorage.getItem("SPID").then((res) => {
      console.log("SPID-----", res);
      let id = parseInt(res);
      console.log("SPID-----", id);

      this.setState({ actorId: id });
    });
    if (this.state.title !== "") {
      this.setState({ modalVisible: false, loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/add_sp_location",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spid: this.state.actorId,
            latitude: this.state.x.latitude,
            longitude: this.state.x.longitude,
            addressdetails: this.state.address,
            addressname: this.state.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("result ------", responseJson);
          if (responseJson.error === false) {
            this.setState({ loading: false });
            Toast.show({
              text: "Location has been saved successfully!!",
              buttonText: "",
              position: "bottom",
            });
            this.props.navigation.navigate(this.state.route, {
              user: responseJson.sp,
            });
          } else {
            Toast.show({
              text: responseJson.message,
              buttonText: "",
              position: "bottom",
              duration: 5000,
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
    } else {
      Toast.show({
        text: "please enter location title!",
        buttonText: "",
        position: "bottom",
      });
    }
  };
  notifyChange = (loc) => {
    this.getCordsForName(loc);
  };
  getCordsForName = (loc) => {
    let obj = {
      latitude: loc.geometry.location.lat,
      longitude: loc.geometry.location.lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    this.mapView.animateToRegion(obj, 2000);
    this.setState({ x: obj, address: loc.formatted_address });
    this.updateState(obj);
  };
  updateState = (location) => {
    this.GooglePlacesRef.setAddressText("");
    this.setState({
      region: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  };
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
          <Left style={{ marginTop: Platform.OS === "android" ? 25 : 6 }}>
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
              top: Platform.OS === "android" ? 40.5 : 40,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Select Location
          </Title>
          <Right />
        </Header>
        <>
          {this.state.isMapLoaded === true ? (
            <View>
              <MapView
                moveOnMarkerPress={true}
                zoomEnabled={true}
                ref={(ref) => (this.mapView = ref)}
                initialRegion={this.state.region}
                onRegionChange={(reg) => this.onRegionChange(reg)}
                style={{
                  height: Dimensions.get("window").height,
                  width: Dimensions.get("window").width,
                }}
              >
                <Marker
                  draggable={true}
                  coordinate={this.state.x}
                  onDragEnd={(e) => {
                    this.saveLocation(e);
                  }}
                />
              </MapView>

              <View
                style={{
                  alignSelf: "center",
                  fontSize: 10,
                  backgroundColor: "white",
                  width: 290,
                  position: "absolute",
                  top: 40,
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder={this.state.address}
                  minLength={3}
                  styles={{
                    textInputContainer: {
                      width: Dimensions.get("screen").width - 70,
                      alignSelf: "center",
                      height: 42,
                    },
                  }}
                  autoFocus={false}
                  returnKeyType={"search"}
                  listViewDisplayed={false}
                  currentLocation={false}
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    this.notifyChange(details);
                  }}
                  query={{
                    key: "AIzaSyA4be4vwXO-Zn5IYcxA-trViY3j6LtODjg",
                    Language: "en",
                  }}
                  nearbyPlacesAPI="GooglePlacesSearch"
                  debounce={200}
                  GooglePlacesAutocomplete
                  ref={(instance) => {
                    this.GooglePlacesRef = instance;
                  }}
                />
              </View>
            </View>
          ) : (
            <Spinner size="large" color="blue" />
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View
              style={{
                marginTop: 170,
                alignSelf: "center",
                height: 200,
                borderRadius: 20,
                width: 330,
                backgroundColor: "#293D94",
              }}
            >
              <View style={{ flex: 1, alignSelf: "center", marginTop: -24 }}>
                <Thumbnail
                  source={require("../../assets/icons/Language-top-icon.png")}
                />
              </View>
              <View style={{ position: "absolute", right: 8, top: 6 }}>
                <Ionicons
                  onPress={this.hideModal}
                  name="ios-close-circle-outline"
                  size={28}
                  color="white"
                />
              </View>
              <View
                style={{ alignSelf: "center", position: "absolute", top: 50 }}
              >
                <Text
                  style={{ color: "white", fontSize: 12, alignSelf: "center" }}
                >
                  Enter Location Title
                </Text>

                <Input
                  style={{
                    textAlign: "center",
                    width: 200,
                    height: 34,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: "white",
                    borderRadius: 15,
                    marginTop: 10,
                  }}
                  onChangeText={(address) => {
                    this.setState({ title: address });
                  }}
                />
                <Button
                  onPress={this.saveAddress}
                  style={{
                    width: 140,
                    borderRadius: 15,
                    height: 34,
                    backgroundColor: "skyblue",
                    top: 35,
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "center",
                      marginLeft: 30,
                    }}
                  >
                    Submit
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </>
        {/* Footer */}
        <View
          style={{
            height: 180,
            backgroundColor: "white",
            position: "absolute",
            bottom: 0,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <View style={{ height: 38, marginTop: 10, alignSelf: "center" }}>
              <Button
                onPress={this.showModal}
                style={{ backgroundColor: "#283a97", alignSelf: "center" }}
              >
                <View>
                  <Text style={{ color: "white" }}>Select Location</Text>
                </View>
              </Button>
            </View>
            <Text
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                paddingTop: 10,
                fontSize: 12,
                marginTop: 6,
                alignSelf: "center",
                textAlign: "center",
                color: "#283a97",
              }}
            >
              Press the drop pin for 2s and move your finger to drag. Tap to
              drop the pin
            </Text>
          </View>
        </View>
        {/* Footer */}
      </Container>
    );
  }
}
