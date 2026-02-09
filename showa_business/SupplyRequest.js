import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";


const { width } = Dimensions.get('window');

const ContractScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Supply");

  const contractData = [
    {
      id: "1",
      title: "General Contractor",
      company: "TopIncome Ng (Remote)",
      location: "Lagos",
      posted: "4d ago",
      applicants: "200+ applicants",
      salary: "₦120,000 - ₦150,000/mo"
    },
    {
      id: "2",
      title: "Construction Supervisor",
      company: "BuildRight Ltd",
      location: "Abuja",
      posted: "1d ago",
      applicants: "85 applicants",
      salary: "₦180,000 - ₦220,000/mo"
    },
    {
      id: "3",
      title: "Electrical Contractor",
      company: "PowerSolutions Inc",
      location: "Port Harcourt",
      posted: "1w ago",
      applicants: "150+ applicants",
      salary: "₦90,000 - ₦120,000/mo"
    },
    {
      id: "4",
      title: "Plumbing Specialist",
      company: "AquaFlow Services",
      location: "Ibadan",
      posted: "3d ago",
      applicants: "42 applicants",
      salary: "₦80,000 - ₦100,000/mo"
    },
  ];

  const tabs = [
    { id: "Supply", label: "Supply",screen:''},
    { id: "Explore", label: "Explore Services",  screen: 'SupplyServices' },
    // { id: "Deals", label: "Deals", screen:'' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contractCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SupplyRequestDetail')}
    >
      <View style={styles.contractIcon}>
        <Text style={styles.contractIconText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.contractDetails}>
        <Text style={styles.contractTitle}>{item.title}</Text>
        <Text style={styles.contractCompany}>{item.company}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="location-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{item.posted}</Text>
          </View>
        </View>
        
        <Text style={styles.salaryText}>{item.salary}</Text>
      </View>
      
      <View style={styles.contractActions}>
        <TouchableOpacity style={styles.saveButton}>
          <Icon name="bookmark-outline" size={18} color="#666" />
        </TouchableOpacity>
        
      </View>
    </TouchableOpacity>
  );

  const handlePress =(tab) =>{
    console.log('taps id', tab)
    if (tab.screen === 'SupplyServices'){
      navigation.navigate('SupplyServices');


    }else{
      console.log('no tap id found')
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supply at it Best</Text>
        
        <TouchableOpacity style={{marginLeft:40}} onPress={()=>navigation.navigate('CreateServices')}>
          <Icon name="add" size={27} color="#333" />
        </TouchableOpacity>
       
        
      </View>

      {/* Top Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab.id}
            style={[
              styles.tab, 
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => handlePress(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Hero Banner */}
      <ImageBackground
        source={require("../assets/images/dad.jpg")}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
          style={styles.bannerOverlay}
        />
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Quickly Connect With Suppliers</Text>
          <Text style={styles.bannerSubtitle}>
            Find reliable suppliers in minutes and get what you need with our verified network
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.bannerButtonPrimary} onPress={()=>navigation.navigate('RequesterPostHistory')}>
              <Text style={styles.bannerButtonText}>Track Supply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bannerButtonSecondary} onPress={()=>navigation.navigate('SupplyRequestForm')}>
              <Text style={styles.bannerButtonText}>Post New Supply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contracts or suppliers..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchText("")}
            >
              <Icon name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contract Listings */}
      <FlatList
        data={contractData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recommended For You</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f7fa" 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333'
  },
  tabContainer: {
    flexDirection: "row", 
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff'
  },
  tab: { 
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    position: 'relative'
  },
  tabText: { 
    color: "#666", 
    fontSize: 15,
    fontWeight: '500'
  },
  activeTab: { 
    // backgroundColor: "#f0f0f0" 
  },
  activeTabText: { 
    color: "#0d64dd", 
    fontWeight: "600" 
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#0d64dd',
    borderRadius: 3
  },
  banner: { 
    height: 180, 
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerImage: {
    resizeMode: 'cover'
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end'
  },
  bannerTitle: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 8 
  },
  bannerSubtitle: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 14, 
    marginBottom: 16,
    lineHeight: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bannerButtonPrimary: {
    backgroundColor: "#0d64dd",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8
  },
  bannerButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1
  },
  bannerButtonText: { 
    color: "#fff", 
    textAlign: "center",
    fontWeight: '500',
    fontSize: 14
  },
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 16,
    marginVertical: 8
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#333'
  },
  clearButton: {
    padding: 4
  },
  filterButton: {
    backgroundColor: "#0d64dd",
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 12
  },
  contractCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contractIcon: {
    backgroundColor: "#0d64dd",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  contractIconText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 20 
  },
  contractDetails: { 
    flex: 1 
  },
  contractTitle: { 
    fontWeight: "600", 
    fontSize: 16,
    color: '#333',
    marginBottom: 2
  },
  contractCompany: { 
    color: "#666",
    fontSize: 14,
    marginBottom: 8
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  metaText: {
    color: "#666",
    fontSize: 13,
    marginLeft: 4
  },
  salaryText: {
    color: '#0d64dd',
    fontWeight: '600',
    fontSize: 14
  },
  contractActions: {
    alignItems: 'center'
  },
  saveButton: {
    padding: 6,
    marginBottom: 8
  },
  applicantsText: {
    color: "#999",
    fontSize: 12
  },
  listContent: { 
    paddingBottom: 20 
  },
});

export default ContractScreen;
