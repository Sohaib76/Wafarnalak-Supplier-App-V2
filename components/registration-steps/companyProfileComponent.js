import { AsyncStorage, Dimensions, Image, Text, View } from "react-native";
import {
  Button,
  Container,
  Content,
  Header,
  Input,
  Picker,
  Right,
  Title,
  Toast,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class CompanyProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crNumber: "",
      iqamaNumber: "",
      licenseNumber: "",
      companyorindividual: 1,
      user: {},
      loading: false,
      nationalities: [],
      selectedNationality: "",
      location: "",
      shopName: "",
      spid: null,
      mobile: "",
      spname: "",
    };
  }
  getNationalities = () => {
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_nationality",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ nationalities: responseJson });
      })
      .catch((error) => {
        Toast.show({
          text: "something went wrong try again later!",
          buttonText: "",
          position: "bottom",
        });
      });
  };

  getNationalities = () => {
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_nationality",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ nationalities: responseJson });
      })
      .catch((error) => {
        Toast.show({
          text: "something went wrong try again later!",
          buttonText: "",
          position: "bottom",
        });
      });
  };
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    this.getNationalities();
  };

  //   getSpUser = async () => {
  //     this.setState({ loading: true });
  //     let user = await AsyncStorage.getItem("sp");
  //     if (user !== null) {
  //       let spUser = JSON.parse(user);
  //       fetch(
  //         "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/get_sp_details",
  //         {
  //           method: "POST",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             mobile: this.state.spid.mobile
  //           }),
  //         }
  //       )
  //         .then((response) => response.json())
  //         .then((responseJson) => {
  //           if (responseJson.error === false) {
  //             this.setState({
  //               loading: false,
  //               selectedNationality: responseJson.nationality
  //                 ? responseJson.nationality.country_name
  //                 : "",
  //               user: responseJson,
  //               crNumber: responseJson.crnumber ? responseJson.crnumber : "",
  //               iqamaNumber: responseJson.nationaloriqama
  //                 ? responseJson.nationaloriqama
  //                 : "",
  //               licenseNumber: responseJson.licensenumber
  //                 ? responseJson.licensenumber
  //                 : "",
  //             });
  //           } else {
  //             Toast.show({
  //               text: responseJson.message,
  //               buttonText: "",
  //               position: "bottom",
  //             });
  //             this.setState({ loading: false });
  //           }
  //         })
  //         .catch((error) => {
  //           Toast.show({
  //             text: "something went wrong try again later!",
  //             buttonText: "",
  //             position: "bottom",
  //           });
  //         });
  //     }
  //   };
  saveState = (label, value) => {
    this.setState({ [label]: value });
  };
  saveCompanyDetail = async () => {
    console.log("this.state.user-----", this.state.user);

    await AsyncStorage.getItem("SPID").then((res) => {
      console.log("SPID-----", res);
      let id = parseInt(res);
      console.log("SPID-----", id);

      this.setState({ spid: id });
    });
    await AsyncStorage.getItem("SPNAME").then((res) => {
      console.log("SPn-----", res);

      this.setState({ spname: res });
    });
    await AsyncStorage.getItem("SPMOB").then((res) => {
      console.log("SPID-----", res);

      this.setState({ mobile: res });
    });

    if (this.state.iqamaNumber && this.state.selectedNationality !== "") {
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
            spid: this.state.spid,
            name: this.state.spname,
            email: this.state.user.email,
            mobile: this.state.mobile,
            companyorindividual: this.state.companyorindividual,
            nationaloriqama: this.state.iqamaNumber,
            nationality: this.state.selectedNationality,
            shopname: this.state.shopName,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("company profile ---------", responseJson);
          if (responseJson.error === false) {
            this.setState({ loading: false });
            Toast.show({
              text: "Company detail has been saved successfully!!",
              buttonText: "",
              position: "bottom",
            });

            if (responseJson.profilestatus === 3) {
              this.props.navigation.navigate("ProfileVerification", {
                lan: this.state.lan,
              });
            }
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
            text: "Something went wrong tryagain later!",
            buttonText: "",
            position: "bottom",
          });
        });
    } else {
      Toast.show({
        text: "Please enter the required data!!",
        buttonText: "",
        position: "bottom",
      });
    }
  };
  render() {
    let nationalityItems =
      this.state.nationalities &&
      this.state.nationalities.map((s, i) => {
        return <Picker.Item key={i} value={s.id} label={s.country_name} />;
      });

    return (
      <Container>
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
          <Title
            style={{
              alignSelf: "center",
              color: "white",
              position: "absolute",
              top: Platform.OS === "android" ? 38 : 38,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {this.state.lan == "en" ? "User Details" : ""}
          </Title>
          <Right />
        </Header>
        <>
          <Spinner visible={this.state.loading} textContent={""} />
          {/* <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>
              Company Registration Number
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 5 }}>
                <Image
                  source={require("../../assets/icons/Hashtag.png")}
                  style={{ width: 20, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <Input
                placeholder="Registration #"
                placeholderTextColor="gray"
                value={this.state.crNumber}
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(cr) => {
                  this.saveState("crNumber", cr);
                }}
              />
            </View>
          </View> */}
          {/* <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("UploadDocument", {
                fileType: 6,
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>
                Company Registration Certificate
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-image" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>Upload images</Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback> */}
          <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>
              {this.state.lan == "en" ? "Shop Name" : "اسم المحل"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 5 }}>
                <Image
                  source={require("../../assets/icons/Hashtag.png")}
                  style={{ width: 20, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <Input
                placeholder="Shop Name"
                placeholderTextColor="gray"
                value={this.state.shopName}
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(shop) => {
                  this.saveState("shopName", shop);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>
              {this.state.lan == "en"
                ? "Iqama/National ID Number"
                : "الإقامة / رقم الهوية"}{" "}
              *
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 5 }}>
                <Image
                  source={require("../../assets/icons/Hashtag.png")}
                  style={{ width: 20, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <Input
                placeholder="Iqama #"
                placeholderTextColor="gray"
                value={this.state.iqamaNumber}
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(iqama) => {
                  this.saveState("iqamaNumber", iqama);
                }}
              />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("UploadDocument", {
                fileType: 2,
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>
                {this.state.lan == "en"
                  ? "Iqama/National ID"
                  : "الإقامة / الهوية الوطنية"}{" "}
                *
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-image" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>
                      {this.state.lan == "en"
                        ? "Upload images"
                        : "تحميل الصورة"}
                    </Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>License Number</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 5 }}>
                <Image
                  source={require("../../assets/icons/Hashtag.png")}
                  style={{ width: 20, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <Input
                placeholder="License #"
                placeholderTextColor="gray"
                value={this.state.licenseNumber}
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                }}
                onChangeText={(license) => {
                  this.saveState("licenseNumber", license);
                }}
              />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("UploadDocument", {
                fileType: 3,
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>License Picture</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-image" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>Upload images</Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("UploadDocument", {
                fileType: 4,
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>
                {this.state.lan == "en" ? "Pictures of Work" : "صورة العمل"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-image" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>
                      {this.state.lan == "en"
                        ? "Upload images"
                        : "تحميل الصورة"}
                    </Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("UploadDocument", {
                fileType: 5,
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>
                {this.state.lan == "en" ? "Pictures of Shop" : "صورة المحل"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-image" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>
                      {this.state.lan == "en"
                        ? "Upload images"
                        : "تحميل الصورة"}
                    </Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("Addresses", {
                user: this.state.user,
              })
            }
          >
            <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
              <Text style={{ color: "#283a97" }}>
                {this.state.lan == "en" ? "Select Location" : "إختر الموقع"} *
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 3 }}>
                  <Ionicons name="ios-locate" size={22} />
                </View>
                <View
                  style={{
                    backgroundColor: "lightgray",
                    height: 28,
                    marginLeft: 5,
                    width: Dimensions.get("screen").width - 76,
                  }}
                >
                  <View style={{ position: "absolute", left: 8, top: 5 }}>
                    <Text style={{ color: "gray" }}>
                      {this.state.location !== ""
                        ? this.state.location.addressname
                        : "your location"}
                    </Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 6, marginTop: 3 }}
                  >
                    <Ionicons name="ios-arrow-forward" size={22} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ marginTop: 15, marginLeft: 18, marginRight: 35 }}>
            <Text style={{ color: "#283a97" }}>
              {this.state.lan == "en" ? "Select Nationality" : "إختر الجنسية"} *
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: 5 }}>
                <Image
                  source={require("../../assets/icons/Hashtag.png")}
                  style={{ width: 20, height: 17 }}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  backgroundColor: "lightgray",
                  height: 28,
                  marginLeft: 5,
                  width: Dimensions.get("screen").width - 76,
                }}
              >
                <View style={{ marginLeft: 4, marginTop: -8 }}>
                  <Picker
                    selectedValue={this.state.selectedNationality}
                    onValueChange={(code) =>
                      this.setState({ selectedNationality: code })
                    }
                    style={{ width: Dimensions.get("screen").width - 80 }}
                  >
                    {nationalityItems}
                  </Picker>
                </View>
                <View style={{ position: "absolute", right: 6, marginTop: 3 }}>
                  <Ionicons name="ios-arrow-down" size={22} />
                </View>
              </View>
            </View>
          </View>
        </>
        <Button
          onPress={this.saveCompanyDetail}
          // onPress={() =>
          //   this.props.navigation.navigate("ProfileVerification", {
          //     lan: this.state.lan,
          //   })
          // } //Change
          rounded
          style={{
            backgroundColor: "#283a97",
            marginBottom: 8,
            alignSelf: "center",
            width: 270,
            height: 40,
            justifyContent: "center",
            position: "absolute",
            bottom: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
        </Button>
      </Container>
    );
  }
}
