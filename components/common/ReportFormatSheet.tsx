import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { CaretRight } from 'phosphor-react-native';
import { ThemedText } from '@/components/themed-text';

interface ReportFormatSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (format: 'weekly' | 'monthly') => void;
}

export const ReportFormatSheet = ({
  visible,
  onClose,
  onSelect
}: ReportFormatSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const formats = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Choose report format"
    >
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {formats.map((format, index) => (
            <Pressable
              key={format.id}
              style={({ pressed }) => [
                styles.optionRow,
                { 
                  backgroundColor: theme.surface, 
                  borderColor: theme.border,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
              onPress={() => onSelect(format.id as any)}
            >
              <ThemedText style={[styles.optionLabel, { color: theme.text }]}>{format.label}</ThemedText>
              <View style={[styles.caretCircle, { backgroundColor: theme.surfaceSecondary }]}>
                <CaretRight size={14} color={theme.text} weight="bold" />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  optionsList: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  optionLabel: {
    ...Typography.H3,
    fontSize: 17,
    fontWeight: '700',
  },
  caretCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
