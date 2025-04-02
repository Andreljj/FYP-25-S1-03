import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NavigationBar from './NavigationBar';

export default function AboutScreen() {

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Use the NavigationBar component instead of the separate header and nav bar */}
      <NavigationBar
        activeTab="ABOUT US"
      />

      {/* About Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>About Us</Text>

        {/* Company Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('./images/about us.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Our Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.paragraph}>
            TOP CARE FASHION was founded in 2020 with a simple yet powerful mission: to make sustainable fashion accessible to everyone while reducing textile waste. What began as a small online marketplace for pre-loved clothing has grown into a thriving community of fashion enthusiasts who value both style and sustainability.
          </Text>
          <Text style={styles.paragraph}>
            Our founder, Sarah Chen, was inspired to create the platform after witnessing firsthand the environmental impact of fast fashion during her years in the retail industry. She envisioned a marketplace where quality clothing could find new homes instead of ending up in landfills.
          </Text>
        </View>

        {/* Our Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.missionItem}>
            <Ionicons name="leaf" size={32} color="#0077b3" style={styles.missionIcon} />
            <View style={styles.missionText}>
              <Text style={styles.missionTitle}>Sustainability</Text>
              <Text style={styles.missionDescription}>
                We're committed to extending the lifecycle of clothing items, reducing waste and minimizing the fashion industry's environmental footprint.
              </Text>
            </View>
          </View>

          <View style={styles.missionItem}>
            <Ionicons name="people" size={32} color="#0077b3" style={styles.missionIcon} />
            <View style={styles.missionText}>
              <Text style={styles.missionTitle}>Community</Text>
              <Text style={styles.missionDescription}>
                We foster a supportive community of fashion lovers who share our values of sustainability, authenticity, and style.
              </Text>
            </View>
          </View>

          <View style={styles.missionItem}>
            <Ionicons name="shield-checkmark" size={32} color="#0077b3" style={styles.missionIcon} />
            <View style={styles.missionText}>
              <Text style={styles.missionTitle}>Quality</Text>
              <Text style={styles.missionDescription}>
                We verify every item on our platform to ensure our customers receive high-quality, authentic fashion products.
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.processContainer}>
            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>1</Text>
              </View>
              <Text style={styles.processTitle}>List Your Items</Text>
              <Text style={styles.processDescription}>
                Take photos of your quality items and create listings with detailed descriptions.
              </Text>
            </View>

            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>2</Text>
              </View>
              <Text style={styles.processTitle}>Connect with Buyers</Text>
              <Text style={styles.processDescription}>
                Respond to inquiries and negotiate prices with interested buyers.
              </Text>
            </View>

            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>3</Text>
              </View>
              <Text style={styles.processTitle}>Ship & Get Paid</Text>
              <Text style={styles.processDescription}>
                Ship items securely and receive payment through our protected payment system.
              </Text>
            </View>
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamContainer}>
            <View style={styles.teamMember}>
              <Image
                source={{ uri: "https://cdn.pixabay.com/photo/2023/10/17/03/23/child-8320341_640.png" }}
                style={styles.teamImage}
              />
              <Text style={styles.teamName}>Reshma & Celine</Text>
              <Text style={styles.teamRole}>Founder & CEO</Text>
            </View>

            <View style={styles.teamMember}>
              <Image
                source={{ uri: "https://res.cloudinary.com/ybmedia/image/upload/c_scale,f_auto,q_auto,w_1.35/v1/m/5/4/5400778035f154dfd64368d39291b4c0c85dc56a/thumb_16x9/cartoon-characters-century-already-iconic.jpg" }}
                style={styles.teamImage}
              />
              <Text style={styles.teamName}>Jhon & Andrew</Text>
              <Text style={styles.teamRole}>Head of Operations</Text>
            </View>

            <View style={styles.teamMember}>
              <Image
                source={{ uri: "https://pfst.cf2.poecdn.net/base/image/79889296ab05923fd20632e0b179db252b89207a1c204960cb10d6f681be4189?w=640&h=640" }}
                style={styles.teamImage}
              />
              <Text style={styles.teamName}>Nila & Ray</Text>
              <Text style={styles.teamRole}>Community Manager</Text>
            </View>
          </View>
        </View>

        {/* QR Code Section - Only visible on web */}
        {Platform.OS === 'web' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get Our Mobile App</Text>
            <View style={styles.downloadContainer}>
              <View style={styles.qrContainer}>
                {/* QR code image - replace with your actual QR code that links to your app */}
                <Image
                  source={{ uri: "https://www.emoderationskills.com/wp-content/uploads/2010/08/QR1.jpg" }}
                  style={styles.qrCode}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.downloadInfo}>
                <Text style={styles.downloadTitle}>Scan to Download</Text>
                <Text style={styles.downloadDescription}>
                  Scan this QR code with your phone's camera to download our app from the App Store or Google Play Store.
                </Text>
                <View style={styles.storeButtonsContainer}>
                  <TouchableOpacity style={styles.storeButton}>
                    <Ionicons name="logo-apple" size={20} color="white" />
                    <Text style={styles.storeButtonText}>App Store</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.storeButton}>
                    <Ionicons name="logo-google-playstore" size={20} color="white" />
                    <Text style={styles.storeButtonText}>Google Play</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Contact Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={24} color="#0077b3" style={styles.contactIcon} />
            <Text style={styles.contactText}>support@topcarefashion.com</Text>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="call" size={24} color="#0077b3" style={styles.contactIcon} />
            <Text style={styles.contactText}>+65 623 23 451 </Text>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="location" size={24} color="#0077b3" style={styles.contactIcon} />
            <Text style={styles.contactText}>123 Sustainable St, Fashion District, Singapore 10001</Text>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={28} color="#0077b3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={28} color="#0077b3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={28} color="#0077b3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-pinterest" size={28} color="#0077b3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra space at the bottom for better scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3"
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0077b3"
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BonnieCondensedBlackItalic",
    color: "white"
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#f8f8f8"
  },
  navItemContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  navItem: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10
  },
  activeNavItem: {
    color: "#0077b3",
    fontWeight: "700",
  },
  navSeparator: {
    fontSize: 16,
    color: "gray"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0077b3",
    marginVertical: 20,
    marginHorizontal: 15,
  },
  bannerContainer: {
    position: "relative",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: 180,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 25,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077b3",
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginBottom: 15,
  },
  missionItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  missionIcon: {
    marginRight: 15,
  },
  missionText: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  processContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  processStep: {
    width: "31%",
    alignItems: "center",
    marginBottom: 10,
  },
  processNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0077b3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  processNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  processTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  processDescription: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  teamContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  teamMember: {
    width: "31%",
    alignItems: "center",
    marginBottom: 15,
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  teamRole: {
    fontSize: 12,
    color: "#666",
  },
  // QR Code section styles
  downloadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  qrContainer: {
    marginRight: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  downloadInfo: {
    flex: 1,
    minWidth: 220,
  },
  downloadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  downloadDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  storeButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#0077b3",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  storeButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  // Contact section styles
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contactIcon: {
    marginRight: 15,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
});