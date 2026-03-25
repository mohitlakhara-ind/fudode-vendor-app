import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { 
  MagnifyingGlass, 
  CaretLeft,
  Moon,
  Sun,
  Monitor
} from 'phosphor-react-native';
import { ExploreGrid } from '@/components/more/ExploreGrid';
import { ProfileModal } from '@/components/more/ProfileModal';
import { TimeOffReasonModal } from '@/components/more/TimeOffReasonModal';
import { RushKitchenModal } from '@/components/more/RushKitchenModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const { colorScheme, themeMode, setThemeMode } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [profileVisible, setProfileVisible] = useState(false);
  const [timeOffVisible, setTimeOffVisible] = useState(false);
  const [rushVisible, setRushVisible] = useState(false);

  const mockUserData = {
    name: 'Sunil Lalwani',
    phone: '9376273686',
    email: 'lsunil96@gmail.com',
    role: 'OWNER',
    avatar: null,
  };

  const handleItemPress = (action?: string) => {
    console.log('Action pressed:', action);
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
            backgroundColor: isActive ? theme.primary + '15' : theme.surfaceSecondary + '50',
            borderColor: isActive ? theme.primary : 'transparent',
            borderWidth: 1.5,
          }
        ]}
      >
        <Icon size={20} color={isActive ? theme.primary : theme.textSecondary} weight={isActive ? 'bold' : 'regular'} />
        <Text style={[styles.themeLabel, { color: isActive ? theme.primary : theme.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Explore</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Pressable style={[styles.headerIcon, { backgroundColor: theme.surface }]}>
            <MagnifyingGlass size={22} color={theme.text} />
          </Pressable>
          <Pressable onPress={() => setProfileVisible(true)} style={styles.profileWrapper}>
            <Image 
              source={require('@/assets/images/react-logo.png')}
              style={[styles.profilePic, { borderColor: theme.primary, borderWidth: 2 }]} 
            />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ExploreGrid onItemPress={handleItemPress} />

        {/* Theme Settings Section */}
        <View style={styles.themeSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APP APPEARANCE</Text>
          <View style={styles.themeRow}>
            <ThemeOption mode="light" label="Light" icon={Sun} />
            <ThemeOption mode="dark" label="Dark" icon={Moon} />
            <ThemeOption mode="system" label="System" icon={Monitor} />
          </View>
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      <ProfileModal 
        visible={profileVisible} 
        onClose={() => setProfileVisible(false)} 
        userData={mockUserData}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.Display,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileWrapper: {
    padding: 2,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
  },
  themeSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 16,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  themeLabel: {
    ...Typography.H3,
    fontSize: 13,
  },
});
