import { View ,Text,Image} from "react-native";
import React from "react";
import { useUser } from "@clerk/expo";

export default function Header() {
    const {user}=useUser();
    return (
        <View style={{
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
        }}>  
            <View style={{
                fontFamily:"OutfitRegular",
                fontSize:18
            }}>
                <Text style={{
                    fontFamily:"OutfitMedium",
                    fontSize:24
                }}>Hello, {user?.firstName || 'there'}!</Text>
            </View>
            <Image source={{uri:user?.imageUrl}} style={{width:50,height:50,borderRadius:25,marginTop:10}} />
        </View>
    );
}