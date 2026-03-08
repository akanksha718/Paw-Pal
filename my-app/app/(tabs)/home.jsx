import { View,Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetLsitByCategory from "../../components/Home/PetLsitByCategory";

export default function Home() {
    return (
        <View style={{
            flex:1,
            padding:20,
            marginTop:20
        }}>
            <Header />
            <Slider/>
            <PetLsitByCategory/>
            <View style={{
                display:'flex',
                flexDirection:'row',
                gap:10,
                marginTop:10,
                padding:5,
                alignItems:'center',
                justifyContent:'center',
                backgroundColor:'#f0f0f0',
                borderRadius:10
            }}>
                <Text style={{
                    fontFamily:'OutfitMedium',
                    fontSize:16,
                    color:'#333'
                }}>
                    Add New Pet
                </Text>
            </View>
        </View>
    );
}