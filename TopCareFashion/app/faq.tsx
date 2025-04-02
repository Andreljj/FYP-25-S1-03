import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NavigationBar from './NavigationBar';

// Sample FAQ data
const faqData = [
  {
    id: "1",
    question: "How do I create an account?",
    answer: "To create an account, tap on the profile icon in the top-right corner of the screen and select 'Register'. Follow the prompts to enter your details and create your TOP CARE FASHION account."
  },
  {
    id: "2",
    question: "How can I track my order?",
    answer: "After logging in, navigate to 'My Orders' in your account dashboard. You'll find tracking information for all your recent orders there, including delivery status and estimated arrival dates."
  },
  {
    id: "3",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all unworn items with original tags attached. Returns can be initiated through your account dashboard. Please note that sale items and intimates are final sale and cannot be returned."
  },
  {
    id: "4",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping times and rates vary by location. You can see the estimated shipping cost at checkout before completing your purchase."
  },
  {
    id: "5",
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team through the 'Contact Us' form in the app, via email at support@topcarefashion.com, or by phone at +1-800-FASHION during business hours (Monday-Friday, 9am-5pm EST)."
  },
  {
    id: "6",
    question: "Are there any membership benefits?",
    answer: "Yes! Members earn points on every purchase, get access to exclusive sales, and receive special birthday offers. Higher membership tiers unlock additional benefits like free shipping and early access to new collections."
  }
];

// FAQItem Component - Simplified without animations to reduce possible errors
const FAQItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.questionContainer} 
        onPress={() => setExpanded(!expanded)} 
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#0077b3" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const router = useRouter();

  // Navigation items
  const categories = ["TOP", "BOTTOM", "FOOTWEAR", "ABOUT US", "FAQ"];

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Use the NavigationBar component instead of the separate header and nav bar */}
      <NavigationBar 
        activeTab="FAQ"
        showBackButton={true}
      />

      {/* FAQ Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        
        {faqData.map((faq) => (
          <FAQItem key={faq.id} item={faq} />
        ))}
        
        {/* Contact Support Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  faqItem: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
    color: "#333",
  },
  answerContainer: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  contactSection: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  contactButton: {
    backgroundColor: "#0077b3",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});