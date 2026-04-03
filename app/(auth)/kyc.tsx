import { OnboardingStep2 } from '@/api/types';
import { JourneyProgress } from '@/components/ui/JourneyProgress';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getRestaurantStatus, submitStep2, updateStep2 } from '@/store/slices/restaurantSlice';
import { updateRestaurantToken } from '@/store/slices/authSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  At,
  Bank,
  Building,
  CheckCircle,
  CreditCard,
  FileText,
  Fingerprint,
  IdentificationCard,
  User,
} from 'phosphor-react-native';
import { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  Layout
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function KycScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { status, loading, error: apiError } = useAppSelector((state) => state.restaurant);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [hasGstin, setHasGstin] = useState(true);

  // Form State aligned with OnboardingStep2
  const [form, setForm] = useState<OnboardingStep2>({
    legalName: '',
    fssai: '',
    PanNo: '',
    Gstin: '',
    paymentMethod: 'BANK_TRANSFER',
    holderName: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    upiId: '',
  });

  const hasPrefilled = useRef(false);

  // 1. Fetch current status on mount
  useEffect(() => {
    console.log('🔄 [KYC] Screen mounted. Dispatching status fetch...');
    dispatch(getRestaurantStatus());
  }, []);

  // 2. Prefill effect with "Breakpoint" logging
  useEffect(() => {
    if (status && !hasPrefilled.current) {
      console.log('🚨 [KYC Breakpoint] Pre-fill Candidate Found:', {
        legalName: status.legalName,
        paymentMethod: status.paymentMethod,
        hasStatus: !!status
      });

      if (status.legalName || status.paymentMethod) {
        console.log('✅ [KYC Breakpoint] Population START');
        setForm(prev => ({
          ...prev,
          legalName: status.legalName || prev.legalName,
          fssai: status.fssai || prev.fssai,
          PanNo: status.PanNo || prev.PanNo,
          Gstin: status.Gstin || prev.Gstin,
          paymentMethod: (status.paymentMethod as any) || prev.paymentMethod,
          holderName: status.holderName || prev.holderName,
          bankName: status.bankName || prev.bankName,
          accountNo: status.accountNo || prev.accountNo,
          ifscCode: status.ifscCode || prev.ifscCode,
          upiId: status.upiId || prev.upiId,
        }));
        if (status.Gstin) {
          setHasGstin(true);
        } else if (status.Gstin === '') {
          setHasGstin(false);
        }
        hasPrefilled.current = true;
        console.log('✅ [KYC Breakpoint] Population COMPLETE');
      }
    }
  }, [status]);

  const updateForm = (key: keyof OnboardingStep2, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateRegex = (value: string, pattern: RegExp, fieldName: string) => {
    if (!pattern.test(value)) {
      Alert.alert('Invalid Format', `Please enter a valid ${fieldName}.`);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentPhase === 1) {
      if (!form.legalName || !form.fssai) {
        Alert.alert('Required', 'Please enter legal name and FSSAI number.');
        return;
      }
      if (!validateRegex(form.fssai, /^[0-9]{14}$/, '14-digit FSSAI Number')) return;
      setCurrentPhase(2);
    } else if (currentPhase === 2) {
      if (!form.PanNo) {
        Alert.alert('Required', 'Please enter your PAN number.');
        return;
      }
      if (!validateRegex(form.PanNo, /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN Number (ABCDE1234F)')) return;
      
      if (hasGstin && form.Gstin) {
        if (!validateRegex(form.Gstin, /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/, 'GSTIN (e.g. 29ABCDE1234F1Z5)')) return;
      } else if (hasGstin && !form.Gstin) {
        Alert.alert('Required', 'Please enter GSTIN or toggle it off if not applicable.');
        return;
      }
      setCurrentPhase(3);
    } else {
      // Final Submit for Step 2
      if (form.paymentMethod === 'BANK_TRANSFER') {
        if (!form.holderName || !form.bankName || !form.accountNo || !form.ifscCode) {
          Alert.alert('Required', 'Please fill all bank details.');
          return;
        }
        if (!validateRegex(form.ifscCode, /^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC Code (e.g. HDFC0001234)')) return;
      } else {
        if (!form.upiId) {
          Alert.alert('Required', 'Please enter your UPI ID.');
          return;
        }
      }

      // CLEAN PAYLOAD: Only send valid onboarding fields
      const finalPayload: any = {
        legalName: form.legalName,
        fssai: form.fssai,
        PanNo: form.PanNo,
        paymentMethod: form.paymentMethod,
      };
      
      if (form.paymentMethod === 'BANK_TRANSFER') {
        finalPayload.holderName = form.holderName;
        finalPayload.bankName = form.bankName;
        finalPayload.accountNo = form.accountNo;
        finalPayload.ifscCode = form.ifscCode;
      } else {
        finalPayload.upiId = form.upiId;
      }

      if (hasGstin && form.Gstin) {
        finalPayload.Gstin = form.Gstin;
      }

      console.log(`🚀 [Onboarding Step 2] ${status?.onboardingStep && status.onboardingStep >= 2 ? 'Updating' : 'Submitting'} Payload:`, JSON.stringify(finalPayload, null, 2));

      let resultAction: any;
      // Decide between POST (submit) or PUT (update)
      // If we already have KYC data (legalName or paymentMethod), use Update (PUT)
      if (status?.id && (status?.legalName || status?.paymentMethod)) {
        console.log('🔄 [KYC] Existing record found. Calling Update (PUT)...');
        resultAction = await dispatch(updateStep2(finalPayload));
      } else {
        console.log('🚀 [KYC] No existing record. Calling Submit (POST)...');
        resultAction = await dispatch(submitStep2(finalPayload));
      }

      if (submitStep2.fulfilled.match(resultAction) || updateStep2.fulfilled.match(resultAction)) {
        if (status?.id) {
          console.log(`🚀 [Handshake] Step 2 success. Updating token for Restaurant: ${status.id}`);
          await dispatch(updateRestaurantToken({ restaurantId: status.id }));
        }
        await dispatch(getRestaurantStatus());
      }
    }
  };

  const handleBack = () => {
    if (currentPhase > 1) {
      setCurrentPhase(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const renderPhase1 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.phaseContainer}>
      <View style={styles.headerSection}>
        <Building size={48} color={theme.primary} weight="duotone" />
        <Text style={[styles.phaseTitle, { color: theme.text }]}>Identity & Business</Text>
        <Text style={[styles.phaseSubtitle, { color: theme.icon }]}>
          Enter your restaurant's legal entity and FSSAI details.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <PremiumInput
          label="Legal Entity Name"
          placeholder="e.g. Grandma's Foods Pvt Ltd"
          value={form.legalName}
          onChangeText={(v) => updateForm('legalName', v)}
          icon={IdentificationCard}
        />
        <PremiumInput
          label="FSSAI License Number"
          placeholder="14-digit FSSAI number"
          value={form.fssai}
          onChangeText={(v) => updateForm('fssai', v)}
          icon={FileText}
          keyboardType="numeric"
        />
      </View>
    </Animated.View>
  );

  const renderPhase2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.phaseContainer}>
      <View style={styles.headerSection}>
        <Fingerprint size={48} color={theme.primary} weight="duotone" />
        <Text style={[styles.phaseTitle, { color: theme.text }]}>Document Verification</Text>
        <Text style={[styles.phaseSubtitle, { color: theme.icon }]}>
          Enter your Permanent Account Number (PAN).
        </Text>
      </View>

      <View style={styles.formGroup}>
        <PremiumInput
          label="PAN Number"
          placeholder="ABCDE1234F"
          value={form.PanNo}
          onChangeText={(v) => updateForm('PanNo', v.toUpperCase())}
          icon={FileText}
          autoCapitalize="characters"
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            onPress={() => {
              setHasGstin(!hasGstin);
              if (hasGstin) updateForm('Gstin', '');
            }} 
            style={styles.toggleRow}
          >
            <View style={[styles.checkbox, { borderColor: theme.border, backgroundColor: hasGstin ? theme.primary : 'transparent' }]}>
              {hasGstin && <CheckCircle size={14} color="#FFF" weight="bold" />}
            </View>
            <Text style={[styles.toggleLabel, { color: theme.text }]}>I have a GSTIN for this business</Text>
          </TouchableOpacity>
        </View>

        {hasGstin && (
          <PremiumInput
            label="GSTIN Number"
            placeholder="29ABCDE1234F1Z5"
            value={form.Gstin}
            onChangeText={(v) => updateForm('Gstin', v.toUpperCase())}
            icon={Fingerprint}
            autoCapitalize="characters"
          />
        )}
        <View style={[styles.infoBox, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={[styles.infoText, { color: theme.icon }]}>
            Ensure the PAN name matches your legal entity name.
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPhase3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.phaseContainer}>
      <View style={styles.headerSection}>
        <CreditCard size={48} color={theme.primary} weight="duotone" />
        <Text style={[styles.phaseTitle, { color: theme.text }]}>Payout Settings</Text>
        <Text style={[styles.phaseSubtitle, { color: theme.icon }]}>
          Where should we send your settlements?
        </Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.row}>
          <PremiumButton
            label="Bank Transfer"
            onPress={() => updateForm('paymentMethod', 'BANK_TRANSFER')}
            variant={form.paymentMethod === 'BANK_TRANSFER' ? 'primary' : 'outline'}
            style={styles.halfBtn}
          />
          <PremiumButton
            label="UPI ID"
            onPress={() => updateForm('paymentMethod', 'UPI')}
            variant={form.paymentMethod === 'UPI' ? 'primary' : 'outline'}
            style={styles.halfBtn}
          />
        </View>

        {form.paymentMethod === 'BANK_TRANSFER' ? (
          <Animated.View entering={FadeInDown} layout={Layout} style={{ gap: 16 }}>
            <PremiumInput
              label="Account Holder Name"
              placeholder="Name as per bank records"
              value={form.holderName || ''}
              onChangeText={(v) => updateForm('holderName', v)}
              icon={User}
            />
            <PremiumInput
              label="Bank Name"
              placeholder="e.g. HDFC Bank"
              value={form.bankName || ''}
              onChangeText={(v) => updateForm('bankName', v)}
              icon={Bank}
            />
            <PremiumInput
              label="Account Number"
              placeholder="Enter account number"
              value={form.accountNo || ''}
              onChangeText={(v) => updateForm('accountNo', v)}
              icon={IdentificationCard}
              keyboardType="number-pad"
            />
            <PremiumInput
              label="IFSC Code"
              placeholder="HDFC0001234"
              value={form.ifscCode || ''}
              onChangeText={(v) => updateForm('ifscCode', v.toUpperCase())}
              icon={At}
              autoCapitalize="characters"
            />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown} layout={Layout}>
            <PremiumInput
              label="UPI ID"
              placeholder="e.g. store@upi"
              value={form.upiId || ''}
              onChangeText={(v) => updateForm('upiId', v)}
              icon={At}
              autoCapitalize="none"
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <MeshGradient />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.progressTracker}>
            <JourneyProgress totalSteps={3} currentStep={currentPhase - 1} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentPhase === 1 && renderPhase1()}
          {currentPhase === 2 && renderPhase2()}
          {currentPhase === 3 && renderPhase3()}
          
          {apiError && (
            <Text style={[styles.errorText, { color: theme.error, marginTop: 20 }]}>
              {apiError}
            </Text>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <View style={styles.footerContent}>
            <View style={styles.stepIndicator}>
              <Text style={[styles.stepText, { color: theme.icon }]}>Phase</Text>
              <Text style={[styles.stepValue, { color: theme.text }]}>0{currentPhase} <Text style={{ color: theme.icon, fontSize: 14 }}>/ 03</Text></Text>
            </View>
            <PremiumButton
              label={currentPhase === 3 ? "Submit KYC" : "Continue"}
              onPress={handleNext}
              isLoading={loading}
              style={styles.nextBtn}
              variant="primary"
              rightIcon={currentPhase < 3 ? <ArrowRight size={20} color={theme.background} weight="bold" /> : undefined}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center' },
  progressTracker: { flex: 1, marginLeft: 10 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 140 },
  phaseContainer: { flex: 1 },
  headerSection: { marginBottom: 32 },
  phaseTitle: { ...Typography.H1, marginTop: 16, marginBottom: 8 },
  phaseSubtitle: { ...Typography.BodyLarge, opacity: 0.8 },
  formGroup: { gap: 16 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  halfBtn: { flex: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: Platform.OS === 'ios' ? 34 : 24, paddingTop: 20, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  footerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepIndicator: { flex: 1 },
  stepText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  stepValue: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  nextBtn: { flex: 2, height: 56 },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16, marginTop: 10 },
  infoText: { fontSize: 13, fontWeight: '500', flex: 1 },
  errorText: { textAlign: 'center', fontWeight: '600' },
  toggleContainer: { marginTop: 8, marginBottom: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
});

