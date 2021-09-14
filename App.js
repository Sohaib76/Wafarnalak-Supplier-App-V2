import { registerRootComponent } from "expo";
import * as Updates from "expo-updates";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AppNavigator from "./navigation/appNavigator";
import { AppLoading, SplashScreen } from "expo";
import Spinner from "react-native-loading-spinner-overlay";
import { Root } from "native-base";
console.disableYellowBox = true;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppReady: false,
      isUpdateAvailable: false,
    };
  }
  componentDidMount = async () => {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    // this.setState({ isAppReady: true });
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        this.setState({ isUpdateAvailable: true });
        updateDownload = async () => {
          // Updates.reload();
          await Updates.fetchUpdateAsync();
          // ... notify user of update ...
          Updates.reloadFromCache();
        };
        setTimeout(function () {
          this.updateDownload();
          this.setState({ isUpdateAvailable: false });
        }, 5000);
      }
    });
  };
  loadApp = () => {
    setTimeout(() => {
      this.setState({ isAppReady: true });
    }, 1800);
  };

  render() {
    // if (!this.state.isAppReady) {
    //   return <AppLoading />;
    // }
    // if (this.state.isUpdateAvailable === true) {
    //   return (
    //     <Image
    //       style={{
    //         height: Dimensions.get("window").height,
    //         width: Dimensions.get("window").width
    //       }}
    //       source={require("./assets/updating.gif")}
    //       resizeMode="contain"
    //     />
    //   );
    // } else {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: "#fff" }}>
    //       <Root>
    //         <AppNavigator />
    //       </Root>
    //     </View>
    //   );
    // }
    if (this.state.isUpdateAvailable === true) {
      return (
        <Image
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
          source={require("./assets/updating.gif")}
          resizeMode="contain"
        />
      );
    }
    if (!this.state.isAppReady && !this.state.isUpdateAvailable) {
      if (this.state.lan === "en") {
        return (
          <Image
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
            source={require("./assets/splash.png")}
            resizeMode="contain"
            onLoadStart={this.loadApp}
          />
        );
      } else {
        return (
          <Image
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
            source={require("./assets/splash.png")}
            resizeMode="contain"
            onLoadStart={this.loadApp}
          />
        );
      }
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Root>
          <AppNavigator />
        </Root>
      </View>
    );
  }
}

// "sdkVersion": "38.0.0",

registerRootComponent(App);
