import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown, Info, Plus, Scissors } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ValuePicker = ({ label, placeholder, options }: any) => {
  const { colorScheme, isDark } = useAppTheme();
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
        style={[styles.pickerBox, { borderColor: theme.border + '26', backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10' }]}
        onPress={handlePress}
      >
        <ThemedText style={[styles.pickerText, { color: theme.text }]}>{placeholder}</ThemedText>
        <CaretDown size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

export default function PercentageDiscountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];
  const { queue } = useSelector((state: RootState) => state.order);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <RestaurantHeader
        restaurantName="Muggs Cafe"
        locality="Balotra Locality"
        isOnline={true}
        onToggleStatus={() => {}}
        onPressInfo={() => {}}
        onBack={() => router.back()}
        title="Percentage discount"
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Offer setup</ThemedText>

        <View style={[styles.valueCard, { backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10', borderColor: theme.border + '26', borderWidth: 1 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '15' }]}>
                <Scissors size={24} color={theme.primary} weight="fill" />
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

        <TouchableOpacity style={[styles.addValueBtn, { borderColor: theme.border + '40' }]}>
          <Plus size={20} color={theme.textSecondary} weight="bold" />
          <ThemedText style={[styles.addValueText, { color: theme.textSecondary }]}>Add another value</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: theme.border + '26', backgroundColor: theme.background }]}>
        <TouchableOpacity 
            style={[styles.continueBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push({ pathname: '/growth/offers/create-offer-flow', params: { type: 'percentage' } })}
        >
          <ThemedText style={[styles.continueText, { color: isDark ? '#131313' : '#FFF' }]}>Continue</ThemedText>
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
    borderWidth: 1,
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
    borderTopWidth: 1,
  },
  continueBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
