import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Image } from 'react-native';
import { CaretRight, ChartLineUp } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export const AdsHomeContent = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Create a new Ad</ThemedText>
        
        <Pressable 
          style={({ pressed }) => [
            styles.adsPromoCard, 
            { backgroundColor: theme.surface, borderColor: theme.border + '20', opacity: pressed ? 0.9 : 1 }
          ]}
          onPress={() => router.push('/ads/create-ad')}
        >
          <View style={[styles.badge, { backgroundColor: '#F0E7FF' }]}>
            <ThemedText style={{ color: '#7C3AED', fontSize: 10, fontWeight: '900' }}>✦ Optimised for you ✦</ThemedText>
          </View>
          
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrapper}>
              <ChartLineUp size={32} color={theme.primary} weight="bold" />
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Fudode Ads</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Get unlimited clicks and impressions!
              </ThemedText>
            </View>
            <CaretRight size={24} color={theme.textSecondary} />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Learn about Ads</ThemedText>
        <View style={[styles.videoPlaceholder, { backgroundColor: '#FF4D4D' }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' }}
            style={styles.videoImage}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <View style={styles.playIcon} />
          </View>
          
          {/* Mock Overlays like in screenshot */}
          <View style={styles.searchMock}>
             <ThemedText style={styles.mockSearchText}>Pizza</ThemedText>
          </View>
          
          <View style={styles.adResultMock}>
             <ThemedText style={styles.adBadge}>Ad</ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  adsPromoCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  cardIconWrapper: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  videoPlaceholder: {
    width: '100%',
    height: 500,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#FFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 6,
  },
  searchMock: {
    position: 'absolute',
    top: 40,
    left: 40,
    right: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  mockSearchText: {
    color: '#000',
    fontWeight: '700',
  },
  adResultMock: {
    position: 'absolute',
    bottom: 120,
    left: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adBadge: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
