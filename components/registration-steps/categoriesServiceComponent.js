import {
  AsyncStorage,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Container,
  Content,
  FooterTab,
  Header,
  Left,
  Right,
  Title,
  Toast,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

const pics = ["Electrician", "Plumber", "Carpenter", "Packer-&-Mover", "Ac"];

export default class CategoriesServiceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businessCategory: [],
      user: {},
      loading: false,
    };
  }
  getUser = async () => {
    let user = await AsyncStorage.getItem("sp");
    if (user !== null) {
      let u = JSON.parse(user);
      this.setState({ user: u });
    }
  };
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    const { navigation } = this.props;
    let category = navigation.getParam("category");
    this.setState({ businessCategory: category });
    this.getUser();
  };
  selectBusinessCategory = (service) => {
    let cat = this.state.businessCategory.services.slice();
    let index = cat.findIndex((c) => c.serviceid === service.serviceid);
    if (index > -1) {
      if (service.isSelected && service.isSelected === true) {
        service.isSelected = false;
      } else {
        service.isSelected = true;
      }
      cat[index] = service;
      let copyCat = this.state.businessCategory;
      copyCat.services = cat;
      this.setState({ businessCategories: copyCat });
    }
  };
  saveBusinessCategoryService = () => {
    let index = this.state.businessCategory.services.findIndex(
      (c2) => c2.isSelected === true
    );
    if (index > -1) {
      let finalCategory = this.state.businessCategory;
      let servicesSelected = ([] = []);
      finalCategory.services.forEach((element) => {
        if (element.isSelected === true) {
          servicesSelected.push({ serviceid: element.serviceid });
        }
      });
      let obj = {
        spid: this.state.user.spid,
        categoryid: this.state.businessCategory.categoryid,
        services: servicesSelected,
      };
      this.setState({ loading: true });
      fetch(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/V1/add_services",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error === false) {
            this.setState({ loading: false });
            this.props.navigation.navigate("CompanyProfile");
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
        text: "Please select your business category services!",
        buttonText: "",
        position: "bottom",
      });
    }
  };

  render() {
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
            <View>
              <Ionicons
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                name={"ios-arrow-back"}
                size={30}
                color={"white"}
              />
            </View>
            <Title
              style={{
                width: 150,
                marginLeft: 12,
                marginTop: 2,
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Primary Service
            </Title>
          </Left>
          <Right />
        </Header>
        <>
          <Spinner visible={this.state.loading} textContent={""} />
          <View style={{ marginTop: 6, marginLeft: 5 }}>
            <Text style={{ color: "#283a97" }}>Select your service</Text>
          </View>
          {this.state.businessCategory.services &&
            this.state.businessCategory.services.map(
              function (service, index) {
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => {
                      this.selectBusinessCategory(service);
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
                          source={{ uri: service.serviceseoname }}
                          style={{
                            width: 45,
                            height: 45,
                            backgroundColor: "#ece8e8",
                          }}
                        />
                        <Text style={{ marginLeft: 6, alignSelf: "center" }}>
                          {service.servicename}
                        </Text>
                      </View>
                      {service.isSelected ? (
                        service.isSelected === true ? (
                          <View style={{ marginRight: 12, marginTop: 27 }}>
                            <Ionicons
                              name="ios-checkmark-circle"
                              size={22}
                              color="#283a97"
                            />
                          </View>
                        ) : (
                          <View></View>
                        )
                      ) : (
                        <View></View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              }.bind(this)
            )}
        </>
        <Button
          onPress={this.saveBusinessCategoryService}
          rounded
          style={{
            backgroundColor: "#283a97",
            marginBottom: 20,
            alignSelf: "center",
            width: 270,
            height: 40,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Proceed</Text>
        </Button>
      </Container>
    );
  }
}
