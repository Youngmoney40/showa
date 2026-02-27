// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   TextInput,
// // //   FlatList,
// // //   StyleSheet,
// // //   ImageBackground,
// // //   Dimensions
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import Icon from "react-native-vector-icons/Ionicons";
// // // import LinearGradient from "react-native-linear-gradient";


// // // const { width } = Dimensions.get('window');

// // // const ContractScreen = ({ navigation }) => {
// // //   const [searchText, setSearchText] = useState("");
// // //   const [activeTab, setActiveTab] = useState("Supply");

 

// // //   const tabs = [
// // //     { id: "Supply", label: "Supply",screen:''},
// // //     { id: "Explore", label: "Explore Services",  screen: 'SupplyServices' },
  
// // //   ];

// // //   const renderItem = ({ item }) => (
// // //     <TouchableOpacity 
// // //       style={styles.contractCard}
// // //       activeOpacity={0.8}
// // //       onPress={() => navigation.navigate('SupplyRequestDetail')}
// // //     >
// // //       <View style={styles.contractIcon}>
// // //         <Text style={styles.contractIconText}>{item.title.charAt(0)}</Text>
// // //       </View>
// // //       <View style={styles.contractDetails}>
// // //         <Text style={styles.contractTitle}>{item.title}</Text>
// // //         <Text style={styles.contractCompany}>{item.company}</Text>
        
// // //         <View style={styles.metaContainer}>
// // //           <View style={styles.metaItem}>
// // //             <Icon name="location-outline" size={14} color="#666" />
// // //             <Text style={styles.metaText}>{item.location}</Text>
// // //           </View>
// // //           <View style={styles.metaItem}>
// // //             <Icon name="time-outline" size={14} color="#666" />
// // //             <Text style={styles.metaText}>{item.posted}</Text>
// // //           </View>
// // //         </View>
        
// // //         <Text style={styles.salaryText}>{item.salary}</Text>
// // //       </View>
      
// // //       <View style={styles.contractActions}>
// // //         <TouchableOpacity style={styles.saveButton}>
// // //           <Icon name="bookmark-outline" size={18} color="#666" />
// // //         </TouchableOpacity>
        
// // //       </View>
// // //     </TouchableOpacity>
// // //   );

// // //   const handlePress =(tab) =>{
// // //     console.log('taps id', tab)
// // //     if (tab.screen === 'SupplyServices'){
// // //       navigation.navigate('SupplyServices');


// // //     }else{
// // //       console.log('no tap id found')
// // //     }

// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <Text style={styles.headerTitle}>Find your Next Contact</Text>
        
// // //         <TouchableOpacity style={{marginLeft:40}} onPress={()=>navigation.navigate('CreateServices')}>
// // //           <Icon name="add" size={27} color="#333" />
// // //         </TouchableOpacity>
       
        
// // //       </View>

// // //       {/* Top Tabs */}
// // //       <View style={styles.tabContainer}>
// // //         {tabs.map(tab => (
// // //           <TouchableOpacity 
// // //             key={tab.id}
// // //             style={[
// // //               styles.tab, 
// // //               activeTab === tab.id && styles.activeTab
// // //             ]}
// // //             onPress={() => handlePress(tab)}
// // //           >
// // //             <Text style={[
// // //               styles.tabText,
// // //               activeTab === tab.id && styles.activeTabText
// // //             ]}>
// // //               {tab.label}
// // //             </Text>
// // //             {activeTab === tab.id && <View style={styles.tabIndicator} />}
// // //           </TouchableOpacity>
// // //         ))}
// // //       </View>

// // //       {/* Hero Banner */}
// // //       <ImageBackground
// // //         source={require("../assets/images/dad.jpg")}
// // //         style={styles.banner}
// // //         imageStyle={styles.bannerImage}
// // //       >
// // //         <LinearGradient
// // //           colors={['rgba(0,0,0,0.7)', 'rgba(32, 32, 32, 0.3)']}
// // //           style={styles.bannerOverlay}
// // //         />
// // //         <View style={styles.bannerContent}>
          
