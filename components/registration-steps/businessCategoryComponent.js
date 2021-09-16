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
          this.setState({
            loading: false,
            businessCategories: responseJson.categories,
            services: responseJson.services,
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
            text: responseJson.message,
            buttonText: "",
            position: "bottom",
          });
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        Toast.show({
          text: "Something went wrong try again later!",
          buttonText: "",
          position: "bottom",
        });
      });
    // }
  };
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#283a97", height: 80 }}>
          <Left />
          <Title
            style={{
              width: 200,
              alignSelf: "center",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {this.state.lan == "en" ? "Primary Business" : "العمل الرئيسي"}
          </Title>
          <Right />
        </Header>
        <ScrollView>
          {/* Content */}
          <Spinner visible={this.state.loading} textContent={""} />
          <View
            style={{ marginTop: 6, marginLeft: 5, alignSelf: "flex-start" }}
          >
            <Text style={{ color: "#283a97" }}>
              {this.state.lan == "en" ? "Select you business" : "اختر عملك"}
            </Text>
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
                      {this.state.selectedArrayItem.includes(category) ? (
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
          onPress={this.saveBusinessCategory}
          // onPress={() => this.props.navigation.navigate("CompanyProfile")} //Change
          rounded
          style={{
            backgroundColor: "#283a97",
            alignSelf: "center",
            marginBottom: 20,
            width: 270,
            height: 40,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {this.state.lan == "en" ? "Proceed" : "تقدم"}
          </Text>
        </Button>
      </Container>
    );
  }
}
