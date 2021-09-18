import React from "react"
import LottieView from "lottie-react-native"

const WorkspaceAnimation = ({ style }) => {
  return (
    <LottieView style={style} source={require("../../assets/lottie/workspace.json")} autoPlay loop />
  )
}

export default WorkspaceAnimation