// // //           <Text style={styles.bannerTitle}>Quickly Connect With Suppliers</Text>
// // //           <Text style={styles.bannerSubtitle}>
// // //             Find reliable suppliers in minutes and get what you need with our verified network
// // //           </Text>
// // //           <View style={styles.buttonRow}>
// // //             <TouchableOpacity style={styles.bannerButtonPrimary} onPress={()=>navigation.navigate('RequesterPostHistory')}>
// // //               <Text style={styles.bannerButtonText}>Track Supply</Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity style={styles.bannerButtonSecondary} onPress={()=>navigation.navigate('SupplyRequestForm')}>
// // //               <Text style={styles.bannerButtonText}>Post New Supply</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       </ImageBackground>

     
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { 
// // //     flex: 1, 
// // //     backgroundColor: "#f5f7fa" 
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 15,
// // //     backgroundColor: '#ffffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee'
// // //   },
// // //   headerTitle: {
// // //     fontSize: 26,
// // //     fontWeight: '700',
// // //     color: '#333'
// // //   },
// // //   tabContainer: {
// // //     flexDirection: "row", 
// // //     paddingHorizontal: 10,
// // //     paddingTop: 10,
// // //     backgroundColor: '#fff'
// // //   },
// // //   tab: { 
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     marginRight: 8,
// // //     position: 'relative'
// // //   },
// // //   tabText: { 
// // //     color: "#666", 
// // //     fontSize: 15,
// // //     fontWeight: '500'
// // //   },
// // //   activeTab: { 
// // //     // backgroundColor: "#f0f0f0" 
// // //   },
// // //   activeTabText: { 
// // //     color: "#0d64dd", 
// // //     fontWeight: "600" 
// // //   },
// // //   tabIndicator: {
// // //     position: 'absolute',
// // //     bottom: 4,
// // //     left: 16,
// // //     right: 16,
// // //     height: 3,
// // //     backgroundColor: '#0d64dd',
// // //     borderRadius: 3
// // //   },
// // //   banner: { 
// // //     height: 580, 
  
// // //     borderRadius: 1,
// // //     overflow: 'hidden',
// // //     elevation: 3,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //   },
// // //   bannerImage: {
// // //     resizeMode: 'cover'
// // //   },
// // //   bannerOverlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //   },
// // //   bannerContent: {
// // //     flex: 1,
// // //     padding: 30,
// // //     justifyContent: 'flex-end'
// // //   },
// // //   bannerTitle: { 
// // //     color: "#fff", 
// // //     fontSize: 50, 
// // //     fontWeight: "bold", 
// // //     marginBottom: 8 
// // //   },
// // //   bannerSubtitle: { 
// // //     color: "rgba(255,255,255,0.9)", 
// // //     fontSize: 14, 
// // //     marginBottom: 16,
// // //     lineHeight: 20
// // //   },
// // //   buttonRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between'
// // //   },
// // //   bannerButtonPrimary: {
// // //     backgroundColor: "#0d64dd",
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 8,
// // //     flex: 1,
// // //     marginRight: 8
// // //   },
// // //   bannerButtonSecondary: {
// // //     backgroundColor: "rgba(255,255,255,0.2)",
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.3)',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 8,
// // //     flex: 1
// // //   },
// // //   bannerButtonText: { 
// // //     color: "#fff", 
// // //     textAlign: "center",
// // //     fontWeight: '500',
// // //     fontSize: 14
// // //   },
// // //   searchContainer: { 
// // //     flexDirection: "row", 
// // //     alignItems: "center", 
// // //     paddingHorizontal: 16,
// // //     marginVertical: 8
// // //   },
// // //   searchInputContainer: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     paddingHorizontal: 12,
// // //     height: 48,
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 2,
// // //   },
// // //   searchIcon: {
// // //     marginRight: 8
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     height: '100%',
// // //     fontSize: 15,
// // //     color: '#333'
// // //   },
// // //   clearButton: {
// // //     padding: 4
// // //   },
// // //   filterButton: {
// // //     backgroundColor: "#0d64dd",
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginLeft: 10,
// // //     elevation: 2
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#333',
// // //     marginLeft: 16,
// // //     marginTop: 8,
// // //     marginBottom: 12
// // //   },
// // //   contractCard: {
// // //     backgroundColor: "#fff",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     padding: 16,
// // //     marginHorizontal: 16,
// // //     marginBottom: 12,
// // //     borderRadius: 12,
// // //     elevation: 1,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //   },
// // //   contractIcon: {
// // //     backgroundColor: "#0d64dd",
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 12,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     marginRight: 12
// // //   },
// // //   contractIconText: { 
// // //     color: "#fff", 
// // //     fontWeight: "bold",
// // //     fontSize: 20 
// // //   },
// // //   contractDetails: { 
// // //     flex: 1 
// // //   },
// // //   contractTitle: { 
// // //     fontWeight: "600", 
// // //     fontSize: 16,
// // //     color: '#333',
// // //     marginBottom: 2
// // //   },
// // //   contractCompany: { 
// // //     color: "#666",
// // //     fontSize: 14,
// // //     marginBottom: 8
// // //   },
// // //   metaContainer: {
// // //     flexDirection: 'row',
// // //     marginBottom: 8
// // //   },
// // //   metaItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginRight: 16
// // //   },
// // //   metaText: {
// // //     color: "#666",
// // //     fontSize: 13,
// // //     marginLeft: 4
// // //   },
// // //   salaryText: {
// // //     color: '#0d64dd',
// // //     fontWeight: '600',
// // //     fontSize: 14
// // //   },
// // //   contractActions: {
// // //     alignItems: 'center'
// // //   },
// // //   saveButton: {
// // //     padding: 6,
// // //     marginBottom: 8
// // //   },
// // //   applicantsText: {
// // //     color: "#999",
// // //     fontSize: 12
// // //   },
// // //   listContent: { 
// // //     paddingBottom: 20 
// // //   },
// // // });

// // // export default ContractScreen;
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   ImageBackground,
// //   Dimensions,
// //   StatusBar,
// //   Platform,
// //   ScrollView
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import Icon from "react-native-vector-icons/Ionicons";
// // import LinearGradient from "react-native-linear-gradient";

// // const { width, height } = Dimensions.get('window');

// // const ContractScreen = ({ navigation }) => {
// //   const [activeTab, setActiveTab] = useState("Explore");

// //   const contractData = [
// //     {
// //       id: "1",
// //       title: "General Contractor",
// //       company: "TopIncome Ng",
// //       location: "Lagos",
// //       posted: "4d ago",
// //       applicants: "200+",
// //       salary: "₦120k - ₦150k/mo",
// //       isRemote: true,
// //       type: "Full-time",
// //       icon: "🏗️"
// //     },
// //     {
// //       id: "2",
// //       title: "Construction Supervisor",
// //       company: "BuildRight Ltd",
// //       location: "Abuja",
// //       posted: "1d ago",
// //       applicants: "85",
// //       salary: "₦180k - ₦220k/mo",
// //       isRemote: false,
// //       type: "Contract",
// //       icon: "👷"
// //     },
// //     {
// //       id: "3",
// //       title: "Electrical Contractor",
// //       company: "PowerSolutions Inc",
// //       location: "Port Harcourt",
// //       posted: "1w ago",
// //       applicants: "150+",
// //       salary: "₦90k - ₦120k/mo",
// //       isRemote: false,
// //       type: "Full-time",
// //       icon: "⚡"
// //     },
// //     {
// //       id: "4",
// //       title: "Plumbing Specialist",
// //       company: "AquaFlow Services",
// //       location: "Ibadan",
// //       posted: "3d ago",
// //       applicants: "42",
// //       salary: "₦80k - ₦100k/mo",
// //       isRemote: false,
// //       type: "Part-time",
// //       icon: "🔧"
// //     },
// //     {
// //       id: "5",
// //       title: "HVAC Technician",
// //       company: "Climate Control Ltd",
// //       location: "Lagos",
// //       posted: "2d ago",
// //       applicants: "67",
// //       salary: "₦150k - ₦200k/mo",
// //       isRemote: false,
// //       type: "Full-time",
// //       icon: "❄️"
// //     },
// //     {
// //       id: "6",
// //       title: "Site Manager",
// //       company: "Urban Development",
// //       location: "Abuja",
// //       posted: "5d ago",
// //       applicants: "34",
// //       salary: "₦250k - ₦300k/mo",
// //       isRemote: false,
// //       type: "Full-time",
// //       icon: "🏢"
// //     },
// //   ];

