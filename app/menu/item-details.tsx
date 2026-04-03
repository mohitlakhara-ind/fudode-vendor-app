import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, TextInput, Switch, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Check, Camera, Plus, Leaf, Trash } from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { MOCK_INVENTORY, InventoryItem } from '@/constants/mockInventory';

export default function ItemDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryName: string; subCategoryName: string; itemId?: string }>();
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    dishType: '',
    basePrice: '',
    weight: '',
    protein: '',
    fiber: '',
    calories: '',
    allergens: '',
    tags: [] as string[],
    image: null as string | null,
  });

  useEffect(() => {
    if (params.itemId) {
      for (const cat of MOCK_INVENTORY) {
        const item = cat.items.find((i: InventoryItem) => i.id === params.itemId);
        if (item) {
          setForm({
            name: item.name,
            description: item.description || '',
            dishType: item.isVeg ? 'veg' : 'non-veg',
            basePrice: item.price.toString(),
            weight: '',
            protein: '',
            fiber: '',
            calories: '',
            allergens: '',
            tags: [],
            image: item.imageUrl || null,
          });
          break;
        }
      }
    }
  }, [params.itemId]);

  const availableTags = ['Spicy', 'Vegan', 'Bestseller', 'Gluten Free'];

  const toggleTag = (tag: string) => {
    setForm(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
  };

  const handleSave = () => {
    // Save logic here
    router.back();
    router.back();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>{params.itemId ? 'Edit Item' : 'Add New Item'}</ThemedText>
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <ThemedText style={[styles.saveText, { color: theme.primary }]}>Save</ThemedText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.categoryBreadcrumbs}>
          <ThemedText style={[styles.breadcrumbText, { color: theme.textSecondary }]}>
            {params.categoryName} <ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>{'>'}</ThemedText> {params.subCategoryName}
          </ThemedText>
        </View>

        <View style={styles.photoSection}>
          <Pressable 
            onPress={pickImage}
            style={[
              styles.photoUpload, 
              { 
                backgroundColor: theme.surfaceSecondary, 
                borderColor: theme.border, 
                borderStyle: form.image ? 'solid' : 'dashed', 
                borderWidth: 1,
                overflow: 'hidden'
              }
            ]}
          >
            {form.image ? (
              <>
                <Image source={{ uri: form.image }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Camera size={24} color="#fff" weight="fill" />
                  <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
                </View>
              </>
            ) : (
              <>
                <Camera size={32} color={theme.textSecondary} />
                <ThemedText style={{ color: theme.textSecondary, marginTop: 8, ...Typography.BodyRegular }}>Add Item Photo</ThemedText>
              </>
            )}
          </Pressable>
          
          {form.image && (
            <TouchableOpacity 
              onPress={removeImage} 
              style={[styles.removeImageBtn, { backgroundColor: theme.error + '20' }]}
            >
              <Trash size={18} color={theme.error} />
              <ThemedText style={[styles.removeText, { color: theme.error }]}>Remove</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Basic Info</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Item Name"
              placeholderTextColor={theme.textSecondary}
              value={form.name}
              onChangeText={(val) => setForm({...form, name: val})}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border, height: 100 }]}>
            <TextInput
              style={[styles.input, { color: theme.text, height: '100%', textAlignVertical: 'top' }]}
              placeholder="Description"
              placeholderTextColor={theme.textSecondary}
              value={form.description}
              onChangeText={(val) => setForm({...form, description: val})}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Dish Type</ThemedText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['Veg', 'Non-Veg', 'Egg'].map(type => {
              const isSelected = form.dishType === type.toLowerCase();
              return (
                <Pressable
                  key={type}
                  onPress={() => setForm({...form, dishType: type.toLowerCase()})}
                  style={[
                    styles.tagBubble,
                    {
                      backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                      marginRight: 0
                    }
                  ]}
                >
                  <ThemedText style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? '700' : '500' }}>
                    {type}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Pricing & Tax</ThemedText>
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowInput}>
              <ThemedText style={{ color: theme.textSecondary, fontSize: 16 }}>₹</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1, paddingLeft: 8 }]}
                placeholder="Base Price"
                placeholderTextColor={theme.textSecondary}
                value={form.basePrice}
                onChangeText={(val) => setForm({...form, basePrice: val})}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.taxRow}>
              <View>
                <ThemedText style={[styles.taxLabel, { color: theme.text }]}>Taxes & Charges (5% GST)</ThemedText>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>Auto-calculated from base price</ThemedText>
              </View>
              <ThemedText style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                ₹{(Number(form.basePrice || 0) * 0.05).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Nutrition & Details</ThemedText>
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.rowInputInner, { color: theme.text }]}
              placeholder="Weight (e.g. 250g)"
              placeholderTextColor={theme.textSecondary}
              value={form.weight}
              onChangeText={(val) => setForm({...form, weight: val})}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={[styles.rowInputInner, { color: theme.text, flex: 1 }]}
                placeholder="Calories"
                placeholderTextColor={theme.textSecondary}
                value={form.calories}
                onChangeText={(val) => setForm({...form, calories: val})}
                keyboardType="numeric"
              />
              <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />
              <TextInput
                style={[styles.rowInputInner, { color: theme.text, flex: 1 }]}
                placeholder="Protein (g)"
                placeholderTextColor={theme.textSecondary}
                value={form.protein}
                onChangeText={(val) => setForm({...form, protein: val})}
                keyboardType="numeric"
              />
              <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />
              <TextInput
                style={[styles.rowInputInner, { color: theme.text, flex: 1 }]}
                placeholder="Fiber (g)"
                placeholderTextColor={theme.textSecondary}
                value={form.fiber}
                onChangeText={(val) => setForm({...form, fiber: val})}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Dietary & Allergens</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Allergens (e.g. Nuts, Dairy)"
              placeholderTextColor={theme.textSecondary}
              value={form.allergens}
              onChangeText={(val) => setForm({...form, allergens: val})}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
            {availableTags.map(tag => {
              const isSelected = form.tags.includes(tag);
              return (
                <Pressable 
                  key={tag}
                  style={[
                    styles.tagBubble, 
                    { 
                      backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border 
                    }
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <ThemedText style={{ color: isSelected ? theme.primary : theme.text, fontWeight: isSelected ? '700' : '500' }}>
                    {tag}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 10 }]}>
        <Pressable style={[styles.createBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
          <ThemedText style={styles.createBtnText}>{params.itemId ? 'Save Changes' : 'Create Item'}</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.H3,
    fontWeight: '700',
  },
  saveBtn: {
    padding: 8,
    paddingHorizontal: 16,
  },
  saveText: {
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
  },
  categoryBreadcrumbs: {
    marginBottom: 20,
  },
  breadcrumbText: {
    ...Typography.BodyRegular,
    fontWeight: '600',
  },
  photoUpload: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.H3,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  rowInputInner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
  },
  vertDivider: {
    width: 1,
  },
  taxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  taxLabel: {
    ...Typography.BodyLarge,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tagBubble: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  photoSection: {
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
