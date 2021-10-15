import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  Toast,
  ImageBackground,
} from "react-native";
import {
  Button,
  Container,
  Content,
  Form,
  Header,
  Input,
  Item,
  Label,
  Left,
  Right,
  Title,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
export default class UploadDocumentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileType: "",
      images: [],
      loading: false,
      user: {},
      actorId: null,
    };
  }
  componentDidMount = async () => {
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    const { navigation } = this.props;
    let fileType = navigation.getParam("fileType");
    let user = navigation.getParam("user");
    console.log("user", user);
    let img = ([] = []);
    if (fileType === 6) {
      img = user.company_reg_pictures;
    }
    if (fileType === 5) {
      img = user.pictures_shop;
    }
    if (fileType === 2) {
      img = user.national_ids;
    }
    if (fileType === 3) {
      img = user.license_pictures;
    }
    if (fileType === 4) {
      img = user.works;
    }
    this.setState({ fileType: fileType, user: user, images: img });
    this.getPermissionAsync();
  };
  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };
  uploadPicture = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };
  _handleImagePicked = async (pickerResult) => {
    this.uploadImageAsync(pickerResult.uri);
    this.displayImages(pickerResult.uri);
    // let uploadResponse, uploadResult;
    // try {
    //   if (!pickerResult.cancelled) {
    //     uploadResponse = await this.uploadImageAsync(pickerResult.uri);
    //     console.log("upload uploadResponse", uploadResponse);

    //     uploadResult = await uploadResponse.json();
    //     console.log("upload result", uploadResult);
    //     this.displayImages(uploadResult.file);
    //   }
    // } catch (e) {
    // } finally {
    //   this.setState({ loading: false });
    // }
  };
  displayImages = (image) => {
    console.log("display images ", image);
    let copyImages = this.state.images;
    let obj = {
      path: image,
    };
    copyImages.push(obj);
    this.setState({ images: copyImages, loading: false });
  };
  uploadImageAsync = async (uri) => {
    console.log("uri----------", uri);
    await AsyncStorage.getItem("SPID").then((res) => {
      console.log("SPID-----", res);
      let id = parseInt(res);
      console.log("SPID-----", id);

      this.setState({ actorId: id });
    });
    this.setState({ loading: true });
    let apiUrl =
      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/upload.php";
    let uriParts = uri.split(".");
    let fileType = uri[uri.length - 1];

    let formData = new FormData();
    formData.append("file", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    console.log("actorId, ", this.state.actorId);
    formData.append("actorid", this.state.actorId);
    formData.append("actortype", 2);
    formData.append("filetype", parseInt(this.state.fileType));
    axios
      .post(
        "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/wf/upload.php",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("image uploaded successfully ", response.data);
        this.setState({ loading: false });
        Toast.show({
          text: "image uploaded successfully",
          position: "bottom",
          duration: 3000,
        });
        // this.displayImages(response.data.file);
      })
      .catch((e) => {
        console.log("image uploaded error ", e);
        Toast.show({
          text: e.message,
          position: "bottom",
          duration: 3000,
        });
        this.setState({ loading: false });
      });
    // let options = {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "multipart/form-data"
    //   }
    // };

    // return fetch(apiUrl, options);
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
          <Header style={{ backgroundColor: "#fff", height: 80 }}>
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
                color: "#00203b",
                position: "absolute",
                top: Platform.OS === "android" ? 38 : 38,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {this.state.lan == "en" ? "Upload Pictures" : "تحميل الصور"}
            </Title>
            <Right />
          </Header>
          <>
            <Spinner visible={this.state.loading} textContent={""} />
            {this.state.images && this.state.images.length > 0 ? (
              <FlatList
                data={this.state.images}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 15,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.path,
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        borderWidth: 1,
                        borderColor: "black",
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}
                numColumns={3}
              />
            ) : (
              <View>
                <View
                  style={{
                    marginTop: 60,
                    alignSelf: "center",
                    borderWidth: 1,
                    height: 190,
                    width: Dimensions.get("screen").width - 120,
                    borderColor: "lightgray",
                  }}
                >
                  <View style={{ alignSelf: "center", marginTop: 60 }}>
                    <Image
                      source={require("../../assets/icons/CameraC.png")}
                      style={{ width: 90, height: 40 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text>
                      {this.state.lan == "en"
                        ? "Please upload a picture"
                        : "يرجى تحميل صورة"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <TouchableWithoutFeedback onPress={this.uploadPicture}>
              <View
                style={{ marginTop: 40, marginBottom: 40, alignSelf: "center" }}
              >
                <Image
                  source={require("../../assets/icons/PlusC.png")}
                  style={{ width: 90, height: 50 }}
                  resizeMode="contain"
                />
                <View style={{ alignSelf: "center" }}>
                  <Text>
                    {this.state.lan == "en" ? "Browse Files" : "تصفح الملفات"}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </>
        </ImageBackground>
      </Container>
    );
  }
}
