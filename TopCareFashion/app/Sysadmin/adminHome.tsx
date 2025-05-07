import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminHomepageNavigationProp } from './types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: AdminHomepageNavigationProp;
};

const AdminHomepage: React.FC<Props> = ({ navigation }) => {
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const { logout } = useAuth(); 

  const menuItems = [
    { label: 'Product Category', screen: 'ProductCategory' },
    { label: 'FAQ', screen: 'Adminfaq' },
    { label: 'Feedback Form', screen: 'Adminfeedback' },
    { label: 'User Accounts', screen: 'UserAccounts' }, //for Nila to add
    { label: 'Stats', screen: 'Stats' },
  ];

  const renderScreen = () => {
    switch (selectedScreen) {
      case 'ProductCategory':
        return <ProductCategory />;
      case 'Adminfaq':
        return <Adminfaq />;
      case 'Adminfeedback':
        return <Adminfeedback />;
      case 'UserAccounts':
        return <UserAccounts />; 
      case 'Stats':
        return <Stats />; 
      default:
        return null;
    }
  };
  

  if (selectedScreen) {
    return renderScreen();
  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60 }}>
      {/* Top Navigation Bar */}
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#034F84' }}>
        <FontAwesome name="bars" size={20} color="white" /> {/* menu */}
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' }}>TOP CARE ADMIN</Text>
        <FontAwesome name="user" size={20} color="white" /> {/* user */}
      </View>

      {/* Welcome Message */}
      <Text style={{ textAlign: 'center', marginTop: 100, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Welcome System Admin</Text>

      {/* Menu Buttons */}
      <View style={{ marginTop: 10, width: '50%' }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: 'black', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6, marginVertical: 6, width: '100%', alignItems: 'center' }}
            onPress={() => setSelectedScreen(item.screen)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={{ backgroundColor: 'red', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, marginBottom: 10 }}
        onPress={logout}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminHomepage;
