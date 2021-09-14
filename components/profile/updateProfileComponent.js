import React from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  AsyncStorage,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Container,
  Form,
  Item,
  Input,
  Picker,
  Content,
  Button,
  Header,
  Toast,
  Left,
  Right,
  Title,
} from "native-base";
// import { Picker } from "@react-native-picker/picker";

import { ScrollView } from "react-native-gesture-handler";
export default class UpdateProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lan: "en",
      user: null,
      id: "",
      name: "",
      email: "",
      gender: "",
      mobile: "",
      shopName: "",
      crNumber: "",
      category: "",
      service: "",
      licenseNumber: "",
      loading: false,
      selectedNationality: "",
      gender: "1",
    };
  }
  saveState = (label, value) => {
    this.setState({ [label]: value });
  };
  componentDidMount = () => {
    const { navigation } = this.props;
    let lan = navigation.getParam("lan");
    let user = navigation.getParam("user");
    this.setState({
      lan: lan,
      user: user,
      licenseNumber: user.licensenumber,
      id: user.nationaloriqama,
      selectedNationality: user.nationality ? user.nationality.id : "",
      name: user.name,
      shopName: user.shopname ? user.shopname : "",
      email: user.email,
      mobile: user.mobile,
      crNumber: user.crnumber,
      category: user.category ? user.category.categoryname : "",
      service: user.services.length > 0 ? user.services[0].servicename : "",
    });
  };
  getSpUser = async () => {
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
            console.log(responseJson);
            this.setState({ user: responseJson });
          } else {
            Toast.show({
              text: responseJson.message,
              buttonText: "",
              position: "bottom",
            });
          }
        })
        .catch((error) => {
          Toast.show({
            text: "Something went wrong please try again later!",
            buttonText: "",
            position: "bottom",
          });
        });
    }
  };
  updateProfile = () => {
    this.setState({ loading: true });
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/update_sp_profile",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spid: this.state.user.spid,
          name: this.state.name,
          shopname: this.state.shopName,
          email: this.state.email,
          mobile: this.state.mobile,
          companyorindividual: 1,
          crnumber: this.state.crNumber,
          nationaloriqama: this.state.id,
          licensenumber: this.state.licenseNumber,
          nationality: this.state.selectedNationality,
          gender: this.state.gender,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error === false) {
          this.setState({ loading: false });
          Toast.show({
            text: "Profile updated Successfully",
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
        Toast.show({
          text: "Something went wrong please try again later!",
          buttonText: "",
          position: "bottom",
        });
        this.setState({ loading: false });
      });
  };
  deleteWorkPicture = (image) => {
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/remove_file",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filepath: image.path,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error === false) {
          let copyWorkImages = this.state.user;
          let index = copyWorkImages.works.findIndex(
            (img) => img.fileid === image.fileid
          );
          if (index > -1) {
            copyWorkImages.works.splice(index, 1);
            this.setState({ user: copyWorkImages });
          } //thing
        } else {
          this.setState({ loading: false });
          Toast.show({
            text: responseJson.message,
            buttonText: "",
            position: "bottom",
          });
        }
      }) //speak
      .catch((error) => {
        this.setState({ loading: false });
        Toast.show({
          text: "Something went wrong please try again later!",
          buttonText: "",
          position: "bottom",
        });
      });
  };
  addNewWorkImage = () => {
    this.props.navigation.navigate("UploadDocument", {
      fileType: 4,
      user: this.state.user,
    });
  };
  onValueChange(value) {
    this.setState({
      gender: value,
    });
  }
  render() {
    return (
      <Container style={{ backgroundColor: "lightgray" }}>
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
          <Left
            style={{
              marginTop: Platform.OS === "ios" ? 9 : 24,
              //  marginTop: Platform.OS === "ios" ? 9 : 24,
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
            {this.state.lan == "en" ? "Profile" : "ملفي الشخصي"}
          </Title>
          <Right />
        </Header>
        {/* Content */}
        {/* <View style={{ backgroundColor: "lightgray" }}> */}
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            // backgroundColor: "lightgray",
            // height: "100%",
          }}
        >
          {
            <NavigationEvents
              onWillFocus={() => {
                this.getSpUser();
              }}
            />
          }
          <Spinner visible={this.state.loading} textContent={""} />
          <View style={{ marginTop: 20, marginLeft: 35.5, marginRight: 35.5 }}>
            {/* ml : 18, mr:35 */}
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en"
                ? "ID (Iqama) Number"
                : "رقم هوية الإقامة"}
              *
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="123"
                placeholderTextColor="gray"
                returnKeyType="done"
                value={this.state.id}
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(id) => {
                  this.saveState("id", id);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "License Number" : "رقم الرخصة"}*
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="123"
                placeholderTextColor="gray"
                value={this.state.licenseNumber}
                returnKeyType="done"
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(license) => {
                  this.saveState("licenseNumber", license);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "Full Name" : "الاسم بالكامل"}*
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="John Doe"
                placeholderTextColor="gray"
                value={this.state.name}
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(name) => {
                  this.saveState("name", name);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en"
                ? "Email Address"
                : "عنوان البريد الإلكتروني"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="John@Doe.com"
                placeholderTextColor="gray"
                returnKeyType="done"
                value={this.state.email}
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(email) => {
                  this.saveState("email", email);
                }}
              />
            </View>
          </View>
          {/* <View style={{ marginTop: 10,  marginLeft: 35.5, marginRight: 35.5 }}>
                        <Text style={{ color: '#283a97', marginLeft: 5 }}>Gender</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Input placeholder="Male"
                                placeholderTextColor="gray"
                                value={this.state.gender}
                                style={{ backgroundColor: 'white', height: 28, marginLeft: 5 }}
                                onChangeText={(gender) => { this.saveState('gender', gender) }}
                            />
                            <View style={{ marginTop: 8, position: 'absolute', right: 10 }}><Ionicons name="ios-arrow-down" /></View>
                        </View>
                    </View> */}
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "Mobile Number" : "رقم الجوال"}*
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="+96XXXXXX"
                placeholderTextColor="gray"
                value={this.state.mobile}
                returnKeyType="done"
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(mobile) => {
                  this.saveState("mobile", mobile);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "Shop Name" : "إسم المحل"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="ABC Shop"
                placeholderTextColor="gray"
                value={this.state.shopName}
                returnKeyType="done"
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(shopName) => {
                  this.saveState("shopName", shopName);
                }}
              />
            </View>
          </View>
          {/* 35.5 */}
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 25 }}>
            {/* marginLeft: 22, marginRight: 35  */}
            <Text style={{ color: "#283a97", marginLeft: 5, marginRight: 5 }}>
              {this.state.lan == "en" ? "Gender" : "الجنس"}*
            </Text>

            {/* <View
              style={{
                backgroundColor: "red",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
            */}
            <Picker
              mode="dropdown"
              iosHeader={"Choose Gender"}
              iosIcon={<Ionicons name="ios-arrow-down" color="black" />}
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="black" //#007aff
              // Icon={<Ionicons name="arrow-down" color="black" />}
              selectedValue={this.state.gender}
              style={{
                // backgroundColor: "transparent",

                // width: "70%",
                // color: "#747474",
                // flex: 0.8,
                backgroundColor: "white",
                // height: Platform.OS === "android" ? 40 : 45,

                height: 32,
                borderRadius: 0,
                marginLeft: 5, // marginLeft: 5,
                marginRight: 10, // marginRight: 10,
              }}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item
                label={this.state.lan == "en" ? "Female" : "أنثى"}
                value="0"
              />
              <Picker.Item
                label={this.state.lan == "en" ? "Male" : "ذكر"}
                value="1"
              />
            </Picker>
            {/* <View
                style={{
                  flex: 0.5,
                  backgroundColor: "black",
                  alignItems: "flex-end",
                }}
              >
                <Ionicons name="ios-arrow-down" color="green" size={20} />
              </View>
            </View> */}
          </View>
          <View style={{ marginTop: 10, marginLeft: 35.5, marginRight: 35.5 }}>
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "CR Number" : "رقم تسجيل الشركة"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Input
                placeholder="9213"
                placeholderTextColor="gray"
                value={this.state.crNumber}
                returnKeyType="done"
                style={{
                  backgroundColor: "white",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(crNumber) => {
                  this.saveState("crNumber", crNumber);
                }}
              />
            </View>
          </View>
          {/* <View style={{ marginTop: 10,  marginLeft: 35.5, marginRight: 35.5 }}>
                        <Text style={{ color: '#283a97', marginLeft: 5 }}>Business Name</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Input placeholder="Electronic Repair"
                                placeholderTextColor="gray"
                                value={this.state.category}
                                style={{ backgroundColor: 'white', height: 28, marginLeft: 5 }}
                                onChangeText={(category) => { this.saveState('category', category) }}
                            />
                            <View style={{ marginTop: 8, position: 'absolute', right: 10 }}><Ionicons name="ios-arrow-down" /></View>
                        </View>
                    </View> */}
          {/* <View style={{ marginTop: 10,  marginLeft: 35.5, marginRight: 35.5 }}>
                        <Text style={{ color: '#283a97', marginLeft: 5 }}>Service Name</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Input placeholder="Electronic Repair"
                                placeholderTextColor="gray"
                                value={this.state.service}
                                style={{ backgroundColor: 'white', height: 28, marginLeft: 5 }}
                                onChangeText={(service) => { this.saveState('service', service) }}
                            />
                        </View>
                    </View> */}
          <View
            style={{
              marginTop: 5,
              marginBottom: 0,
              marginLeft: 35.5,
              marginRight: 35.5,
            }}
          >
            <Text style={{ color: "#283a97", marginLeft: 5 }}>
              {this.state.lan == "en" ? "Work Pictures" : "صورة العمل"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                marginLeft: 5,
                marginRight: 2,
                height: 80,
              }}
            >
              {this.state.user &&
                this.state.user.works.map(
                  function (image, index) {
                    return (
                      <View key={index} style={{ marginTop: 5, marginLeft: 5 }}>
                        <Image
                          source={{
                            uri:
                              "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/" +
                              image.path,
                          }}
                          style={{ width: 50, height: 70 }}
                          resizeMode="contain"
                        />
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.deleteWorkPicture(image);
                          }}
                        >
                          <View style={{ marginTop: -12 }}>
                            <Image
                              source={require("../../assets/icons/Delete-Picture.png")}
                              style={{ width: 15, height: 12 }}
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    );
                  }.bind(this)
                )}
              <TouchableWithoutFeedback onPress={this.addNewWorkImage}>
                <View
                  style={{
                    marginLeft: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    width: 65,
                    height: 70,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/Add-Picture.png")}
                    style={{ width: 30, height: 20 }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{ marginTop: 10 }}></View>
        </ScrollView>
        {/* </View> */}
        {/* Content */}
        <View style={{ backgroundColor: "lightgray" }}>
          <Button
            onPress={this.updateProfile}
            rounded
            style={{
              marginBottom: 10,
              justifyContent: "center",
              backgroundColor: "#283a97",
              width: 270,
              height: 40,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {this.state.lan == "en" ? "Update" : "تحديث"}
            </Text>
          </Button>
        </View>
      </Container>
    );
  }
}
