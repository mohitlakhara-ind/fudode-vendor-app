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
import { Colors, Fonts, Typography } from '@/constants/theme';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';
import { ThemedText } from '@/components/themed-text';
import { EditOutletSheet } from '@/components/outlet/EditOutletSheet';
import { PremiumButton } from '@/components/ui/PremiumButton';

const SECTION_SPACING = 24;

const InfoCard = ({ label, value, icon: Icon, onEdit, isAddress }: any) => {
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary + '10' }]}>
      <ThemedText style={[styles.cardLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
      <View style={styles.cardContent}>
        <View style={styles.cardValueRow}>
          {Icon && <Icon size={20} color={isAddress ? theme.primary : theme.textSecondary} weight={isAddress ? "fill" : "regular"} style={{ marginTop: 2 }} />}
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.cardValue, { color: theme.text }]}>{value}</ThemedText>
            {isAddress && (
              <Pressable>
                <ThemedText style={[styles.subLink, { color: theme.primary }]}>View on map</ThemedText>
              </Pressable>
            )}
          </View>
          <Pressable onPress={onEdit}>
            <ThemedText style={[styles.editLink, { color: theme.primary }]}>edit</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default function OutletInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];

  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('muggs');
  const [outletName, setOutletName] = useState('Muggs Cafe');
  const [cuisineTags, setCuisineTags] = useState('Cafe, Pizza, Sandwich, Fast Food, Chinese, Beverages, Desserts, Coffee');
  const [outletAddress, setOutletAddress] = useState('Near New Bus Stand, Balotra Locality, Balotra, Rajasthan 344022');

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
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft size={28} color={theme.text} weight="bold" />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.rounded }]}>Outlet info</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <ThemedText style={[styles.resId, { color: theme.textSecondary }]}>Res id: 20202954</ThemedText>
          <Pressable 
            onPress={onShare} 
            style={[styles.shareBtn, { backgroundColor: theme.surfaceSecondary + '50' }]}
          >
            <ShareNetwork size={22} color={theme.text} weight="bold" />
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
            source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)' }]} />
          <Pressable 
            onPress={() => setReplaceModalVisible(true)}
            style={[styles.replaceBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.5)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', borderWidth: 1 }]}
          >
            <PencilSimple size={16} color="#FFF" weight="bold" />
            <Text style={[styles.replaceText, { color: '#FFF' }]}>Replace image</Text>
          </Pressable>

          <Pressable style={[styles.cameraIconOverlay, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border, shadowColor: isDark ? '#000' : theme.textSecondary }]}>
            <Camera size={24} color={theme.text} weight="bold" />
          </Pressable>
        </View>

        <View style={styles.contentPadding}>
          <Pressable style={styles.addPhotoLink}>
            <ThemedText style={[styles.addPhotoText, { color: theme.primary }]}>Add photo</ThemedText>
          </Pressable>
 
          {/* Ratings */}
          <View style={styles.ratingsRow}>
            <View style={[styles.ratingBadge, { backgroundColor: theme.success }]}>
              <ThemedText style={styles.ratingText}>3.7 ★</ThemedText>
            </View>
            <ThemedText style={[styles.ratingLabel, { color: theme.text }]}>245 DELIVERY REVIEWS</ThemedText>
            <CaretRight size={14} color={theme.text} weight="bold" />
          </View>
 
          <View style={styles.ratingsRow}>
            <View style={[styles.ratingBadge, { backgroundColor: theme.success }]}>
              <ThemedText style={styles.ratingText}>3.3 ★</ThemedText>
            </View>
            <ThemedText style={[styles.ratingLabel, { color: theme.text }]}>4 DINING REVIEWS</ThemedText>
            <CaretRight size={14} color={theme.text} weight="bold" />
          </View>
 
          <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />
          
          <ThemedText style={[styles.sectionHeader, { color: theme.textSecondary }]}>Restaurant information</ThemedText>
 
          {/* Info Cards */}
          <InfoCard 
            label="Restaurant's name"
            value={outletName}
            onEdit={() => setEditSheetVisible(true)}
          />
 
          <InfoCard 
            label="Cuisine tags"
            value={cuisineTags}
            onEdit={() => setEditSheetVisible(true)}
          />
 
          <InfoCard 
            label="Address"
            value={outletAddress}
            icon={MapPin}
            isAddress
            onEdit={() => setEditSheetVisible(true)}
          />
 
          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary + '10' }]}>
            <ThemedText style={[styles.cardLabel, { color: theme.textSecondary }]}>Pickup instructions</ThemedText>
            <ThemedText style={[styles.cardValue, { color: theme.text, fontSize: 15, marginTop: 4 }]}>
              Helps our delivery partner reach your outlet faster
            </ThemedText>
            <Pressable style={styles.recordRow}>
              <Microphone size={18} color={theme.primary} weight="fill" />
              <ThemedText style={[styles.recordLink, { color: theme.primary }]}>Tap here to record instructions</ThemedText>
            </Pressable>
          </View>

          {/* Bottom Nav Links */}
          <View style={styles.bottomLinks}>
            <Pressable 
              onPress={() => router.push('/outlet-timings')}
              style={[styles.navLink, { borderBottomColor: theme.border }]}
            >
              <View style={styles.navLinkLeft}>
                <Clock size={22} color={theme.primary} weight="regular" />
                <ThemedText style={[styles.navLinkLabel, { color: theme.text }]}>Outlet timings</ThemedText>
              </View>
              <CaretRight size={18} color={theme.textSecondary} />
            </Pressable>
 
            <Pressable 
              onPress={() => router.push('/contact-details')}
              style={[styles.navLink, { borderBottomColor: theme.border }]}
            >
              <View style={styles.navLinkLeft}>
                <Phone size={22} color={theme.primary} weight="regular" />
                <ThemedText style={[styles.navLinkLabel, { color: theme.text }]}>Contact details</ThemedText>
              </View>
              <CaretRight size={18} color={theme.textSecondary} />
            </Pressable>
 
            <Pressable style={styles.navLink}>
              <View style={styles.navLinkLeft}>
                <Storefront size={22} color={theme.primary} weight="regular" />
                <ThemedText style={[styles.navLinkLabel, { color: theme.text }]}>View on Fudode</ThemedText>
              </View>
              <ArrowSquareOut size={18} color={theme.primary} />
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
          <PremiumButton
            label="Proceed"
            onPress={() => setReplaceModalVisible(false)}
            variant="primary"
            style={styles.proceedBtn}
          />
        }
      >
        <View style={styles.modalContent}>
          <View style={[styles.searchContainer, { backgroundColor: theme.surfaceSecondary + '30', borderColor: theme.border, borderWidth: 1 }]}>
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
              <ThemedText style={[styles.outletName, { color: theme.text }]}>Muggs Cafe</ThemedText>
              <ThemedText style={[styles.outletSub, { color: theme.textSecondary }]}>Balotra Locality, Balotra</ThemedText>
              <ThemedText style={[styles.outletSub, { color: theme.textSecondary }]}>ID: 20202954</ThemedText>
            </View>
            <RadioButton 
              selected={selectedOutlet === 'muggs'} 
              onPress={() => setSelectedOutlet('muggs')} 
              activeColor={theme.primary}
            />
          </Pressable>
        </View>
      </ModalWrapper>

      <EditOutletSheet
        visible={editSheetVisible}
        onClose={() => setEditSheetVisible(false)}
        initialName={outletName}
        initialCuisines={cuisineTags}
        initialAddress={outletAddress}
        onSave={(name, cuisines, address) => {
          setOutletName(name);
          setCuisineTags(cuisines);
          setOutletAddress(address);
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
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
    fontSize: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resId: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '700',
  },
  shareBtn: {
    padding: 10,
    borderRadius: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  replaceText: {
    color: '#FFF',
    ...Typography.Caption,
    fontWeight: '800',
    fontSize: 13,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addPhotoLink: {
    marginBottom: 24,
  },
  addPhotoText: {
    ...Typography.H3,
    fontSize: 16,
    fontWeight: '700',
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  ratingLabel: {
    ...Typography.Caption,
    fontWeight: '800',
    letterSpacing: 1,
    flex: 1,
    fontSize: 11,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    marginVertical: 28,
  },
  sectionHeader: {
    ...Typography.Caption,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
    fontSize: 12,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    ...Typography.Caption,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  subLink: {
    ...Typography.Caption,
    marginTop: 6,
    fontWeight: '800',
    fontSize: 13,
  },
  editLink: {
    ...Typography.Caption,
    fontWeight: '800',
    paddingLeft: 12,
    fontSize: 13,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  recordLink: {
    ...Typography.H3,
    fontSize: 15,
    fontWeight: '800',
  },
  bottomLinks: {
    marginTop: 16,
    gap: 0,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
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
    fontWeight: '700',
  },
  modalContent: {
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    ...Typography.BodyRegular,
    fontWeight: '600',
  },
  outletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  outletName: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  outletSub: {
    ...Typography.Caption,
    fontSize: 14,
    fontWeight: '600',
  },
  proceedBtn: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  proceedText: {
    ...Typography.H2,
    fontSize: 18,
    fontWeight: '900',
  },
});
