import { Container, Content, Header } from "native-base";
import {
  Dimensions,
  Image,
  ImageBackground,
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
      <Header style={{ borderBottomWidth: 0 }} />
      <>
        <View style={{ alignSelf: "center", marginTop: 80 }}>
          <Text>
            {lan == "en"
              ? "Just one step away from your"
              : "على بعد خطوة واحدة"}{" "}
            {"\n"} {lan == "en" ? "new customers" : "فقط من عملائك الجدد"}
          </Text>
        </View>
        <View
          style={{ marginTop: 40, flexDirection: "row", alignSelf: "center" }}
        >
          <View>
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
                  01
                </Text>
              </View>
            </ImageBackground>
            <Text
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 8 }}
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
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 8 }}
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
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 8 }}
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
            </ImageBackground>
            <Text
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 8 }}
            >
              {lan == "en" ? "Respond \n to request" : "استجب للطلب"}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "center", marginTop: 80 }}>
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
        </View>
      </>
      <View style={{ marginBottom: 50, alignSelf: "center" }}>
        <Text style={{ fontSize: 10, alignSelf: "flex-start" }}>
          {lan == "en"
            ? "Your account is under verification"
            : "حسابك قيد التحقق"}
          ,
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          {lan == "en" ? "Wafarnalak will get back" : ""}
          {"\n"}{" "}
          {lan == "en"
            ? "to you once done"
            : "سوف يعود عليك وفرنالك بمجرد الانتهاء"}
        </Text>
      </View>
    </Container>
  );
}
