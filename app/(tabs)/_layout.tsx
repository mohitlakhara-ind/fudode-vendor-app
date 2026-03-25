import { Tabs } from 'expo-router';
import React from 'react';
import { CustomTabBar } from '@/components/CustomTabBar';
import { House, Package, Star, ChartBar, TrendUp, ForkKnife, CurrencyInr, DotsThreeCircle } from 'phosphor-react-native';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Live', 
          tabBarIcon: ({ color }) => <House size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="stock" 
        options={{ 
          title: 'Stock', 
          tabBarIcon: ({ color }) => <Package size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="reviews" 
        options={{ 
          title: 'Reviews', 
          tabBarIcon: ({ color }) => <Star size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard', 
          tabBarIcon: ({ color }) => <ChartBar size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="promotions" 
        options={{ 
          title: 'Growth', 
          tabBarIcon: ({ color }) => <TrendUp size={24} weight="bold" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="catalog" 
        options={{ 
          title: 'Menu', 
          tabBarIcon: ({ color }) => <ForkKnife size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="earnings" 
        options={{ 
          title: 'Finance', 
          tabBarIcon: ({ color }) => <CurrencyInr size={24} weight="fill" color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="more" 
        options={{ 
          title: 'More', 
          tabBarIcon: ({ color }) => <DotsThreeCircle size={24} weight="fill" color={color} /> 
        }} 
      />
    </Tabs>
  );
}
