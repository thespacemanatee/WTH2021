import React from "react"
import LottieView from "lottie-react-native"

const TableAnimation = ({ style }) => {
  return (
    <LottieView style={style} source={require("../../assets/lottie/table.json")} autoPlay loop />
  )
}

export default TableAnimation
