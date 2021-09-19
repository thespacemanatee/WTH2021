import React from "react"
import LottieView from "lottie-react-native"

const ShelfAnimation = ({ style }) => {
  return (
    <LottieView style={style} source={require("../../assets/lottie/shelf.json")} autoPlay loop />
  )
}

export default ShelfAnimation
