import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { setOwnerProfile } from '@/store/slices/profileSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import {
  Camera,
  CaretLeft,
  CheckCircle,
  Envelope,
  IdentificationCard,
  Phone,
  PlusCircle,
  User
} from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
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

// Calculate width for the side-by-side Aadhaar cards
const { width } = Dimensions.get('window');
const AADHAAR_CARD_WIDTH = (width - 40 - 16) / 2; // (TotalWidth - Padding - Gap) / 2

const FormInput = ({ value, onChangeText, placeholder, keyboardType = 'default', error, icon: Icon }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: error ? '#FF3B30' : theme.border }]}>
        <View style={styles.inputIcon}>
          <Icon size={20} color={theme.icon} />
        </View>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.icon + '80'} // Reduced opacity for placeholder
          keyboardType={keyboardType}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const FilePickerTile = ({ label, value, onPick, icon: Icon }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.fileCardSmall,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: theme.border,
          width: AADHAAR_CARD_WIDTH
        }
      ]}
      onPress={onPick}
      activeOpacity={0.7}
    >
      <View style={[styles.tileIconWrapper, { backgroundColor: value ? '#34C75920' : theme.primary + '10' }]}>
        <Icon size={24} color={value ? '#34C759' : theme.primary} weight="duotone" />
      </View>
      <View style={styles.tileInfo}>
        <Text style={[styles.tileLabel, { color: theme.text }]} numberOfLines={1}>{label}</Text>
        {value ? (
          <CheckCircle size={20} color="#34C759" weight="fill" />
        ) : (
          <PlusCircle size={20} color={theme.icon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function OwnerProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.profile);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    alternateNo: '',
    aadhaarNo: '',
  });

  // Basic Validation State
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!form.aadhaarNo || form.aadhaarNo.length !== 12) newErrors.aadhaarNo = '12-digit Aadhaar required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const result = await dispatch(setOwnerProfile(formData));
    if (setOwnerProfile.fulfilled.match(result)) {
      router.replace('/(auth)/kyc');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* 1. Header with back button only */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { 
              borderColor: theme.border,
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
            }
          ]} 
          onPress={() => router.back()}
        >
          <CaretLeft size={22} color={theme.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 2. Profile Photo Circular Placeholder (Moved to center body) */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={[styles.avatarPlaceholder, { borderColor: theme.border, backgroundColor: theme.surface }]}
              onPress={() => Alert.alert('Pick Image')}
              activeOpacity={0.8}
            >
              <Camera size={40} color={theme.icon} weight="duotone" />
              <View style={[styles.addAvatarBtn, { backgroundColor: theme.primary }]}>
                <PlusCircle size={20} color="#fff" weight="fill" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 3. Personal Input Section (Name -> Email -> Alt. Number) */}
          <FormInput
            value={form.name}
            onChangeText={(val: string) => setForm({ ...form, name: val })}
            placeholder="Name" // Placeholder text from image
            icon={User}
            error={errors.name}
          />
          <FormInput
            value={form.email}
            onChangeText={(val: string) => setForm({ ...form, email: val })}
            placeholder="Email" // Placeholder text from image
            keyboardType="email-address"
            icon={Envelope}
            error={errors.email}
          />
          <FormInput
            value={form.alternateNo}
            onChangeText={(val: string) => setForm({ ...form, alternateNo: val })}
            placeholder="Alt. Number" // Placeholder text from image
            keyboardType="phone-pad"
            icon={Phone}
          />

          {/* 4. Document Verification Section Label */}
          <Text style={[styles.sectionHeaderLabel, { color: theme.text }]}>Document Verification</Text>

          {/* 5. Aadhaar Number Input */}
          <FormInput
            value={form.aadhaarNo}
            onChangeText={(val: string) => setForm({ ...form, aadhaarNo: val.replace(/\D/g, '').slice(0, 12) })}
            placeholder="Aadhaar Number" // Spelling from image
            keyboardType="number-pad"
            icon={IdentificationCard}
            error={errors.aadhaarNo}
          />

          {/* 6. Side-by-Side Aadhaar Upload Tiles */}
          <View style={styles.aadhaarTileRow}>
            <FilePickerTile
              label="Aadhaar Front" // Label spelling from image
              icon={IdentificationCard}
              onPick={() => { }}
            />
            <FilePickerTile
              label="Aadhaar Back" // Label spelling from image
              icon={IdentificationCard}
              onPick={() => { }}
            />
          </View>

          {error && <Text style={styles.globalError}>{error}</Text>}

          {/* 7. Full Width Submit Button */}
          <View style={styles.footer}>
            <PrimaryButton
              title={loading ? 'SAVING...' : 'Submit'} // Title text from image
              onPress={handleSubmit}
              loading={loading}
              style={{ borderRadius: 18 }} // Matching image's rounded look
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addAvatarBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    height: 52,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 8,
  },
  sectionHeaderLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 2,
  },
  aadhaarTileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fileCardSmall: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileIconWrapper: {
    width: 50,
    height: 50, // Square aesthetic for the icon part
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 4,
  },
  globalError: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 10,
  },
});