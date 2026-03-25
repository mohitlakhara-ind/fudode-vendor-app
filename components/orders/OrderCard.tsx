import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Fonts, StatusColors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  ArrowRight,
  CaretDown,
  CaretUp,
  ChatText,
  CheckCircle,
  Clock,
  Motorcycle,
  Ticket,
  Timer
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Addon {
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  addons?: Addon[];
}

interface OrderCardProps {
  id: string;
  status: string;
  customerName: string;
  items: OrderItem[];
  subtotal: string;
  taxes: string;
  packagingCharge?: string;
  total: string;
  time: string;
  paymentMethod?: 'UPI' | 'Card' | 'Cash';
  specialInstructions?: string;
  offer?: {
    title: string;
    subtitle: string;
    coupon: string;
    discount: string;
  };
  deliveryBoy?: {
    name: string;
    phone: string;
    comingIn: string;
  };
  estimatedReadyTime?: number; // Timestamp
  createdAt?: number; // Added
  onUpdateStatus?: (id: string, status: string) => void; // Added
}

const BillDetails = ({ subtotal, taxes, packagingCharge, theme }: any) => (
  <View style={[styles.billContainer, { borderTopColor: theme.border }]}>
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, { color: theme.textSecondary }]}>Subtotal</Text>
      <Text style={[styles.billValue, { color: theme.text }]}>₹{subtotal}</Text>
    </View>
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, { color: theme.textSecondary }]}>Taxes</Text>
      <Text style={[styles.billValue, { color: theme.text }]}>₹{taxes}</Text>
    </View>
    {packagingCharge && (
      <View style={styles.billRow}>
        <Text style={[styles.billLabel, { color: theme.textSecondary }]}>Packaging</Text>
        <Text style={[styles.billValue, { color: theme.text }]}>₹{packagingCharge}</Text>
      </View>
    )}
  </View>
);

