import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Category from './Category';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetLsitByCategory() {
    const [petList, setPetList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [activeCategory, setActiveCategory] = React.useState('Dog');

    useEffect(() => {
        GetPetList(activeCategory);
    }, [activeCategory]);

    const normalizeText = (value) =>
        typeof value === 'string' ? value.trim().toLowerCase() : '';

    const getDocCategoryValue = (item) =>
        item?.category || item?.Category || item?.petCategory || item?.type || '';

    const GetPetList = async (categoryName) => {
        try {
            setLoading(true);
            setError('');

            // Fetch all pets, then match category safely to handle mixed field names/casing in Firestore docs.
            const querySnapshot = await getDocs(collection(db, 'Pets'));
            const normalizedTarget = normalizeText(categoryName);
            const pets = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((pet) => normalizeText(getDocCategoryValue(pet)) === normalizedTarget);
            setPetList(pets);
        } catch (err) {
            console.error('Error loading pets by category:', err);
            setError('Unable to load pets right now.');
            setPetList([]);
        } finally {
            setLoading(false);
        }
    };

    const getPetImageUri = (item) => {
        const uri = item?.ImageURL || item?.imageURL || item?.ImageURl || item?.image || item?.url;
        return typeof uri === 'string' ? uri.trim() : '';
    };

    const getPetName = (item) => {
        const value = item?.name || item?.Name || 'Lovely Pet';
        return typeof value === 'string' ? value : 'Lovely Pet';
    };

    const getPetMeta = (item) => {
        const breed = item?.breed || item?.Breed || '';
        const age = item?.age || item?.Age || '';

        if (breed && age) return `${breed} • ${age}`;
        if (breed) return String(breed);
        if (age) return `${age}`;

        return 'Ready for adoption';
    };

    return (
        <View style={styles.wrapper}>
            <Category onCategorySelect={(value) => setActiveCategory(value)} />

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{activeCategory} Friends</Text>
                <Text style={styles.sectionSubtitle}>{petList.length} available</Text>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="small" color="#2f6fed" />
                    <Text style={styles.loadingText}>Loading pets...</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.petList}
                    data={petList}
                    keyExtractor={(item, index) => item?.id || String(index)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyTitle}>No pets found</Text>
                            <Text style={styles.emptySubtitle}>Try another category above.</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const imageUri = getPetImageUri(item);
                        return (
                            <View style={styles.card}>
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
                                ) : (
                                    <View style={styles.imageFallback}>
                                        <Text style={styles.imageFallbackText}>No image</Text>
                                    </View>
                                )}
                                <View style={styles.cardBody}>
                                    <Text numberOfLines={1} style={styles.petName}>{getPetName(item)}</Text>
                                    <Text numberOfLines={1} style={styles.petMeta}>{getPetMeta(item)}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        flex: 1,
    },
    petList: {
        flex: 1,
    },
    sectionHeader: {
        marginTop: 14,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'OutfitMedium',
        color: '#111827',
    },
    sectionSubtitle: {
        fontSize: 12,
        fontFamily: 'Outfit',
        color: '#6b7280',
    },
    errorText: {
        color: '#b91c1c',
        marginBottom: 8,
        fontSize: 12,
    },
    loadingBox: {
        marginTop: 14,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 12,
        color: '#6b7280',
        fontFamily: 'Outfit',
    },
    listContent: {
        paddingTop: 6,
        paddingBottom: 18,
    },
    card: {
        marginBottom: 14,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 170,
    },
    imageFallback: {
        width: '100%',
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2f7',
    },
    imageFallbackText: {
        color: '#6b7280',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    cardBody: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    petName: {
        fontSize: 16,
        color: '#111827',
        fontFamily: 'OutfitMedium',
    },
    petMeta: {
        marginTop: 4,
        fontSize: 12,
        color: '#6b7280',
        fontFamily: 'Outfit',
    },
    emptyCard: {
        marginTop: 8,
        paddingVertical: 24,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 14,
        color: '#111827',
        fontFamily: 'OutfitMedium',
    },
    emptySubtitle: {
        marginTop: 4,
        fontSize: 12,
        color: '#6b7280',
        fontFamily: 'Outfit',
    },
});