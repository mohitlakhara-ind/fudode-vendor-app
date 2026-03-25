import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  CaretLeft, 
  CheckCircle, 
  Ticket, 
  Lightning, 
  Timer, 
  ChartBar,
  ShieldCheck,
  Plus,
  Minus,
  Info
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { OfferOtpModal } from '@/components/growth/OfferOtpModal';

const { width } = Dimensions.get('window');

type Step = 'milestone' | 'reward' | 'validity' | 'review';

export default function CreateLoyaltyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [currentStep, setCurrentStep] = useState<Step>('milestone');
  const [visits, setVisits] = useState(5);
  const [rewardType, setRewardType] = useState<'flat' | 'percentage' | 'freebie'>('flat');
  const [rewardValue, setRewardValue] = useState('100');
  const [minOrder, setMinOrder] = useState('199');
  const [validityDays, setValidityDays] = useState(30);
  
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  const steps: { key: Step; label: string }[] = [
    { key: 'milestone', label: 'Milestone' },
    { key: 'reward', label: 'Reward' },
    { key: 'validity', label: 'Validity' },
    { key: 'review', label: 'Review' },
  ];

  const handleNext = () => {
    if (currentStep === 'milestone') setCurrentStep('reward');
    else if (currentStep === 'reward') setCurrentStep('validity');
    else if (currentStep === 'validity') setCurrentStep('review');
    else if (currentStep === 'review') setIsOtpVisible(true);
  };

  const handleBack = () => {
    if (currentStep === 'milestone') router.back();
    else if (currentStep === 'reward') setCurrentStep('milestone');
    else if (currentStep === 'validity') setCurrentStep('reward');
    else if (currentStep === 'review') setCurrentStep('validity');
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isPast = steps.findIndex(s => s.key === currentStep) > index;
        return (
          <View key={step.key} style={styles.progressSegment}>
            <View style={[
              styles.progressDot, 
              { 
                backgroundColor: isActive || isPast ? theme.primary : theme.border + '40',
                transform: [{ scale: isActive ? 1.2 : 1 }]
              }
            ]}>
              {isPast && <CheckCircle size={14} color={theme.background} weight="fill" />}
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.progressLine, 
                { backgroundColor: isPast ? theme.primary : theme.border + '26' }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <Pressable 
            onPress={handleBack}
            style={[styles.backBtn, { backgroundColor: theme.surface }]}
          >
            <CaretLeft size={24} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>New Loyalty Program</Text>
          <View style={{ width: 44 }} />
        </View>
        {renderProgress()}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 'milestone' && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Set Visit Milestone</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              After how many visits should the customer receive a reward?
            </Text>

            <View style={[styles.counterContainer, { backgroundColor: theme.surface, borderColor: theme.border + '26' }]}>
              <Pressable 
                onPress={() => setVisits(Math.max(2, visits - 1))}
                style={[styles.counterBtn, { backgroundColor: theme.surfaceSecondary }]}
              >
                <Minus size={24} color={theme.text} weight="bold" />
              </Pressable>
              <View style={styles.counterValue}>
                <Text style={[styles.visitCount, { color: theme.text }]}>{visits}</Text>
                <Text style={[styles.visitLabel, { color: theme.textSecondary }]}>Visits</Text>
              </View>
              <Pressable 
                onPress={() => setVisits(visits + 1)}
                style={[styles.counterBtn, { backgroundColor: theme.surfaceSecondary }]}
              >
                <Plus size={24} color={theme.text} weight="bold" />
              </Pressable>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
              <Info size={20} color={theme.primary} weight="fill" />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                A standard visit pack consists of <Text style={{ color: theme.text, fontWeight: '700' }}>5 visits</Text>.
              </Text>
            </View>
          </View>
        )}

        {currentStep === 'reward' && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Choose Reward</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              What will the customer get on their {visits}th visit?
            </Text>

            <View style={styles.rewardTypes}>
              {[
                { id: 'flat', label: 'Flat Off', icon: Ticket },
                { id: 'percentage', label: '% Off', icon: ChartBar },
                { id: 'freebie', label: 'Freebie', icon: Ticket },
              ].map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => setRewardType(type.id as any)}
                  style={[
                    styles.rewardTypeBtn,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: rewardType === type.id ? theme.primary : theme.border + '26'
                    }
                  ]}
                >
                  <type.icon size={24} color={rewardType === type.id ? theme.primary : theme.textSecondary} weight="bold" />
                  <Text style={[
                    styles.rewardTypeLabel, 
                    { color: rewardType === type.id ? theme.primary : theme.textSecondary }
                  ]}>{type.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>REWARD VALUE</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border + '26' }]}
                value={rewardValue}
                onChangeText={setRewardValue}
                placeholder="e.g. 100"
                placeholderTextColor={theme.textSecondary + '60'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>MINIMUM ORDER VALUE</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border + '26' }]}
                value={minOrder}
                onChangeText={setMinOrder}
                placeholder="e.g. 199"
                placeholderTextColor={theme.textSecondary + '60'}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {currentStep === 'validity' && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Program Validity</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              How long should this program run?
            </Text>

            <View style={styles.optionsGrid}>
              {[30, 60, 90, 180].map((days) => (
                <Pressable
                  key={days}
                  onPress={() => setValidityDays(days)}
                  style={[
                    styles.optionBtn,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: validityDays === days ? theme.primary : theme.border + '26'
                    }
                  ]}
                >
                  <Text style={[
                    styles.optionValue, 
                    { color: validityDays === days ? theme.primary : theme.text }
                  ]}>{days}</Text>
                  <Text style={[
                    styles.optionLabel, 
                    { color: validityDays === days ? theme.primary : theme.textSecondary }
                  ]}>Days</Text>
                </Pressable>
              ))}
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20', marginTop: 32 }]}>
              <Timer size={20} color={theme.primary} weight="fill" />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Programs running for <Text style={{ color: theme.text, fontWeight: '700' }}>90 days</Text> show best results.
              </Text>
            </View>
          </View>
        )}

        {currentStep === 'review' && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Review Program</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Almost there! Review your loyalty program details.
            </Text>

            <View style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border + '26' }]}>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Milestone</Text>
                <Text style={[styles.reviewValue, { color: theme.text }]}>{visits} Visits</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border + '26' }]} />
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Reward</Text>
                <Text style={[styles.reviewValue, { color: theme.text }]}>
                    {rewardType === 'flat' ? `₹${rewardValue} Off` : rewardType === 'percentage' ? `${rewardValue}% Off` : rewardValue || 'Surprise Freebie'}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border + '26' }]} />
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Conditions</Text>
                <Text style={[styles.reviewValue, { color: theme.text }]}>Min. order ₹{minOrder}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border + '26' }]} />
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Duration</Text>
                <Text style={[styles.reviewValue, { color: theme.text }]}>{validityDays} Days</Text>
              </View>
            </View>

            <View style={[styles.safetyCard, { backgroundColor: isDark ? theme.surfaceSecondary : theme.background, borderColor: theme.border + '26' }]}>
                <ShieldCheck size={24} color={theme.success} weight="fill" />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.safetyTitle, { color: theme.text }]}>Secure Creation</Text>
                    <Text style={[styles.safetyDesc, { color: theme.textSecondary }]}>
                        You'll need to verify with OTP to launch this program.
                    </Text>
                </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PremiumButton
          label={currentStep === 'review' ? "Verify & Launch" : "Continue"}
          onPress={handleNext}
          variant="glassy"
          style={styles.primaryBtn}
        />
      </View>

      <OfferOtpModal 
        visible={isOtpVisible}
        onClose={() => setIsOtpVisible(false)}
        phoneNumber="9376273686"
        onVerify={(otp) => {
            console.log('OTP Verified:', otp);
            setIsOtpVisible(false);
            router.replace('/growth/loyalty');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.H2,
    fontSize: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressSegment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    width: width * 0.15,
    height: 2,
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  stepContent: {
    marginTop: 12,
  },
  stepTitle: {
    ...Typography.H1,
    fontSize: 24,
    marginBottom: 8,
  },
  stepDesc: {
    ...Typography.BodyRegular,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    marginBottom: 32,
  },
  counterBtn: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    alignItems: 'center',
  },
  visitCount: {
    ...Typography.Display,
    fontSize: 48,
    lineHeight: 56,
  },
  visitLabel: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
  },
  infoText: {
    ...Typography.Caption,
    fontSize: 13,
    flex: 1,
  },
  rewardTypes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  rewardTypeBtn: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  rewardTypeLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 24,
    gap: 8,
  },
  inputLabel: {
    ...Typography.Caption,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    paddingLeft: 4,
  },
  input: {
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: Fonts.inter.semibold,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionBtn: {
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  optionValue: {
    ...Typography.H2,
    fontSize: 20,
  },
  optionLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    gap: 16,
    marginBottom: 24,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    ...Typography.Caption,
    fontSize: 14,
  },
  reviewValue: {
    ...Typography.H3,
    fontSize: 16,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
  },
  safetyTitle: {
    ...Typography.H3,
    fontSize: 16,
    marginBottom: 2,
  },
  safetyDesc: {
    ...Typography.Caption,
    fontSize: 12,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  primaryBtn: {
    width: '100%',
    height: 56,
  },
});
