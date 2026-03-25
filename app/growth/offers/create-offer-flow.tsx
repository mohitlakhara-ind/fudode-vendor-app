import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown, Info, Users, PencilSimple, CalendarBlank, Tag, Scissors, Globe } from 'phosphor-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useRouter, useLocalSearchParams } from 'expo-router';

const RadioItem = ({ label, description, selected, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={styles.radioItem}
      onPress={onSelect}
    >
      <View style={{ flex: 1 }}>
        <ThemedText style={[styles.radioLabel, { color: theme.text }]}>{label}</ThemedText>
        {description && <ThemedText style={[styles.radioDesc, { color: theme.textSecondary }]}>{description}</ThemedText>}
      </View>
      <View style={[styles.radioOuter, { borderColor: selected ? theme.text : theme.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: theme.text }]} />}
      </View>
    </TouchableOpacity>
  );
};

const ValuePill = ({ label, selected, onSelect }: any) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  return (
    <TouchableOpacity 
      style={[styles.valuePill, { backgroundColor: selected ? theme.primary : theme.surfaceSecondary }]}
      onPress={onSelect}
    >
      <ThemedText style={[styles.valuePillText, { color: '#FFF' }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

export default function CreateOfferFlowScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const { type = 'flat' } = useLocalSearchParams<{ type: string }>();
  const [step, setStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState('All customers');
  const [selectedPref, setSelectedPref] = useState('All type');
  const [selectedVal, setSelectedVal] = useState('60%');
  const [selectedLimit, setSelectedLimit] = useState('₹120');
  const [selectedDays, setSelectedDays] = useState('All days');

  const title = type === 'percentage' ? 'Create percentage discount' : 'Create flat discount';

  const renderStep1 = () => (
    <View>
      <View style={styles.stepHeader}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <ThemedText style={[styles.stepHeaderText, { color: theme.text }]}>CUSTOMER TARGET</ThemedText>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>
      <ThemedText style={[styles.stepIndicator, { color: theme.textSecondary }]}>( STEP 1/3 )</ThemedText>

      <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '20' }]}>
            <Users size={24} color={theme.primary} weight="fill" />
          </View>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Choose customer group</ThemedText>
          <Info size={20} color={theme.textSecondary} />
        </View>
        <RadioItem 
          label="All customers" 
          selected={selectedGroup === 'All customers'} 
          onSelect={() => setSelectedGroup('All customers')} 
        />
        <View style={styles.divider} />
        <RadioItem 
          label="New customers" 
          description="Customers who haven't ordered in the last 90 days"
          selected={selectedGroup === 'New customers'} 
          onSelect={() => setSelectedGroup('New customers')} 
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '20' }]}>
            <Globe size={24} color={theme.primary} weight="fill" />
          </View>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Choose offer preference type</ThemedText>
          <Info size={20} color={theme.textSecondary} />
        </View>
        <RadioItem label="All type" selected={selectedPref === 'All type'} onSelect={() => setSelectedPref('All type')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <RadioItem 
          label="Offer sensitive" 
          description="Customers highly attracted towards offers"
          selected={selectedPref === 'Offer sensitive'} 
          onSelect={() => setSelectedPref('Offer sensitive')} 
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <RadioItem 
          label="Premium" 
          description="Customers less attracted towards offers"
          selected={selectedPref === 'Premium'} 
          onSelect={() => setSelectedPref('Premium')} 
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View style={styles.stepHeader}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <ThemedText style={[styles.stepHeaderText, { color: theme.text }]}>DISCOUNT SELECTION</ThemedText>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>
      <ThemedText style={[styles.stepIndicator, { color: theme.textSecondary }]}>( STEP 2/3 )</ThemedText>

      <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '20' }]}>
            {type === 'percentage' ? <Scissors size={24} color={theme.primary} weight="fill" /> : <Tag size={24} color={theme.primary} weight="fill" />}
          </View>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Choose discount value</ThemedText>
          <Info size={20} color={theme.textSecondary} />
        </View>
        
        <ThemedText style={styles.pillLabel}>{type === 'percentage' ? 'Discount percentage' : 'Discount value'}</ThemedText>
        <View style={styles.pillRow}>
          {(type === 'percentage' ? ['60%', '50%', '40%', '30%', '20%', '10%'] : ['₹200', '₹175', '₹150', '₹125', '₹100']).map(v => (
            <ValuePill key={v} label={v} selected={selectedVal === v} onSelect={() => setSelectedVal(v)} />
          ))}
        </View>

        {type === 'percentage' && (
          <>
            <View style={[styles.divider, { marginVertical: 16, backgroundColor: theme.border }]} />
            <ThemedText style={[styles.pillLabel, { color: theme.text }]}>Max limit for discount</ThemedText>
            <View style={styles.pillRow}>
              {['₹120', '₹150', '₹180', '₹200'].map(v => (
                <ValuePill key={v} label={v} selected={selectedLimit === v} onSelect={() => setSelectedLimit(v)} />
              ))}
            </View>
          </>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '20' }]}>
            <CalendarBlank size={24} color={theme.primary} weight="fill" />
          </View>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Select minimum order value</ThemedText>
          <Info size={20} color={theme.textSecondary} />
        </View>
        <TouchableOpacity style={[styles.pickerBox, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}>
          <ThemedText style={{ color: theme.text, fontSize: 16 }}>None</ThemedText>
          <CaretDown size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.hintBox}>
          <ThemedText style={styles.hintEmoji}>💡</ThemedText>
          <ThemedText style={styles.hintText}>
            To achieve your goal, we recommend you a minimum order value of <ThemedText style={{ fontWeight: '900' }}>₹159</ThemedText>
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <View style={styles.stepHeader}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <ThemedText style={[styles.stepHeaderText, { color: theme.text }]}>OFFER TIMINGS</ThemedText>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>
      <ThemedText style={[styles.stepIndicator, { color: theme.textSecondary }]}>( STEP 3/3 )</ThemedText>

      <View style={[styles.card, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '20' }]}>
            <CalendarBlank size={24} color={theme.primary} weight="fill" />
          </View>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Select offer days & start date</ThemedText>
          <Info size={20} color={theme.textSecondary} />
        </View>
        
        <View style={styles.pillRow}>
          {['All days', 'Mon - Thu', 'Fri - Sun'].map(d => (
            <TouchableOpacity 
              key={d}
              style={[styles.dayPill, { backgroundColor: selectedDays === d ? theme.primary : theme.background }]}
              onPress={() => setSelectedDays(d)}
            >
              <ThemedText style={{ color: selectedDays === d ? '#FFF' : theme.text, fontWeight: '800' }}>{d}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { marginVertical: 20, backgroundColor: theme.border }]} />
        
        <ThemedText style={[styles.pillLabel, { color: theme.text }]}>Offer start date</ThemedText>
        <View style={[styles.dateDisplay, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <ThemedText style={[styles.dateText, { color: theme.text }]}>18 Mar 2026</ThemedText>
          <PencilSimple size={20} color={theme.text} />
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
          You can <ThemedText style={{ fontWeight: '900', color: theme.text }}>Stop</ThemedText> this offer anytime on the <ThemedText style={{ fontWeight: '900', color: theme.text }}>Track Offers</ThemedText> page
        </ThemedText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={28} color={theme.text} weight="bold" />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>{title}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
            style={[styles.continueBtn, { backgroundColor: theme.primary }]}
            onPress={() => {
              if (step < 3) setStep(step + 1);
              else console.log('Finish');
            }}
        >
          <ThemedText style={[styles.continueBtnText, { color: '#FFF' }]}>Preview offer</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 30,
    flex: 1,
  },
  scrollContent: { padding: 16 },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  line: { flex: 1, height: 1.5, backgroundColor: '#333' },
  stepHeaderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 24,
    letterSpacing: 2,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFF',
    flex: 1,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    gap: 12,
  },
  radioLabel: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  radioDesc: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
    lineHeight: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: -20,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#333',
  },
  pillLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 16,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  valuePill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  valuePillText: {
    fontSize: 16,
    fontWeight: '900',
  },
  pickerBox: {
    height: 56,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  hintEmoji: { fontSize: 20 },
  hintText: {
    flex: 1,
    color: '#2DD4BF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  dayPill: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  dateText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  continueBtn: {
    height: 56,
    backgroundColor: '#555',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
