// app/data/mockData.tsx

// Define type interfaces for our data
export interface Product {
    id: string;
    name: string;
    price: number; // Ensure price is always a number
    image: string;
    category: string;
    size: string;
    condition: string;
    seller: string;
    gender: string;
    datePosted: Date; // Ensure dates are Date objects
    isNew?: boolean; // Optional field
  }
  
  export interface Deal extends Product {
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: string;
  }
  
  export interface Review {
    id: string;
    userName: string;
    userAvatar: string;
    productName: string;
    productImage: string;
    rating: number;
    text: string;
    date: string;
    helpful: number;
    productId: string;
  }
  
  export interface Testimonial {
    id: string;
    name: string;
    location: string;
    avatar: string;
    text: string;
    rating: number;
  }
  
  // Standardized mock products
  export const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Checkered H&M Shirt',
      price: 38.99, // Number, not string
      image: 'https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800',
      category: 'Tops',
      size: 'M',
      condition: 'Good',
      seller: 'fashionista22',
      gender: 'Men',
      datePosted: new Date('2024-10-15T14:30:00')
    },
    {
      id: '2',
      name: 'Varsity Jacket',
      price: 89.90,
      image: 'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600',
      category: 'Outerwear',
      size: 'L',
      condition: 'Like new',
      seller: 'vintage_vibes',
      gender: 'Men',
      datePosted: new Date('2024-11-19T10:30:00')
    },
    {
      id: '3',
      name: 'Safety Boots',
      price: 47.04,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: '42',
      condition: 'Good',
      seller: 'workwear_pro',
      gender: 'Men',
      datePosted: new Date('2024-11-20T14:30:00')
    },
    {
      id: '4',
      name: 'Patchwork Shirt',
      price: 30.10,
      image: 'https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800',
      category: 'Tops',
      size: 'S',
      condition: 'Good',
      seller: 'urban_threads',
      gender: 'Men',
      datePosted: new Date('2024-02-05T09:15:00')
    },
    {
      id: '5',
      name: 'Green Henley Top',
      price: 22.20,
      image: 'https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768',
      category: 'Tops',
      size: 'M',
      condition: 'Good',
      seller: 'eco_closet',
      gender: 'Women',
      datePosted: new Date('2024-12-01T11:45:00')
    },
    {
      id: '6',
      name: 'Designer Jeans',
      price: 120.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7d82871895686bc45483fa21a77c789f99c723e78805baf5f36fb4309afbc1b?w=600&h=600',
      category: 'Bottoms',
      size: 'XS',
      condition: 'New with tags',
      seller: 'luxe_styles',
      gender: 'Unisex',
      datePosted: new Date('2024-04-01T11:30:00')
    },
    {
      id: '7',
      name: 'Vintage Leather Jacket',
      price: 199.99,
      image: 'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600',
      category: 'Outerwear',
      size: 'XL',
      condition: 'Good',
      seller: 'retro_finds',
      gender: 'Men',
      datePosted: new Date('2024-06-20T14:45:00')
    },
    {
      id: '8',
      name: 'Summer Sundress',
      price: 45.00,
      image: 'https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768',
      category: 'Dresses',
      size: 'One Size',
      condition: 'Like new',
      seller: 'summer_vibes',
      gender: 'Women',
      datePosted: new Date('2024-08-15T13:40:00')
    },
    {
      id: '9',
      name: 'Work Boots',
      price: 85.75,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: 'XXL',
      condition: 'Poor',
      seller: 'work_essentials',
      gender: 'Men',
      datePosted: new Date('2024-10-05T09:45:00')
    },
    {
      id: '10',
      name: 'Wool Peacoat',
      price: 150.00,
      image: 'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600',
      category: 'Outerwear',
      size: 'L',
      condition: 'Poor',
      seller: 'winter_styles',
      gender: 'Men',
      datePosted: new Date('2024-09-30T15:10:00')
    },
    {
      id: '11',
      name: 'Beach Shorts',
      price: 18.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/0fdf057c93e0c5730986f0e8552b1cca33d30494ca3ff1aa51b41453106da332?w=600&h=600',
      category: 'Bottoms',
      size: 'L',
      condition: 'Like new',
      seller: 'bob_45',
      gender: 'Men',
      datePosted: new Date('2025-4-29T09:20:00')
    },
    {
      id: '12',
      name: 'Glamour Hys Girl Black T-shirt',
      price: 30.00,
      image: 'https://pfst.cf2.poecdn.net/base/image/0e4af12b60ff4c76d87d0bd651ae5a988492bed97358e107f0299c18fc512a19?w=600&h=600',
      category: 'Tops',
      size: 'S',
      condition: 'Like new',
      seller: 'sarah_yoyo',
      gender: 'Women',
      datePosted: new Date('2025-04-20T15:30:00')
    },
    {
      id: '13',
      name: 'Zara Blue Style T-shirt',
      price: 14.00,
      image: 'https://cdn.shopify.com/s/files/1/1754/6207/files/3f45453a-8694-44eb-a1d5-79b3e9761f6e.jpg.webp?v=1723194966',
      category: 'Tops',
      size: 'XL',
      condition: 'Good',
      seller: 'ram_tom',
      gender: 'Women',
      datePosted: new Date('2025-02-12T16:00:00')
    },
    {
      id: '14',
      name: 'Timberland Boots',
      price: 35.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: '48',
      condition: 'Like New',
      seller: 'drake_123',
      gender: 'Men',
      datePosted: new Date('2024-12-01T11:30:00')
    },
    {
      id: '15',
      name: 'Patchwork Bandana Shirt',
      price: 30.10,
      image: 'https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800',
      category: 'Tops',
      size: 'S',
      condition: 'Good',
      seller: 'urban_threads',
      gender: 'Men',
      datePosted: new Date('2024-10-28T13:15:00')
    },
    {
      id: '16',
      name: 'Checkered Flannel Shirt',
      price: 38.99,
      image: 'https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800',
      category: 'Tops',
      size: 'M',
      condition: 'Good',
      seller: 'fashionista22',
      gender: 'Men',
      datePosted: new Date('2024-11-19T10:30:00')
    },
    {
      id: '17',
      name: 'Full Sleeve Babydoll Top',
      price: 22.20,
      image: 'https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768',
      category: 'Tops',
      size: 'M',
      condition: 'Poor',
      seller: 'eco_closet',
      gender: 'Women',
      datePosted: new Date('2024-12-05T08:45:00')
    },
    {
      id: '18',
      name: 'Vintage Levi\'s Denim Shorts',
      price: 34.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/0fdf057c93e0c5730986f0e8552b1cca33d30494ca3ff1aa51b41453106da332?w=600&h=600',
      category: 'Bottoms',
      size: '28',
      condition: 'Good',
      seller: 'retro_closet',
      gender: 'Men',
      datePosted: new Date('2024-07-20T14:45:00')
    },
    {
      id: '19',
      name: 'Blue Tropical Print Swim Shorts',
      price: 18.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/0fdf057c93e0c5730986f0e8552b1cca33d30494ca3ff1aa51b41453106da332?w=600&h=600',
      category: 'Bottoms',
      size: 'L',
      condition: 'Like new',
      seller: 'bob_45',
      gender: 'Men',
      datePosted: new Date('2024-09-30T15:10:00')
    },
    {
      id: '20',
      name: 'Distressed Retro Wide Leg Jeans',
      price: 45.99,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7d82871895686bc45483fa21a77c789f99c723e78805baf5f36fb4309afbc1b?w=600&h=600',
      category: 'Bottoms',
      size: 'M',
      condition: 'Good',
      seller: 'denim_lover22',
      gender: 'Men',
      datePosted: new Date('2024-05-05T08:30:00')
    },
    {
      id: '21',
      name: 'Designer Jeans',
      price: 120.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7d82871895686bc45483fa21a77c789f99c723e78805baf5f36fb4309afbc1b?w=600&h=600',
      category: 'Bottoms',
      size: 'XS',
      condition: 'New with tags',
      seller: 'luxe_styles',
      gender: 'Unisex',
      datePosted: new Date('2024-11-10T16:15:00')
    },
    {
      id: '22',
      name: 'H&M Floral Summer Maxi Dress',
      price: 29.50,
      image: 'https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768',
      category: 'Dresses',
      size: 'L',
      condition: 'New with tags',
      seller: 'summer_styles',
      gender: 'Women',
      datePosted: new Date('2024-11-25T13:40:00')
    },
    {
      id: '25',
      name: 'High-Waisted Cargo Pants',
      price: 30.75,
      image: 'https://bananarepublic.gap.com/webcontent/0052/356/664/cn52356664.jpg',
      category: 'Bottoms',
      size: 'M',
      condition: 'Good',
      seller: 'urban_style',
      gender: 'Women',
      datePosted: new Date('2025-01-25T13:40:00')
    },
    {
      id: '26',
      name: 'Black Slim Fit Jeans',
      price: 42.99,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7d82871895686bc45483fa21a77c789f99c723e78805baf5f36fb4309afbc1b?w=600&h=600',
      category: 'Bottoms',
      size: '32',
      condition: 'Like new',
      seller: 'jeans_expert',
      gender: 'Men',
      datePosted: new Date('2025-04-08T10:20:00')
    },
    {
      id: '27',
      name: 'Nike Running Shoes',
      price: 65.99,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: '40',
      condition: 'Good',
      seller: 'sport_enthusiast',
      gender: 'Unisex',
      datePosted: new Date('2024-11-28T16:15:00')
    },
    {
      id: '28',
      name: 'Leather Loafers',
      price: 59.95,
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: '43',
      condition: 'New with tags',
      seller: 'formal_style',
      gender: 'Men',
      datePosted: new Date('2024-10-15T13:40:00')
    },
    {
      id: '29',
      name: 'Silver Heels',
      price: 42.50,
      image: 'https://i.ebayimg.com/images/g/uo0AAOSw0~JkcZG8/s-l400.jpg',
      category: 'Footwear',
      size: '38',
      condition: 'Like new',
      seller: 'fashion_queen',
      gender: 'Women',
      datePosted: new Date('2024-12-10T10:20:00')
    },
    {
      id: '30',
      name: 'Converse All Star Sneakers',
      price: 38.00, // Fixed: Now a number, not a string
      image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      category: 'Footwear',
      size: '41',
      condition: 'Good',
      seller: 'casual_wear',
      gender: 'Unisex',
      datePosted: new Date('2024-09-25T15:10:00')
    },
  ];
  
  // Derived data based on categories
  export const mockTops = mockProducts.filter(product => product.category === 'Tops');
  export const mockBottoms = mockProducts.filter(product => product.category === 'Bottoms');
  export const mockFootwear = mockProducts.filter(product => product.category === 'Footwear');
  export const mockOuterwear = mockProducts.filter(product => product.category === 'Outerwear');
  export const mockDresses = mockProducts.filter(product => product.category === 'Dresses');
  
  // Mock recent items (could be the most recently posted items)
  export const recentItems = [...mockProducts]
    .sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime())
    .slice(0, 5)
    .map(item => ({
      ...item,
      isNew: new Date().getTime() - item.datePosted.getTime() < 7 * 24 * 60 * 60 * 1000 // Added in last 7 days
    }));
  
  // Mock deals items
  export const dealsItems: Deal[] = [
    {
      ...mockProducts.find(p => p.id === '3')!,
      originalPrice: 47.04,
      discountedPrice: 34.18,
      discountPercentage: "-36%"
    },
    {
      ...mockProducts.find(p => p.id === '5')!,
      originalPrice: 22.20,
      discountedPrice: 16.10,
      discountPercentage: "-50%"
    },
    {
      ...mockProducts.find(p => p.id === '4')!,
      originalPrice: 30.10,
      discountedPrice: 21.54,
      discountPercentage: "-30%"
    },
    {
      ...mockProducts.find(p => p.id === '1')!,
      originalPrice: 38.99,
      discountedPrice: 29.99,
      discountPercentage: "-23%"
    },
    {
      ...mockProducts.find(p => p.id === '2')!,
      originalPrice: 89.90,
      discountedPrice: 65.00,
      discountPercentage: "-28%"
    }
  ];
  
  // Testimonials
  export const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah L.',
      location: 'Singapore',
      avatar: 'https://pfst.cf2.poecdn.net/base/image/3e362e4acf1f91aad71338afe0e75640ff00727cd0d2d739bbb559f80102e981?w=128&h=128',
      text: "Top Care Fashion made it super easy to sell my pre-loved clothes. I've made over $500 in just two months!",
      rating: 5
    },
    {
      id: '2',
      name: 'Mike T.',
      location: 'Singapore',
      avatar: 'https://pfst.cf2.poecdn.net/base/image/b66dd985e74bf5ccbcb82b1d2fcdc36f10b7b7a8261d7e4fe3b096b6cdfd79c8?w=128&h=128',
      text: "Great platform to find unique fashion pieces. The quality control is'Good - everything I've bought has been exactly as described.",
      rating: 5
    },
    {
      id: '3',
      name: 'Jenny K.',
      location: 'Singapore',
      avatar: 'https://pfst.cf2.poecdn.net/base/image/0749d9a8a95a6c9131d20bb1b0992437d5410867c5628fa09cfe7ec5a7e06aa0?w=128&h=128',
      text: "I love how easy it is to list items and connect with buyers. The payment system is secure and I always receive my money promptly.",
      rating: 4
    }
  ];
  
  // Reviews
  export const reviews: Review[] = [
    {
      id: 'r1',
      userName: 'Alex W.',
      userAvatar: 'https://pfst.cf2.poecdn.net/base/image/b66dd985e74bf5ccbcb82b1d2fcdc36f10b7b7a8261d7e4fe3b096b6cdfd79c8?w=128&h=128',
      productName: 'Varsity Jacket',
      productImage: 'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600',
      rating: 5,
      text: 'Amazing quality for the price! The jacket looks even better in person. Shipping was fast and seller was very responsive.',
      date: '2 days ago',
      helpful: 24,
      productId: '2'
    },
    {
      id: 'r2',
      userName: 'Emma S.',
      userAvatar: 'https://pfst.cf2.poecdn.net/base/image/3e362e4acf1f91aad71338afe0e75640ff00727cd0d2d739bbb559f80102e981?w=128&h=128',
      productName: 'Patchwork Shirt',
      productImage: 'https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800',
      rating: 4,
      text: 'Great shirt! The patchwork design is unique and stylish. Fits true to size. Taking off one star because delivery took longer than expected.',
      date: '1 week ago',
      helpful: 18,
      productId: '4'
    },
    {
      id: 'r3',
      userName: 'David K.',
      userAvatar: 'https://pfst.cf2.poecdn.net/base/image/243b40c76c456fe2e92adf550eba1c9b727221648fb5191e87d72cae1341cf0d?w=128&h=128',
      productName: 'Safety Boots',
      productImage: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225',
      rating: 5,
      text: 'These boots are perfect for work! Comfortable right out of the box and very durable. Seller was helpful with sizing questions.',
      date: '3 days ago',
      helpful: 31,
      productId: '3'
    }
  ];