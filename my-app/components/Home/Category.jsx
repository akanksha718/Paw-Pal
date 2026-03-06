import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function Category() {
    const [category, setCategory] = React.useState([]);
    const [error, setError] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        try {
            setError('');
            const snapshot = await getDocs(collection(db, 'Category'));
            const categoryData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCategory(categoryData);
        } catch (err) {
            console.error('Error loading categories:', err);
            if (err?.code === 'permission-denied') {
                setError('Missing Firestore permission for Category collection.');
            } else {
                setError('Unable to load categories right now.');
            }
        }
    };

    const getImageUri = (item) => {
        const uri = item?.ImageURL || item?.imageURL || item?.imageUrl || item?.image || item?.url;
        return typeof uri === 'string' ? uri.trim() : '';
    };

    const getCategoryLabel = (item) => {
        const label = item?.name || item?.Name || item?.title || item?.Title || item?.category || item?.Category;
        return typeof label === 'string' && label.trim() ? label.trim() : 'Category';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Category</Text>
            {!!error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                horizontal
                data={category}
                keyExtractor={(item, index) => item?.id || String(index)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const imageUri = getImageUri(item);
                    const label = getCategoryLabel(item);
                    const isActive = selectedCategory === label;
                    return (
                    <Pressable
                        onPress={() => setSelectedCategory(label)}
                        style={[styles.itemContainer, isActive && styles.itemContainerActive]}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.imageFallback}>
                                <Text style={styles.fallbackText}>No image</Text>
                            </View>
                        )}
                        <Text numberOfLines={1} style={[styles.itemLabel, isActive && styles.itemLabelActive]}>{label}</Text>
                    </Pressable>
                );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
    },
    title: {
        fontSize: 18,
        fontFamily: 'OutfitMedium',
        marginBottom: 10,
    },
    error: {
        color: '#b91c1c',
        marginBottom: 8,
        fontSize: 12,
    },
    listContent: {
        flexDirection: 'row',
        paddingRight: 10,
    },
    itemContainer: {
        width: 92,
        flexShrink: 0,
        alignItems: 'center',
        marginRight: 14,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#eceff3',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    itemContainerActive: {
        backgroundColor: '#f0f4ff',
        borderColor: '#3b82f6',
    },
    itemImage: {
        width: 52,
        height: 52,
        borderRadius: 14,
    },
    imageFallback: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2f7',
    },
    fallbackText: {
        fontSize: 9,
        color: '#6b7280',
        fontFamily: 'Outfit',
    },
    itemLabel: {
        marginTop: 7,
        fontSize: 12,
        color: '#111827',
        fontFamily: 'OutfitMedium',
    },
    itemLabelActive: {
        color: '#1d4ed8',
    },
});