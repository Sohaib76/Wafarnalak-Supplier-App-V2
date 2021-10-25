import { Container, Content, Header } from "native-base";
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function ProfileVerificationComponent(props) {
  // componentDidMount = async()=>{
  //   let lan = await AsyncStorage.getItem("lan");
  //   this.setState({
  //     lan: lan !== null ? lan : "en",
  //   });
  // }

  const lan = props.navigation.getParam("lan");

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
        {/* <Header style={{ borderBottomWidth: 0 }} /> */}
        <>
          <View
            style={{
              alignSelf: "center",
              marginTop: Platform.OS == "ios" ? "20%" : "10%",
            }}
          >
            {/* //marginTop: 80 */}
            <Text>
              {lan == "en"
                ? "Just one step away from your new customers"
                : "فقط من عملائك الجدد على بعد خطوة واحدة"}{" "}
              {/* {"\n"} {lan == "en" ? "new customers" : "فقط من عملائك الجدد"} */}
            </Text>
          </View>

          <View style={{}}>
            <View
              style={{
                // backgroundColor: "red",
                flexDirection: "row",
                alignItems: "center",
                // padding: 10,
                marginTop: 50,
              }}
            >
              <View
                style={{
                  backgroundColor: "#00203b",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginLeft: 45,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, marginBottom: -26 }}
                >
                  Step
                </Text>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 35 }}
                >
                  01
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Ionicons
                  name="ios-checkmark-circle"
                  size={22}
                  color="#4cb71a"
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "#00203b", fontSize: 17 }}>
                  {lan == "en" ? "Signup" : "اشتراك"}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#00203b",
                width: 8,
                height: 40,
                marginLeft: 80,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#00203b",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginLeft: 45,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, marginBottom: -26 }}
                >
                  Step
                </Text>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 35 }}
                >
                  02
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Ionicons
                  name="ios-checkmark-circle"
                  size={22}
                  color="#4cb71a"
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "#00203b", fontSize: 17 }}>
                  {lan == "en" ? "Service Info" : "معلومات الخدمة"}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#00203b",
                width: 8,
                height: 40,
                marginLeft: 80,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#00203b",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginLeft: 45,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, marginBottom: -26 }}
                >
                  Step
                </Text>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 35 }}
                >
                  03
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Ionicons
                  name="ios-checkmark-circle"
                  size={22}
                  color="#4cb71a"
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "#00203b", fontSize: 17 }}>
                  {lan == "en" ? "Details" : "تفاصيل"}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#00203b",
                width: 8,
                height: 40,
                marginLeft: 80,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "lightgrey",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginLeft: 45,
                }}
              >
                <Text
                  style={{
                    color: "rgba(0,0,0,0.5)",
                    fontSize: 20,
                    marginBottom: -26,
                  }}
                >
                  Step
                </Text>
                <Text
                  style={{
                    color: "rgba(0,0,0,0.6)",
                    fontWeight: "bold",
                    fontSize: 35,
                  }}
                >
                  04
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Ionicons
                  name={"checkmark-circle-outline"}
                  size={20}
                  color={"grey"}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "#00203b", fontSize: 17 }}>
                  {lan == "en" ? "Respond to request" : "استجب للطلب"}
                </Text>
              </View>
            </View>

            {/* <View></View>
            <View></View>
            <View></View> */}
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: 80,
            }}
          >
            <View>
            

              <View style={{ alignSelf: "center", marginTop: 14 }}>
                <Text style={{ color: "white", fontSize: 10 }}>Step</Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  01
                </Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {lan == "en" ? "Signup" : "اشتراك"}
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
               <ImageBackground
              source={require("../../assets/icons/Steps-Icon.png")}
              style={{ width: 80, height: 90 }}
              resizeMode="contain"
            > 
              <View style={{ alignSelf: "center", marginTop: 14 }}>
                <Text style={{ color: "white", fontSize: 10 }}>Step</Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  02
                </Text>
              </View>
              </ImageBackground> 
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {lan == "en" ? "Service Info" : "معلومات الخدمة"}
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              <ImageBackground
                source={require("../../assets/icons/Steps-Icon.png")}
                style={{ width: 80, height: 90 }}
                resizeMode="contain"
              >
                <View style={{ alignSelf: "center", marginTop: 14 }}>
                  <Text style={{ color: "white", fontSize: 10 }}>Step</Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    03
                  </Text>
                </View>
              </ImageBackground>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {lan == "en" ? "Details" : "تفاصيل"}
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
             <ImageBackground
              source={require("../../assets/icons/Steps-Icon.png")}
              style={{ width: 80, height: 90 }}
              resizeMode="contain"
            > 
              <View style={{ alignSelf: "center", marginTop: 14 }}>
                <Text style={{ color: "white", fontSize: 10 }}>Step</Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  04
                </Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {lan == "en" ? "Respond \n to request" : "استجب للطلب"}
              </Text>
            </View>
          </View> */}
          {/* <View style={{ flex: 1, alignSelf: "center", marginTop: 80 }}>
            <View
              style={{
                alignSelf: "center",
                width: Dimensions.get("screen").width - 10,
                height: 4,
                backgroundColor: "lightgray",
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                marginTop: -37,
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../../assets/icons/Tick-Icon-Large.png")}
                style={{ width: 70, height: 70, marginLeft: 0 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/icons/Tick-Icon-Large.png")}
                style={{ width: 70, height: 70, marginLeft: 16 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/icons/Tick-Icon-Large.png")}
                style={{ width: 70, height: 70, marginLeft: 16 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/icons/Minus-Icon.png")}
                style={{ width: 70, height: 70, marginLeft: 18 }}
                resizeMode="contain"
              />
            </View>
          </View> */}
        </>
        <View style={{ marginTop: 60, marginBottom: 50, alignSelf: "center" }}>
          <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>
            {lan == "en"
              ? "Your account is under verification"
              : "حسابك قيد التحقق"}
            ,
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            {/* {lan == "en" ? "Wafarnalak will get back" : ""}
            {"\n"}{" "} */}
            {lan == "en"
              ? "Wafarnalak will get back to you once done"
              : "سوف يعود عليك وفرنالك بمجرد الانتهاء"}
          </Text>
        </View>
      </ImageBackground>
    </Container>
  );
}
