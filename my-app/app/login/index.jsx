import Colors from "../../constants/Colors";
import React, { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { View, Text, Image, Pressable, Platform, Alert } from 'react-native'

const createFallbackUsername = () => `pawpal_${Date.now().toString().slice(-8)}`

const completeCommonMissingFields = async (signUp) => {
    if (!signUp?.missingFields?.length) return signUp

    const payload = {}

    if (signUp.missingFields.includes('username')) {
        payload.username = createFallbackUsername()
    }

    if (signUp.missingFields.includes('first_name')) {
        payload.firstName = 'Pet'
    }

    if (signUp.missingFields.includes('last_name')) {
        payload.lastName = 'Pal'
    }

    if (signUp.missingFields.includes('legal_accepted_at')) {
        payload.legalAccepted = true
    }

    if (!Object.keys(payload).length) return signUp

    return signUp.update(payload)
}

const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}
WebBrowser.maybeCompleteAuthSession()
export default function Login() {
    useWarmUpBrowser();
    const { startSSOFlow } = useSSO();
    const router = useRouter();
    const onPress = useCallback(async () => {
        try {
            const redirectUrl = AuthSession.makeRedirectUri({
                path: 'oauth-native-callback',
            })

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl,
            })

            let updatedSignUp = signUp

            if (!createdSessionId && signUp?.status === 'missing_requirements') {
                try {
                    updatedSignUp = await completeCommonMissingFields(signUp)
                } catch (updateErr) {
                    console.error('Clerk signUp.update failed:', JSON.stringify(updateErr, null, 2))
                }
            }

            const sessionId =
                createdSessionId ?? signIn?.createdSessionId ?? updatedSignUp?.createdSessionId

            // If sign in was successful, set the active session
            if (sessionId) {
                await setActive?.({
                    session: sessionId,
                })

                router.replace('/home')
            } else {
                const taskKey = signIn?.firstFactorVerification?.status || signIn?.status || updatedSignUp?.status || 'unknown'
                const missingFields = updatedSignUp?.missingFields?.length
                    ? `\nMissing fields: ${updatedSignUp.missingFields.join(', ')}`
                    : ''
                const unverifiedFields = updatedSignUp?.unverifiedFields?.length
                    ? `\nUnverified fields: ${updatedSignUp.unverifiedFields.join(', ')}`
                    : ''
                const requiredFields = updatedSignUp?.requiredFields?.length
                    ? `\nRequired fields: ${updatedSignUp.requiredFields.join(', ')}`
                    : ''

                Alert.alert(
                    'Sign-in not completed',
                    `Clerk requires an extra step (${taskKey}).${missingFields}${unverifiedFields}${requiredFields}\n\nRedirect URL used: ${redirectUrl}\n\nMake sure this exact URL is allowed in Clerk OAuth redirect URLs.`
                )
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Google sign-in failed', 'Please try again and check console logs for Clerk error details.')
        }
    }, [router, startSSOFlow])
    return (
        <View
            style={{
                backgroundColor: "#fff",
                height: "100%",
            }}
        >
            <Image
                source={require("./../../assets/images/login.png")}
                style={{ width: "100%", height: 500 }}
            />

            <View
                style={{
                    padding: 20,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontFamily: "OutfitBold",
                        fontSize: 30,
                        textAlign: "center",
                    }}
                >
                    Ready to make a new friend?
                </Text>

                <Text
                    style={{
                        fontFamily: "OutfitRegular",
                        fontSize: 18,
                        textAlign: "center",
                        color: Colors.GRAY,
                    }}
                >
                    Let's adopt the pet which you like and make their life happy again
                </Text>

                <Pressable
                    onPress={onPress}
                    style={{
                        padding: 14,
                        marginTop: 100,
                        backgroundColor: Colors.PRIMARY,
                        width: "100%",
                        borderRadius: 14,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "OutfitMedium",
                            fontSize: 20,
                            textAlign: "center",
                            color: "#fff",
                        }}
                    >
                        Continue with Google
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}