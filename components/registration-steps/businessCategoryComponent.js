import {
  AsyncStorage,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import {
  Button,
  Container,
  Content,
  Footer,
  Header,
  Left,
  Right,
  Title,
  Toast,
} from "native-base";

import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

export default class BusinessCategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businessCategories: [],
      user: {},
      loading: false,
      services: [],
      selectedArrayItem: [],
      isSelected: false,
      spid: null,
    };
  }
  getBusinessCategories = () => {
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/all_categories_sp",
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
        if (responseJson.error === false) {
          console.log(responseJson);
          this.setState({
            loading: false,
            businessCategories: responseJson.categories,
            services: responseJson.services,
          });
        } else {
          Toast.show({
            text:
              this.state.lan == "en"
                ? responseJson.message
                : responseJson_ar.message,
            buttonText: "",
            position: "bottom",
          });
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    let user = await AsyncStorage.getItem("sp");
    let spUser = JSON.parse(user);
    if (user !== null) {
      let spUser = JSON.parse(user);
    }
    this.getBusinessCategories();
  };

  saveBusinessCategory = async () => {
    let serviceId = [];
    this.state.selectedArrayItem.map((i) => {
      serviceId.push({ serviceid: i.serviceid });
    });
    let categoryid = this.state.selectedArrayItem[0].categoryid;

    await AsyncStorage.getItem("SPID").then((res) => {
      console.log("red sp", parseInt(res));
      this.setState({ spid: parseInt(res) });
    });
    // if (this.state.selectedArrayItem.length > 0) {
    //   this.props.navigation.navigate("CategoriesService", {
    //     category: this.state.selectedArrayItem,
    //   });
    // } else {
    this.setState({ loading: true });
    fetch(
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/V1.2/add_services",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spid: this.state.spid,
          categoryid: categoryid,
          services: serviceId,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error === false) {
          this.setState({ loading: false });
          this.props.navigation.navigate("CompanyProfile", {
            spid: this.state.spid,
          });
        } else {
          Toast.show({
            text:
              this.state.lan == "en"
                ? responseJson.message
                : responseJson_ar.message,
            buttonText: "",
            position: "bottom",
          });
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        Toast.show({
          text:
            this.state.lan == "en"
              ? "Something went wrong try again later!"
              : "حدث خطأ ما ، حاول مرة أخرى في وقت لاحق",
          buttonText: "",
          position: "bottom",
        });
      });
    // }
  };
  render() {
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
              //marginBottom: 30,
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
                width: 200,
                alignSelf: "center",
                color: "#00203b",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "Select the Service" : "حدد الخدمة"}
            </Title>
            <Right />
          </Header>
          <ScrollView style={{ marginBottom: Platform.OS === "ios" ? 0 : 150 }}>
            {/* Content */}
            <Spinner visible={this.state.loading} textContent={""} />
            <View
              style={{
                margin: 10,
                marginLeft: 5,
                alignSelf: "center",
              }}
            >
              <Image
                resizeMode="cover"
                style={{ height: 40, width: 150 }}
                source={require("../../assets/profile-logo.png")}
              />
              {/* <Text style={{ color: "#283a97" }}>
              {this.state.lan == "en" ? "Select you business" : "اختر عملك"}
            </Text> */}
            </View>
            {this.state.services &&
              this.state.services.map(
                function (category, index) {
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() => {
                        let array = this.state.selectedArrayItem;
                        let itemIndex = array.indexOf(category);

                        if (!array.includes(category)) {
                          array.push(category);
                          this.setState({ isSelected: true });
                        } else if (array.includes(category)) {
                          array.splice(itemIndex, 1);
                          this.setState({ isSelected: true });
                        }
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          backgroundColor: "lightgrey",
                          marginLeft: 20,
                          marginRight: 20,
                          marginBottom: 10,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            // marginTop: 15,
                            marginLeft: 5,
                            // alignItems: "center",
                            // justifyContent: "center",
                            // backgroundColor: "red",
                            alignSelf: "center",
                          }}
                        >
                          <Image
                            resizeMode="contain"
                            source={{ uri: category.serviceseoname }}
                            style={{
                              width: 45,
                              height: 45,
                              backgroundColor: "#ece8e8",
                              alignSelf: "center",
                            }}
                          />
                          <Text
                            style={{
                              marginLeft: 26,
                              alignSelf: "center",
                              fontSize: 12,
                            }}
                          >
                            {this.state.lan == "en"
                              ? category.servicename.toUpperCase()
                              : category.servicename_ar}
                          </Text>
                        </View>
                        {this.state.selectedArrayItem.includes(category) ? (
                          <View style={{ marginRight: 12, marginTop: 0 }}>
                            <Ionicons
                              name="ios-checkmark-circle"
                              size={22}
                              color="#4cb71a"
                            />
                          </View>
                        ) : (
                          <View></View>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }.bind(this)
              )}

            {/* {this.state.services &&
            this.state.services.map(
              function (category, index) {
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => {
                      this.selectBusinessCategory(category);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 15,
                          marginLeft: 5,
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          source={{ uri: category.serviceseoname }}
                          style={{
                            width: 45,
                            height: 45,
                            backgroundColor: "#ece8e8",
                          }}
                        />
                        <Text style={{ marginLeft: 6, alignSelf: "center" }}>
                          {category.servicename}
                        </Text>
                      </View>
                      {category.isSelected && category.isSelected === true ? (
                        <View style={{ marginRight: 12, marginTop: 27 }}>
                          <Ionicons
                            name="ios-checkmark-circle"
                            size={22}
                            color="#283a97"
                          />
                        </View>
                      ) : (
                        <View></View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              }.bind(this)
            )} */}
          </ScrollView>
          {/* Content */}
          <Button
            // onPress={this.saveBusinessCategory}
            onPress={() => this.props.navigation.navigate("CompanyProfile")} //Change
            style={{
              backgroundColor: "#00203b",
              alignSelf: "center",
              marginBottom: 20,
              width: "85%",
              height: 55,
              justifyContent: "center",
              borderRadius: 10,
              position: Platform.OS === "android" && "absolute",
              bottom: Platform.OS === "android" && 80,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {this.state.lan == "en" ? "Next" : "التالي"}
            </Text>
          </Button>
        </ImageBackground>
      </Container>
    );
  }
}
