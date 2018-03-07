import React, { Component } from "react";
import {
  Animated,
  View,
  Dimensions,
  Image,
  Text,
  Easing,
  PixelRatio,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import Colors from "./colors";

import { DangerZone } from "expo";
const { Lottie } = DangerZone;

const { width, height } = Dimensions.get("window");
const BOX_WIDTH = width - 100;
const BOX_HEIGHT = BOX_WIDTH / 5;
const IMAGE_SIZE = BOX_HEIGHT - 36;
const LOTTIE_SIZE = BOX_HEIGHT - 30;

export default class MyTextInput extends Component {
  state = {
    animation: require("./assets/eye.json"),
    text: "",
    containerWidth: new Animated.Value(LOTTIE_SIZE),
    containerHeight: new Animated.Value(LOTTIE_SIZE),
    progress: new Animated.Value(0),
    opacity: new Animated.Value(0),
    showing: false,
    secureTextEntry: true
  };

  show() {
    const { text } = this.state;
    this.setState({ showing: true }, () => {
      Animated.parallel([
        Animated.timing(this.state.containerWidth, { toValue: BOX_WIDTH * 2 }),
        Animated.timing(this.state.containerHeight, {
          toValue: BOX_HEIGHT * 2
        }),
        Animated.timing(this.state.progress, { toValue: 1, duration: 300 }),
        Animated.timing(this.state.opacity, { toValue: 1, duration: 300 })
      ]).start();

      this.hidePassword = setTimeout(() => {
        this.setState({ secureTextEntry: false });
      }, 1800 / text.length);
    });
  }

  hide() {
    const { text } = this.state;
    this.setState({ showing: false }, () => {
      Animated.parallel([
        Animated.timing(this.state.containerWidth, { toValue: LOTTIE_SIZE }),
        Animated.timing(this.state.containerHeight, { toValue: LOTTIE_SIZE }),
        Animated.timing(this.state.progress, { toValue: 0, duration: 500 }),
        Animated.timing(this.state.opacity, { toValue: 0, duration: 300 })
      ]).start();

      if (this.showPassword) {
        clearTimeout(this.showPassword);
      }

      this.hidePassword = setTimeout(() => {
        this.setState({ secureTextEntry: true });
      }, 300);
    });
  }

  renderEye() {
    const { containerWidth, containerHeight, progress } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.show()}>
        <View style={styles.lottieContainer}>
          <Animated.View
            style={[
              styles.whiteBG,
              {
                width: containerWidth,
                height: containerHeight,
                transform: [
                  {
                    translateX: containerWidth.interpolate({
                      inputRange: [LOTTIE_SIZE, BOX_WIDTH * 2],
                      outputRange: [0, BOX_HEIGHT / 2]
                    })
                  }
                ],
                borderRadius: 1000 //some arbitrary large number
              }
            ]}
          />
          <View>
            <Lottie
              ref={animation => {
                this.animation = animation;
              }}
              resizeMode="contain"
              source={this.state.animation}
              style={styles.image}
              progress={progress}
              imageAssetsFolder="assets"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderLock() {
    const { opacity } = this.state;
    return (
      <View style={{ marginLeft: 8 }}>
        <Image
          style={[styles.image]}
          source={require("./assets/icons8-lock-white.png")}
        />
        <Animated.Image
          style={[
            styles.image,
            { position: "absolute", opacity, left: 0, top: 0 }
          ]}
          source={require("./assets/icons8-lock-black.png")}
        />
      </View>
    );
  }

  render() {
    const { text, showing, secureTextEntry } = this.state;

    return (
      <View style={styles.container}>
        {this.renderEye()}
        {this.renderLock()}
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={text => this.setState({ text })}
          secureTextEntry={secureTextEntry}
          underlineColorAndroid="transparent"
        />

        <TouchableWithoutFeedback
          onPress={() => (showing ? this.hide() : this.show())}
        >
          <View style={styles.touch} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.textInputBG,
    overflow: "hidden"
  },
  bg: {
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "center",
    left: 0,
    top: 0,
    borderRadius: 8,
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    backgroundColor: Colors.textInputBG
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  },
  lottieContainer: {
    position: "absolute",
    right: 0,
    right: 0,
    top: 0,
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    padding: 16,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  lottie: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  },
  whiteBG: {
    position: "absolute",
    backgroundColor: "white",
    right: BOX_HEIGHT / 4,
    zIndex: -100
  },
  textInput: {
    color: Colors.purple,
    flex: 1,
    marginLeft: 8
  },
  touch: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE
  }
});
