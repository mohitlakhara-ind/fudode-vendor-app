import React, { useState } from 'react';
import { StyleSheet, View, Pressable, StatusBar, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Question, SlidersHorizontal } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { AdsHomeContent } from '@/components/ads/AdsHomeContent';
import { AdCampaignCard } from '@/components/ads/AdCampaignCard';
import { AdsFilterSheet } from '@/components/ads/AdsFilterSheet';

const ID_SELECTOR_TEXT = "ID: 20202954, Muggs Cafe, Balot...";

export default function AdsScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Campaigns'>('Home');
  const [activeStatus, setActiveStatus] = useState('All');
  const [filterVisible, setFilterVisible] = useState(false);

  const statusOptions = ['All', 'Active', 'Paused', 'Completed', 'Scheduled'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Ads</ThemedText>
          <Pressable style={[styles.helpBtn, { borderColor: theme.primary }]}>
            <ThemedText style={[styles.helpText, { color: theme.primary }]}>Help</ThemedText>
          </Pressable>
        </View>

        <View style={styles.tabWrapper}>
          <Pressable 
            onPress={() => setActiveTab('Home')}
            style={[styles.tab, activeTab === 'Home' && { borderBottomColor: theme.primary }]}
          >
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'Home' ? theme.primary : theme.textSecondary }]}>
              Ads Home
            </ThemedText>
          </Pressable>
          <Pressable 
            onPress={() => setActiveTab('Campaigns')}
            style={[styles.tab, activeTab === 'Campaigns' && { borderBottomColor: theme.primary }]}
          >
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'Campaigns' ? theme.primary : theme.textSecondary }]}>
              All Campaigns
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {activeTab === 'Home' ? (
        <AdsHomeContent />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.campaignListHeader}>
            {/* ID Selector Card */}
            <View style={styles.topRow}>
              <View style={[styles.idCard, { backgroundColor: theme.surface, borderColor: theme.border + '20' }]}>
                <View style={styles.idLeft}>
                  <SlidersHorizontal size={24} color={theme.primary} />
                  <ThemedText style={[styles.idText, { color: theme.text }]} numberOfLines={1}>
                    {ID_SELECTOR_TEXT}
                  </ThemedText>
                </View>
                <Pressable onPress={() => setFilterVisible(true)}>
                  <ThemedText style={[styles.changeText, { color: theme.primary }]}>Change</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Status Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusPills}>
              {statusOptions.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setActiveStatus(status)}
                  style={[
                    styles.statusPill,
                    { backgroundColor: theme.surface, borderColor: theme.border + '20' },
                    activeStatus === status && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                >
                  <ThemedText style={[
                    styles.statusPillText, 
                    { color: theme.text },
                    activeStatus === status && { color: '#FFF' }
                  ]}>
                    {status}{status === 'All' ? ' (2)' : status === 'Scheduled' ? ' (0)' : ''}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.campaignScroll}>
            <AdCampaignCard status="Cancelled" />
            <AdCampaignCard status="Completed" />
          </ScrollView>
        </View>
      )}

      <AdsFilterSheet 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.5,
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
  tabWrapper: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  campaignListHeader: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  topRow: {
    marginBottom: 0,
  },
  idCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  idLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  idText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    flex: 1,
  },
  changeText: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 22,
    paddingLeft: 8,
  },
  statusPills: {
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  campaignScroll: {
    padding: 16,
    paddingBottom: 40,
  },
});
