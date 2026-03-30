import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Lightning, CaretLeft } from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';

interface RushKitchenModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

const TIME_OPTIONS = [
  { id: 30, label: '30 minutes' },
  { id: 60, label: '1 hour' },
  { id: 90, label: '1 hour 30 minutes' },
  { id: 120, label: '2 hours' },
];

export const RushKitchenModal = ({ visible, onClose, onConfirm }: RushKitchenModalProps) => {
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="Rush in kitchen"
      fullHeight
      footer={
        <Pressable 
          style={[
            styles.confirmButton, 
            { backgroundColor: selectedId ? theme.primary : theme.surfaceSecondary + '20' }
          ]}
          disabled={!selectedId}
          onPress={handleConfirm}
        >
          <Text style={[styles.confirmText, { color: selectedId ? (isDark ? '#000' : '#FFF') : theme.textSecondary }]}>
            Confirm Changes
          </Text>
        </Pressable>
      }
    >
      <View style={[styles.banner, { backgroundColor: theme.background }]}>
        <View style={[styles.bannerIconCircle, { backgroundColor: theme.primary + '20' }]}>
          <Lightning size={28} weight="fill" color={theme.primary} />
        </View>
        <Text style={[styles.bannerText, { color: theme.text }]}>
          Let us know if your kitchen is extra busy. We'll add more prep time to keep things running smoothly.
        </Text>
      </View>

      <Text style={[styles.sectionHeading, { color: theme.text }]}>How this helps you</Text>
      
      <View style={styles.infoItems}>
        {[
          'Gives your team more preparation time',
          'Accurate delivery arrival for customers',
          'Optimize rider scheduling at your store'
        ].map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={[styles.numberCircle, { backgroundColor: theme.primary + '30' }]}>
              <Text style={[styles.numberText, { color: theme.primary }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.infoItemText, { color: theme.text }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.optionsSection}>
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Extend prep time for next</Text>
        
        <View style={styles.radioList}>
          {TIME_OPTIONS.map((option) => (
            <View key={option.id} style={styles.radioWrapper}>
              <RadioButton 
                selected={selectedId === option.id} 
                onPress={() => setSelectedId(option.id)} 
                label={option.label}
                size={24}
              />
            </View>
          ))}
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  bannerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    ...Typography.BodyRegular,
    flex: 1,
  },
  sectionHeading: {
    ...Typography.H3,
    fontSize: 18,
    marginBottom: 16,
  },
  infoItems: {
    marginBottom: 32,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    ...Typography.Caption,
    fontSize: 12,
    fontWeight: '800',
  },
  infoItemText: {
    ...Typography.BodyRegular,
    fontSize: 15,
  },
  optionsSection: {
    paddingBottom: 20,
  },
  radioList: {
    gap: 16,
  },
  radioWrapper: {
    paddingVertical: 4,
  },
  confirmButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmText: {
    ...Typography.BodyLarge,
    fontSize: 18,
    fontWeight: '800',
  }
});
