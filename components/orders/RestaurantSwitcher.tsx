import { Colors, Fonts } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';
import { SealCheck } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

interface Restaurant {
  id: string;
  name: string;
  locality: string;
}

interface RestaurantSwitcherProps {
  visible: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  selectedId: string;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantSwitcher = ({
  visible,
  onClose,
  restaurants,
  selectedId,
  onSelect,
}: RestaurantSwitcherProps) => {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Switch Restaurant"
      isNonDismissible={false}
    >
      <View style={styles.restaurantList}>
        <Text style={[styles.switcherSubtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Select from your owned businesses
        </Text>
        
        {restaurants.map((res) => (
          <Pressable
            key={res.id}
            style={[
              styles.restaurantItem,
              { borderColor: theme.border },
              selectedId === res.id && { backgroundColor: `${theme.primary}10`, borderColor: theme.primary }
            ]}
            onPress={() => onSelect(res)}
          >
            <View style={[styles.resIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
              <Text style={[styles.resIconText, { color: theme.primary, fontFamily: Fonts.rounded }]}>
                {res.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.resInfoBox}>
              <Text style={[styles.resNameText, { color: theme.text, fontFamily: Fonts.rounded }]}>{res.name}</Text>
              <Text style={[styles.resLocalityText, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>{res.locality}</Text>
            </View>
            {selectedId === res.id && (
              <SealCheck size={20} color={theme.primary} weight="fill" />
            )}
          </Pressable>
        ))}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  restaurantList: {
    gap: 12,
    paddingBottom: 20,
  },
  switcherSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  resIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  resIconText: {
    fontSize: 20,
    fontWeight: '900',
  },
  resInfoBox: {
    flex: 1,
  },
  resNameText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resLocalityText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
