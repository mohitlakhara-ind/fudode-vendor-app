import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Check, Camera, Plus, Leaf, Trash, Clock } from 'phosphor-react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Colors, Typography } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { createItem, updateItem, deleteItem, fetchAddonGroups } from '@/store/slices/menuSlice';
import { ItemCreateRequest, MenuVariant } from '@/api/types';

export default function ItemDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ 
    categoryName: string; 
    subCategoryName: string; 
    categoryId: string;
    subCategoryId: string;
    itemId?: string 
  }>();
  
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const { items, addonGroups, loading, addonGroupsFetched } = useAppSelector((state: RootState) => state.menu);
  
  useEffect(() => {
    if (!addonGroupsFetched) {
      dispatch(fetchAddonGroups());
    }
  }, [dispatch, addonGroupsFetched]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    foodType: 'VEG' as 'VEG' | 'NON_VEG' | 'EGG',
    prepTime: '15',
    basePrice: '',
    tags: [] as string[],
    image: null as string | null,
    variants: [] as MenuVariant[],
    addonGroupIds: [] as string[],
    nutrients: {
      serving: { value: '', unit: 'g' },
      calories: { value: '', unit: 'kcal' },
      protein: { value: '', unit: 'g' },
      carbs: { value: '', unit: 'g' },
      fat: { value: '', unit: 'g' },
      fibre: { value: '', unit: 'g' },
    },
  });

  useEffect(() => {
    if (params.itemId) {
      const item = (items || []).find(i => i && i.id === params.itemId);
      if (item) {
        setForm({
          name: item.name,
          description: item.description || '',
          foodType: item.foodType,
          prepTime: item.prepTime?.toString() || '15',
          basePrice: item.variants?.[0]?.price?.toString() || '',
          tags: item.tags || [],
          image: item.imageUrl || null,
          variants: item.variants || [],
          addonGroupIds: item.addonGroupIds || [],
          nutrients: {
            serving: { 
              value: (item.nutrients?.serving as any)?.value?.toString() || '', 
              unit: (item.nutrients?.serving as any)?.unit || 'g' 
            },
            calories: { 
              value: (item.nutrients?.calories as any)?.value?.toString() || '', 
              unit: (item.nutrients?.calories as any)?.unit || 'kcal' 
            },
            protein: { 
              value: (item.nutrients?.protein as any)?.value?.toString() || '', 
              unit: (item.nutrients?.protein as any)?.unit || 'g' 
            },
            carbs: { 
              value: (item.nutrients?.carbs as any)?.value?.toString() || '', 
              unit: (item.nutrients?.carbs as any)?.unit || 'g' 
            },
            fat: { 
              value: (item.nutrients?.fat as any)?.value?.toString() || '', 
              unit: (item.nutrients?.fat as any)?.unit || 'g' 
            },
            fibre: { 
              value: (item.nutrients?.fibre as any)?.value?.toString() || '', 
              unit: (item.nutrients?.fibre as any)?.unit || 'g' 
            },
          },
        });
      }
    }
  }, [params.itemId, items]);

  const availableTags = ['BESTSELLER', 'SPICY', 'NEW', 'CHEF_SPECIAL'];

  const formatTagName = (tag: string) => {
    switch (tag) {
      case 'BESTSELLER': return 'Bestseller';
      case 'SPICY': return 'Spicy';
      case 'NEW': return 'New Arrival';
      case 'CHEF_SPECIAL': return 'Chef\'s Special';
      default: return tag;
    }
  };

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

  const handleSave = async () => {
    if (!form.name || !form.basePrice) {
      Alert.alert('Error', 'Name and Base Price are required');
      return;
    }

    if (!form.description || form.description.length < 5) {
      Alert.alert('Error', 'Description must be at least 5 characters long');
      return;
    }

    const itemData: any = {
      description: form.description || '',
      foodType: form.foodType,
      prepTime: parseInt(form.prepTime) || 15,
      imageUrl: form.image || '',
      variants: (form.variants.length > 0 ? form.variants : [
        { name: 'Regular', price: parseFloat(form.basePrice), isDefault: true }
      ]).map((v: any) => ({
        name: v.name,
        price: v.price,
        isDefault: v.isDefault
      })),
      tags: form.tags || [],
      addonGroupIds: form.addonGroupIds || [],
      nutrients: {
        serving: form.nutrients.serving.value ? { 
          value: parseFloat(form.nutrients.serving.value), 
          unit: form.nutrients.serving.unit 
        } : undefined,
        calories: form.nutrients.calories.value ? { 
          value: parseFloat(form.nutrients.calories.value), 
          unit: form.nutrients.calories.unit 
        } : undefined,
        protein: form.nutrients.protein.value ? { 
          value: parseFloat(form.nutrients.protein.value), 
          unit: form.nutrients.protein.unit 
        } : undefined,
        carbs: form.nutrients.carbs.value ? { 
          value: parseFloat(form.nutrients.carbs.value), 
          unit: form.nutrients.carbs.unit 
        } : undefined,
        fat: form.nutrients.fat.value ? { 
          value: parseFloat(form.nutrients.fat.value), 
          unit: form.nutrients.fat.unit 
        } : undefined,
        fibre: form.nutrients.fibre.value ? { 
          value: parseFloat(form.nutrients.fibre.value), 
          unit: form.nutrients.fibre.unit 
        } : undefined,
      },
    };

    // Add immutable fields ONLY for creation
    if (!params.itemId) {
      itemData.name = form.name.trim();
      itemData.categoryId = params.subCategoryId || params.categoryId;
    }

    console.log('Sending Item Data:', JSON.stringify(itemData, null, 2));

    try {
      if (params.itemId) {
        await dispatch(updateItem({ id: params.itemId, details: itemData })).unwrap();
        Alert.alert('Success', 'Update submitted! Admin will verify changes shortly.', [
          { text: 'OK', onPress: () => router.dismiss(3) }
        ]);
      } else {
        await dispatch(createItem(itemData)).unwrap();
        router.dismiss(3); 
      }
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to save item');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (params.itemId) {
                await dispatch(deleteItem(params.itemId)).unwrap();
                router.dismiss(3);
              }
            } catch (err: any) {
              Alert.alert('Error', err || 'Failed to delete item');
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', marginLeft: params.itemId ? 40 : 0 }}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {params.itemId ? 'Edit Item' : 'Add New Item'}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {params.itemId && (
            <Pressable onPress={handleDelete} hitSlop={10}>
              <Trash size={22} color={theme.error} />
            </Pressable>
          )}
          <Pressable onPress={handleSave} style={styles.saveBtn} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <ThemedText style={[styles.saveText, { color: theme.primary }]}>Save</ThemedText>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        {params.itemId && (
          <View style={[styles.verificationNotice, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
            <Clock size={18} color={theme.primary} weight="fill" />
            <ThemedText style={[styles.verificationText, { color: theme.primary }]}>
              Updates require admin verification. Changes will go live after approval.
            </ThemedText>
          </View>
        )}
        <View style={styles.categoryBreadcrumbs}>
          <ThemedText style={[styles.breadcrumbText, { color: theme.textSecondary }]}>
            {params.categoryName} 
            {params.subCategoryName ? (
              <>
                {' '}<ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>{'>'}</ThemedText>{' '}
                {params.subCategoryName}
              </>
            ) : (
              <>
                {' '}<ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>{'>'}</ThemedText>{' '}
                <ThemedText style={{ fontStyle: 'italic', opacity: 0.6 }}>No Sub Category</ThemedText>
              </>
            )}
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
          
          <View style={[styles.inputContainer, { backgroundColor: params.itemId ? theme.surfaceSecondary : theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: params.itemId ? theme.textSecondary : theme.text }]}
              placeholder="Item Name"
              placeholderTextColor={theme.textSecondary}
              value={form.name}
              onChangeText={(val) => setForm({...form, name: val})}
              editable={!params.itemId}
            />
          </View>
          {params.itemId && (
            <ThemedText style={[styles.draftNote, { color: theme.textSecondary }]}>
              * Item name cannot be changed once created. Contact support for major updates.
            </ThemedText>
          )}

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
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Dish Type & Prep Time</ThemedText>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            {['VEG', 'NON_VEG', 'EGG'].map(type => {
              const isSelected = form.foodType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setForm({...form, foodType: type as any})}
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
                    {type.replace('_', ' ')}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowInput}>
              <Clock size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1, paddingLeft: 12 }]}
                placeholder="Prep Time (mins)"
                placeholderTextColor={theme.textSecondary}
                value={form.prepTime}
                onChangeText={(val) => setForm({...form, prepTime: val})}
                keyboardType="numeric"
              />
            </View>
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
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Tags</ThemedText>
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
                    {formatTagName(tag)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Nutritional Info (per serving)</ThemedText>
          <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Calories (kcal)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.calories.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, calories: { ...form.nutrients.calories, value: val } }
                  })}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Protein (g)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.protein.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, protein: { ...form.nutrients.protein, value: val } }
                  })}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Fat (g)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.fat.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, fat: { ...form.nutrients.fat, value: val } }
                  })}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Carbs (g)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.carbs.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, carbs: { ...form.nutrients.carbs, value: val } }
                  })}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Fiber (g)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.fibre.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, fibre: { ...form.nutrients.fibre, value: val } }
                  })}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />
              <View style={styles.nutrientInput}>
                <ThemedText style={[styles.nutrientLabel, { color: theme.textSecondary }]}>Serv. Size</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, paddingHorizontal: 0 }]}
                  placeholder="e.g. 250g"
                  placeholderTextColor={theme.textSecondary}
                  value={form.nutrients.serving.value}
                  onChangeText={(val: string) => setForm({
                    ...form,
                    nutrients: { ...form.nutrients, serving: { ...form.nutrients.serving, value: val } }
                  })}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Add-on Groups</ThemedText>
          <View style={{ gap: 8 }}>
            {addonGroups.length > 0 ? (
              addonGroups.map(group => {
                const isSelected = form.addonGroupIds.includes(group.id);
                return (
                  <Pressable
                    key={group.id}
                    onPress={() => {
                      setForm(prev => ({
                        ...prev,
                        addonGroupIds: isSelected 
                          ? prev.addonGroupIds.filter(id => id !== group.id)
                          : [...prev.addonGroupIds, group.id]
                      }));
                    }}
                    style={[
                      styles.addonOption,
                      { 
                        backgroundColor: isSelected ? theme.primary + '10' : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <ThemedText style={[styles.addonOptionName, { color: theme.text }]}>{group.name}</ThemedText>
                      <ThemedText style={{ color: theme.textSecondary, fontSize: 12 }}>
                        {group.minSelect} - {group.maxSelect} selections
                      </ThemedText>
                    </View>
                    {isSelected && <Check size={20} color={theme.primary} weight="bold" />}
                  </Pressable>
                );
              })
            ) : (
              <ThemedText style={{ color: theme.textSecondary, fontStyle: 'italic', paddingVertical: 8 }}>
                No add-on groups available. Create some in the Add-ons tab.
              </ThemedText>
            )}
          </View>
        </View>

        {params.itemId && (
          <TouchableOpacity 
            onPress={handleDelete}
            style={[styles.deleteItemBtn, { borderColor: theme.error + '40' }]}
          >
            <Trash size={20} color={theme.error} />
            <ThemedText style={{ color: theme.error, fontWeight: '700' }}>Delete Item</ThemedText>
          </TouchableOpacity>
        )}

      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 24 }]}>
        <Pressable 
          style={[styles.createBtn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText style={styles.createBtnText}>{params.itemId ? 'Save Changes' : 'Create Item'}</ThemedText>
          )}
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
    minWidth: 60,
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
  addonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  addonOptionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 40,
    gap: 10,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  draftNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  statusContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  nutrientRow: {
    flexDirection: 'row',
    height: 70,
  },
  nutrientInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  nutrientLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  verificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  verificationText: {
    ...Typography.Caption,
    flex: 1,
    fontWeight: '600',
    lineHeight: 18,
  },
});
