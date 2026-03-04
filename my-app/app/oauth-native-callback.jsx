import { View, Text } from 'react-native'

export default function OAuthNativeCallback() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ fontFamily: 'OutfitMedium', fontSize: 18 }}>Signing you in...</Text>
    </View>
  )
}
