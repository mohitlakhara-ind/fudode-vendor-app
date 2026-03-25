import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { RadioButton } from '@/components/ui/RadioButton';
import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface StockFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: 'all' | 'out_of_stock' | 'in_stock') => void;
  selectedFilter: 'all' | 'out_of_stock' | 'in_stock';
}

export const StockFilterSheet = ({
  visible,
  onClose,
  onApply,
  selectedFilter
}: StockFilterSheetProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];

  const [localSelected, setLocalSelected] = useState(selectedFilter);

  const options = [
    { id: 'all', label: 'All items' },
    { id: 'out_of_stock', label: 'Out of stock items only' },
    { id: 'in_stock', label: 'In stock items only' },
  ];

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Filters"
    >
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {options.map((option, index) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionRow,
                index === options.length - 1 && { borderBottomWidth: 0 },
                { borderBottomColor: theme.border + '15' }
              ]}
              onPress={() => setLocalSelected(option.id as any)}
            >
              <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
              <RadioButton
                selected={localSelected === option.id}
                onPress={() => setLocalSelected(option.id as any)}
                size={24}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <PremiumButton
            label="Apply"
            variant="primary"
            onPress={() => onApply(localSelected)}
            style={{ ...styles.footerBtn, backgroundColor: '#000' }}
            textStyle={{ color: '#FFF' }}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  optionsList: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  optionLabel: {
    ...Typography.H3,
    fontSize: 18,
  },
  footer: {
    marginTop: 10,
  },
  footerBtn: {
    height: 56,
    borderRadius: 14,
  },
});
