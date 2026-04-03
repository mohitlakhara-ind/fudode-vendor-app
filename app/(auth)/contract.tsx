import { OnboardingStep3 } from '@/api/types';
import api from '@/api/api';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getRestaurantContract, getRestaurantStatus, submitStep3 } from '@/store/slices/restaurantSlice';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  ShieldCheck
} from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ContractScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { loading: submitting, error: apiError } = useAppSelector((state) => state.restaurant);
  
  const [contractMarkdown, setContractMarkdown] = useState<string>('');
  const [contractData, setContractData] = useState<{ id: string; version: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const resultAction = await dispatch(getRestaurantContract());
        if (getRestaurantContract.fulfilled.match(resultAction)) {
          const data = resultAction.payload.data;
          setContractMarkdown(data.content);
          setContractData({
            id: data.id,
            version: data.version
          });
        } else {
          throw new Error('Failed to load contract');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load the contract. Please try again.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

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
      await dispatch(getRestaurantStatus());
      Alert.alert('Congratulations!', 'Your registration is complete. We will verify your details soon.', [
        { text: 'Go to Dashboard', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.icon, marginTop: 16 }]}>Loading legal agreement...</Text>
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

        <BlurView intensity={isDark ? 50 : 80} style={styles.footer}>
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

          <PrimaryButton
            title={submitting ? "Processing..." : "Accept & Complete"}
            onPress={handleSubmit}
            loading={submitting}
            style={styles.submitBtn}
            disabled={!accepted}
          />
        </BlurView>
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
});
