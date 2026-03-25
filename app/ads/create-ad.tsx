import React, { useState, useRef } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Platform, TextInput, PanResponder, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown, Minus, Plus } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Info } from 'phosphor-react-native';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

const SLIDER_WIDTH = Dimensions.get('window').width - 80; // Rough width after margins/padding

export default function CreateAdScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [percentage, setPercentage] = useState(2.00);

  const [startDate, setStartDate] = useState(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m}, ${y}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(0, Math.min(gestureState.moveX - 40, SLIDER_WIDTH));
        const newPercentage = (newX / SLIDER_WIDTH) * 10; // Max 10%
        setPercentage(Math.round(newPercentage * 100) / 100);
      },
    })
  ).current;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10), backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <View style={styles.titleRow}>
             <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Fudode Ads</ThemedText>
          </View>
          <Pressable style={[styles.helpBtn, { borderColor: theme.primary }]}>
            <ThemedText style={[styles.helpText, { color: theme.primary }]}>Help</ThemedText>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.stepperCard, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}>
          <View style={styles.stepperHeader}>
             <ThemedText style={[styles.stepperTitle, { color: theme.text }]}>Ads/CV percentage (x%)</ThemedText>
             <Info size={18} color={theme.textSecondary} />
          </View>
          
          <View style={styles.stepperControls}>
            <Pressable 
              onPress={() => setPercentage(Math.max(0, percentage - 0.05))}
              style={[styles.stepBtn, { backgroundColor: theme.border + '10' }]}
            >
              <Minus size={24} color={theme.textSecondary} weight="bold" />
            </Pressable>
            <View style={styles.valueDisplay}>
               <ThemedText style={[styles.valueText, { color: theme.text }]}>{percentage.toFixed(2)}%</ThemedText>
            </View>
            <Pressable 
              onPress={() => setPercentage(percentage + 0.05)}
              style={[styles.stepBtn, { backgroundColor: theme.border + '10' }]}
            >
              <Plus size={24} color={theme.textSecondary} weight="bold" />
            </Pressable>
          </View>

          <View 
            style={[styles.sliderTrack, { backgroundColor: theme.border + '20' }]}
            {...panResponder.panHandlers}
          >
             <View style={[styles.sliderFill, { backgroundColor: theme.primary, width: `${(percentage / 10) * 100}%` }]} />
             <View style={[styles.sliderThumb, { backgroundColor: '#FFF', borderColor: theme.primary, left: `${(percentage / 10) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={[styles.inputLabel, { color: theme.text }]}>Start Date</ThemedText>
          <Pressable 
            onPress={() => setIsPickerVisible(true)}
            style={[styles.pickerBtn, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}
          >
            <ThemedText style={[styles.pickerText, { color: theme.text }]}>{formatDate(startDate)}</ThemedText>
            <CaretDown size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={[styles.inputLabel, { color: theme.text }]}>Auto renew campaign</ThemedText>
          <Pressable style={[styles.pickerBtn, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}>
            <ThemedText style={[styles.pickerText, { color: theme.text }]}>Disabled</ThemedText>
            <CaretDown size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={[styles.inputLabel, { color: theme.text }]}>Office Address</ThemedText>
          <View style={[styles.addressBox, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}>
            <ThemedText style={[styles.addressText, { color: theme.textSecondary }]}>
              nayapura balotra, teh pachpadra dist , barmer pachpasra, barmer, rajasthan 344022, Balotra
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton 
          title="Start Ad" 
          onPress={() => router.back()}
          style={{ height: 56, borderRadius: 14 }}
        />
      </View>

      <DateTimePicker
        visible={isPickerVisible}
        mode="date"
        initialDate={startDate}
        onClose={() => setIsPickerVisible(false)}
        onConfirm={(date) => {
          setStartDate(date);
          setIsPickerVisible(false);
        }}
        title="Selecting ad start date"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  knowMore: {
    fontSize: 15,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  helpBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  helpText: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 120,
  },
  stepperCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  stepperTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  stepBtn: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueDisplay: {
    minWidth: 140,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    marginHorizontal: 10,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -12,
    left: '30%',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    marginLeft: -15,
  },
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 12,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  addressBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
});
