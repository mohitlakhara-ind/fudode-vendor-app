import { JourneyProgress } from '@/components/ui/JourneyProgress';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { getRestaurantStatus } from '@/store/slices/restaurantSlice';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import {
  CaretRight,
  CheckCircle,
  Files,
  Lightning,
  MapPin,
  ShieldCheck,
  SignOut,
  Storefront
} from 'phosphor-react-native';
import { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { status, loading } = useAppSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(getRestaurantStatus());
  }, []);

  const steps = useMemo(() => {
    const currentOnboardingStep = status?.onboardingStep || 1;
    return [
      {
        id: 'step1',
        title: 'Store Profile',
        description: 'Basic details & shop location',
        icon: Storefront,
        route: '/(auth)/store-profile',
        isCompleted: currentOnboardingStep > 1,
        isClickable: true,
      },
      {
        id: 'step2',
        title: 'Business & KYC',
        description: 'Legal name, FSSAI & PAN details',
        icon: Files,
        route: '/(auth)/kyc',
        isCompleted: currentOnboardingStep > 2,
        isClickable: currentOnboardingStep >= 2,
      },
      {
        id: 'step3',
        title: 'Accept Agreement',
        description: 'Review partnership & terms',
        icon: ShieldCheck,
        route: '/(auth)/contract',
        isCompleted: status?.onboardingStatus === 'COMPLETED' || status?.onboardingStatus === 'VERIFIED',
        isClickable: currentOnboardingStep >= 3,
      },
    ];
  }, [status]);

  const currentStep = status?.onboardingStep || 1;
  const progressPercent = Math.min((currentStep - 1) / 3, 1);

  const handleStepPress = (route: string, isClickable: boolean) => {
    if (!isClickable) {
      Alert.alert('Locked', 'Please complete the previous steps first.');
      return;
    }
    router.push(route as any);
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          <BlurView intensity={isDark ? 20 : 40} style={styles.progressCard}>
            <JourneyProgress totalSteps={3} currentStep={Math.max(0, currentStep - 1)} />
            <View style={styles.progressFooter}>
              <View style={styles.progressInfo}>
                <Lightning size={16} color={theme.primary} weight="fill" />
                <Text style={[styles.progressText, { color: theme.text }]}>
                  {status?.onboardingStatus === 'COMPLETED' ? '100% Completed' : `${Math.round(progressPercent * 100)}% Completed`}
                </Text>
              </View>
              <Text style={[styles.estimatedText, { color: theme.icon }]}>Step {currentStep} of 3</Text>
            </View>
          </BlurView>
        </Animated.View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View
              key={step.id}
              entering={FadeInDown.delay(600 + index * 100).duration(600)}
            >
              <TouchableOpacity
                onPress={() => handleStepPress(step.route, step.isClickable)}
                activeOpacity={0.7}
                style={styles.stepCardWrapper}
              >
                <BlurView
                  intensity={isDark ? 15 : 30}
                  style={[
                    styles.stepCard,
                    step.isCompleted && { borderColor: theme.success + '40' },
                    !step.isClickable && { opacity: 0.5 }
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
                    <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                    <Text style={[styles.stepDesc, { color: theme.icon }]}>{step.description}</Text>
                  </View>
                  {step.isCompleted ? (
                    <CheckCircle size={28} color={theme.success} weight="fill" />
                  ) : (
                    <CaretRight size={20} color={theme.icon} />
                  )}
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.supportCardWrapper}>
          <TouchableOpacity style={styles.supportCard}>
            <Text style={[styles.supportText, { color: theme.icon }]}>
              Need help? <Text style={{ color: theme.primary, fontWeight: '700' }}>Contact Support</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
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
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    marginBottom: 4,
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
});

