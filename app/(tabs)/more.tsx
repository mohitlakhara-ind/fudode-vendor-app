import { ExploreGrid } from '@/components/more/ExploreGrid';
import { ProfileModal } from '@/components/more/ProfileModal';
import { RushKitchenModal } from '@/components/more/RushKitchenModal';
import { TimeOffReasonModal } from '@/components/more/TimeOffReasonModal';
import { LogoutConfirmationModal } from '@/components/more/LogoutConfirmationModal';
import { LanguageSelectionSheet, FeedbackSheet } from '@/components/help/HelpBottomSheets';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import { logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Monitor,
  Moon,
  Sun,
  CaretRight,
  Gear,
  SignOut
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { GlobalRestaurantHeader } from '@/components/common/GlobalRestaurantHeader';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { AnimatedPage } from '@/components/ui/AnimatedPage';

export default function MoreScreen() {
  const { colorScheme, themeMode, setThemeMode } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { status: restaurantStatus } = useAppSelector((state: RootState) => state.restaurant);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [profileVisible, setProfileVisible] = useState(false);
  const [timeOffVisible, setTimeOffVisible] = useState(false);
  const [rushVisible, setRushVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const { queue } = useAppSelector((state: RootState) => state.order);

  const userData = {
    name: restaurantStatus?.profileData?.name || 'Partner Name',
    phone: restaurantStatus?.phone || 'Loading...',
    email: restaurantStatus?.profileData?.email || 'email@example.com',
    role: 'OWNER',
    avatar: restaurantStatus?.profileData?.avatarUrl || null,
    verificationStatus: restaurantStatus?.profileData?.verificationStatus || 'PENDING'
  };

  const handleItemPress = (action?: string) => {
    if (action === 'time-off') {
      setTimeOffVisible(true);
    } else if (action === 'rush') {
      setRushVisible(true);
    } else if (action === 'help') {
      router.push('/help');
    } else if (action === 'order-history') {
      router.push('/orders/history');
    } else if (action === 'communications') {
      router.push('/communications');
    } else if (action === 'settings') {
      router.push('/settings');
    } else if (action === 'invite-user') {
      router.push('/invite-user');
    } else if (action === 'security') {
      router.push('/sessions');
    } else if (action === 'timings') {
      router.push('/outlet-timings');
    } else if (action === 'contact-details') {
      router.push('/contact-details');
    } else if (action === 'outlet-info') {
      router.push('/outlet-info');
    } else if (action === 'troubleshoot') {
      router.push('/help/troubleshoot');
    } else if (action === 'notifications') {
      router.push('/notifications');
    } else if (action === 'payout') {
      router.push('/finance/payouts');
    } else if (action === 'bank') {
      router.push('/finance/bank-details');
    } else if (action === 'taxes') {
      router.push('/finance/tax-settings');
    } else if (action === 'language') {
      setLanguageVisible(true);
    } else if (action === 'feedback') {
      setFeedbackVisible(true);
    } else if (action === 'call') {
      Linking.openURL('tel:9376273686');
    } else if (action === 'complaints') {
      router.push('/reviews');
    }
  };

  const ThemeOption = ({ mode, label, icon: Icon }: any) => {
    const isActive = themeMode === mode;
    return (
      <Pressable
        onPress={() => setThemeMode(mode)}
        style={[
          styles.themeOption,
          {
            backgroundColor: isActive ? theme.primary + '15' : theme.surface,
            borderColor: isActive ? theme.primary : theme.border,
          }
        ]}
      >
        <Icon size={20} color={isActive ? theme.primary : theme.textSecondary} weight="bold" />
        <Text style={[styles.themeLabel, { color: isActive ? theme.primary : theme.textSecondary, fontFamily: isActive ? Fonts.inter.semibold : Fonts.inter.regular }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <AnimatedPage style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <GlobalRestaurantHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: queue.length > 0 ? 240 : 120 }]}>

        {/* Profile Card Header */}
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Settings & Profile</Text>
                <Pressable onPress={() => handleItemPress('settings')} style={[styles.settingsBtn, { backgroundColor: theme.surface }]}>
                    <Gear size={22} color={theme.text} weight="bold" />
                </Pressable>
            </View>

            <Pressable 
                onPress={() => setProfileVisible(true)}
                style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
                <Image
                    source={userData.avatar ? { uri: userData.avatar } : require('@/assets/images/icon.png')}
                    style={[styles.profilePic, { borderColor: theme.primary + '20' }]}
                />
                <View style={styles.profileInfo}>
                    <Text style={[styles.userName, { color: theme.text }]}>{userData.name}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={[styles.roleText, { color: theme.primary }]}>{userData.role}</Text>
                        <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                        <Text style={[styles.userId, { color: theme.textSecondary }]}>{userData.verificationStatus}</Text>
                    </View>
                </View>
                <CaretRight size={18} color={theme.textSecondary} weight="bold" />
            </Pressable>
        </View>

        <ExploreGrid onItemPress={handleItemPress} />

        {/* Theme Settings Section */}
        <View style={styles.themeSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
          <View style={styles.themeRow}>
            <ThemeOption mode="light" label="Light" icon={Sun} />
            <ThemeOption mode="dark" label="Dark" icon={Moon} />
            <ThemeOption mode="system" label="System" icon={Monitor} />
          </View>
        </View>

        <View style={styles.logoutSection}>
          <PremiumButton
            label="Logout"
            onPress={() => setLogoutVisible(true)}
            variant="glassy"
            color={theme.error}
            leftIcon={<SignOut size={20} color={theme.error} weight="bold" />}
            style={styles.logoutBtn}
          />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Logged in as {userData.email}</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        userData={userData}
      />

      <TimeOffReasonModal
        visible={timeOffVisible}
        onClose={() => setTimeOffVisible(false)}
        onContinue={(reason) => {
          console.log('Selected reason:', reason);
          setTimeOffVisible(false);
        }}
      />

      <RushKitchenModal
        visible={rushVisible}
        onClose={() => setRushVisible(false)}
        onConfirm={(mins) => {
          console.log('Rush confirmed for:', mins);
          setRushVisible(false);
        }}
      />

      <LogoutConfirmationModal
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={() => {
          console.log('Logging out...');
          setLogoutVisible(false);
          dispatch(logout());
          router.replace('/(auth)/login');
        }}
      />

      <LanguageSelectionSheet
        visible={languageVisible}
        onClose={() => setLanguageVisible(false)}
        onFinish={(lang: string) => {
          console.log('Language selected:', lang);
          setLanguageVisible(false);
        }}
      />

      <FeedbackSheet
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        onFinish={(feedback: string) => {
          console.log('Feedback submitted:', feedback);
          setFeedbackVisible(false);
        }}
      />
    </AnimatedPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.Display,
    fontSize: 24,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1.5,
    gap: 16,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    backgroundColor: '#333',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    ...Typography.H2,
    fontSize: 18,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleText: {
    ...Typography.Caption,
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.3,
  },
  userId: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '600',
  },
  themeSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 16,
    textTransform: 'uppercase',
    opacity: 0.6,
    paddingLeft: 4,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  themeLabel: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '700',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  logoutBtn: {
    width: '100%',
  },
  footerText: {
    ...Typography.Caption,
    opacity: 0.5,
  },
});
