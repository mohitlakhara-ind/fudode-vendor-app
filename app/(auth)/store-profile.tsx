import { getPersistentDeviceId } from '@/api/api';
import { PhoneInput } from '@/components/PhoneInput';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { updateRestaurantToken } from '@/store/slices/authSlice';
import { getRestaurantStatus, submitStep1, updateStep1 } from '@/store/slices/restaurantSlice';
import { AppDispatch, RootState } from '@/store/store';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  Buildings,
  CaretLeft,
  GpsFix,
  MapPin,
  MapTrifold,
  Storefront
} from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Region } from 'react-native-maps';

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
  View
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { AnimatedPage } from '@/components/ui/AnimatedPage';

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
  const isDark = colorScheme === 'dark';
  const dispatch = useDispatch<AppDispatch>();
  const { status, loading, error } = useSelector((state: RootState) => state.restaurant);
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

  const hasPrefilled = useRef(false);
  
  // 1. Fetch current status on mount to ensure we have the latest data
  useEffect(() => {
    console.log('🔄 [StoreProfile] Screen mounted. Dispatching status fetch...');
    dispatch(getRestaurantStatus());
  }, []);

  // 2. Prefill effect with "Breakpoint" logging
  useEffect(() => {
    if (status && !hasPrefilled.current) {
      console.log('🚨 [StoreProfile Breakpoint] Pre-fill Candidate Found:', {
        name: status.name,
        existingFormName: form.name,
        onboardingStep: status.onboardingStep
      });

      if (status.name) {
        console.log('✅ [StoreProfile Breakpoint] Population START');
        setForm(prev => ({
          ...prev,
          name: status.name || prev.name,
          alternateNo: status.alternateNo || prev.alternateNo,
          shopno: status.shopno || prev.shopno,
          floor: status.floor || prev.floor,
          landMark: status.landMark || prev.landMark,
          area: status.area || prev.area,
          city: status.city || prev.city,
          lat: status.lat || prev.lat,
          long: status.long || prev.long,
        }));

        // Update map region if location exists
        if (status.lat && status.long) {
          setMapRegion({
            latitude: status.lat,
            longitude: status.long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        hasPrefilled.current = true;
        console.log('✅ [StoreProfile Breakpoint] Population COMPLETE');
      }
    }
  }, [status]);

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
    // Wait for the restaurant status to be fetched before deciding to initialize GPS
    const initializeLocation = async () => {
      if (loading) {
        console.log('⏳ [StoreProfile] Wait for status fetch before GPS init...');
        return;
      }

      // If we have data, we are in Edit Mode. Skip GPS auto-fetch.
      if (status?.name || (status?.lat && status?.lat !== 19.0760)) {
        console.log('🛡️ [StoreProfile Guard] Edit Mode Detected. Saved data found. Skipping auto GPS.');
        return;
      }

      console.log('📍 [StoreProfile] Fresh entry. Initiating initial location search...');
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        // Only trigger full geocode if we haven't already filled from store
        if (!status?.name) {
          handleGetCurrentLocation();
        }
      } else {
        const { status: reqStatus } = await Location.requestForegroundPermissionsAsync();
        if (reqStatus === 'granted') {
          handleGetCurrentLocation();
        }
      }
    };

    initializeLocation();
  }, [loading, status?.id]);

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = 'Restaurant Name is required';
    if (!form.alternateNo || form.alternateNo.length < 10) newErrors.alternateNo = 'Valid phone number required';
    if (!form.shopno) newErrors.shopno = 'Shop/Building number is required';
    if (!form.area) newErrors.area = 'Area/Locality is required';
    if (!form.city) newErrors.city = 'City is required';

    // LANDMARK VALIDATION: Exclude numeric characters as per requirements
    if (form.landMark && /\d/.test(form.landMark)) {
      newErrors.landMark = 'Landmark should not contain numbers';
    }

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
      
      console.log('🛰️ [Location] Fetched current GPS position. Fetching address...');
      
      let addressData = {
        area: '',
        city: '',
        landMark: ''
      };

      try {
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address && address.length > 0) {
          const addr = address[0];
          addressData = {
            area: addr.district || addr.subregion || addr.city || '',
            city: addr.city || addr.subregion || addr.region || '',
            landMark: (addr.street || addr.name || '').replace(/[0-9]/g, ''),
          };
        }
      } catch (geocodingErr) {
        console.warn('[Location] Initial reverse geocoding failed:', geocodingErr);
      }

      setForm((prev) => ({ 
        ...prev, 
        lat: latitude, 
        long: longitude,
        ...addressData
      }));

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
    
    // Only clear and re-geocode if the change is significant (to avoid clearing on tiny shakes)
    const latDiff = Math.abs(latitude - form.lat);
    const lngDiff = Math.abs(longitude - form.long);
    
    if (latDiff > 0.0001 || lngDiff > 0.0001) {
      console.log('📍 [Location] Position changed significantly. Resetting address fields.');
      setForm((prev) => ({ 
        ...prev, 
        lat: latitude, 
        long: longitude,
        area: '', 
        city: '', 
        landMark: '' 
      }));
      setMapRegion(region);

      try {
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address && address.length > 0) {
          const addr = address[0];
          setForm((prev) => ({
            ...prev,
            area: addr.district || addr.subregion || addr.city || '',
            city: addr.city || addr.subregion || addr.region || '',
            landMark: (addr.street || addr.name || '').replace(/[0-9]/g, ''),
          }));
        }
      } catch (err) {
        console.warn('[Location] Reverse geocoding failed:', err);
      }
    } else {
      // Just update coordinates and region without clearing address
      setForm((prev) => ({ ...prev, lat: latitude, long: longitude }));
      setMapRegion(region);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // BUILD WHITELISTED PAYLOAD: Only send recognized fields
    const apiPayload = {
      name: form.name,
      alternateNo: form.alternateNo,
      lat: form.lat,
      long: form.long,
      area: form.area,
      city: form.city,
      shopno: form.shopno,
      floor: form.floor,
      landMark: form.landMark
    };

    console.log(`🚀 [Onboarding Step 1] ${status?.onboardingStep && status.onboardingStep >= 1 ? 'Updating' : 'Submitting'} Payload:`, JSON.stringify(apiPayload, null, 2));
    
    let result: any;
    // Decide between POST (submit) or PUT (update)
    // If we have an existing ID and a name, we should UPDATE.
    // If it's a fresh submission for this restaurant ID, we should SUBMIT.
    if (status?.id && status?.name) {
      console.log('🔄 [StoreProfile] Existing record found. Calling Update (PUT)...');
      result = await dispatch(updateStep1(apiPayload));
    } else {
      console.log('🚀 [StoreProfile] No existing record. Calling Submit (POST)...');
      result = await dispatch(submitStep1(apiPayload));
    }

    const isSuccess = submitStep1.fulfilled.match(result) || updateStep1.fulfilled.match(result);
    // 409 Conflict means record already exists, which we can treat as success for progression
    const isAlreadyExists = submitStep1.rejected.match(result) && 
      (result.payload as string)?.toLowerCase().includes('already exists');

    if (isSuccess || isAlreadyExists) {
      Alert.alert(
        "Success", 
        "Store profile submitted successfully!",
        [{ text: "OK", onPress: () => router.replace('/(auth)/onboarding') }]
      );

      // PERFORM HANDSHAKE (Only if actually successful)
      if (isSuccess) {
        const restaurantId = result.payload?.data?.restaurantId || result.payload?.restaurantId;
        if (restaurantId) {
          console.log(`🚀 [Handshake] Step 1 success. Initiating handshake for Restaurant: ${restaurantId}`);
          const handshakeResult = await dispatch(updateRestaurantToken({
            restaurantId
          }));

          if (updateRestaurantToken.fulfilled.match(handshakeResult)) {
            console.log('✅ [Handshake] Success. Refreshing status with new scoped token.');
            await dispatch(getRestaurantStatus());
          }
        }
      } else {
        // Just refresh status if it already existed
        await dispatch(getRestaurantStatus());
      }
    } else {
      // Real error
      const errorMsg = result.payload as string || 'Failed to save profile';
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background }]}>
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
            onChangeText={(val: string) => setForm({ ...form, landMark: val.replace(/[0-9]/g, '') })}
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
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <PremiumButton
            label={loading ? 'SAVING...' : 'Save & Continue'}
            onPress={handleSubmit}
            isLoading={loading}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </AnimatedPage>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 140 },
  infoBox: { marginBottom: 20, marginTop: 10 },
  infoTitle: { fontSize: 18, fontWeight: '700' },
  infoSubtitle: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, height: 52 },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '600' },
  errorText: { fontSize: 11, fontWeight: '600', marginTop: 4, marginLeft: 8 },
  sectionDivider: { height: 1, marginVertical: 24, opacity: 0.3 },
  mapWrapper: {
    height: 250,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
    marginVertical: 20,
    position: 'relative'
  },
  map: { ...StyleSheet.absoluteFillObject },
  centerPinContainer: { position: 'absolute', top: '50%', left: '50%', marginLeft: -16, marginTop: -32 },
  currentLocationFab: { position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  globalError: { textAlign: 'center', marginVertical: 10, fontWeight: '600' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
