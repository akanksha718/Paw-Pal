import { View,Text  } from "react-native";
import React from "react";

export default function Profile() {
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize:24,fontFamily:"OutfitMedium"}}>This is your Profile!</Text>  
        </View>
    );
}