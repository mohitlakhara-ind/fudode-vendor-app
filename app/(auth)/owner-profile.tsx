import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { submitOwnerProfile, getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  CaretLeft,
  User,
  Envelope,
  IdentificationCard,
  PlusCircle,
  Camera,
  CheckCircle,
  Phone
} from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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

export default function OwnerIdentityScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.restaurant);

  const [form, setForm] = useState({
    name: '',
    email: '',
    alternateNo: '',
    aadhaarNo: '',
  });

  const [images, setImages] = useState<any>({
    avatar: null,
    aadhaarFront: null,
    aadhaarBack: null,
  });

  const [errors, setErrors] = useState<any>({});

  const pickImage = async (key: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev: any) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = 'Full Name is required';
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!form.alternateNo || form.alternateNo.length !== 10) newErrors.alternateNo = 'Valid 10-digit number is required';
    if (!form.aadhaarNo || form.aadhaarNo.length !== 12) newErrors.aadhaarNo = 'Valid 12-digit Aadhaar is required';
    
    if (!images.avatar || !images.aadhaarFront || !images.aadhaarBack) {
       Alert.alert('Images Required', 'Please upload your profile picture, and both front and back of your Aadhaar card.');
       return false;
    }

    console.log('📝 [Validation] Errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🚀 [handleSubmit] Form State:', form);
    console.log('📸 [handleSubmit] Image State:', images);
    if (!validate()) {
      console.log('❌ [handleSubmit] Validation failed');
      return;
    }
    console.log('✅ [handleSubmit] Validation passed, preparing FormData');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('alternateNo', form.alternateNo);
    formData.append('aadhaarNo', form.aadhaarNo);

    // Append images
    if (images.avatar) {
      formData.append('avatar', {
        uri: images.avatar,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);
    }
    
    formData.append('aadhaarFront', {
      uri: images.aadhaarFront,
      name: 'aadhaar_front.jpg',
      type: 'image/jpeg',
    } as any);

    formData.append('aadhaarBack', {
      uri: images.aadhaarBack,
      name: 'aadhaar_back.jpg',
      type: 'image/jpeg',
    } as any);

    const result = await dispatch(submitOwnerProfile(formData));
    if (submitOwnerProfile.fulfilled.match(result)) {
      // Small delay to allow the backend to process the update and invalidate its cache
      console.log('⏳ [handleSubmit] Waiting 1.5s for backend catch-up...');
      setTimeout(async () => {
        await dispatch(getRestaurantStatus());
        router.replace('/(auth)/onboarding');
      }, 1500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Owner Identity</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={() => pickImage('avatar')} style={[styles.avatarWrapper, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}>
              {images.avatar ? (
                <Image source={{ uri: images.avatar }} style={styles.avatar} />
              ) : (
                <User size={40} color={theme.icon} />
              )}
              <View style={[styles.avatarAdd, { backgroundColor: theme.primary }]}>
                <PlusCircle size={20} color="#000" weight="fill" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.avatarLabel, { color: theme.text }]}>Upload Profile Picture</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Personal Details</Text>
            <Text style={[styles.infoSubtitle, { color: theme.icon }]}>Phase 2: Verifying your identity as a partner</Text>
          </View>

          <FormInput
            value={form.name}
            onChangeText={(val: string) => setForm({ ...form, name: val })}
            placeholder="Full Name (As per Aadhaar)"
            icon={User}
            error={errors.name}
          />

          <FormInput
            value={form.email}
            onChangeText={(val: string) => setForm({ ...form, email: val })}
            placeholder="Email Address"
            icon={Envelope}
            keyboardType="email-address"
            error={errors.email}
          />

          <FormInput
            value={form.alternateNo}
            onChangeText={(val: string) => setForm({ ...form, alternateNo: val.replace(/\D/g, '') })}
            placeholder="Alternate Mobile Number"
            icon={Phone}
            keyboardType="numeric"
            error={errors.alternateNo}
          />

          <FormInput
            value={form.aadhaarNo}
            onChangeText={(val: string) => setForm({ ...form, aadhaarNo: val.replace(/\D/g, '') })}
            placeholder="12-Digit Aadhaar Number"
            icon={IdentificationCard}
            keyboardType="numeric"
            error={errors.aadhaarNo}
          />

          <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Aadhaar Card Verification</Text>
          
          <View style={styles.docGrid}>
            <TouchableOpacity 
              style={[styles.docPicker, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]} 
              onPress={() => pickImage('aadhaarFront')}
            >
              {images.aadhaarFront ? (
                <Image source={{ uri: images.aadhaarFront }} style={styles.docImage} />
              ) : (
                <>
                  <Camera size={24} color={theme.icon} />
                  <Text style={[styles.docLabel, { color: theme.icon }]}>Front Side</Text>
                </>
              )}
              {images.aadhaarFront && (
                <View style={styles.doneBadge}>
                  <CheckCircle size={18} color={theme.success} weight="fill" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.docPicker, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]} 
              onPress={() => pickImage('aadhaarBack')}
            >
              {images.aadhaarBack ? (
                <Image source={{ uri: images.aadhaarBack }} style={styles.docImage} />
              ) : (
                <>
                  <Camera size={24} color={theme.icon} />
                  <Text style={[styles.docLabel, { color: theme.icon }]}>Back Side</Text>
                </>
              )}
              {images.aadhaarBack && (
                <View style={styles.doneBadge}>
                  <CheckCircle size={18} color={theme.success} weight="fill" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error && <Text style={[styles.globalError, { color: theme.error }]}>{error}</Text>}

          <View style={styles.footer}>
            <PrimaryButton
              title={loading ? 'SUBMITTING...' : 'Verify & Continue'}
              onPress={handleSubmit}
              loading={loading}
              style={{ borderRadius: 18 }}
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatar: { width: '100%', height: '100%', borderRadius: 50 },
  avatarAdd: { position: 'absolute', bottom: 0, right: 0, borderRadius: 12, padding: 2 },
  avatarLabel: { marginTop: 12, fontSize: 14, fontWeight: '700' },
  infoBox: { marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: '700' },
  infoSubtitle: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, height: 52 },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '600' },
  errorText: { fontSize: 11, fontWeight: '600', marginTop: 4, marginLeft: 8 },
  sectionDivider: { height: 1, marginVertical: 24, opacity: 0.3 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  docGrid: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  docPicker: { flex: 1, height: 120, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  docImage: { width: '100%', height: '100%' },
  docLabel: { fontSize: 12, marginTop: 8, fontWeight: '600' },
  doneBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 10 },
  globalError: { textAlign: 'center', marginVertical: 10, fontWeight: '600' },
  footer: { marginTop: 20 },
});