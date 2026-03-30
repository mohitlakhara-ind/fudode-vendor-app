export interface Review {
  id: string;
  orderId: string;
  restaurantName: string;
  locality: string;
  userName: string;
  userImage?: string;
  userOrderCount: number;
  rating: number;
  date: string;
  comment: string;
  replyCount: number;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    orderId: '#1675',
    restaurantName: 'Muggs Cafe',
    locality: 'Balotra Locality',
    userName: 'bhagwan gehlot',
    userImage: 'https://i.pravatar.cc/150?u=bhagwan',
    userOrderCount: 0,
    rating: 1,
    date: '25 Dec, 2022 10:04 AM',
    comment: 'The food was late and cold. Very disappointed.',
    replyCount: 1,
  },
  {
    id: 'rev-2',
    orderId: '#6061',
    restaurantName: 'Muggs Cafe',
    locality: 'Balotra Locality',
    userName: 'dr. karan gaur',
    userImage: 'https://i.pravatar.cc/150?u=karan',
    userOrderCount: 5,
    rating: 5,
    date: '24 Dec, 2022 08:30 PM',
    comment: 'Excellent service and taste is always consistent. Highly recommended!',
    replyCount: 0,
  },
  {
    id: 'rev-3',
    orderId: '#4231',
    restaurantName: 'Muggs Cafe',
    locality: 'Balotra Locality',
    userName: 'anita sharma',
    userImage: 'https://i.pravatar.cc/150?u=anita',
    userOrderCount: 2,
    rating: 4,
    date: '23 Dec, 2022 01:15 PM',
    comment: 'Good food, but quantity could be a bit more for the price.',
    replyCount: 2,
  }
];

export const RATING_SUMMARY = {
  averageRating: 3.7,
  totalRatings: 245,
  totalReviews: 67,
};
