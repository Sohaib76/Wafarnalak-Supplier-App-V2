import {
  AsyncStorage,
  Dimensions,
  Image,
  Text,
  View,
  ImageBackground,
} from "react-native";
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
  Left,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

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
              text:
                this.state.lan == "en"
                  ? "Company detail has been saved successfully!!"
                  : "تم حفظ تفاصيل الشركة بنجاح !!",
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
        text:
          this.state.lan == "en"
            ? "Please enter the required data!!"
            : "الرجاء إدخال البيانات المطلوبة!!",
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
                alignSelf: "center",
                color: "#00203b",
                position: "absolute",
                top: Platform.OS === "android" ? 38 : 38,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "User Details" : "بيانات المستخدم"}
            </Title>

            <Right />
          </Header>
          <ScrollView style={{ marginBottom: Platform.OS === "ios" ? 0 : 170 }}>
            <Spinner visible={this.state.loading} textContent={""} />
            {/* <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>
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
            <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>
                Company Registration Certificate
              </Text>
                <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
              </View>
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
                  <View style={{ position: "absolute", left: 13, top: 8 }}>
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

            <View
              style={{
                marginTop: 10, //10
                marginLeft: 18,
                marginRight: 35,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>
                  {this.state.lan == "en" ? "Shop Name" : "اسم المحل"}
                </Text>
                <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* <View style={{ marginTop: 5 }}>
                  <Image
                    source={require("../../assets/icons/Hashtag.png")}
                    style={{ width: 20, height: 17 }}
                    resizeMode="contain"
                  />
                </View> */}
                <Input
                  placeholder={this.state.lan == "en" ? "Mandatory" : "إلزامي"}
                  placeholderTextColor="gray"
                  value={this.state.shopName}
                  style={{
                    backgroundColor: "white",
                    height: 35, //28
                    marginLeft: 0,
                    borderRadius: 20,
                    borderWidth: 0.5,
                    borderColor: "grey",
                    paddingLeft: 15,
                    fontSize: 15,
                  }}
                  onChangeText={(shop) => {
                    this.saveState("shopName", shop);
                  }}
                />
              </View>
            </View>
            <View style={{ marginTop: 20, marginLeft: 18, marginRight: 35 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>
                  {this.state.lan == "en"
                    ? "Iqama/National ID Number"
                    : "الإقامة / رقم الهوية"}{" "}
                </Text>
                <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* <View style={{ marginTop: 5 }}>
                  <Image
                    source={require("../../assets/icons/Hashtag.png")}
                    style={{ width: 20, height: 17 }}
                    resizeMode="contain"
                  />
                </View> */}
                <Input
                  placeholder={this.state.lan == "en" ? "Mandatory" : "إلزامي"}
                  placeholderTextColor="gray"
                  value={this.state.iqamaNumber}
                  style={{
                    backgroundColor: "white",
                    height: 35, //28
                    marginLeft: 0,
                    borderRadius: 20,
                    borderWidth: 0.5,
                    borderColor: "grey",
                    paddingLeft: 15,
                    fontSize: 15,
                  }}
                  onChangeText={(iqama) => {
                    this.saveState("iqamaNumber", iqama);
                  }}
                />
              </View>
            </View>
            <TouchableWithoutFeedback
              // style={{ backgroundColor: "red" }}
              onPress={() =>
                this.props.navigation.navigate("UploadDocument", {
                  fileType: 2,
                  user: this.state.user,
                })
              }
            >
              <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#00203b", marginBottom: 10 }}>
                    {this.state.lan == "en"
                      ? "Iqama/National ID"
                      : "الإقامة / الهوية الوطنية"}{" "}
                  </Text>
                  <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ marginTop: 3 }}>
                    <Ionicons name="ios-image" size={22} />
                  </View> */}
                  <View
                    style={{
                      backgroundColor: "white",
                      height: 35,
                      marginLeft: 0,
                      width: Dimensions.get("screen").width - 60, //76
                      // borderRadius: 20,
                      borderWidth: 0.5,
                      borderColor: "grey",
                      paddingLeft: 15,
                      fontSize: 15,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  >
                    <View style={{ position: "absolute", left: 13, top: 8 }}>
                      <Text style={{ color: "gray" }}>
                        {this.state.lan == "en"
                          ? "Upload images"
                          : "تحميل الصورة"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 3, //6
                      width: 50,
                      // marginTop: 3,
                      backgroundColor: "#00203b",
                      height: 35,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="ios-image" size={18} color={"white"} />
                    {/* size={22} */}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            {/* <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>License Number</Text>
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
            <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>License Picture</Text>
                <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
              </View>
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
                  <View style={{ position: "absolute", left: 13, top: 8 }}>
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
              <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#00203b", marginBottom: 10 }}>
                    {this.state.lan == "en" ? "Pictures of Work" : "صورة العمل"}
                  </Text>
                  <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ marginTop: 3 }}>
                    <Ionicons name="ios-image" size={22} />
                  </View> */}
                  <View
                    style={{
                      backgroundColor: "white",
                      height: 35,
                      marginLeft: 0,
                      width: Dimensions.get("screen").width - 60, //76
                      // borderRadius: 20,
                      borderWidth: 0.5,
                      borderColor: "grey",
                      paddingLeft: 15,
                      fontSize: 15,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  >
                    <View style={{ position: "absolute", left: 13, top: 8 }}>
                      <Text style={{ color: "gray" }}>
                        {this.state.lan == "en"
                          ? "Upload images"
                          : "تحميل الصورة"}
                      </Text>
                    </View>
                    {/* <View
                      style={{ position: "absolute", right: 6, marginTop: 3 }}
                    >
                      <Ionicons name="ios-arrow-forward" size={22} />
                    </View> */}
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 3, //6
                      width: 50,
                      // marginTop: 3,
                      backgroundColor: "#00203b",
                      height: 35,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="ios-image" size={18} color={"white"} />
                    {/* size={22} */}
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
              <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#00203b", marginBottom: 10 }}>
                    {this.state.lan == "en" ? "Pictures of Shop" : "صورة المحل"}
                  </Text>
                  <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ marginTop: 3 }}>
                    <Ionicons name="ios-image" size={22} />
                  </View> */}
                  <View
                    style={{
                      backgroundColor: "white",
                      height: 35,
                      marginLeft: 0,
                      width: Dimensions.get("screen").width - 60, //76
                      // borderRadius: 20,
                      borderWidth: 0.5,
                      borderColor: "grey",
                      paddingLeft: 15,
                      fontSize: 15,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  >
                    <View style={{ position: "absolute", left: 13, top: 8 }}>
                      <Text style={{ color: "gray" }}>
                        {this.state.lan == "en"
                          ? "Upload images"
                          : "تحميل الصورة"}
                      </Text>
                    </View>
                    {/* <View
                      style={{ position: "absolute", right: 6, marginTop: 3 }}
                    >
                      <Ionicons name="ios-arrow-forward" size={22} />
                    </View> */}
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 3, //6
                      width: 50,
                      // marginTop: 3,
                      backgroundColor: "#00203b",
                      height: 35,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="ios-image" size={18} color={"white"} />
                    {/* size={22} */}
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
              <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#00203b", marginBottom: 10 }}>
                    {this.state.lan == "en" ? "Select Location" : "إختر الموقع"}{" "}
                  </Text>
                  <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ marginTop: 3 }}>
                    <Ionicons name="ios-locate" size={22} />
                  </View> */}
                  <View
                    style={{
                      backgroundColor: "white",
                      height: 35,
                      marginLeft: 0,
                      width: Dimensions.get("screen").width - 60, //76
                      // borderRadius: 20,
                      borderWidth: 0.5,
                      borderColor: "grey",
                      paddingLeft: 15,
                      fontSize: 15,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  >
                    <View style={{ position: "absolute", left: 13, top: 8 }}>
                      <Text style={{ color: "gray" }}>
                        {this.state.location !== ""
                          ? this.state.location.addressname
                          : this.state.lan == "en"
                          ? "Mandatory"
                          : "إلزامي"}
                      </Text>
                    </View>
                    {/* <View
                      style={{ position: "absolute", right: 6, marginTop: 3 }}
                    >
                      <Ionicons name="ios-arrow-forward" size={22} />
                    </View> */}
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 3, //6
                      width: 50,
                      // marginTop: 3,
                      backgroundColor: "#00203b",
                      height: 35,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="ios-locate" size={18} color={"white"} />
                    {/* size={22} */}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 25, marginLeft: 18, marginRight: 35 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#00203b", marginBottom: 10 }}>
                  {this.state.lan == "en"
                    ? "Select Nationality"
                    : "إختر الجنسية"}{" "}
                </Text>
                <Text style={{ color: "red", marginBottom: 10 }}> *</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* <View style={{ marginTop: 5 }}>
                  <Image
                    source={require("../../assets/icons/Hashtag.png")}
                    style={{ width: 20, height: 17 }}
                    resizeMode="contain"
                  />
                </View> */}
                <View
                  style={{
                    backgroundColor: "white",
                    height: 35,
                    //marginLeft: 5,
                    width: Dimensions.get("screen").width - 60,
                    borderWidth: 0.5,
                    borderColor: "grey",
                    //paddingLeft: 15,
                    fontSize: 15,
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    // borderRadius:20
                  }}
                >
                  <View style={{ marginLeft: 0, marginTop: -5 }}>
                    {/* marginTop: -8  */}
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
                  {/* <View style={{ position: "absolute", right: 6, marginTop: 3 }}>
                  <Ionicons name="ios-arrow-down" size={22} />
                </View> */}
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: 3, //6
                    width: 50,
                    // marginTop: 3,
                    backgroundColor: "#00203b",
                    height: 35,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="flag-outline" size={18} color={"white"} />
                  {/* size={22} */}
                </View>
              </View>
            </View>
            {/* </> */}
          </ScrollView>

          {/* <Button
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
          </Button> */}

          <Button
            // onPress={this.saveCompanyDetail}
            onPress={() =>
              this.props.navigation.navigate("ProfileVerification", {
                lan: this.state.lan,
              })
            }
            // onPress={() =>
            //   this.props.navigation.navigate("DisabledAccount", {
            //     lan: this.state.lan,
            //   })
            // }
            // rounded
            style={{
              // marginTop: "0%",
              backgroundColor: "#283a97",
              justifyContent: "center",
              width: "82%",
              height: 55,
              alignSelf: "center",
              backgroundColor: "rgba(0, 32, 59, 1)",
              borderRadius: 12,
              position: "absolute",
              bottom: Platform.OS == "ios" ? 30 : 100,
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
              {this.state.lan == "en" ? "Submit" : "يقدم"}
            </Text>
          </Button>
        </ImageBackground>
      </Container>
    );
  }
}
