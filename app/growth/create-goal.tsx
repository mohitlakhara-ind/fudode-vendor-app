import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function CreateGoalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();
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
        title={title || 'Grow your customer base'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.promoBanner, { backgroundColor: isDark ? theme.surfaceSecondary + '40' : theme.surfaceSecondary + '10', borderColor: theme.border + '26', borderWidth: 1 }]}>
            <View style={styles.promoBannerContent}>
                <ThemedText style={[styles.promoBannerTitle, { color: theme.text }]}>Choose your promo discount type</ThemedText>
            </View>
            <View style={[styles.promoIllustration, { backgroundColor: theme.primary + '20' }]}>
                <ThemedText style={{ fontSize: 40, color: theme.primary, fontWeight: '900' }}>%</ThemedText>
            </View>
        </View>

        <TouchableOpacity 
            style={[styles.promoCard, { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: theme.border + '26' }]}
            onPress={() => router.push('/growth/offers/percentage')}
        >
            <View style={styles.promoIconRow}>
                <ThemedText style={[styles.promoIconText, { color: theme.primary }]}>30% OFF</ThemedText>
                <View style={styles.promoTextContainer}>
                    <ThemedText style={[styles.promoTitle, { color: theme.text }]}>Percentage discount</ThemedText>
                    <ThemedText style={[styles.promoDesc, { color: theme.textSecondary }]}>Create promo discounts like '30% OFF up to ₹75'</ThemedText>
                </View>
                <CaretRight size={20} color={theme.primary} weight="bold" />
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.promoCard, { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: theme.border + '26' }]}
            onPress={() => router.push('/growth/offers/flat-price')}
        >
            <View style={styles.promoIconRow}>
                <ThemedText style={[styles.promoIconText, { color: theme.primary }]}>₹100 OFF</ThemedText>
                <View style={styles.promoTextContainer}>
                    <ThemedText style={[styles.promoTitle, { color: theme.text }]}>Flat Price</ThemedText>
                    <ThemedText style={[styles.promoDesc, { color: theme.textSecondary }]}>Create absolute flat discounts like 'Flat ₹100 OFF'</ThemedText>
                </View>
                <CaretRight size={20} color={theme.primary} weight="bold" />
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.promoCard, { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: theme.border + '26' }]}
            onPress={() => router.push('/growth/offers/freebies')}
        >
            <View style={styles.promoIconRow}>
                <ThemedText style={[styles.promoIconText, { color: theme.primary }]}>FREE</ThemedText>
                <View style={styles.promoTextContainer}>
                    <ThemedText style={[styles.promoTitle, { color: theme.text }]}>Freebies</ThemedText>
                    <ThemedText style={[styles.promoDesc, { color: theme.textSecondary }]}>Offer free items like 'Free Dessert on ₹500+'</ThemedText>
                </View>
                <CaretRight size={20} color={theme.primary} weight="bold" />
            </View>
        </TouchableOpacity>

        <View style={[styles.line, { marginTop: 40, backgroundColor: theme.border + '26' }]} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  promoBanner: {
    height: 140,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
  },
  promoBannerContent: {
    flex: 1,
  },
  promoBannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
  },
  promoIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 1,
  },
  promoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  promoIconText: {
    width: 60,
    fontSize: 16,
    fontWeight: '900',
    color: '#D946EF',
    textAlign: 'center',
  },
  promoTextContainer: {
    flex: 1,
    gap: 4,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  promoDesc: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: '600',
  },
  line: {
    height: 1,
    backgroundColor: '#000',
  },
});