// //   const tabs = [
// //     { id: "Supply", label: "Supply", screen: '' },
// //     { id: "Explore", label: "Explore Services", screen: 'SupplyServices' },
// //   ];

// //   const renderItem = ({ item, index }) => (
// //     <TouchableOpacity
// //       style={styles.contractCard}
// //       activeOpacity={0.7}
// //       onPress={() => navigation.navigate('SupplyRequestDetail', { contract: item })}
// //     >
// //       <View style={styles.cardGradient}>
// //         <LinearGradient
// //           colors={['#050da3ff', '#041bebff']}
// //           style={styles.cardContent}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //         >
          

// //           <View style={styles.cardBody}>
// //             <Text style={[styles.contractTitle,{color:'#fff',fontSize:23}]}>EXplore Services</Text>
// //             {/* <Text style={styles.contractCompany}>{item.company}</Text> */}

// //             {/* <View style={styles.metaGrid}>
// //               <View style={styles.metaItem}>
// //                 <Icon name="location-outline" size={14} color="#6B7280" />
// //                 <Text style={styles.metaText}>{item.location}</Text>
// //               </View>
// //               <View style={styles.metaItem}>
// //                 <Icon name="time-outline" size={14} color="#6B7280" />
// //                 <Text style={styles.metaText}>{item.posted}</Text>
// //               </View>
// //               <View style={styles.metaItem}>
// //                 <Icon name="people-outline" size={14} color="#6B7280" />
// //                 <Text style={styles.metaText}>{item.applicants} applicants</Text>
// //               </View>
// //             </View> */}
// //           </View>

// //           {/* <View style={styles.cardFooter}>
// //             <View>
// //               <Text style={styles.salaryLabel}>Monthly Salary</Text>
// //               <Text style={styles.salaryText}>{item.salary}</Text>
// //             </View>
// //             <TouchableOpacity style={styles.applyButton}>
// //               <LinearGradient
// //                 colors={['#2563EB', '#1D4ED8']}
// //                 style={styles.applyGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 0 }}
// //               >
// //                 <Text style={styles.applyButtonText}>Apply Now</Text>
// //                 <Icon name="arrow-forward-outline" size={16} color="#FFFFFF" />
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </View> */}
// //         </LinearGradient>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   const handlePress = (tab) => {
// //     setActiveTab(tab.id);
// //     if (tab.screen === 'SupplyServices') {
// //       navigation.navigate('SupplyRequestDetail');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

// //       {/* Full Screen Image Banner */}
// //       <ImageBackground
// //         source={require("../assets/images/dad.jpg")}
// //         style={styles.fullBanner}
// //         imageStyle={styles.bannerImage}
// //       >
// //         <LinearGradient
// //           colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)', '#000000']}
// //           style={styles.fullBannerOverlay}
// //           locations={[0, 0.5, 1]}
// //         />
        
// //         <SafeAreaView style={styles.bannerContent} edges={['top']}>
// //           {/* Header */}
// //           <View style={styles.bannerHeader}>
// //             <TouchableOpacity style={styles.backButton}>
// //               <Icon name="arrow-back-outline" size={24} color="#FFFFFF" />
// //             </TouchableOpacity>
// //             <View style={styles.headerActions}>
// //               <TouchableOpacity style={styles.iconButton}>
// //                 <Icon name="notifications-outline" size={22} color="#FFFFFF" />
// //               </TouchableOpacity>
// //               <TouchableOpacity 
// //                 style={styles.addButton}
// //                 onPress={() => navigation.navigate('CreateServices')}
// //               >
// //                 <Icon name="add" size={24} color="#FFFFFF" />
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {/* Banner Text */}
// //           <View style={styles.bannerTextContainer}>
// //             <View style={styles.welcomeTag}>
// //               <Icon name="flash" size={16} color="#FBBF24" />
// //               <Text style={styles.welcomeText}>Find Your Next Contract</Text>
// //             </View>
            
// //             <Text style={styles.bannerMainTitle}>
// //               Connect with top{'\n'}industry professionals
// //             </Text>
            
// //             <Text style={styles.bannerDescription}>
// //               Join thousands of contractors finding opportunities in construction, engineering, and more
// //             </Text>

// //             <View style={styles.statsContainer}>
// //               <View style={styles.statItem}>
// //                 <Text style={styles.statNumber}>2.5k+</Text>
// //                 <Text style={styles.statLabel}>Active Contracts</Text>
// //               </View>
// //               <View style={styles.statDivider} />
// //               <View style={styles.statItem}>
// //                 <Text style={styles.statNumber}>500+</Text>
// //                 <Text style={styles.statLabel}>Companies</Text>
// //               </View>
// //               <View style={styles.statDivider} />
// //               <View style={styles.statItem}>
// //                 <Text style={styles.statNumber}>95%</Text>
// //                 <Text style={styles.statLabel}>Success Rate</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </SafeAreaView>
// //       </ImageBackground>

