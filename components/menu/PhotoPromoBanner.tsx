import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Plus } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

export const PhotoPromoBanner = () => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const router = useRouter();

  const handlePress = () => {
    router.push('/menu/add-item');
  };

  return (
    <View style={[styles.promoBanner, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30', borderWidth: 1 }]}>
      <View style={styles.promoContent}>
        <ThemedText style={[styles.promoTitle, { color: theme.text }]}>Menu-ready photos in seconds</ThemedText>
        <ThemedText style={[styles.promoSubtitle, { color: theme.textSecondary }]}>
          Click a photo of a prepared dish and enhance while you add it to menu
        </ThemedText>
        <Pressable 
          style={[styles.learnMoreBtn, { backgroundColor: theme.primary }]}
          onPress={handlePress}
        >
          <Plus size={16} color={theme.background} weight="bold" />
          <ThemedText style={[styles.learnMoreText, { color: theme.background }]}>Add Item</ThemedText>
        </Pressable>
      </View>
      <View style={styles.promoImageWrapper}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' }}
          style={styles.promoImage}
        />
        <View style={styles.promoTimerBadge}>
          <ThemedText style={styles.promoTimerText}>Just 30</ThemedText>
          <ThemedText style={styles.promoTimerText}>seconds</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promoBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    paddingRight: 12,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  promoImageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    transform: [{ rotate: '15deg' }],
  },
  promoTimerBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  promoTimerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
    lineHeight: 10,
  },
});
