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
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
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
              text:
                this.state.lan == "en"
                  ? "Location has been saved successfully!!"
                  : "تم حفظ الموقع بنجاح",
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
        text:
          this.state.lan == "en"
            ? "please enter location title!"
            : "الرجاء إدخال عنوان الموقع",
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
        <Header style={{ backgroundColor: "white", height: 80 }}>
          <Left style={{ marginTop: Platform.OS === "android" ? 25 : 6 }}>
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
              top: Platform.OS === "android" ? 40.5 : 40,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {this.state.lan == "en" ? "Select Location" : "اختر الموقع"}
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

              {/* <View
                style={{
                  fontSize: 10,
                  backgroundColor: "white",
                  width: 290,
                  position: "absolute",
                  margin: 20,
                  borderRadius: 10,
                  height: 45,
                  elevation: 1,
                }}
              >
                <Ionicons
                  name={"search-outline"}
                  size={25}
                  color={"#00203b"}
                  style={{ position: "absolute", left: 5, top: 7, zIndex: 2 }}
                />
                <GooglePlacesAutocomplete
                  placeholder={this.state.address}
                  minLength={3}
                  styles={{
                    textInputContainer: {
                      width: Dimensions.get("screen").width - 60, //-70
                      alignSelf: "center",
                      height: 45, //42
                      backgroundColor: "white",
                      borderRadius: 10,
                      elevation: 1,
                      marginLeft: 100,
                    },
                   
                    poweredContainer: {
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderBottomRightRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderColor: "#fff",
                      borderTopWidth: 0.5,
                    },
                  }} */}
              <View
                style={{
                  alignSelf: "center",
                  fontSize: 10,
                  backgroundColor: "white",
                  width: 290,
                  position: "absolute",
                  top: 40,
                  borderRadius: 10,
                }}
              >
                <Ionicons
                  name={"search-outline"}
                  size={25}
                  color={"#00203b"}
                  style={{ position: "absolute", left: -30, top: 7, zIndex: 2 }}
                />
                <GooglePlacesAutocomplete
                  placeholder={this.state.address}
                  minLength={3}
                  styles={{
                    textInputContainer: {
                      width: Dimensions.get("screen").width - 50, //70
                      alignSelf: "center",
                      height: 52, //42
                      backgroundColor: "white",
                      paddingLeft: 20,
                    },
                    poweredContainer: {
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderBottomRightRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderColor: "#fff",
                      borderTopWidth: 0.5,
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
            // visible={true}
          >
            <View
              style={{
                marginTop: "60%",
                alignSelf: "center",
                height: 250,
                // borderRadius: 20,
                width: "90%", //330
                backgroundColor: "#00203b",
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}
            >
              {/* <View style={{ flex: 1, alignSelf: "center", marginTop: -24 }}>
                <Thumbnail
                  source={require("../../assets/icons/Language-top-icon.png")}
                />
              </View>*/}
              <View style={{ position: "absolute", right: 8, top: 6 }}>
                <Ionicons
                  onPress={this.hideModal}
                  name="ios-close-circle-outline"
                  size={28}
                  color="white"
                />
              </View>
              <View
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  top: 20,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    alignSelf: "center",
                    fontWeight: "bold",
                  }}
                >
                  {this.state.lan == "en"
                    ? "Enter Location Title"
                    : "أدخل عنوان الموقع"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: 180,
                    alignSelf: "center",
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={28}
                    color="white"
                    style={{ marginTop: 50 }}
                  />
                  <Input
                    style={{
                      textAlign: "center",
                      width: 150, //200 150
                      height: 34,
                      paddingLeft: 10,
                      paddingRight: 10,
                      // backgroundColor: "red",
                      // borderRadius: 15,
                      marginTop: 50,
                      borderBottomWidth: 5,
                      borderBottomColor: "white",
                      fontSize: 15,
                      alignSelf: "center",
                      color: "white",
                    }}
                    onChangeText={(address) => {
                      this.setState({ title: address });
                    }}
                    placeholder={
                      this.state.lan == "en" ? "My Shop Location" : "موقع متجري"
                    }
                    placeholderTextColor="rgba(255,255,255,0.6)"
                  />
                </View>
                <Button
                  onPress={this.saveAddress}
                  style={{
                    width: "120%", //140
                    borderRadius: 10,
                    height: "40%",
                    backgroundColor: "skyblue",
                    top: 48, //35
                    alignSelf: "center",
                    backgroundColor: "white",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      alignSelf: "center",
                      // marginLeft: 30,
                    }}
                  >
                    {this.state.lan == "en" ? "Submit" : "تسليم"}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </>
        {/* Footer */}
        <View
          style={{
            height: 110, //180
            backgroundColor: "white",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              // backgroundColor: "pink",
              height: 65,
              width: 340,
            }}
          >
            {/* <View
              style={{
                marginTop: 10,
                alignSelf: "center",
                backgroundColor: "red",
              }}
            > */}
            <Button
              onPress={this.showModal}
              style={{
                backgroundColor: "#00203b",
                alignSelf: "center",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontWeight: "bold",
                  }}
                >
                  {this.state.lan == "en" ? "Select Location" : "اختر الموقع"}
                </Text>
              </View>
            </Button>
          </View>
          {/* <Text
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
              {this.state.lan == "en"
                ? "Press the drop pin for 2s and move your finger to drag. Tap to drop the pin"
                : "انقر على السهم لمدة ثانيتين وحرك إصبعك للسحب ، انقر لتحريك السهم"}
            </Text> */}
        </View>
        {/* </View> */}
        {/* Footer */}
      </Container>
    );
  }
}
