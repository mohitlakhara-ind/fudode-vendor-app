import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, TextInput, Switch, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Plus, Trash, Check, Info } from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { createAddonGroup, updateAddonGroup, deleteAddonGroup } from '@/store/slices/menuSlice';
import { Addon, AddonGroupCreateRequest } from '@/api/types';

export default function AddonGroupDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ id?: string }>();
  
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const { addonGroups, loading } = useAppSelector((state: RootState) => state.menu);

  const [form, setForm] = useState({
    name: '',
    isRequired: false,
    minSelect: 0,
    maxSelect: 1,
    addons: [] as Omit<Addon, 'id'>[],
  });

  useEffect(() => {
    if (params.id) {
      const group = addonGroups.find(g => g.id === params.id);
      if (group) {
        setForm({
          name: group.name,
          isRequired: group.isRequired,
          minSelect: group.minSelect,
          maxSelect: group.maxSelect,
          addons: (group.addons || []).map(({ id, ...rest }: any) => rest), // Keep it purely for editing
        });
      }
    }
  }, [params.id, addonGroups]);

  const addAddon = () => {
    setForm(prev => ({
      ...prev,
      addons: [...prev.addons, { name: '', price: 0, status: 'AVAILABLE' }]
    }));
  };

  const updateAddon = (index: number, field: keyof Omit<Addon, 'id'>, value: any) => {
    const updatedAddons = [...form.addons];
    updatedAddons[index] = { ...updatedAddons[index], [field]: value };
    setForm({ ...form, addons: updatedAddons });
  };

  const removeAddon = (index: number) => {
    setForm(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!form.name) {
      Alert.alert('Error', 'Group name is required');
      return;
    }

    if (form.addons.length === 0) {
      Alert.alert('Error', 'Add at least one addon item');
      return;
    }

    if (form.minSelect > form.maxSelect) {
      Alert.alert('Error', 'Minimum selection cannot be greater than maximum');
      return;
    }

    if (form.isRequired && form.minSelect === 0) {
      Alert.alert('Error', 'Required groups must have a minimum selection of at least 1');
      return;
    }

    const payload: AddonGroupCreateRequest = {
      name: form.name,
      isRequired: form.isRequired,
      minSelect: form.minSelect,
      maxSelect: form.maxSelect,
      addons: form.addons,
    };

    try {
      if (params.id) {
        await dispatch(updateAddonGroup({ id: params.id, details: payload })).unwrap();
      } else {
        await dispatch(createAddonGroup(payload)).unwrap();
      }
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to save addon group');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this addon group?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (params.id) {
                await dispatch(deleteAddonGroup(params.id)).unwrap();
                router.back();
              }
            } catch (err: any) {
              Alert.alert('Error', err || 'Failed to delete group');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
          {params.id ? 'Edit Add-on Group' : 'New Add-on Group'}
        </ThemedText>
        <Pressable onPress={handleSave} style={styles.saveBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText style={[styles.saveText, { color: theme.primary }]}>Save</ThemedText>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.section}>
          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Group Name (e.g. Extra Toppings)"
              placeholderTextColor={theme.textSecondary}
              value={form.name}
              onChangeText={(val) => setForm({...form, name: val})}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Required Choice</ThemedText>
              <ThemedText style={{ color: theme.textSecondary, fontSize: 13 }}>Forces user to make a selection</ThemedText>
            </View>
            <Switch 
              value={form.isRequired} 
              onValueChange={(val) => setForm({...form, isRequired: val, minSelect: val ? Math.max(1, form.minSelect) : form.minSelect})}
              trackColor={{ true: theme.primary, false: theme.border }}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Minimum Selection</ThemedText>
            </View>
            <View style={[styles.numberInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
               <TextInput
                style={{ color: theme.text, textAlign: 'center', width: 40, height: 40, fontWeight: '700' }}
                value={form.minSelect.toString()}
                keyboardType="numeric"
                onChangeText={(val) => setForm({...form, minSelect: parseInt(val) || 0})}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Maximum Selection</ThemedText>
            </View>
            <View style={[styles.numberInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
               <TextInput
                style={{ color: theme.text, textAlign: 'center', width: 40, height: 40, fontWeight: '700' }}
                value={form.maxSelect.toString()}
                keyboardType="numeric"
                onChangeText={(val) => setForm({...form, maxSelect: parseInt(val) || 0})}
              />
            </View>
          </View>
        </View>

        <View style={styles.addonSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Add-on Items</ThemedText>
            <Pressable onPress={addAddon} style={[styles.addBtn, { backgroundColor: theme.primary + '20' }]}>
              <Plus size={16} color={theme.primary} weight="bold" />
              <ThemedText style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>Add Item</ThemedText>
            </Pressable>
          </View>

          {form.addons.map((addon, index) => (
            <View key={index} style={[styles.addonRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={{ flex: 1, gap: 8 }}>
                <TextInput
                  style={[styles.smallInput, { color: theme.text, borderBottomColor: theme.border, borderBottomWidth: 1 }]}
                  placeholder="Item Name"
                  placeholderTextColor={theme.textSecondary}
                  value={addon.name}
                  onChangeText={(val) => updateAddon(index, 'name', val)}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>₹</ThemedText>
                  <TextInput
                    style={[styles.smallInput, { color: theme.text, flex: 1, paddingLeft: 4 }]}
                    placeholder="Price"
                    placeholderTextColor={theme.textSecondary}
                    value={addon.price.toString()}
                    keyboardType="numeric"
                    onChangeText={(val) => updateAddon(index, 'price', parseFloat(val) || 0)}
                  />
                </View>
              </View>
              <Pressable onPress={() => removeAddon(index)} style={styles.trashBtn}>
                <Trash size={20} color={theme.error} />
              </Pressable>
            </View>
          ))}

          {form.addons.length === 0 && (
            <View style={[styles.emptyAddons, { borderColor: theme.border }]}>
              <Info size={24} color={theme.textSecondary} />
              <ThemedText style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>
                No items added. Add individual addons like Extra Cheese, Jalapeños etc.
              </ThemedText>
            </View>
          )}
        </View>

        {params.id && (
          <TouchableOpacity 
            onPress={handleDelete}
            style={[styles.deleteBtn, { borderColor: theme.error + '40' }]}
          >
            <Trash size={20} color={theme.error} />
            <ThemedText style={{ color: theme.error, fontWeight: '700' }}>Delete Group</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 10 }]}>
        <Pressable 
          style={[styles.createBtn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText style={styles.createBtnText}>{params.id ? 'Update Group' : 'Create Group'}</ThemedText>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 8 },
  headerTitle: { ...Typography.H3, fontWeight: '700' },
  saveBtn: { padding: 8, paddingHorizontal: 16 },
  saveText: { fontWeight: '700', fontSize: 16 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 20 },
  inputContainer: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  input: { paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter-Regular' },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1 },
  numberInput: { width: 50, height: 40, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addonSection: { marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  addonRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12, gap: 12 },
  smallInput: { fontSize: 15, paddingVertical: 4, fontFamily: 'Inter-Regular' },
  trashBtn: { padding: 8 },
  emptyAddons: { padding: 40, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  createBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  createBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
