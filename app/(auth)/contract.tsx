import { OnboardingStep3 } from '@/api/types';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getRestaurantContract, getRestaurantStatus, submitStep3 } from '@/store/slices/restaurantSlice';
import { updateRestaurantToken } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  WarningCircle
} from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ContractScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { status, loading: submitting, error: apiError } = useAppSelector((state) => state.restaurant);

  const [contractMarkdown, setContractMarkdown] = useState<string>('');
  const [contractData, setContractData] = useState<{ id: string; version: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContract = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const resultAction = await dispatch(getRestaurantContract());
      if (getRestaurantContract.fulfilled.match(resultAction)) {
        const data = resultAction.payload.data;
        setContractMarkdown(data.content);
        setContractData({
          id: data.id,
          version: data.version
        });
        setIsPending(false);
      } else {
        const errorMsg = resultAction.payload as string;
        // If contract not found, it's likely pending verification
        if (errorMsg?.includes('No active contract found') || errorMsg?.includes('404')) {
          setIsPending(true);
        } else {
          Alert.alert('Error', errorMsg || 'Failed to load the contract. Please try again.');
          router.back();
        }
      }
    } catch (error) {
      console.error('Fetch Contract Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  useEffect(() => {
    if (status?.onboardingStep && status.onboardingStep >= 3) {
      setAccepted(true);
    }
  }, [status?.onboardingStep]);

  const handleSubmit = async () => {
    if (!accepted) {
      Alert.alert('Required', 'Please accept the terms and conditions to proceed.');
      return;
    }

    if (!contractData) return;

    const payload: OnboardingStep3 = {
      contractAccepted: true,
      contractId: contractData.id,
      contractVersion: contractData.version,
    };

    const resultAction = await dispatch(submitStep3(payload));
    if (submitStep3.fulfilled.match(resultAction)) {
      if (contractData?.id) {
         console.log(`🚀 [Handshake] Step 3 success. Finalizing token for Restaurant: ${contractData.id}`);
         await dispatch(updateRestaurantToken({ restaurantId: contractData.id }));
      }
      await dispatch(getRestaurantStatus());
      router.replace('/(tabs)');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MeshGradient />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.icon, marginTop: 16 }]}>Loading legal agreement...</Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <MeshGradient />
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Contract Status</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.pendingContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchContract(true)} tintColor={theme.primary} />
            }
          >
            <Animated.View entering={ZoomIn.duration(600)} style={styles.pendingIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                <Clock size={64} color={theme.primary} weight="duotone" />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.pendingTextSection}>
              <Text style={[styles.pendingTitle, { color: theme.text }]}>Verification in Progress</Text>
              <Text style={[styles.pendingDescription, { color: theme.icon }]}>
                Your documents are currently being reviewed by our compliance team. This normally takes 24-48 hours.
              </Text>

              <View style={[styles.infoBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
                <WarningCircle size={20} color={theme.primary} weight="fill" />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  We'll notify you via SMS and Email once your customized contract is ready for signature.
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)} style={styles.pendingActions}>
              <PremiumButton
                label="Refresh Status"
                onPress={() => fetchContract(true)}
                isLoading={refreshing}
                style={styles.refreshBtn}
                variant="primary"
              />
              <TouchableOpacity onPress={() => router.back()} style={styles.secondaryBtn}>
                <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>Back to Dashboard</Text>
                <ArrowRight size={18} color={theme.primary} />
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MeshGradient />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Terms of Service</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.headerSection}>
              <ShieldCheck size={48} color={theme.primary} weight="duotone" />
              <Text style={[styles.phaseTitle, { color: theme.text }]}>Partnership Agreement</Text>
              <Text style={[styles.phaseSubtitle, { color: theme.icon }]}>
                Please review our terms of service and commission agreements carefully.
              </Text>
            </View>

            <View style={[styles.markdownContainer, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Markdown style={{
                body: { color: theme.text, fontSize: 14, lineHeight: 22 },
                heading1: { color: theme.primary, marginBottom: 10, fontSize: 22, fontWeight: '800' },
                heading2: { color: theme.text, marginBottom: 8, fontSize: 18, fontWeight: '700' },
                strong: { fontWeight: 'bold' },
                em: { fontStyle: 'italic' },
              }}>
                {contractMarkdown}
              </Markdown>
            </View>
          </Animated.View>

          {apiError && (
            <Text style={[styles.errorText, { color: theme.error, marginTop: 20 }]}>
              {apiError}
            </Text>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={styles.acceptanceRow}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              { borderColor: accepted ? theme.primary : theme.icon },
              accepted && { backgroundColor: theme.primary }
            ]}>
              {accepted && <CheckCircle size={18} color="white" weight="fill" />}
            </View>
            <Text style={[styles.acceptanceText, { color: theme.text }]}>
              I have read and agree to the partnership terms.
            </Text>
          </TouchableOpacity>
          <PremiumButton
            label={submitting ? "Processing..." : "Accept & Complete"}
            onPress={handleSubmit}
            isLoading={submitting}
            style={styles.submitBtn}
            disabled={!accepted}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  loadingText: { fontSize: 14, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 180 },
  headerSection: { marginBottom: 24 },
  phaseTitle: { ...Typography.H1, marginTop: 16, marginBottom: 8 },
  phaseSubtitle: { ...Typography.BodyLarge, opacity: 0.8 },
  markdownContainer: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: Platform.OS === 'ios' ? 34 : 24, paddingTop: 24, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  acceptanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  acceptanceText: { fontSize: 14, fontWeight: '500', flex: 1 },
  submitBtn: { height: 56 },
  errorText: { textAlign: 'center', fontWeight: '600' },
  pendingContent: { flexGrow: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  pendingIconContainer: { marginBottom: 32 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  pendingTextSection: { alignItems: 'center', marginBottom: 40 },
  pendingTitle: { ...Typography.H1, textAlign: 'center', marginBottom: 12 },
  pendingDescription: { ...Typography.BodyLarge, textAlign: 'center', paddingHorizontal: 20, marginBottom: 24 },
  infoBox: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 12 },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18, fontWeight: '500' },
  pendingActions: { width: '100%', gap: 16 },
  refreshBtn: { height: 56 },
  secondaryBtn: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryBtnText: { fontSize: 16, fontWeight: '600' },
});
