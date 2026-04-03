import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  setSelectedRestaurantId, 
  setRestaurantOnline,
  fetchMyRestaurants
} from '@/store/slices/restaurantSlice';
import { RestaurantHeader } from '@/components/orders/RestaurantHeader';
import { RestaurantSwitcher } from '@/components/orders/RestaurantSwitcher';
import { useEffect } from 'react';

interface GlobalRestaurantHeaderProps {
  onBack?: () => void;
  title?: string;
  onTitlePress?: () => void;
}

export const GlobalRestaurantHeader = ({
  onBack,
  title,
  onTitlePress,
}: GlobalRestaurantHeaderProps) => {
  const dispatch = useDispatch();
  const { 
    myRestaurants, 
    selectedRestaurantId, 
    isOnline 
  } = useSelector((state: RootState) => state.restaurant);

  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);

  // Fetch restaurants if not already loaded
  useEffect(() => {
    if (myRestaurants.length === 0) {
      dispatch(fetchMyRestaurants() as any);
    }
  }, [dispatch, myRestaurants.length]);

  const currentRestaurant = useMemo(() => {
    const selected = myRestaurants.find(r => r.restaurant.id === selectedRestaurantId);
    if (selected) {
      return {
        id: selected.restaurant.id,
        name: selected.restaurant.name,
        locality: selected.restaurant.address || 'Managed Store'
      };
    }
    return {
      id: '',
      name: 'Select Restaurant',
      locality: 'Please choose a business'
    };
  }, [myRestaurants, selectedRestaurantId]);

  const switcherRestaurants = useMemo(() => {
    return myRestaurants.map(r => ({
      id: r.restaurant.id,
      name: r.restaurant.name,
      locality: r.restaurant.address || 'Managed Store'
    }));
  }, [myRestaurants]);

  const handleToggleStatus = () => {
    dispatch(setRestaurantOnline(!isOnline));
  };

  const handleSelectRestaurant = (restaurant: { id: string }) => {
    dispatch(setSelectedRestaurantId(restaurant.id));
    setIsSwitcherVisible(false);
  };

  return (
    <>
      <RestaurantHeader
        restaurantName={currentRestaurant.name}
        locality={currentRestaurant.locality}
        isOnline={isOnline}
        onToggleStatus={handleToggleStatus}
        onPressInfo={() => setIsSwitcherVisible(true)}
        onBack={onBack}
        title={title}
        onTitlePress={onTitlePress}
      />

      <RestaurantSwitcher
        visible={isSwitcherVisible}
        onClose={() => setIsSwitcherVisible(false)}
        restaurants={switcherRestaurants}
        selectedId={selectedRestaurantId || ''}
        onSelect={handleSelectRestaurant}
      />
    </>
  );
};
