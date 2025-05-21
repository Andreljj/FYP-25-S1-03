import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

interface AdminNavigationBarProps {
  showBackButton?: boolean;
}

const AdminNavigationBar = ({ showBackButton }: AdminNavigationBarProps) => {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'BonnieCondensedBlackItalic': require('../../assets/fonts/BonnieCondensedBlackItalic.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);
  
  const handleLogoPress = () => {
    router.push('/Sysadmin/adminHome');
  };
  
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={handleLogoPress}
      >
        <Text style={[
          styles.headerTitle,
          fontsLoaded && { fontFamily: 'BonnieCondensedBlackItalic' }
        ]}>
          TOP CARE FASHION
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0077b3',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default AdminNavigationBar;