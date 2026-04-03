import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { submitStep1, getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { updateRestaurantToken } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  MapPin,
  Storefront,
  Buildings,
  MapTrifold,
  GpsFix
} from 'phosphor-react-native';
import React, { useState, useRef, useEffect } from 'react';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { PhoneInput } from '@/components/PhoneInput';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

const FormInput = ({ value, onChangeText, placeholder, keyboardType = 'default', error, icon: Icon }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: error ? theme.error : theme.border }]}>
        <View style={styles.inputIcon}>
          <Icon size={20} color={theme.icon} />
        </View>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.icon + '80'}
          keyboardType={keyboardType}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

export default function StoreProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.restaurant);
  const { refreshToken } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    name: '',
    alternateNo: '',
    shopno: '',
    floor: '', // Floor mappend to tower
    landMark: '',
    area: '',
    city: '',
    lat: 19.0760, 
    long: 72.8777,
  });

  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          handleGetCurrentLocation();
        }
      } else {
        handleGetCurrentLocation();
      }
    })();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = 'Restaurant Name is required';
    if (!form.alternateNo || form.alternateNo.length < 10) newErrors.alternateNo = 'Valid phone number required';
    if (!form.shopno) newErrors.shopno = 'Shop/Building number is required';
    if (!form.area) newErrors.area = 'Area/Locality is required';
    if (!form.city) newErrors.city = 'City is required';
    
    if (!form.lat || !form.long || (form.lat === 19.0760 && form.long === 72.8777)) {
      newErrors.location = 'Please pin your exact store location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetCurrentLocation = async () => {
    setIsLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setForm((prev) => ({ ...prev, lat: latitude, long: longitude }));
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setMapRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch location.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const onRegionChangeComplete = async (region: Region) => {
    const { latitude, longitude } = region;
    setForm((prev) => ({ ...prev, lat: latitude, long: longitude }));
    setMapRegion(region);

    try {
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address && address.length > 0) {
        const addr = address[0];
        setForm((prev) => ({
          ...prev,
          area: addr.district || addr.subregion || prev.area,
          city: addr.city || addr.subregion || prev.city,
          landMark: addr.street || prev.landMark,
        }));
      }
    } catch (err) {
      console.warn('[Location] Reverse geocoding failed:', err);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await dispatch(submitStep1(form));
    if (submitStep1.fulfilled.match(result)) {
      // PERFORM HANDSHAKE
      const restaurantId = result.payload?.data?.restaurantId || result.payload?.restaurantId;
      if (restaurantId) {
          console.log(`🚀 [Handshake] Step 1 success. Initiating handshake for Restaurant: ${restaurantId}`);
          const handshakeResult = await dispatch(updateRestaurantToken({
              refreshToken: refreshToken || '', 
              deviceId: 'APP_DEVICE_ID', 
              restaurantId
          }));
          
          if (updateRestaurantToken.fulfilled.match(handshakeResult)) {
              console.log('✅ [Handshake] Success. Refreshing status with new scoped token.');
              await dispatch(getRestaurantStatus());
          }
      }
      router.replace('/(auth)/onboarding');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]} 
          onPress={() => router.back()}
        >
          <CaretLeft size={22} color={theme.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Store Profile</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBox}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Restaurant Identity</Text>
            <Text style={[styles.infoSubtitle, { color: theme.icon }]}>Phase 3: Setting up your business profile</Text>
          </View>

          <FormInput
            value={form.name}
            onChangeText={(val: string) => setForm({ ...form, name: val })}
            placeholder="Restaurant Name"
            icon={Storefront}
            error={errors.name}
          />
          
          <PhoneInput
            label="Secondary/Alt Number"
            value={form.alternateNo}
            onChangeText={(val: string) => setForm({ ...form, alternateNo: val.replace(/\D/g, '') })}
            error={errors.alternateNo}
          />

          <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />
          
          <FormInput
            value={form.shopno}
            onChangeText={(val: string) => setForm({ ...form, shopno: val })}
            placeholder="Shop / House No."
            icon={Buildings}
            error={errors.shopno}
          />

          <FormInput
            value={form.floor}
            onChangeText={(val: string) => setForm({ ...form, floor: val })}
            placeholder="Floor / Building Name"
            icon={Buildings}
          />

          <FormInput
            value={form.landMark}
            onChangeText={(val: string) => setForm({ ...form, landMark: val })}
            placeholder="Landmark (Optional)"
            icon={MapPin}
          />

          <FormInput
            value={form.area}
            onChangeText={(val: string) => setForm({ ...form, area: val })}
            placeholder="Area / Locality"
            icon={MapTrifold}
            error={errors.area}
          />

          <FormInput
            value={form.city}
            onChangeText={(val: string) => setForm({ ...form, city: val })}
            placeholder="City"
            icon={Buildings}
            error={errors.city}
          />

          <View style={[styles.mapWrapper, { borderColor: theme.border }]}>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={onRegionChangeComplete}
              showsUserLocation={true}
              showsMyLocationButton={false}
            />
            <View style={styles.centerPinContainer} pointerEvents="none">
              <MapPin size={32} color={theme.primary} weight="fill" />
            </View>
            <TouchableOpacity 
              style={[styles.currentLocationFab, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={handleGetCurrentLocation}
              disabled={isLocationLoading}
            >
              <GpsFix size={22} color={theme.primary} weight="bold" />
            </TouchableOpacity>
          </View>

          {error && <Text style={[styles.globalError, { color: theme.error }]}>{error}</Text>}

          <View style={styles.footer}>
            <PrimaryButton
              title={loading ? 'SAVING...' : 'Save & Continue'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 16 },
  backButton: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  infoBox: { marginBottom: 20, marginTop: 10 },
  infoTitle: { fontSize: 18, fontWeight: '700' },
  infoSubtitle: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, height: 52 },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '600' },
  errorText: { fontSize: 11, fontWeight: '600', marginTop: 4, marginLeft: 8 },
  sectionDivider: { height: 1, marginVertical: 24, opacity: 0.3 },
  mapWrapper: { height: 250, borderRadius: 20, borderWidth: 1.5, overflow: 'hidden', marginVertical: 20, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  centerPinContainer: { position: 'absolute', top: '50%', left: '50%', marginLeft: -16, marginTop: -32 },
  currentLocationFab: { position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  globalError: { textAlign: 'center', marginVertical: 10, fontWeight: '600' },
  footer: { marginTop: 20 },
});
