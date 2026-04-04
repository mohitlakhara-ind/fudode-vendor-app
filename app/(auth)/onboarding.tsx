import { PrimaryButton } from '@/components/PrimaryButton';
import { GlassView } from '@/components/ui/GlassView';
import { JourneyProgress } from '@/components/ui/JourneyProgress';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { useRouter } from 'expo-router';
import {
  CaretRight,
  CheckCircle,
  Files,
  Lightning,
  ShieldCheck,
  SignOut,
  Storefront,
} from 'phosphor-react-native';
import { useEffect, useMemo } from 'react';
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
import { AnimatedPage } from '@/components/ui/AnimatedPage';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { status, loading } = useAppSelector((state) => state.restaurant);


  const steps = useMemo(() => {
    const currentOnboardingStep = status?.onboardingStep ?? 0;
    return [
      {
        id: 'step1',
        title: 'Store Profile',
        description: 'Basic details & shop location',
        icon: Storefront,
        route: '/(auth)/store-profile',
        isCompleted: currentOnboardingStep >= 1,
        isClickable: true,
      },
      {
        id: 'step2',
        title: 'Business & KYC',
        description: 'Legal name, FSSAI & PAN details',
        icon: Files,
        route: '/(auth)/kyc',
        isCompleted: currentOnboardingStep >= 2,
        isClickable: currentOnboardingStep >= 1 && currentOnboardingStep < 2,
      },
      {
        id: 'step3',
        title: 'Accept Agreement',
        description: 'Review partnership & terms',
        icon: ShieldCheck,
        route: '/(auth)/contract',
        isCompleted: currentOnboardingStep >= 3 || status?.onboardingStatus === 'COMPLETED' || status?.onboardingStatus === 'VERIFIED',
        isClickable: currentOnboardingStep >= 2 && currentOnboardingStep < 3,
      },
    ];
  }, [status]);

  const currentStep = status?.onboardingStep ?? 0;
  const progressPercent = Math.min((currentStep) / 3, 1);

  const handleStepPress = (step: any) => {
    if (step.isCompleted && step.id !== 'step1') {
      Alert.alert('Step Completed', 'This phase has already been submitted and cannot be updated.');
      return;
    }
    if (!step.isClickable) {
      Alert.alert('Locked', 'Please complete the previous steps first.');
      return;
    }
    router.push(step.route as any);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  if (loading && !status) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <MeshGradient />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background }]}>
      <MeshGradient />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.header}>
            <View style={styles.badge}>
              <ShieldCheck size={14} color={theme.primary} weight="fill" />
              <Text style={[styles.badgeText, { color: theme.primary }]}>PARTNER ONBOARDING</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welcome to Fudode</Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>
              Complete these steps to verify your restaurant and start accepting orders.
            </Text>
          </Animated.View>

          <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { borderColor: theme.border }]}>
            <SignOut size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.progressSection}>
          <GlassView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.progressCard}>
            <JourneyProgress totalSteps={3} currentStep={Math.max(0, currentStep)} />
            <View style={styles.progressFooter}>
              <View style={styles.progressInfo}>
                <Lightning size={16} color={theme.primary} weight="fill" />
                <Text style={[styles.progressText, { color: theme.text }]}>
                  {status?.onboardingStatus === 'COMPLETED' ? '100% Completed' : `${Math.round(progressPercent * 100)}% Completed`}
                </Text>
              </View>
              <Text style={[styles.estimatedText, { color: theme.icon }]}>Step {currentStep + 1} of 3</Text>
            </View>
          </GlassView>
        </Animated.View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View
              key={step.id}
              entering={FadeInDown.delay(600 + index * 100).duration(600)}
            >
              <TouchableOpacity
                onPress={() => handleStepPress(step)}
                activeOpacity={0.7}
                disabled={!step.isClickable && !step.isCompleted}
                style={styles.stepCardWrapper}
              >
                <GlassView
                  intensity={isDark ? 30 : 60}
                  tint={isDark ? 'dark' : 'light'}
                  style={[
                    styles.stepCard,
                    step.isCompleted && { 
                      borderColor: theme.success + '60',
                      backgroundColor: theme.success + '08' 
                    },
                    !step.isClickable && !step.isCompleted && { opacity: 0.5 }
                  ]}
                >
                  <View style={[
                    styles.iconBox,
                    { backgroundColor: step.isCompleted ? theme.success + '20' : theme.surfaceSecondary }
                  ]}>
                    <step.icon
                      size={24}
                      color={step.isCompleted ? theme.success : theme.primary}
                      weight={step.isCompleted ? "fill" : "duotone"}
                    />
                  </View>
                  <View style={styles.stepInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                      {step.isCompleted && (
                        <View style={[styles.completedBadge, { backgroundColor: theme.success + '20' }]}>
                          <Text style={[styles.completedBadgeText, { color: theme.success }]}>COMPLETED</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.stepDesc, { color: theme.icon }]}>{step.description}</Text>
                  </View>
                  {step.isCompleted ? (
                    <View style={styles.checkWrapper}>
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={24} color={theme.success} weight="fill" />
                        {step.id === 'step1' && (
                          <Text style={{ fontSize: 10, color: theme.primary, fontWeight: 'bold' }}>EDIT</Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <CaretRight size={20} color={theme.icon} />
                  )}
                </GlassView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

      </ScrollView>

      <GlassView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.stickyFooter}>
        {status?.onboardingStatus === 'COMPLETED' || status?.onboardingStatus === 'VERIFIED' ? (
          <PrimaryButton
            title="Proceed to Dashboard"
            onPress={() => router.replace('/(tabs)')}
            style={{ borderRadius: 20 }}
          />
        ) : (
          <TouchableOpacity style={styles.supportCard}>
            <Text style={[styles.supportText, { color: theme.icon }]}>
              Need help? <Text style={{ color: theme.primary, fontWeight: '700' }}>Contact Support</Text>
            </Text>
          </TouchableOpacity>
        )}
      </GlassView>
    </AnimatedPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 140,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  header: {
    flex: 1,
    marginRight: 16,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(250, 203, 4, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    ...Typography.H1,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.BodyLarge,
    opacity: 0.7,
    lineHeight: 24,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressCard: {
    padding: 24,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
  },
  estimatedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepsContainer: {
    gap: 16,
  },
  stepCardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
    marginLeft: 16,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  checkWrapper: {
    marginLeft: 12,
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },
  supportCardWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  supportCard: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  supportText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stickyFooter: {
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

