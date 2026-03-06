import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../config/FirebaseConfig";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.86;

export default function Slider() {
    const [sliders, setSliders] = React.useState([]);
    const [error, setError] = React.useState("");

    useEffect(() => {
        GetSliders();
    }, []);

    const GetSliders = async () => {
        try {
            setError("");
            const snapshot = await getDocs(collection(db, "Sliders"));
            const sliderData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const imageUri = await resolveImageUri(data);
                    return { id: doc.id, ...data, imageUri };
                })
            );
            setSliders(sliderData);
        } catch (err) {
            console.error("Error loading sliders:", err);
            if (err?.code === "permission-denied") {
                setError("Missing Firestore permission for Sliders collection.");
            } else {
                setError("Unable to load sliders right now.");
            }
        }
    };

    const getImageUri = (item) => {
        const uri = item?.ImageURL || item?.imageURL || item?.imageUrl || item?.image || item?.url;
        return typeof uri === "string" ? uri.trim() : "";
    };

    const resolveImageUri = async (item) => {
        const rawValue =
            item?.ImageURL ||
            item?.imageURL ||
            item?.imageUrl ||
            item?.image?.url ||
            item?.image?.imageUrl ||
            item?.image?.imageURL ||
            item?.image ||
            item?.url;
        if (typeof rawValue !== "string") return "";

        const value = rawValue.trim();
        if (!value) return "";

        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }

        try {
            if (value.startsWith("gs://")) {
                return await getDownloadURL(ref(storage, value));
            }

            // Firestore may store object path like "sliders/banner1.jpg".
            return await getDownloadURL(ref(storage, value));
        } catch (storageErr) {
            console.error("Unable to resolve slider image URL from storage:", value, storageErr);
            return "";
        }
    };

    return (
        <View style={styles.wrapper}>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {sliders.map((item) => {
                    const imageUri = item?.imageUri || getImageUri(item);

                    return (
                        <View key={item.id} style={styles.slideContainer}>
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.sliderImage}
                                    resizeMode="cover"
                                    onError={() => {
                                        console.error("Slider image failed to load:", imageUri);
                                    }}
                                />
                            ) : (
                                <View style={styles.imageFallback}>
                                    <Text style={styles.fallbackText}>Image not available</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
    },
    listContent: {
        flexDirection: "row",
        paddingRight: 6,
    },
    slideContainer: {
        marginRight: 14,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 4,
    },
    sliderImage: {
        width: CARD_WIDTH,
        height: 190,
        borderRadius: 16,
    },
    imageFallback: {
        width: CARD_WIDTH,
        height: 190,
        borderRadius: 16,
        backgroundColor: "#eef2f7",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#d6deea",
    },
    fallbackText: {
        color: "#4b5563",
        fontSize: 13,
        fontWeight: "600",
    },
    errorText: {
        color: "#b91c1c",
        marginBottom: 8,
        fontSize: 12,
        fontWeight: "500",
    },
});