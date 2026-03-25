import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getMyRestaurants, getOwnerProfile } from '@/store/slices/profileSlice';
import { updateScope } from '@/store/slices/authSlice';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { House, Plus, Storefront, UserCircle, CaretRight, SignOut } from 'phosphor-react-native';
import { logout } from '@/store/slices/authSlice';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const dispatch = useDispatch<AppDispatch>();
  
  const { restaurants, ownerProfile, loading: profileLoading } = useSelector((state: RootState) => state.profile);
  const { loading: authLoading, deviceId, refreshToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getMyRestaurants());
    dispatch(getOwnerProfile());
  }, []);

  const handleSelectRestaurant = async (restaurantId: string) => {
    if (!deviceId || !refreshToken) return;
    const result = await dispatch(updateScope({ restaurantId, deviceId, refreshToken }));
    if (updateScope.fulfilled.match(result)) {
      router.replace('/(tabs)');
    }
  };

  const handleRegisterNew = () => {
    if (!ownerProfile || ownerProfile.status !== 'COMPLETED') {
      router.push('/(auth)/owner-profile');
    } else {
      router.push('/(auth)/kyc');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  if (profileLoading || authLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <SignOut size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {restaurants.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.icon }]}>YOUR RESTAURANTS</Text>
            {restaurants.map((item) => (
              <TouchableOpacity
                key={item.scopeId}
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => handleSelectRestaurant(item.restaurant.id)}
              >
                <View style={[styles.iconBox, { backgroundColor: theme.primary + '10' }]}>
                  <Storefront size={24} color={theme.primary} weight="duotone" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{item.restaurant.name}</Text>
                  <Text style={[styles.cardSub, { color: theme.icon }]}>{item.role.toLowerCase()}</Text>
                </View>
                <CaretRight size={20} color={theme.icon} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.icon }]}>GET STARTED</Text>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.primary }]}
            onPress={handleRegisterNew}
          >
            <View style={styles.actionIcon}>
              <Plus size={24} color="#FFF" weight="bold" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.actionTitle}>Add Your Own Restaurant</Text>
              <Text style={styles.actionSub}>Setup your business and start selling</Text>
            </View>
            <CaretRight size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <UserCircle size={20} color={theme.icon} />
          <Text style={[styles.infoText, { color: theme.icon }]}>
            {ownerProfile?.status === 'COMPLETED' 
              ? 'Owner Profile: Verified' 
              : 'Owner Profile: Pending setup'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  actionIcon: {
    width: 48,
    paddingRight: 16,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    opacity: 0.6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
