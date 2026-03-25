import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown, Info, Plus, Scissors } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

const ValuePicker = ({ label, placeholder, options }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const handlePress = () => {
    Alert.alert(`Select ${label}`, 'Available options:', options.map((o: string) => ({ text: o, onPress: () => {} })));
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerLabelRow}>
        <ThemedText style={[styles.pickerLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
        <TouchableOpacity>
          <Info size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.pickerBox, { borderColor: theme.border, backgroundColor: 'transparent' }]}
        onPress={handlePress}
      >
        <ThemedText style={[styles.pickerText, { color: theme.textSecondary }]}>{placeholder}</ThemedText>
        <CaretDown size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

export default function PercentageDiscountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Percentage discount</ThemedText>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Offer setup</ThemedText>

        <View style={[styles.valueCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#A3E63520' }]}>
                <Scissors size={24} color="#A3E635" weight="fill" />
            </View>
            <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Offer value #1</ThemedText>
          </View>

          <ValuePicker 
            label="Percentage discount" 
            placeholder="30% OFF" 
            options={['10%', '20%', '30%', '40%', '50%', '60%']}
          />

          <View style={{ height: 20 }} />

          <ValuePicker 
            label="Items for discount" 
            placeholder="name for" 
            options={['Whole Menu', 'Recommended Items', 'Specific Categories', 'Specific Items']}
          />
        </View>

        <TouchableOpacity style={[styles.addValueBtn, { borderColor: 'rgba(255,255,255,0.2)' }]}>
          <Plus size={20} color={theme.textSecondary} weight="bold" />
          <ThemedText style={[styles.addValueText, { color: theme.textSecondary }]}>Add another value</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
            style={[styles.continueBtn, { backgroundColor: '#FFF' }]}
            onPress={() => router.push({ pathname: '/growth/offers/create-offer-flow', params: { type: 'percentage' } })}
        >
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    marginTop: 10,
  },
  valueCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  pickerContainer: {
    gap: 8,
  },
  pickerLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  pickerBox: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addValueBtn: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  addValueText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  continueBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },
});
