import React from "react"
import LottieView from "lottie-react-native"

const TableDeployedAnimation = ({ style }) => {
  return (
    <LottieView
      style={style}
      source={require("../../assets/lottie/table_deployed.json")}
      autoPlay
      loop
    />
  )
}

export default TableDeployedAnimation
