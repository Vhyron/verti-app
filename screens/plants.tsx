/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Circle, Path } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Dashboard: undefined;
  Plants: undefined;
  Profile: undefined;
  Notifications: undefined;
  Menu: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Plants'>;

// Search icon component
const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" stroke="#999" fill="none" strokeWidth="2">
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 21L16.65 16.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Burger Menu Icon
const BurgerMenuIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
    <Path d="M3 12h18M3 6h18M3 18h18" />
  </Svg>
);

// Notification bell icon
const NotificationIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#2ecc71" fill="none" strokeWidth="2">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

// Plant interface
interface Plant {
  id: number;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  metrics: {
    light: string | null;
    temperature: string | null;
    humidity: string | null;
    water: string | null;
  };
  healthStatus: string;
}

const API_URL = 'http://192.168.5.80:8080'; // Update with your server's URL

const PlantsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropScientificName, setNewCropScientificName] = useState('');
  const [activeTab, setActiveTab] = useState('plants');

  // Fetch plants on component mount
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      // Check if we have cached plant data to show immediately
      const cachedPlants = await AsyncStorage.getItem('plants');
      if (cachedPlants) {
        setPlants(JSON.parse(cachedPlants));
      }

      // Try to fetch fresh data from server
      const response = await axios.get(`${API_URL}/plants`);
      if (response.data) {
        const fetchedPlants = response.data;
        setPlants(fetchedPlants);
        // Cache the plants data
        await AsyncStorage.setItem('plants', JSON.stringify(fetchedPlants));
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
      // If server fetch fails and we don't have cached data, use default plants
      if (plants.length === 0) {
        setPlants([
          {
            id: 1,
            name: 'Cabbage',
            scientificName: 'Brassica Oleracea',
            imageUrl: null,
            metrics: {
              light: null,
              temperature: null,
              humidity: null,
              water: null,
            },
            healthStatus: 'Good',
          },
          {
            id: 2,
            name: 'Lettuce',
            scientificName: 'Lactuca Sativa',
            imageUrl: null,
            metrics: {
              light: null,
              temperature: null,
              humidity: null,
              water: null,
            },
            healthStatus: 'Good',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCrop = () => {
    setShowAddCropModal(true);
  };

  const addCrop = async () => {
    if (!newCropName.trim()) {
      Alert.alert('Error', 'Please enter a crop name');
      return;
    }

    const newPlant: Plant = {
      id: plants.length > 0 ? Math.max(...plants.map(p => p.id)) + 1 : 1,
      name: newCropName,
      scientificName: newCropScientificName || '',
      imageUrl: null,
      metrics: {
        light: null,
        temperature: null,
        humidity: null,
        water: null,
      },
      healthStatus: 'New',
    };

    try {
      // Try to save to server
      await axios.post(`${API_URL}/plants`, newPlant);
      // Update local state
      const updatedPlants = [...plants, newPlant];
      setPlants(updatedPlants);
      // Update cache
      await AsyncStorage.setItem('plants', JSON.stringify(updatedPlants));
    } catch (error) {
      console.error('Error adding plant:', error);
      // Still update UI even if server save fails
      setPlants([...plants, newPlant]);
    }

    setNewCropName('');
    setNewCropScientificName('');
    setShowAddCropModal(false);
  };

  const selectCropType = () => {
    Alert.alert(
      'Select Crop Type',
      'Choose a crop type:',
      [
        {
          text: 'Cabbage',
          onPress: () => {
            setNewCropName('Cabbage');
            setNewCropScientificName('Brassica Oleracea');
            addCrop();
          },
        },
        {
          text: 'Lettuce',
          onPress: () => {
            setNewCropName('Lettuce');
            setNewCropScientificName('Lactuca Sativa');
            addCrop();
          },
        },
        {
          text: 'Other',
          onPress: () => setShowAddCropModal(true),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleUploadImage = async (plant: Plant) => {
    setSelectedPlant(plant);
    setShowImageModal(true);
  };

  const pickImage = async () => {
    if (!selectedPlant) {return;}

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // Update plant with new image
        const updatedPlants = plants.map(p => {
          if (p.id === selectedPlant.id) {
            return { ...p, imageUrl: selectedAsset.uri };
          }
          return p;
        });

        setPlants(updatedPlants);
        await AsyncStorage.setItem('plants', JSON.stringify(updatedPlants));

        // Try to upload to server
        try {
          const formData = new FormData();
          formData.append('plantId', selectedPlant.id.toString());
          formData.append('image', {
            uri: selectedAsset.uri,
            type: 'image/jpeg',
            name: `plant_${selectedPlant.id}.jpg`,
          } as any);

          await axios.post(`${API_URL}/upload-plant-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          console.error('Error uploading image to server:', error);
          // Already updated UI, so we don't need to handle this error for the user
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setShowImageModal(false);
    }
  };

  const viewHealthHistory = (plant: Plant) => {
    Alert.alert('Health History', `Viewing health history for ${plant.name} is not implemented yet.`);
  };

  // Filter plants based on search query
  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle burger menu
  const handleBurgerMenuPress = () => {
    navigation.navigate('Menu');
  };

  // Handle navigation
  const handleNavigation = (screenName: keyof RootStackParamList) => {
    // Don't navigate if we're already on Plants
    if (screenName === 'Plants') {
      return;
    }

    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Updated Header to match Dashboard */}
      <View style={styles.header}>
        {/* Burger Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleBurgerMenuPress}
          activeOpacity={0.7}
        >
          <BurgerMenuIcon />
        </TouchableOpacity>

        {/* Centered Logo */}
        <View style={styles.logoCenteredContainer}>
          <Text style={styles.logo}>
            <Text style={styles.kulay}>Verti</Text>App
          </Text>
        </View>

        {/* Notification Button */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => handleNavigation('Notifications')}
          activeOpacity={0.7}
        >
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Plants</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={selectCropType}
        >
          <Text style={styles.addButtonText}>Add New Crop</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B4332" />
          <Text style={styles.loadingText}>Loading plants...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.plantsGrid}>
            {filteredPlants.map((plant) => (
              <View key={plant.id} style={styles.plantCard}>
                <View style={styles.imageContainer}>
                  {plant.imageUrl ? (
                    <Image
                      source={{ uri: plant.imageUrl }}
                      style={styles.plantImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleUploadImage(plant)}
                    >
                      <Text style={styles.uploadButtonText}>Click to upload crop image</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.scientificName}>{plant.scientificName}</Text>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Light</Text>
                      <Text style={styles.metricValue}>{plant.metrics.light || '%'}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Temperature</Text>
                      <Text style={styles.metricValue}>{plant.metrics.temperature || '°C'}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Humidity</Text>
                      <Text style={styles.metricValue}>{plant.metrics.humidity || '%'}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Water</Text>
                      <Text style={styles.metricValue}>{plant.metrics.water || '%'}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => viewHealthHistory(plant)}
                  >
                    <Text style={styles.historyButtonText}>View Health History</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* iOS-style Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        {/* Home Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('home');
            handleNavigation('Dashboard');
          }}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12h6v10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Plants Button - Already active */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#2ecc71"
            fill="none"
          >
            <Path
              d="M18 20V10M12 20V4M6 20v-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Plants</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>

        {/* Apps Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.navLabel}>Apps</Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('profile');
            handleNavigation('Profile');
          }}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="7" r="4" />
          </Svg>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Image Upload Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Crop Image</Text>
            <Text style={styles.modalSubtitle}>
              Choose an image for {selectedPlant?.name}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImage}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Crop Modal */}
      <Modal
        visible={showAddCropModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCropModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Crop</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Crop Name"
              value={newCropName}
              onChangeText={setNewCropName}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Scientific Name (Optional)"
              value={newCropScientificName}
              onChangeText={setNewCropScientificName}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={addCrop}
            >
              <Text style={styles.modalButtonText}>Add Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddCropModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  kulay: {
    color: '#2ecc71',
  },
  header: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  menuButton: {
    marginTop: 45,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  logoCenteredContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    zIndex: 10,
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white', // Optional: add background to logo text for visibility
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notificationButton: {
    marginTop: 45,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1B4332',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  plantsGrid: {
    flexDirection: 'column',
  },
  plantCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    backgroundColor: '#1B4332',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  plantInfo: {
    padding: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metricBox: {
    width: '50%',
    padding: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  historyButton: {
    borderWidth: 1,
    borderColor: '#1B4332',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#1B4332',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#1B4332',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  // iOS-style Bottom Navigation styles
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    position: 'relative',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 3,
  },
  activeNavLabel: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2ecc71',
  },
});

export default PlantsScreen;