// //       {/* Main Content - Explore Services */}
// //       <View style={styles.mainContent}>
// //         {/* Tabs */}
// //         <View style={styles.tabWrapper}>
// //           <View style={styles.tabContainer}>
// //             {tabs.map(tab => (
// //               <TouchableOpacity
// //                 key={tab.id}
// //                 style={[
// //                   styles.tab,
// //                   activeTab === tab.id && styles.activeTab
// //                 ]}
// //                 onPress={() => handlePress(tab)}
// //               >
// //                 <Text style={[
// //                   styles.tabText,
// //                   activeTab === tab.id && styles.activeTabText
// //                 ]}>
// //                   {tab.label}
// //                 </Text>
// //                 {activeTab === tab.id && (
// //                   <LinearGradient
// //                     colors={['#2563EB', '#1D4ED8']}
// //                     style={styles.tabIndicator}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                   />
// //                 )}
// //               </TouchableOpacity>
// //             ))}
// //           </View>
          
// //           <TouchableOpacity style={styles.filterChip}>
// //             <Icon name="options-outline" size={18} color="#2563EB" />
// //             <Text style={styles.filterText}>Filter</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Section Header */}
// //         <View style={styles.sectionHeader}>
// //           <View>
// //             <Text style={styles.sectionTitle}>Available Contracts</Text>
// //             <Text style={styles.sectionSubtitle}>{contractData.length} opportunities found</Text>
// //           </View>
// //           <TouchableOpacity>
// //             <Text style={styles.seeAllText}>View All</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Contracts List */}
// //         <FlatList
// //           data={contractData}
// //           renderItem={renderItem}
// //           keyExtractor={item => item.id}
// //           contentContainerStyle={styles.listContent}
// //           showsVerticalScrollIndicator={false}
// //           ListFooterComponent={<View style={styles.footer} />}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F3F4F6',
// //   },
// //   fullBanner: {
// //     width: width,
// //     height: height * 0.55,
// //   },
// //   bannerImage: {
// //     resizeMode: 'cover',
// //   },
// //   fullBannerOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //   },
// //   bannerContent: {
// //     flex: 1,
// //     paddingHorizontal: 20,
// //     justifyContent: 'space-between',
// //     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
// //   },
// //   bannerHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   backButton: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: 'rgba(255,255,255,0.15)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   headerActions: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   iconButton: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: 'rgba(255,255,255,0.15)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   addButton: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: '#2563EB',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: '#2563EB',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   bannerTextContainer: {
// //     marginBottom: 30,
// //   },
// //   welcomeTag: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255,255,255,0.15)',
// //     alignSelf: 'flex-start',
// //     paddingHorizontal: 14,
// //     paddingVertical: 8,
// //     borderRadius: 30,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //     gap: 6,
// //   },
// //   welcomeText: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   bannerMainTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 34,
// //     fontWeight: '700',
// //     lineHeight: 42,
// //     letterSpacing: -0.5,
// //     marginBottom: 12,
// //   },
// //   bannerDescription: {
// //     color: 'rgba(255,255,255,0.8)',
// //     fontSize: 15,
// //     lineHeight: 22,
// //     marginBottom: 24,
// //     maxWidth: '90%',
// //   },
// //   statsContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255,255,255,0.1)',
// //     borderRadius: 20,
// //     padding: 16,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.15)',
// //   },
// //   statItem: {
// //     flex: 1,
// //     alignItems: 'center',
// //   },
// //   statNumber: {
// //     color: '#FFFFFF',
// //     fontSize: 20,
// //     fontWeight: '700',
// //     marginBottom: 4,
// //   },
// //   statLabel: {
// //     color: 'rgba(255,255,255,0.7)',
// //     fontSize: 12,
// //   },
// //   statDivider: {
// //     width: 1,
// //     height: 30,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //   },
// //   mainContent: {
// //     flex: 1,
// //     backgroundColor: '#F3F4F6',
// //     borderTopLeftRadius: 30,
// //     borderTopRightRadius: 30,
// //     marginTop: -30,
// //     paddingTop: 20,
// //   },
// //   tabWrapper: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 20,
// //     marginBottom: 16,
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 16,
// //     padding: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   tab: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //     borderRadius: 12,
// //     position: 'relative',
// //   },
// //   tabText: {
// //     color: "#6B7280",
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   activeTabText: {
// //     color: "#2563EB",
// //   },
// //   tabIndicator: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 12,
// //     right: 12,
// //     height: 3,
// //     borderRadius: 3,
// //   },
// //   filterChip: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#FFFFFF',
// //     paddingHorizontal: 14,
// //     paddingVertical: 10,
// //     borderRadius: 16,
// //     gap: 6,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   filterText: {
// //     color: '#2563EB',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     paddingBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#1F2937',
// //     marginBottom: 4,
// //   },
// //   sectionSubtitle: {
// //     fontSize: 13,
// //     color: '#6B7280',
// //   },
// //   seeAllText: {
// //     fontSize: 14,
// //     color: '#2563EB',
// //     fontWeight: '600',
// //   },
// //   contractCard: {
// //     marginHorizontal: 20,
// //     marginBottom: 16,
// //     borderRadius: 20,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 4 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 12,
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   cardGradient: {
// //     borderRadius: 20,
// //     overflow: 'hidden',
// //   },
// //   cardContent: {
// //     padding: 16,
// //     borderWidth: 1,
// //     borderColor: '#F0F0F0',
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   iconContainer: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 14,
// //     backgroundColor: '#F3F4F6',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   contractIcon: {
// //     fontSize: 24,
// //   },
// //   cardHeaderRight: {
// //     flexDirection: 'row',
// //     gap: 8,
// //   },
// //   remoteBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#E0F2FE',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 20,
// //     gap: 4,
// //   },
// //   remoteText: {
// //     color: '#0369A1',
// //     fontSize: 11,
// //     fontWeight: '600',
// //   },
// //   typeBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 20,
// //   },
// //   fullTimeBadge: {
// //     backgroundColor: '#E0F2FE',
// //   },
// //   partTimeBadge: {
// //     backgroundColor: '#FEF3C7',
// //   },
// //   contractBadge: {
// //     backgroundColor: '#E0E7FF',
// //   },
// //   typeText: {
// //     fontSize: 11,
// //     fontWeight: '600',
// //   },
// //   cardBody: {
// //     marginBottom: 12,
// //   },
// //   contractTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#1F2937',
// //     marginBottom: 4,
// //   },
// //   contractCompany: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //     marginBottom: 10,
// //   },
// //   metaGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 12,
// //   },
// //   metaItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //     backgroundColor: '#F3F4F6',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //   },
// //   metaText: {
// //     color: '#6B7280',
// //     fontSize: 12,
// //   },
// //   cardFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     borderTopWidth: 1,
// //     borderTopColor: '#F0F0F0',
// //     paddingTop: 12,
// //   },
// //   salaryLabel: {
// //     fontSize: 11,
// //     color: '#9CA3AF',
// //     marginBottom: 2,
// //   },
// //   salaryText: {
// //     color: '#2563EB',
// //     fontWeight: '700',
// //     fontSize: 16,
// //   },
// //   applyButton: {
// //     overflow: 'hidden',
// //     borderRadius: 12,
// //   },
// //   applyGradient: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     gap: 8,
// //   },
// //   applyButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 13,
// //     fontWeight: '600',
// //   },
// //   listContent: {
// //     paddingBottom: 100,
// //   },
// //   footer: {
// //     height: 20,
// //   },
// // });

// // export default ContractScreen;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   StatusBar,
//   Platform,
//   SafeAreaView,
//   Modal,
//   ScrollView,
//   Animated,
//   ImageBackground,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
// import LinearGradient from "react-native-linear-gradient";

// const { width, height } = Dimensions.get("window");

// const ServicesScreen = ({ navigation }) => {
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     professionals: 0,
//     successRate: 98
//   });

//   // Animation for modal
//   const slideAnimation = useRef(new Animated.Value(height)).current;

//   // Fetch categories
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch services
//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_ROUTE}/services/categories/`);
//       const data = await response.json();
//       if (data.success) {
//         setCategories([{ id: "all", name: "All Services" }, ...data.data.categories]);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchServices = async (pageNum = 1, shouldRefresh = false) => {
//     try {
//       if (pageNum === 1) {
//         setLoading(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const response = await fetch(
//         `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
//       );
//       const data = await response.json();
//       console.log('fetc data', data)

//       if (data.success) {

//         if (shouldRefresh || pageNum === 1) {
//           setServices(data.data.posts);
//           setFilteredServices(data.data.posts);
//           // Update stats
//           setStats({
//             total: data.data.pagination.total_count || data.data.posts.length,
//             professionals: new Set(data.data.posts.map(p => p.user)).size,
//             successRate: 98
//           });
//         } else {
//           setServices((prev) => [...prev, ...data.data.posts]);
//           setFilteredServices((prev) => [...prev, ...data.data.posts]);
//         }
//         setHasMore(data.data.pagination.has_next);
//         setPage(pageNum);
//       }
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//     fetchServices(1, true);
//   };

//   const handleLoadMore = () => {
//     if (hasMore && !loadingMore) {
//       fetchServices(page + 1);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     if (text.trim() === "") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter(
//         (service) =>
//           service.title.toLowerCase().includes(text.toLowerCase()) ||
//           service.company?.toLowerCase().includes(text.toLowerCase()) ||
//           service.description?.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredServices(filtered);
//     }
//   };

//   const handleCategoryFilter = (categoryId) => {
//     setSelectedCategory(categoryId);
//     if (categoryId === "all") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter((service) =>
//         service.categories?.includes(parseInt(categoryId))
//       );
//       setFilteredServices(filtered);
//     }
//   };

//   const openServiceDetails = (service) => {
//     setSelectedService(service);
//     setModalVisible(true);
//     Animated.timing(slideAnimation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.timing(slideAnimation, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setModalVisible(false);
//       setSelectedService(null);
//     });
//   };

//   // Navigate to service page when user taps (new function)
//   const navigateToServicePage = (service) => {
//     navigation.navigate('SupplyRequestDetail', { serviceId: service.id, serviceData: service });
//   };

//   const renderServiceCard = ({ item, index }) => (
//     <TouchableOpacity
//       style={[styles.serviceCard, index === 0 && styles.firstCard]}
//       onPress={() => navigateToServicePage(item)} 
//       activeOpacity={0.7}
//     >
//       <LinearGradient
//         colors={['#FFFFFF', '#F9FAFB']}
//         style={styles.cardGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <View style={styles.cardLeftBorder} />
        
//         <View style={styles.cardHeader}>
//           {item.images && item.images.length > 0 ? (
//             <Image
//               source={{ uri: item.images[0].image || 'https://cdn-icons-png.flaticon.com/512/11966/11966894.png'}}
//               style={styles.serviceImage}
//             />
//           ) : (
//             <View style={[styles.serviceImage, styles.placeholderImage]}>
//               <MaterialIcon name="business-center" size={30} color="#CBD5E0" />
//             </View>
//           )}
          
//           <View style={styles.cardHeaderContent}>
//             <View style={styles.titleRow}>
//               <Text style={styles.serviceTitle} numberOfLines={1}>
//                 {item.title}
//               </Text>
//               {item.is_verified && (
//                 <View style={styles.verifiedBadge}>
//                   <Icon name="checkmark-circle" size={16} color="#10B981" />
//                 </View>
//               )}
//             </View>
            
//             <Text style={styles.companyName}>{item.company || "Individual Provider"}</Text>
            
            
//           </View>
//         </View>

//         <View style={styles.cardBody}>
//           <View style={styles.priceContainer}>
//             <Text style={styles.priceLabel}>Starting from</Text>
//             <Text style={styles.priceText}>${item.price_range || "₦50k - ₦200k"}</Text>
//           </View>

//           <View style={styles.metaContainer}>
//             <View style={styles.metaItem}>
//               <Icon name="location-outline" size={14} color="#6B7280" />
//               <Text style={styles.metaText} numberOfLines={1}>
//                 {item.location || "Nigeria"}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Icon name="time-outline" size={14} color="#6B7280" />
//               <Text style={styles.metaText}>Posted {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.cardFooter}>
//           <View style={styles.userInfo}>
//             <Image
//               source={
//                 item.user_profile_picture
//                   ? { uri: `${API_ROUTE_IMAGE}${item.user_profile_picture}` }
//                   : require("../assets/images/avatar/blank-profile-picture-973460_1280.png")
//               }
//               style={styles.userAvatar}
//             />
//             <Text style={styles.userName}>{item.user_name.slice(0,20)+'...' || "Provider"}</Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.detailsButton}
//             onPress={() => navigateToServicePage(item)}
//           >
//             <Text style={styles.detailsButtonText}>See All</Text>
//             <Icon name="arrow-forward" size={14} color="#2563EB" />
//           </TouchableOpacity>
//         </View>

//         {item.category_names && item.category_names.length > 0 && (
//           <View style={styles.categoryTags}>
//             {item.category_names.slice(0, 2).map((cat, index) => (
//               <View key={index} style={styles.categoryTag}>
//                 <Text style={styles.categoryTagText}>{cat}</Text>
//               </View>
//             ))}
//             {item.category_names.length > 2 && (
//               <View style={styles.categoryTag}>
//                 <Text style={styles.categoryTagText}>+{item.category_names.length - 2}</Text>
//               </View>
//             )}
//           </View>
//         )}
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   const renderCategoryChip = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryChip,
//         selectedCategory === item.id && styles.categoryChipActive,
//       ]}
//       onPress={() => handleCategoryFilter(item.id)}
//     >
//       <Text
//         style={[
//           styles.categoryChipText,
//           selectedCategory === item.id && styles.categoryChipTextActive,
//         ]}
//       >
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderFooter = () => {
//     if (!loadingMore) return null;
//     return (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color="#2563EB" />
//         <Text style={styles.footerLoaderText}>Loading more services...</Text>
//       </View>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <MaterialIcon name="search-off" size={60} color="#CBD5E0" />
//       <Text style={styles.emptyStateTitle}>No Services Found</Text>
//       <Text style={styles.emptyStateText}>
//         {searchQuery
//           ? "Try adjusting your search or filters"
//           : "Be the first to post a service"}
//       </Text>
//       {!searchQuery && (
//         <TouchableOpacity 
//           style={styles.createButton}
//           onPress={() => navigation.navigate("CreateService")}
//         >
//           <Text style={styles.createButtonText}>Create Service</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//       {/* Header Banner */}
//       <ImageBackground
//         source={require("../assets/images/dad.jpg")}
//         style={styles.headerBanner}
//         imageStyle={styles.bannerImage}
//       >
//         <LinearGradient
//           colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)', '#000000']}
//           style={styles.bannerOverlay}
//           locations={[0, 0.5, 1]}
//         />
        
//         <SafeAreaView style={styles.bannerContent} edges={['top']}>
//           <View style={styles.bannerHeader}>
//             <TouchableOpacity 
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Icon name="arrow-back" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//             <View style={styles.headerActions}>
              
//               <TouchableOpacity 
//                 style={styles.addButton}
//                 onPress={() => navigation.navigate("CreateService")}
//               >
//                 <Icon name="add" size={24} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.bannerTextContainer}>
//             <View style={styles.welcomeTag}>
//               <Icon name="flash" size={16} color="#FBBF24" />
//               <Text style={styles.welcomeText}>Professional Services</Text>
//             </View>
            
//             <Text style={styles.bannerMainTitle}>
//               Find trusted{'\n'}service providers
//             </Text>
            
//             <Text style={styles.bannerDescription}>
//               Connect with verified professionals for all your service needs
//             </Text>

//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{stats.total}+</Text>
//                 <Text style={styles.statLabel}>Services</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{stats.professionals}+</Text>
//                 <Text style={styles.statLabel}>Professionals</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{stats.successRate}%</Text>
//                 <Text style={styles.statLabel}>Success Rate</Text>
//               </View>
//             </View>
//           </View>

//           {/* Search Bar - Inside Banner */}
         
//         </SafeAreaView>
//       </ImageBackground>

//       {/* Main Content */}
//       <View style={styles.mainContent}>
//         {/* Categories */}
//         {categories.length > 0 && (
//           <View style={styles.categoriesWrapper}>
//             <FlatList
//               data={categories}
//               renderItem={renderCategoryChip}
//               keyExtractor={(item) => item.id.toString()}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.categoriesList}
//             />
//           </View>
//         )}

//         {/* Results Count */}
//         <View style={styles.resultsHeader}>
//           <Text style={styles.resultsTitle}>
//             {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'} Available
//           </Text>
//           {/* <TouchableOpacity style={styles.sortButton}>
//             <Text style={styles.sortText}>Sort by: Latest</Text>
//             <Icon name="chevron-down" size={16} color="#6B7280" />
//           </TouchableOpacity> */}
//         </View>

//         {/* Services List */}
//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color="#2563EB" />
//             <Text style={styles.loaderText}>Loading services...</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredServices}
//             renderItem={renderServiceCard}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={styles.servicesList}
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//             }
//             onEndReached={handleLoadMore}
//             onEndReachedThreshold={0.3}
//             ListFooterComponent={renderFooter}
//             ListEmptyComponent={renderEmptyState}
//           />
//         )}
//       </View>

      
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="none"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.modalContent,
//               {
//                 transform: [{ translateY: slideAnimation }],
//               },
//             ]}
//           >
//             <View style={styles.modalHandle}>
//               <View style={styles.handleBar} />
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               {selectedService && (
//                 <View style={styles.modalScrollContent}>
//                   {/* Modal Header Image */}
//                   <View style={styles.modalImageContainer}>
//                     {selectedService.images && selectedService.images.length > 0 ? (
//                       <Image
//                         source={{ uri: selectedService.images[0].image }}
//                         style={styles.modalImage}
//                       />
//                     ) : (
//                       <View style={[styles.modalImage, styles.modalPlaceholderImage]}>
//                         <MaterialIcon name="business-center" size={50} color="#CBD5E0" />
//                       </View>
//                     )}
                    
//                     <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
//                       <Icon name="close" size={24} color="#fff" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Modal Content */}
//                   <View style={styles.modalDetails}>
//                     <Text style={styles.modalTitle}>{selectedService.title}</Text>
//                     <Text style={styles.modalCompany}>
//                       {selectedService.company || "Individual Service Provider"}
//                     </Text>

//                     <View style={styles.modalActions}>
//                       <TouchableOpacity 
//                         style={styles.viewFullButton}
//                         onPress={() => {
//                           closeModal();
//                           navigateToServicePage(selectedService);
//                         }}
//                       >
//                         <Text style={styles.viewFullButtonText}>View Full Details</Text>
//                         <Icon name="arrow-forward" size={18} color="#2563EB" />
//                       </TouchableOpacity>
                      
//                       <TouchableOpacity 
//                         style={styles.messageButton}
//                         onPress={() => {
//                           closeModal();
//                           navigation.navigate("Chat", {
//                             userId: selectedService.user,
//                             userName: selectedService.user_name,
//                           });
//                         }}
//                       >
//                         <Icon name="chatbubble-outline" size={18} color="#fff" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               )}
//             </ScrollView>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   headerBanner: {
//     width: width,
//     height: height * 0.60,
//   },
//   bannerImage: {
//     resizeMode: 'cover',
//   },
//   bannerOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   bannerContent: {
//     flex: 1,
//     paddingHorizontal: 0,
//     justifyContent: 'space-between',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   bannerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//     paddingHorizontal:20
//   },
//   backButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   iconButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   addButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#2563EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#2563EB',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   bannerTextContainer: {
//     marginBottom: 20,
//     paddingHorizontal:23
//   },
//   welcomeTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 30,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//     gap: 6,
//   },
//   welcomeText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   bannerMainTitle: {
//     color: '#FFFFFF',
//     fontSize: 32,
//     fontWeight: '700',
//     lineHeight: 40,
//     letterSpacing: -0.5,
//     marginBottom: 12,
//   },
//   bannerDescription: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 15,
//     lineHeight: 22,
//     marginBottom: 20,
//     maxWidth: '90%',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 20,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.15)',
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   statLabel: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 12,
//   },
//   statDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   searchWrapper: {
//     marginBottom: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     height: 52,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1F2937',
//     padding: 0,
//   },
//   mainContent: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: -20,
//     paddingTop: 20,
//   },
//   categoriesWrapper: {
//     marginBottom: 16,
//   },
//   categoriesList: {
//     paddingHorizontal: 20,
//   },
//   categoryChip: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 25,
//     marginRight: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   categoryChipActive: {
//     backgroundColor: '#2563EB',
//   },
//   categoryChipText: {
//     fontSize: 14,
//     color: '#4B5563',
//     fontWeight: '500',
//   },
//   categoryChipTextActive: {
//     color: '#FFFFFF',
//   },
//   resultsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   resultsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   sortButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sortText: {
//     fontSize: 13,
//     color: '#6B7280',
//   },
//   servicesList: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   serviceCard: {
//     marginBottom: 16,
//     borderRadius: 20,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   firstCard: {
//     marginTop: 4,
//   },
//   cardGradient: {
//     borderRadius: 20,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//   },
//   cardLeftBorder: {
//     position: 'absolute',
//     left: 0,
//     top: 16,
//     bottom: 16,
//     width: 4,
//     backgroundColor: '#2563EB',
//     borderTopRightRadius: 4,
//     borderBottomRightRadius: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   serviceImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 14,
//     marginRight: 14,
//   },
//   placeholderImage: {
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardHeaderContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 4,
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     flex: 1,
//   },
//   verifiedBadge: {
//     marginLeft: 4,
//   },
//   companyName: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 6,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   reviewCount: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   cardBody: {
//     marginBottom: 12,
//   },
//   priceContainer: {
//     marginBottom: 8,
//   },
//   priceLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     marginBottom: 2,
//   },
//   priceText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2563EB',
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   userAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//   },
//   userName: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#4B5563',
//   },
//   detailsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   detailsButtonText: {
//     fontSize: 13,
//     color: '#2563EB',
//     fontWeight: '600',
//     marginRight:20
//   },
//   categoryTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   categoryTag: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   categoryTagText: {
//     fontSize: 11,
//     color: '#6B7280',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   loaderText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   footerLoader: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//     gap: 8,
//   },
//   footerLoaderText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   createButton: {
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   createButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     height: height * 0.7,
//   },
//   modalHandle: {
//     alignItems: 'center',
//     paddingTop: 12,
//     paddingBottom: 8,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#CBD5E0',
//     borderRadius: 2,
//   },
//   modalScrollContent: {
//     paddingBottom: 30,
//   },
//   modalImageContainer: {
//     position: 'relative',
//     height: 200,
//   },
//   modalImage: {
//     width: '100%',
//     height: 200,
//   },
//   modalPlaceholderImage: {
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalCloseButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   modalDetails: {
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   modalCompany: {
//     fontSize: 15,
//     color: '#6B7280',
//     marginBottom: 20,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 10,
//   },
//   viewFullButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#2563EB',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     gap: 8,
//   },
//   viewFullButtonText: {
//     color: '#2563EB',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   messageButton: {
//     width: 52,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: '#2563EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ServicesScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
  Modal,
  ScrollView,
  Animated,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");


const ServiceImage = ({ imageUrl, style, placeholderIcon, isAvatar = false }) => {
  const [error, setError] = useState(false);

  // Function to get the correct URL based on image type
  const getCorrectUrl = (url) => {
    if (!url) return null;
    
    // If it's a full URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Convert HTTP to HTTPS for service images
      if (url.startsWith('http://')) {
        const httpsUrl = url.replace('http://', 'https://');
        console.log('🌐 Converting service image to HTTPS:', { original: url, converted: httpsUrl });
        return httpsUrl;
      }
      // Return HTTPS URLs as is
      return url;
    }
    
    
    const baseUrl = 'https://showa.essential.com.ng';
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    console.log('👤 Profile image URL:', { original: url, full: fullUrl });
    return fullUrl;
  };

  const finalUrl = getCorrectUrl(imageUrl);
  console.log('📸 Final URL being used:', finalUrl);

  if (error || !imageUrl) {
    return (
      <View style={[style, styles.placeholderImage]}>
        {placeholderIcon || (
          <MaterialIcon 
            name={isAvatar ? "person" : "business-center"} 
            size={isAvatar ? 20 : 30} 
            color="#CBD5E0" 
          />
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: finalUrl }}
      style={style}
      onError={(e) => {
        console.log('Failed to load image:', finalUrl, e.nativeEvent.error);
        setError(true);
      }}
      onLoad={() => console.log(' Successfully loaded image:', finalUrl)}
      resizeMode="cover"
    />
  );
};

const ServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    professionals: 0,
    successRate: 98
  });

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ROUTE}/services/categories/`);
      const data = await response.json();
      if (data.success) {
        setCategories([{ id: "all", name: "All Services" }, ...data.data.categories]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async (pageNum = 1, shouldRefresh = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
      );
      const data = await response.json();

      if (data.success) {
        const posts = data.data.posts;
        
        if (shouldRefresh || pageNum === 1) {
          setServices(posts);
          setFilteredServices(posts);
          setStats({
            total: data.data.pagination.total_count || posts.length,
            professionals: new Set(posts.map(p => p.user)).size,
            successRate: 98
          });
        } else {
          setServices(prev => [...prev, ...posts]);
          setFilteredServices(prev => [...prev, ...posts]);
        }
        setHasMore(data.data.pagination.has_next);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchServices(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchServices(page + 1);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.title?.toLowerCase().includes(text.toLowerCase()) ||
          service.company?.toLowerCase().includes(text.toLowerCase()) ||
          service.description?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.categories?.includes(parseInt(categoryId))
      );
      setFilteredServices(filtered);
    }
  };

  const navigateToServicePage = (service) => {
    navigation.navigate('SupplyRequestDetail', { serviceId: service.id, serviceData: service });
  };

  const renderServiceCard = ({ item, index }) => {
    // Get the first image URL if available
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, index === 0 && styles.firstCard]}
        onPress={() => navigateToServicePage(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.cardGradient}
        >
          <View style={styles.cardLeftBorder} />
          
          <View style={styles.cardHeader}>
            <ServiceImage
              imageUrl={imageUrl}
              style={styles.serviceImage}
              placeholderIcon={<MaterialIcon name="business-center" size={30} color="#CBD5E0" />}
            />
            
            <View style={styles.cardHeaderContent}>
              <Text style={styles.serviceTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.companyName}>{item.company || "Individual Provider"}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.priceText}>₦{item.price_range || "50k - 200k"}</Text>
            </View>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Icon name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {item.location || "Nigeria"}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.userInfo}>
              <ServiceImage
                imageUrl={item.user_profile_picture}
                style={styles.userAvatar}
                isAvatar={true}
                placeholderIcon={<Icon name="person" size={16} color="#CBD5E0" />}
              />
              <Text style={styles.userName}>
                {item.user_name ? item.user_name.slice(0, 20) + (item.user_name.length > 20 ? '...' : '') : "Provider"}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => navigateToServicePage(item)}
            >
              <Text style={styles.detailsButtonText}>See All</Text>
              <Icon name="arrow-forward" size={14} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {item.category_names && item.category_names.length > 0 && (
            <View style={styles.categoryTags}>
              {item.category_names.slice(0, 2).map((cat, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{cat}</Text>
                </View>
              ))}
              {item.category_names.length > 2 && (
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>+{item.category_names.length - 2}</Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2563EB" />
        <Text style={styles.footerLoaderText}>Loading more services...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcon name="search-off" size={60} color="#CBD5E0" />
      <Text style={styles.emptyStateTitle}>No Services Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? "Try adjusting your search" : "Be the first to post a service"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Banner */}
      <ImageBackground
        source={require("../assets/images/dad.jpg")}
        style={styles.headerBanner}
        imageStyle={styles.bannerImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)', '#000000']}
          style={styles.bannerOverlay}
        />
        
        <SafeAreaView style={styles.bannerContent}>
          <View style={styles.bannerHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CreateServices")}>
              <Icon name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.bannerTextContainer}>
            <View style={styles.welcomeTag}>
              <Icon name="flash" size={16} color="#FBBF24" />
              <Text style={styles.welcomeText}>Professional Services</Text>
            </View>
            
            <Text style={styles.bannerMainTitle}>
              Find trusted{'\n'}service providers
            </Text>
            
            <Text style={styles.bannerDescription}>
              Connect with verified professionals for all your service needs
            </Text>

            {/* <View style={styles.searchWrapper}>
              <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for services..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            </View> */}

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}+</Text>
                <Text style={styles.statLabel}>Services</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.professionals}+</Text>
                <Text style={styles.statLabel}>Professionals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.successRate}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.mainContent}>
        {categories.length > 0 && (
          <View style={styles.categoriesWrapper}>
            <FlatList
              data={categories}
              renderItem={renderCategoryChip}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'} Available
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Loading services...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredServices}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.servicesList}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerBanner: {
    width: width,
    height: height * 0.65,
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 16,
    gap: 6,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bannerMainTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    marginBottom: 12,
  },
  bannerDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  searchWrapper: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginRight: 10,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
  },
  firstCard: {
    marginTop: 4,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    backgroundColor: '#2563EB',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderContent: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardBody: {
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  userName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginRight:20
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 11,
    color: '#6B7280',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ServicesScreen;
