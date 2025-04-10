import './styles.css'
import React from 'react'
import Lottie from "lottie-react";
import { useSelector } from 'react-redux';
// import Loader from "./../../assets/Animations/Loader.json";

export const Home = () => {
  const isLoaded = useSelector((state) => state.loading.loadingState)
  console.log("Load ",isLoaded)

  return (
    <p>Home</p>
    // <p><Lottie animationData={Loader} loop={true} /></p>
  )
}