export const OrderCardContent = ({
  id,
  status,
  items,
  total,
  subtotal,
  taxes,
  packagingCharge,
  time,
  customerName,
  specialInstructions,
  offer,
  deliveryBoy,
  estimatedReadyTime,
  createdAt,
  onUpdateStatus,
  hideActions = false,
  hideHeader = false
}: OrderCardProps & { hideActions?: boolean; hideHeader?: boolean }) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  React.useEffect(() => {
    const updateTimer = () => {
      const isPreparing = status === 'Preparing' || status === 'Delayed';
      if (!isPreparing || !estimatedReadyTime || !createdAt) {
        setTimeLeft('');
        setProgress(0);
        return;
      }

      const totalDuration = Math.max(1, estimatedReadyTime - createdAt);
      const now = Date.now();
      const elapsed = Math.max(0, now - createdAt);

      // Add a small initial progress (2%) if preparation has started
      const rawProgress = elapsed / totalDuration;
      const currentProgress = Math.min(1.1, Math.max(rawProgress > 0 ? 0.02 : 0, rawProgress));
      setProgress(currentProgress);

      const diff = Math.max(0, estimatedReadyTime - now);
      if (diff === 0) {
        setTimeLeft('Delayed');
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Updated to 1s
    return () => clearInterval(interval);
  }, [status, createdAt, estimatedReadyTime]);

  const getProgressColor = (p: number) => {
    // Lighter Shades: Pastels
    // Green (#6EE7B7) -> Yellow (#FDE047) -> Red (#FCA5A5)
    if (p <= 0.5) {
      // Interpolate Green to Yellow
      const ratio = p * 2;
      return interpolateRgb('#6EE7B7', '#FDE047', ratio);
    } else {
      // Interpolate Yellow to Red
      const ratio = Math.min(1, (p - 0.5) * 2);
      return interpolateRgb('#FDE047', '#FCA5A5', ratio);
    }
  };

  const interpolateRgb = (color1: string, color2: string, ratio: number) => {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const statusColor = StatusColors[status as keyof typeof StatusColors] || theme.primary;
  const isAccepted = status !== 'New' && status !== 'Cancelled' && status !== 'Completed';

  // For the Mark as Ready button, use dynamic color based on progress
  const fillingColor = (status === 'Preparing' || status === 'Delayed')
    ? getProgressColor(progress)
    : StatusColors.Ready;

  const isDelayed = progress >= 1;

  return (
    <View>
      {/* SECTION 1: Header - ID and Status */}
      {!hideHeader && (
        <View style={styles.headerRow}>
          <View style={styles.idContainer}>
            <Text style={[styles.hashColor, { color: statusColor }]}>#</Text>
            <Text style={[styles.orderId, { color: theme.text, fontFamily: Fonts.sans }]}>{id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={[styles.statusBadgeText, { color: '#FFF', fontFamily: Fonts.sans }]}>{status.toUpperCase()}</Text>
          </View>
        </View>
      )}

      {/* SECTION 2: Customer Name */}
      <View style={[styles.sectionDivider, { borderTopColor: theme.border }]}>
        <Text style={[styles.customerName, { color: theme.text, fontFamily: Fonts.rounded }]}>{customerName}</Text>
      </View>

      {/* SECTION 3: Items List */}
      <View style={[styles.sectionDivider, { borderTopColor: theme.border }]}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            <View style={styles.itemMainRow}>
              <Text style={[styles.itemLabel, { color: theme.text, fontFamily: Fonts.sans }]}>
                {item.quantity} × {item.name}
              </Text>
              <Text style={[styles.itemPrice, { color: theme.text, fontFamily: Fonts.rounded }]}>₹{item.price * item.quantity}</Text>
            </View>
            {item.addons?.map((addon, aIndex) => (
              <View key={aIndex} style={[styles.addonRow, { backgroundColor: theme.surfaceSecondary + '50' }]}>
                <Text style={[styles.addonLabel, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>+ {addon.name}</Text>
                <Text style={[styles.addonPrice, { color: theme.textSecondary, fontFamily: Fonts.rounded }]}>₹{addon.price}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* SECTION 4: Instructions/Notes */}
      {specialInstructions && (
        <View style={[styles.noteContainer, { backgroundColor: theme.surfaceSecondary, borderLeftColor: theme.primary }]}>
          <ChatText size={18} color={theme.primary} weight="fill" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.noteLabel, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>Special Note</Text>
            <Text style={[styles.noteText, { color: theme.text, fontFamily: Fonts.sans }]}>
              "{specialInstructions}"
            </Text>
          </View>
        </View>
      )}

      {/* SECTION 5: Offer Applied (Coupon Card) */}
      {offer && (
        <View style={[styles.offerCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary }]}>
          <View style={styles.offerHeaderColumn}>
            <View style={styles.offerTagRow}>
              <Ticket size={20} color={theme.primary} weight="fill" />
              <Text style={[styles.offerTitle, { color: theme.primary, fontFamily: Fonts.sans }]}>OFFER APPLIED</Text>
            </View>
            <Text style={[styles.offerSubtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>{offer.title}</Text>
          </View>
          <View style={[styles.offerDivider, { borderLeftColor: theme.primary + '30' }]} />
          <View style={styles.offerValueColumn}>
            <Text style={[styles.discountValue, { color: theme.text, fontFamily: Fonts.rounded }]}>- ₹{offer.discount}</Text>
            <View style={[styles.couponBadge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.couponText, { color: theme.primary, fontFamily: Fonts.sans }]}>{offer.coupon}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={[styles.orderedBar, { backgroundColor: theme.surfaceSecondary }]}>
        <Clock size={14} color={theme.textSecondary} weight="bold" style={{ marginRight: 6 }} />
        <Text style={[styles.orderedTimeText, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Ordered: <Text style={{ fontWeight: '700', color: theme.text }}>{time}</Text> after ordered
        </Text>
      </View>

      {/* SECTION 7: Delivery Grid (Accepted Orders Only) */}
      {isAccepted && deliveryBoy && (
        <View style={[styles.deliveryGrid, { borderTopColor: theme.border }]}>
          <View style={[styles.deliveryItem, { borderRightWidth: 1, borderRightColor: theme.border }]}>
            <View style={styles.deliveryHeader}>
              <Motorcycle size={16} color={theme.textSecondary} weight="bold" />
              <Text style={[styles.deliveryLabel, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>Order pickup in</Text>
            </View>
            <Text style={[styles.deliveryValue, { color: theme.text, fontFamily: Fonts.sans }]}>{deliveryBoy.comingIn}</Text>
          </View>
          <View style={styles.deliveryItem}>
            <View style={styles.deliveryHeader}>
              <Timer size={16} color={theme.textSecondary} weight="bold" />
              <Text style={[styles.deliveryLabel, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>Assigned Partner</Text>
            </View>
            <Text style={[styles.deliveryValue, { color: theme.text, fontFamily: Fonts.sans }]}>{deliveryBoy.name}</Text>
          </View>
        </View>
      )}

      {/* SECTION 8: Calculation / Total */}
      <View style={[styles.sectionDivider, { borderTopColor: theme.border }]}>
        <PremiumButton
          variant="ghost"
          size="small"
          label={`Total: ₹${total}`}
          onPress={() => setShowBillDetails(!showBillDetails)}
          rightIcon={showBillDetails ? <CaretUp size={18} color={theme.primary} /> : <CaretDown size={18} color={theme.primary} />}
          textStyle={{ fontSize: 18, color: theme.text, fontFamily: Fonts.rounded, fontWeight: '800' }}
          style={{ paddingHorizontal: 0, justifyContent: 'space-between', width: '100%' }}
        />
        {showBillDetails && (
          <BillDetails
            subtotal={subtotal}
            taxes={taxes}
            packagingCharge={packagingCharge}
            theme={theme}
          />
        )}
      </View>

      {/* SECTION 9: Actions */}
      {!hideActions && status !== 'Completed' && status !== 'Cancelled' && (
        <>
          {(status === 'Preparing' || status === 'Delayed') ? (
            <View style={styles.actionRow}>
              <PremiumButton
                label={`Mark as Ready (${timeLeft})`}
                onPress={() => onUpdateStatus?.(id, 'Ready')}
                variant="primary"
                color={fillingColor}
                progress={progress}
                isPulsing={isDelayed}
                leftIcon={<CheckCircle size={20} color={isDelayed ? theme.surface : (colorScheme === 'dark' ? theme.surface : theme.text)} weight="bold" />}
                style={{ flex: 1 }}
                textStyle={{ color: isDelayed ? theme.surface : (colorScheme === 'dark' ? theme.surface : theme.text) }}
              />
            </View>
          ) : (
            <>
              <View style={styles.actionRow}>
                <PremiumButton
                  variant="glassy"
                  color={statusColor}
                  label={
                    status === 'New' ? 'Accept Order' :
                      status === 'Ready' ? 'Mark as Completed' :
                        'Mark as Ready'
                  }
                  onPress={() => { }}
                  rightIcon={<ArrowRight size={18} color={statusColor} weight="bold" />}
                  style={{ flex: 1, height: 50 }}
                  textStyle={{ fontSize: 16 }}
                />
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

export const OrderCard = (props: OrderCardProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const statusColor = StatusColors[props.status as keyof typeof StatusColors] || theme.primary;

  return (
    <AnimatedCard>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: statusColor + '40' }]}>
        <OrderCardContent {...props} />
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 20,
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // Elevation for Android
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  hashColor: {
    ...Typography.H3,
  },
  orderId: {
    ...Typography.H3,
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    ...Typography.Caption,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  customerName: {
    ...Typography.H2,
  },
  itemWrapper: {
    marginBottom: 10,
  },
  itemMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    ...Typography.H3,
    flex: 1,
  },
  itemPrice: {
    ...Typography.BodyLarge,
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingVertical: 4,
    marginTop: 4,
    borderRadius: 4,
  },
  addonLabel: {
    ...Typography.BodyRegular,
  },
  addonPrice: {
    ...Typography.BodyRegular,
    fontWeight: '600',
    marginRight: 8,
  },
  noteContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
    borderLeftWidth: 4,
  },
  noteLabel: {
    ...Typography.Caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  noteText: {
    ...Typography.BodyRegular,
  },
  offerCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerHeaderColumn: {
    flex: 1,
  },
  offerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  offerTitle: {
    ...Typography.Caption,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offerSubtitle: {
    ...Typography.Caption,
  },
  offerDivider: {
    height: '100%',
    borderLeftWidth: 1,
    marginHorizontal: 15,
  },
  offerValueColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  discountValue: {
    ...Typography.H2,
  },
  couponBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  couponText: {
    ...Typography.Caption,
    fontWeight: '800',
  },
  orderedBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderedTimeText: {
    ...Typography.Caption,
    fontWeight: '600',
  },
  deliveryGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
    marginBottom: 16,
  },
  deliveryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  deliveryLabel: {
    ...Typography.Caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  deliveryValue: {
    ...Typography.BodyLarge,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
  },
  billContainer: {
    paddingVertical: 12,
    gap: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    ...Typography.BodyRegular,
  },
  billValue: {
    ...Typography.BodyLarge,
  },
});