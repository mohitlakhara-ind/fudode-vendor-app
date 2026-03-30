import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown, Info } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Alert } from 'react-native';

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

export default function FreebiesScreen() {
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
        title="Freebies"
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]} showsVerticalScrollIndicator={false}>
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Offer setup</ThemedText>

        <View style={[styles.valueCard, { backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10', borderColor: theme.border + '26', borderWidth: 1 }]}>
          <ValuePicker 
            label="Freebie items" 
            placeholder="Red Pasta" 
            options={['Red Pasta', 'Garlic Bread', 'Cold Coffee', 'Vanilla Scoop']}
          />

          <View style={{ height: 24 }} />

          <ValuePicker 
            label="Minimum order value" 
            placeholder="₹349 and above" 
            options={['₹199 and above', '₹299 and above', '₹349 and above', '₹499 and above']}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: theme.border + '26', backgroundColor: theme.background }]}>
        <TouchableOpacity 
            style={[styles.continueBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push({ pathname: '/growth/offers/create-offer-flow', params: { type: 'freebie' } })}
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
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
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
    fontSize: 16,
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
