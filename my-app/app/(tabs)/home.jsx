import { View,Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetLsitByCategory from "../../components/Home/PetLsitByCategory";

export default function Home() {
    return (
        <View style={{
            padding:20,
            marginTop:20
        }}>
            <Header />
            <Slider/>
            <PetLsitByCategory/>
        </View>
    );
}