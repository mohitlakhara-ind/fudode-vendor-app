import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Sparkle, Lock, Users, Train, Fire, Warning } from 'phosphor-react-native';
import { Colors, Fonts, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';

interface TimeOffReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (reason: string) => void;
}

const REASONS = [
  { id: 'renovation', label: 'Renovation or relocation of restaurant', icon: MapPin },
  { id: 'festival', label: 'Closed due to festival', icon: Sparkle },
  { id: 'shut', label: 'Permanently shut', icon: Lock },
  { id: 'staff', label: 'Staff availability issues', icon: Users },
  { id: 'station', label: 'Going out of station', icon: Train },
  { id: 'lpg', label: 'Closed due to LPG shortage', icon: Fire },
  { id: 'other', label: 'Other', icon: Warning },
];

export const TimeOffReasonModal = ({ visible, onClose, onContinue }: TimeOffReasonModalProps) => {
  const { colorScheme, isDark } = useAppTheme();
  const theme = Colors[colorScheme];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedId) {
      const reason = REASONS.find(r => r.id === selectedId)?.label || '';
      onContinue(reason);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="Reason for scheduling time off"
      footer={
        <View style={styles.footer}>
          <Pressable 
            style={[styles.footerButton, styles.backButton, { borderColor: theme.text }]} 
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Back</Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.footerButton, 
              styles.continueButton, 
              { backgroundColor: selectedId ? theme.primary : theme.surfaceSecondary + '20' }
            ]}
            disabled={!selectedId}
            onPress={handleContinue}
          >
            <Text style={[styles.buttonText, { color: selectedId ? (isDark ? '#000' : '#FFF') : theme.textSecondary }]}>Continue</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.list}>
        {REASONS.map((reason) => {
          const Icon = reason.icon;
          const isSelected = selectedId === reason.id;
          
          return (
            <Pressable 
              key={reason.id} 
              style={[styles.reasonItem, { borderBottomColor: theme.border }]}
              onPress={() => setSelectedId(reason.id)}
            >
              <View style={styles.reasonLeft}>
                <Icon size={22} color={theme.text} weight="light" />
                <Text style={[styles.reasonLabel, { color: theme.text }]}>{reason.label}</Text>
              </View>
              <RadioButton 
                selected={isSelected} 
                onPress={() => setSelectedId(reason.id)} 
              />
            </Pressable>
          );
        })}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: -8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  reasonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  reasonLabel: {
    ...Typography.H3,
    marginLeft: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  footerButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    borderWidth: 1.5,
  },
  continueButton: {},
  buttonText: {
    ...Typography.BodyLarge,
    fontSize: 18,
    fontWeight: '800',
  }
});
