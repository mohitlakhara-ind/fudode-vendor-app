import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { submitKyc, updateScope } from '@/store/slices/authSlice';
import { getMyRestaurants } from '@/store/slices/profileSlice';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { CaretLeft, CheckCircle, WarningCircle, Buildings, CreditCard, IdentificationCard, Storefront } from 'phosphor-react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { KycDetails } from '@/api/types';
import { TextInput } from 'react-native';

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', error, maxLength }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.icon }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: error ? '#FF3B30' : theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.icon}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const SelectOption = ({ label, options, selectedValue, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.icon }]}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((opt: any) => {
          const isActive = selectedValue === opt.value;
          const { colorScheme } = useAppTheme();
          const isDark = colorScheme === 'dark';
          
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: isActive 
                    ? `${theme.primary}15` 
                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
                  borderColor: isActive ? theme.primary : theme.border,
                  borderWidth: isActive ? 2 : 1.5,
                }
              ]}
              onPress={() => onSelect(opt.value)}
            >
              <Text style={{ 
                color: isActive ? theme.primary : theme.text,
                fontWeight: '700',
                fontSize: 13
              }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function KycScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState<KycDetails>({
    name: '',
    legalName: '',
    description: '',
    fssai: '',
    docType: 'PAN_CARD',
    docNumber: '',
    addressDocType: 'SHOP_ACT',
    addressDocNumber: '',
    paymentMethod: 'BANK_TRANSFER',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    upiId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof KycDetails, string>>>({});

  useEffect(() => {
    dispatch(getMyRestaurants());
  }, []);

  const handleChange = (key: keyof KycDetails, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = 'Restaurant Name is required';
    if (!form.legalName) newErrors.legalName = 'Legal Entity Name is required';
    if (!form.fssai || form.fssai.length !== 14) newErrors.fssai = '14-digit FSSAI is required';
    if (!form.docNumber) newErrors.docNumber = 'Document Number is required';
    if (!form.addressDocNumber) newErrors.addressDocNumber = 'Address Doc Number is required';
    
    if (form.paymentMethod === 'BANK_TRANSFER') {
      if (!form.bankName) newErrors.bankName = 'Bank Name is required';
      if (!form.accountNo) newErrors.accountNo = 'Account Number is required';
      if (!form.ifscCode) newErrors.ifscCode = 'IFSC Code is required';
    } else {
      if (!form.upiId) newErrors.upiId = 'UPI ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }
    
    try {
      const result = await dispatch(submitKyc(form));
      if (submitKyc.fulfilled.match(result)) {
        console.log('[KYC Screen] Submission successful');
        Alert.alert(
          'KYC Submitted',
          'Your KYC details have been submitted successfully. We will review them shortly.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        console.error('[KYC Screen] Submission failed:', result.payload);
      }
    } catch (e) {
      console.error('[KYC Screen] Exception during submission:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
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
          <CaretLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>KYC Onboarding</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <WarningCircle size={20} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            Submit your restaurant legal and payout details to get started.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Storefront size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Restaurant Basics</Text>
          </View>
          <FormInput
            label="Restaurant Display Name"
            value={form.name}
            onChangeText={(val: string) => handleChange('name', val)}
            placeholder="Pizza Palace"
            error={errors.name}
          />
          <FormInput
            label="Legal Entity Name"
            value={form.legalName}
            onChangeText={(val: string) => handleChange('legalName', val)}
            placeholder="Pizza Palace Pvt Ltd"
            error={errors.legalName}
          />
          <FormInput
            label="FSSAI Number (14 digits)"
            value={form.fssai}
            onChangeText={(val: string) => handleChange('fssai', val.replace(/\D/g, '').slice(0, 14))}
            placeholder="12345678901234"
            keyboardType="number-pad"
            maxLength={14}
            error={errors.fssai}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IdentificationCard size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Identity Documents</Text>
          </View>
          <SelectOption
            label="Primary Document Type"
            options={[{ label: 'PAN Card', value: 'PAN_CARD' }, { label: 'GST', value: 'GST' }]}
            selectedValue={form.docType}
            onSelect={(val: string) => handleChange('docType', val)}
          />
          <FormInput
            label={`${form.docType === 'PAN_CARD' ? 'PAN' : 'GST'} Number`}
            value={form.docNumber}
            onChangeText={(val: string) => handleChange('docNumber', val.toUpperCase())}
            placeholder={form.docType === 'PAN_CARD' ? 'ABCDE1234F' : '29AAAAA0000A1Z5'}
            error={errors.docNumber}
          />
          <SelectOption
            label="Address Proof Type"
            options={[{ label: 'Shop Act', value: 'SHOP_ACT' }, { label: 'MSME Reg.', value: 'MSME_REGISTRATION' }]}
            selectedValue={form.addressDocType}
            onSelect={(val: string) => handleChange('addressDocType', val)}
          />
          <FormInput
            label="Address Proof Number"
            value={form.addressDocNumber}
            onChangeText={(val: string) => handleChange('addressDocNumber', val)}
            placeholder="Registration Number"
            error={errors.addressDocNumber}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payout Details</Text>
          </View>
          <SelectOption
            label="Payment Method"
            options={[{ label: 'Bank Transfer', value: 'BANK_TRANSFER' }, { label: 'UPI', value: 'UPI' }]}
            selectedValue={form.paymentMethod}
            onSelect={(val: string) => handleChange('paymentMethod', val)}
          />
          
          {form.paymentMethod === 'BANK_TRANSFER' ? (
            <>
              <FormInput
                label="Bank Name"
                value={form.bankName}
                onChangeText={(val: string) => handleChange('bankName', val)}
                placeholder="HDFC Bank"
                error={errors.bankName}
              />
              <FormInput
                label="Account Number"
                value={form.accountNo}
                onChangeText={(val: string) => handleChange('accountNo', val)}
                placeholder="1234567890"
                keyboardType="number-pad"
                error={errors.accountNo}
              />
              <FormInput
                label="IFSC Code"
                value={form.ifscCode}
                onChangeText={(val: string) => handleChange('ifscCode', val.toUpperCase())}
                placeholder="HDFC0001234"
                error={errors.ifscCode}
                maxLength={11}
              />
            </>
          ) : (
            <FormInput
              label="UPI ID"
              value={form.upiId}
              onChangeText={(val: string) => handleChange('upiId', val.toLowerCase())}
              placeholder="name@bank"
              error={errors.upiId}
            />
          )}
        </View>

        {error && (
          <View style={styles.errorBox}>
            <WarningCircle size={16} color="#FF3B30" />
            <Text style={styles.errorBoxText}>{error as string}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <PrimaryButton
            title={loading ? 'Submitting...' : 'Complete Onboarding'}
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 102, 0, 0.05)',
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    marginBottom: 20,
    gap: 8,
  },
  errorBoxText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
  },
});
