import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Platform,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CaretLeft,
  ShareNetwork,
  PencilSimple,
  Camera,
  Star,
  MapPin,
  Microphone,
  Clock,
  Phone,
  Storefront,
  CaretRight,
  ArrowSquareOut,
  MagnifyingGlass,
  X,
} from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';

const SECTION_SPACING = 24;

const InfoCard = ({ label, value, icon: Icon, onEdit, isAddress }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { borderColor: theme.border + '15', backgroundColor: theme.surface }]}>
      <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.cardContent}>
        <View style={styles.cardValueRow}>
          {Icon && <Icon size={20} color={isAddress ? '#EA4335' : theme.textSecondary} weight={isAddress ? "fill" : "regular"} style={{ marginTop: 2 }} />}
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardValue, { color: theme.text }]}>{value}</Text>
            {isAddress && (
              <Pressable>
                <Text style={[styles.subLink, { color: theme.info }]}>View on map</Text>
              </Pressable>
            )}
          </View>
          <Pressable onPress={onEdit}>
            <Text style={[styles.editLink, { color: theme.info }]}>edit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default function OutletInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('muggs');

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Check out Muggs Cafe on Fudode!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Outlet info</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.resId, { color: theme.textSecondary }]}>Res id: 20202954</Text>
          <Pressable onPress={onShare} style={styles.shareBtn}>
            <ShareNetwork size={24} color={theme.text} weight="bold" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Banner Section */}
        <View style={styles.bannerWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <Pressable 
            onPress={() => setReplaceModalVisible(true)}
            style={[styles.replaceBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
          >
            <PencilSimple size={16} color="#FFF" weight="bold" />
            <Text style={styles.replaceText}>Replace image</Text>
          </Pressable>

          <Pressable style={[styles.cameraIconOverlay, { backgroundColor: theme.surfaceSecondary }]}>
            <Camera size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.contentPadding}>
          <Pressable style={styles.addPhotoLink}>
            <Text style={[styles.addPhotoText, { color: theme.info }]}>Add photo</Text>
          </Pressable>

          {/* Ratings */}
          <View style={styles.ratingsRow}>
            <View style={[styles.ratingBadge, { backgroundColor: '#267E3E' }]}>
              <Text style={styles.ratingText}>3.7 ★</Text>
            </View>
            <Text style={[styles.ratingLabel, { color: theme.text }]}>245 DELIVERY REVIEWS</Text>
            <CaretRight size={14} color={theme.text} weight="bold" />
          </View>

          <View style={styles.ratingsRow}>
            <View style={[styles.ratingBadge, { backgroundColor: '#267E3E' }]}>
              <Text style={styles.ratingText}>3.3 ★</Text>
            </View>
            <Text style={[styles.ratingLabel, { color: theme.text }]}>4 DINING REVIEWS</Text>
            <CaretRight size={14} color={theme.text} weight="bold" />
          </View>

          <View style={[styles.sectionDivider, { backgroundColor: theme.border + '15' }]} />
          
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Restaurant information</Text>

          {/* Info Cards */}
          <InfoCard 
            label="Restaurant's name"
            value="Muggs Cafe"
            onEdit={() => {}}
          />

          <InfoCard 
            label="Cuisine tags"
            value="Cafe, Pizza, Sandwich, Fast Food, Chinese, Beverages, Desserts, Coffee"
            onEdit={() => {}}
          />

          <InfoCard 
            label="Address"
            value="Nayapura Balotra, Teh Pachpadra, Balotra Locality, Bal..."
            icon={MapPin}
            isAddress
            onEdit={() => {}}
          />

          <View style={[styles.card, { borderColor: theme.border + '15', backgroundColor: theme.surface }]}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Pickup instructions</Text>
            <Text style={[styles.cardValue, { color: theme.text, fontSize: 15, marginTop: 4 }]}>
              Helps our delivery partner reach your outlet faster
            </Text>
            <Pressable style={styles.recordRow}>
              <Microphone size={18} color={theme.info} weight="fill" />
              <Text style={[styles.recordLink, { color: theme.info }]}>Tap here to record instructions</Text>
            </Pressable>
          </View>

          {/* Bottom Nav Links */}
          <View style={styles.bottomLinks}>
            <Pressable 
              onPress={() => router.push('/outlet-timings')}
              style={[styles.navLink, { borderBottomColor: theme.border + '10' }]}
            >
              <View style={styles.navLinkLeft}>
                <Clock size={22} color={theme.info} weight="regular" />
                <Text style={[styles.navLinkLabel, { color: theme.text }]}>Outlet timings</Text>
              </View>
              <CaretRight size={18} color={theme.textSecondary} />
            </Pressable>

            <Pressable 
              onPress={() => router.push('/contact-details')}
              style={[styles.navLink, { borderBottomColor: theme.border + '10' }]}
            >
              <View style={styles.navLinkLeft}>
                <Phone size={22} color={theme.info} weight="regular" />
                <Text style={[styles.navLinkLabel, { color: theme.text }]}>Contact details</Text>
              </View>
              <CaretRight size={18} color={theme.textSecondary} />
            </Pressable>

            <Pressable style={styles.navLink}>
              <View style={styles.navLinkLeft}>
                <Storefront size={22} color={theme.info} weight="regular" />
                <Text style={[styles.navLinkLabel, { color: theme.text }]}>View on Fudode</Text>
              </View>
              <ArrowSquareOut size={18} color={theme.info} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Profile Picture Modal */}
      <ModalWrapper
        visible={replaceModalVisible}
        onClose={() => setReplaceModalVisible(false)}
        title="Open profile picture for"
        footer={
          <Pressable 
            onPress={() => setReplaceModalVisible(false)}
            style={[styles.proceedBtn, { backgroundColor: theme.text }]}
          >
            <Text style={[styles.proceedText, { color: theme.background }]}>Proceed</Text>
          </Pressable>
        }
      >
        <View style={styles.modalContent}>
          <View style={[styles.searchContainer, { backgroundColor: theme.surfaceSecondary }]}>
            <MagnifyingGlass size={20} color={theme.textSecondary} />
            <TextInput 
              placeholder="Search outlet name or ID"
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          <Pressable 
            onPress={() => setSelectedOutlet('muggs')}
            style={styles.outletItem}
          >
            <View>
              <Text style={[styles.outletName, { color: theme.text }]}>Muggs Cafe</Text>
              <Text style={[styles.outletSub, { color: theme.textSecondary }]}>Balotra Locality, Balotra</Text>
              <Text style={[styles.outletSub, { color: theme.textSecondary }]}>ID: 20202954</Text>
            </View>
            <RadioButton 
              selected={selectedOutlet === 'muggs'} 
              onPress={() => setSelectedOutlet('muggs')} 
              activeColor={theme.info}
            />
          </Pressable>
        </View>
      </ModalWrapper>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.H1,
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resId: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
  },
  shareBtn: {
    padding: 4,
  },
  bannerWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  replaceBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  replaceText: {
    color: '#FFF',
    ...Typography.Caption,
    fontWeight: '700',
    fontSize: 13,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  addPhotoLink: {
    marginBottom: 20,
  },
  addPhotoText: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '600',
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  ratingLabel: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 0.5,
    flex: 1,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    marginVertical: 24,
  },
  sectionHeader: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardContent: {
    marginTop: 2,
  },
  cardValueRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  cardValue: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  subLink: {
    ...Typography.Caption,
    marginTop: 4,
    fontWeight: '700',
  },
  editLink: {
    ...Typography.Caption,
    fontWeight: '700',
    paddingLeft: 8,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  recordLink: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '700',
  },
  bottomLinks: {
    marginTop: 12,
    gap: 4,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  navLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navLinkLabel: {
    ...Typography.H2,
    fontSize: 17,
    fontWeight: '600',
  },
  modalContent: {
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 10,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    ...Typography.BodyRegular,
  },
  outletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  outletName: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  outletSub: {
    ...Typography.Caption,
    fontSize: 14,
  },
  proceedBtn: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  proceedText: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '800',
  },
});
