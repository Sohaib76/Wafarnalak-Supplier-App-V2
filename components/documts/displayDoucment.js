import React from "react";
import { Dimensions, Image, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Content,
  Button,
  Header,
  Left,
  Right,
  Title,
} from "native-base";
export default class DisplayDocumentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }
  componentDidMount = async () => {
    const { navigation } = this.props;
    let lan = await AsyncStorage.getItem("lan");
    this.setState({
      lan: lan !== null ? lan : "en",
    });
    let images = navigation.getParam("images");
    this.setState({ images: images });
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
            {this.state.lan == "en" ? "Pictures" : "التصوير"}
          </Title>
          <Right />
        </Header>
        <>
          {/* Content */}
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
                    uri:
                      "http://ec2-13-234-48-248.ap-south-1.compute.amazonaws.com/testApi/" +
                      item.path,
                  }}
                  style={{
                    width: 90,
                    height: 80,
                    borderWidth: 1,
                    borderColor: "black",
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
            numColumns={3}
          />
        </>
        {/* Content */}
      </Container>
    );
  }
}
