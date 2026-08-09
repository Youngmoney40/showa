// import React, { useState } from 'react';
// import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList } from 'react-native';
// import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
// // import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Iconn from 'react-native-vector-icons/Ionicons';

// const screenWidth = Dimensions.get('window').width;

// const CreatorDashboard = ({navigation}) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [activeTab, setActiveTab] = useState('analytics');
//   const [showEarningsModal, setShowEarningsModal] = useState(false);
//   const [showMonetizationOptions, setShowMonetizationOptions] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     category: '',
//     bio: '',
//     website: '',
//     taxInfo: '',
//     paymentMethod: '',
//   });

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = () => {
//     setSubmitted(true);
//     setModalVisible(false);
//   };

//   // Chart configurations
//   const lineChartConfig = {
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//     color: (opacity = 1) => `rgba(0, 132, 255, ${opacity})`,
//     strokeWidth: 3,
//     decimalPlaces: 0,
//     propsForDots: {
//       r: '5',
//       strokeWidth: '2',
//       stroke: '#0084ff'
//     },
//     fillShadowGradient: '#0084ff',
//     fillShadowGradientOpacity: 0.1,
//   };

//   const barChartConfig = {
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//     color: (opacity = 1) => `rgba(24, 119, 242, ${opacity})`,
//     strokeWidth: 2,
//     decimalPlaces: 0,
//     barPercentage: 0.5,
//     propsForBackgroundLines: {
//       strokeDasharray: ""
//     }
//   };

//   const pieChartConfig = {
//     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//     strokeWidth: 0,
//     decimalPlaces: 0,
//   };

//   // Data for charts
//   const engagementData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         data: [12500, 15000, 14200, 18900, 21000, 18500, 23000],
//         color: (opacity = 1) => `rgba(0, 132, 255, ${opacity})`,
//         strokeWidth: 3,
//       },
//     ],
//   };

//   const earningsData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         data: [1200, 1900, 2300, 2700, 3200, 3800],
//       },
//     ],
//   };

//   const audienceData = [
//     { name: "18-24", population: 35, color: "#0084ff", legendFontColor: "#7F7F7F" },
//     { name: "25-34", population: 45, color: "#4267B2", legendFontColor: "#7F7F7F" },
//     { name: "35-44", population: 15, color: "#8b9dc3", legendFontColor: "#7F7F7F" },
//     { name: "45+", population: 5, color: "#dfe3ee", legendFontColor: "#7F7F7F" },
//   ];

//   // Monetization options
//   const monetizationOptions = [
//     { id: '1', icon: 'ad-units', name: 'In-Stream Ads', description: 'Earn money from ads played in your videos', enabled: true },
//     { id: '2', icon: 'stars', name: 'Fan Subscriptions', description: 'Let fans support you with monthly payments', enabled: false },
//     { id: '3', icon: 'shopping-bag', name: 'Brand Collaborations', description: 'Get matched with brands for sponsorships', enabled: true },
//     { id: '4', icon: 'monetization-on', name: 'Premium Content', description: 'Charge for exclusive content', enabled: false },
//     { id: '5', icon: 'supervisor-account', name: 'Affiliate Marketing', description: 'Earn commissions from product referrals', enabled: true },
//   ];

//   // Recent earnings
//   const recentEarnings = [
//     { id: '1', date: 'Jun 15, 2023', source: 'In-Stream Ads', amount: '$428.50', status: 'Processing' },
//     { id: '2', date: 'May 31, 2023', source: 'Brand Collab', amount: '$1,200.00', status: 'Paid' },
//     { id: '3', date: 'May 15, 2023', source: 'In-Stream Ads', amount: '$387.20', status: 'Paid' },
//     { id: '4', date: 'Apr 30, 2023', source: 'Affiliate', amount: '$156.80', status: 'Paid' },
//   ];

//   // Performance metrics
//   const performanceMetrics = [
//     { id: '1', metric: 'Total Followers', value: '124,430', change: '+2.4%', trend: 'up' },
//     { id: '2', metric: 'Engagement Rate', value: '8.4%', change: '+0.6%', trend: 'up' },
//     { id: '3', metric: 'Avg. Watch Time', value: '2:45', change: '-0:12', trend: 'down' },
//     { id: '4', metric: 'Post Frequency', value: '24/week', change: '+3', trend: 'up' },
//     { id: '5', metric: 'Click-Through Rate', value: '3.2%', change: '+0.4%', trend: 'up' },
//     { id: '6', metric: 'Earnings (30d)', value: '$3,812', change: '+12%', trend: 'up' },
//   ];

//   const renderMetricItem = ({ item }) => (
//     <View style={styles.metricItem}>
//       <View style={styles.metricTextContainer}>
//         <Text style={styles.metricName}>{item.metric}</Text>
//         <Text style={styles.metricValue}>{item.value}</Text>
//       </View>
//       <View style={[styles.metricChange, item.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
//         <Feather name={item.trend === 'up' ? 'arrow-up' : 'arrow-down'} size={14} color={item.trend === 'up' ? '#4CAF50' : '#F44336'} />
//         <Text style={[styles.changeText, item.trend === 'up' ? styles.positiveText : styles.negativeText]}>{item.change}</Text>
//       </View>
//     </View>
//   );

//   const renderMonetizationOption = ({ item }) => (
//     <View style={[styles.monetizationOption, !item.enabled && styles.disabledOption]}>
//       <Icon name={item.icon} size={24} color={item.enabled ? '#4267B2' : '#BDBDBD'} />
//       <View style={styles.optionTextContainer}>
//         <Text style={[styles.optionName, !item.enabled && styles.disabledText]}>{item.name}</Text>
//         <Text style={[styles.optionDesc, !item.enabled && styles.disabledText]}>{item.description}</Text>
//       </View>
//       {item.enabled ? (
//         <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
//       ) : (
//         <TouchableOpacity style={styles.enableButton}>
//           <Text style={styles.enableButtonText}>Enable</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderEarningItem = ({ item }) => (
//     <View style={styles.earningItem}>
//       <View style={styles.earningDateContainer}>
//         <Text style={styles.earningDate}>{item.date}</Text>
//         <Text style={styles.earningSource}>{item.source}</Text>
//       </View>
//       <View style={styles.earningAmountContainer}>
//         <Text style={styles.earningAmount}>{item.amount}</Text>
//         <View style={[styles.earningStatus, item.status === 'Paid' ? styles.statusPaid : styles.statusProcessing]}>
//           <Text style={styles.earningStatusText}>{item.status}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Icon 
//                     style={styles.backIcon} 
//                     name="arrow-back" 
//                     size={24} 
//                     color="#111827" 
//                     onPress={() => navigation.navigate('Explore')} 
//                   />
//         <View style={styles.headerContent}>
//           <Image 
//             source={{ uri: 'https://imgs.search.brave.com/g7K2Qs5E13qmfiZmXzPJ5B6RJ6fG3Vxt6B7ToOgxykE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bGFuY2lhbi5uZy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/Ny9mZW1hbGUtY29u/dGVudC1jcmVhdG9y/cy1pbi1uaWdlcmlh/LTUuanBn' }} 
//             style={styles.profileImage}
//           />
//           <View style={styles.headerText}>
//             <Text style={styles.headerTitle}>Creator Dashboard</Text>
//             <Text style={styles.headerSubtitle}>@Mary_mike</Text>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.notificationButton}>
//           <Ionicons name="notifications-outline" size={24} color="#4267B2" />
//           <View style={styles.notificationBadge} />
//         </TouchableOpacity>
//       </View>

//       {/* Monetization Status */}
//       <View style={styles.monetizationStatus}>
//         <View style={styles.statusLeft}>
//           <Icon name="monetization-on" size={28} color="#FFD700" />
//           <View style={styles.statusText}>
//             <Text style={styles.statusTitle}>Monetization Status</Text>
//             <Text style={styles.statusValue}>Active</Text>
//           </View>
//         </View>
//         <TouchableOpacity 
//           style={styles.earningsButton}
//           onPress={() => setShowEarningsModal(true)}
//         >
//           <Text style={styles.earningsButtonText}>View Earnings</Text>
//           <AntDesign name="right" size={16} color="#4267B2" />
//         </TouchableOpacity>
//       </View>

//       {/* Quick Stats */}
//       <View style={styles.quickStats}>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>$3,812</Text>
//           <Text style={styles.statLabel}>30d Earnings</Text>
//           <View style={styles.statTrend}>
//             <Feather name="arrow-up" size={14} color="#4CAF50" />
//             <Text style={styles.trendTextPositive}>12% from last month</Text>
//           </View>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>124.4K</Text>
//           <Text style={styles.statLabel}>Followers</Text>
//           <View style={styles.statTrend}>
//             <Feather name="arrow-up" size={14} color="#4CAF50" />
//             <Text style={styles.trendTextPositive}>2.4% from last week</Text>
//           </View>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>8.4%</Text>
//           <Text style={styles.statLabel}>Engagement</Text>
//           <View style={styles.statTrend}>
//             <Feather name="arrow-up" size={14} color="#4CAF50" />
//             <Text style={styles.trendTextPositive}>0.6% from last week</Text>
//           </View>
//         </View>
//       </View>

//       {/* Navigation Tabs */}
//       <View style={styles.tabs}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
//           onPress={() => setActiveTab('analytics')}
//         >
//           <Ionicons name="analytics-outline" size={20} color={activeTab === 'analytics' ? '#4267B2' : '#65676B'} />
//           <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'monetization' && styles.activeTab]}
//           onPress={() => setActiveTab('monetization')}
//         >
//           <Icon name="monetization-on" size={20} color={activeTab === 'monetization' ? '#4267B2' : '#65676B'} />
//           <Text style={[styles.tabText, activeTab === 'monetization' && styles.activeTabText]}>Monetization</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'content' && styles.activeTab]}
//           onPress={() => setActiveTab('content')}
//         >
//           <Feather name="film" size={20} color={activeTab === 'content' ? '#4267B2' : '#65676B'} />
//           <Text style={[styles.tabText, activeTab === 'content' && styles.activeTabText]}>Content</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Analytics Tab Content */}
//       {activeTab === 'analytics' && (
//         <View style={styles.tabContent}>
//           <Text style={styles.sectionTitle}>Audience Engagement</Text>
//           <LineChart
//             data={engagementData}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={lineChartConfig}
//             bezier
//             style={styles.chartStyle}
//             withVerticalLines={false}
//             withHorizontalLines={false}
//             withShadow={true}
//           />

//           <Text style={styles.sectionTitle}>Performance Metrics</Text>
//           <FlatList
//             data={performanceMetrics}
//             renderItem={renderMetricItem}
//             keyExtractor={item => item.id}
//             scrollEnabled={false}
//             contentContainerStyle={styles.metricsList}
//           />

//           <Text style={styles.sectionTitle}>Audience Demographics</Text>
//           <PieChart
//             data={audienceData}
//             width={screenWidth - 40}
//             height={180}
//             chartConfig={pieChartConfig}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="15"
//             absolute
//             style={styles.chartStyle}
//           />
//         </View>
//       )}

//       {/* Monetization Tab Content */}
//       {activeTab === 'monetization' && (
//         <View style={styles.tabContent}>
//           <TouchableOpacity 
//             style={styles.monetizationHeader}
//             onPress={() => setShowMonetizationOptions(!showMonetizationOptions)}
//           >
//             <Text style={styles.sectionTitle}>Monetization Options</Text>
//             <Icon 
//               name={showMonetizationOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
//               size={24} 
//               color="#4267B2" 
//             />
//           </TouchableOpacity>

//           {showMonetizationOptions && (
//             <FlatList
//               data={monetizationOptions}
//               renderItem={renderMonetizationOption}
//               keyExtractor={item => item.id}
//               scrollEnabled={false}
//               contentContainerStyle={styles.optionsList}
//             />
//           )}

//           <Text style={styles.sectionTitle}>Earnings Overview</Text>
//           <BarChart
//             data={earningsData}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={barChartConfig}
//             style={styles.chartStyle}
//             yAxisLabel="$"
//             yAxisSuffix=""
//             fromZero
//             showBarTops={false}
//           />
//         </View>
//       )}

//       {/* Content Tab Content */}
//       {activeTab === 'content' && (
//         <View style={styles.tabContent}>
//           <Text style={styles.sectionTitle}>Top Performing Content</Text>
//           <View style={styles.contentCard}>
//             <Image 
//               source={{ uri: 'https://imgs.search.brave.com/RhmpRJqkonBXX7xGiZlQLvNMsqWAcj7P0MVR7NBPOyU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMzY4/NTUzOC9wZXhlbHMt/cGhvdG8tMzY4NTUz/OC5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA' }} 
//               style={styles.contentThumbnail}
//             />
//             <View style={styles.contentInfo}>
//               <Text style={styles.contentTitle}>How to Create Engaging Content</Text>
//               <View style={styles.contentStats}>
//                 <View style={styles.statItem}>
//                   <Ionicons name="eye-outline" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>124.3K views</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                   <Ionicons name="heart-outline" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>8.7K likes</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                   <FontAwesome name="dollar" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>$428 earned</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           <View style={styles.contentCard}>
//             <Image 
//               source={{ uri: 'https://imgs.search.brave.com/ke0Hk18YKZJS9aTE-tvqkF0DQRvExSvX_-ty6cknKpo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAw/NzAvNzAzMi9hcnRp/Y2xlcy90cmVuZGlu/Zy1wcm9kdWN0c19l/NjgyMWI4Mi0zYThi/LTRkZGUtODU1NC0y/YTAzNGQ4MTFhODEu/cG5nP3Y9MTc1Mzk5/MzM2NyZvcmlnaW5h/bFdpZHRoPTE4NDgm/b3JpZ2luYWxIZWln/aHQ9Nzgy' }} 
//               style={styles.contentThumbnail}
//             />
//             <View style={styles.contentInfo}>
//               <Text style={styles.contentTitle}>Advanced Editing Techniques</Text>
//               <View style={styles.contentStats}>
//                 <View style={styles.statItem}>
//                   <Ionicons name="eye-outline" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>98.5K views</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                   <Ionicons name="heart-outline" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>7.2K likes</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                   <FontAwesome name="dollar" size={16} color="#65676B" />
//                   <Text style={styles.statItemText}>$387 earned</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Earnings Modal */}
//       <Modal visible={showEarningsModal} animationType="slide" transparent={false}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Earnings Details</Text>
//             <TouchableOpacity onPress={() => setShowEarningsModal(false)}>
//               <Ionicons name="close" size={24} color="#65676B" />
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.earningsSummary}>
//             <Text style={styles.earningsPeriod}>June 2023 Earnings</Text>
//             <Text style={styles.earningsTotal}>$1,428.50</Text>
//             <View style={styles.earningsBreakdown}>
//               <View style={styles.breakdownItem}>
//                 <View style={[styles.breakdownColor, { backgroundColor: '#0084ff' }]} />
//                 <Text style={styles.breakdownText}>In-Stream Ads: $428.50</Text>
//               </View>
//               <View style={styles.breakdownItem}>
//                 <View style={[styles.breakdownColor, { backgroundColor: '#4267B2' }]} />
//                 <Text style={styles.breakdownText}>Brand Collab: $1,000.00</Text>
//               </View>
//             </View>
//           </View>

//           <Text style={styles.recentEarningsTitle}>Recent Earnings</Text>
//           <FlatList
//             data={recentEarnings}
//             renderItem={renderEarningItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.earningsList}
//           />

//           <TouchableOpacity 
//             style={styles.withdrawButton}
//             onPress={() => console.log('Withdraw pressed')}
//           >
//             <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* Monetization Application Modal */}
//       <Modal visible={modalVisible} animationType="slide">
//         <ScrollView contentContainerStyle={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Monetization Application</Text>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Ionicons name="close" size={24} color="#65676B" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.modalDesc}>
//             Complete your profile and meet our monetization policies to start earning money from your content.
//           </Text>

//           <Text style={styles.formSectionTitle}>Basic Information</Text>
//           <TextInput
//             placeholder="Full Name"
//             value={formData.fullName}
//             onChangeText={(text) => handleChange('fullName', text)}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Email Address"
//             value={formData.email}
//             onChangeText={(text) => handleChange('email', text)}
//             keyboardType="email-address"
//             style={styles.input}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Category (e.g., Sports, Music, Lifestyle)"
//             value={formData.category}
//             onChangeText={(text) => handleChange('category', text)}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Short Bio (Tell us about your content)"
//             value={formData.bio}
//             onChangeText={(text) => handleChange('bio', text)}
//             multiline
//             style={[styles.input, styles.bioInput]}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Website or Portfolio URL (optional)"
//             value={formData.website}
//             onChangeText={(text) => handleChange('website', text)}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />

//           <Text style={styles.formSectionTitle}>Payment Information</Text>
//           <TextInput
//             placeholder="Tax Information (SSN or EIN)"
//             value={formData.taxInfo}
//             onChangeText={(text) => handleChange('taxInfo', text)}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Payment Method (PayPal, Bank Account)"
//             value={formData.paymentMethod}
//             onChangeText={(text) => handleChange('paymentMethod', text)}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />

//           <View style={styles.requirementsContainer}>
//             <Text style={styles.requirementsTitle}>Monetization Requirements</Text>
//             <View style={styles.requirementItem}>
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text style={styles.requirementText}>10,000+ followers</Text>
//             </View>
//             <View style={styles.requirementItem}>
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text style={styles.requirementText}>5,000+ views in last 30 days</Text>
//             </View>
//             <View style={styles.requirementItem}>
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text style={styles.requirementText}>Original content</Text>
//             </View>
//             <View style={styles.requirementItem}>
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text style={styles.requirementText}>Complies with community standards</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitText}>Submit Application</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingBottom: 30,
//     backgroundColor: '#f7f8fa',
//     minHeight: '100%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e4e6eb',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   headerText: {},
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#050505',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#65676B',
//   },
//   notificationButton: {
//     padding: 8,
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FF0000',
//   },
//   monetizationStatus: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     marginHorizontal: 20,
//     marginTop: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statusLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusText: {
//     marginLeft: 10,
//   },
//   statusTitle: {
//     fontSize: 14,
//     color: '#65676B',
//   },
//   statusValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#050505',
//   },
//   earningsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     backgroundColor: '#e7f3ff',
//     borderRadius: 20,
//   },
//   earningsButtonText: {
//     color: '#4267B2',
//     fontWeight: '600',
//     marginRight: 5,
//   },
//   quickStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginTop: 15,
//   },
//   statCard: {
//     width: '30%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#050505',
//     marginBottom: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#65676B',
//     marginBottom: 8,
//   },
//   statTrend: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   trendTextPositive: {
//     fontSize: 10,
//     color: '#4CAF50',
//     marginLeft: 3,
//   },
//   trendTextNegative: {
//     fontSize: 10,
//     color: '#F44336',
//     marginLeft: 3,
//   },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 20,
//     marginTop: 25,
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e4e6eb',
//   },
//   tab: {
//     paddingBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {
//     borderBottomColor: '#4267B2',
//   },
//   tabText: {
//     marginLeft: 5,
//     color: '#65676B',
//     fontWeight: '600',
//   },
//   activeTabText: {
//     color: '#4267B2',
//   },
//   tabContent: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#050505',
//     marginBottom: 15,
//     marginTop: 20,
//   },
//   chartStyle: {
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   metricsList: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   metricItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f2f5',
//   },
//   metricTextContainer: {},
//   metricName: {
//     fontSize: 14,
//     color: '#65676B',
//     marginBottom: 3,
//   },
//   metricValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#050505',
//   },
//   metricChange: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//   },
//   positiveChange: {
//     backgroundColor: '#E8F5E9',
//   },
//   negativeChange: {
//     backgroundColor: '#FFEBEE',
//   },
//   changeText: {
//     marginLeft: 3,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   positiveText: {
//     color: '#4CAF50',
//   },
//   negativeText: {
//     color: '#F44336',
//   },
//   monetizationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   optionsList: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   monetizationOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f2f5',
//   },
//   disabledOption: {
//     opacity: 0.6,
//   },
//   optionTextContainer: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   optionName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#050505',
//   },
//   optionDesc: {
//     fontSize: 12,
//     color: '#65676B',
//     marginTop: 3,
//   },
//   disabledText: {
//     color: '#BDBDBD',
//   },
//   enableButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     backgroundColor: '#4267B2',
//     borderRadius: 15,
//   },
//   enableButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   contentCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   contentThumbnail: {
//     width: 120,
//     height: 80,
//   },
//   contentInfo: {
//     flex: 1,
//     padding: 10,
//   },
//   contentTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#050505',
//     marginBottom: 8,
//   },
//   contentStats: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//     marginBottom: 5,
//   },
//   statItemText: {
//     fontSize: 12,
//     color: '#65676B',
//     marginLeft: 5,
//   },
//   modalContainer: {
//     padding: 20,
//     backgroundColor: '#fff',
//     minHeight: '100%',
//     paddingTop: 50,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#050505',
//   },
//   modalDesc: {
//     fontSize: 14,
//     color: '#65676B',
//     marginBottom: 25,
//     lineHeight: 20,
//   },
//   formSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#050505',
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   input: {
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//     backgroundColor: '#f7f8fa',
//     fontSize: 14,
//   },
//   bioInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   requirementsContainer: {
//     backgroundColor: '#f7f8fa',
//     borderRadius: 8,
//     padding: 15,
//     marginVertical: 15,
//   },
//   requirementsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#050505',
//     marginBottom: 10,
//   },
//   requirementItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   requirementText: {
//     fontSize: 13,
//     color: '#65676B',
//     marginLeft: 8,
//   },
//   submitButton: {
//     backgroundColor: '#4267B2',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   earningsSummary: {
//     backgroundColor: '#f7f8fa',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 20,
//   },
//   earningsPeriod: {
//     fontSize: 14,
//     color: '#65676B',
//     marginBottom: 5,
//   },
//   earningsTotal: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#050505',
//     marginBottom: 15,
//   },
//   earningsBreakdown: {},
//   breakdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   breakdownColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   breakdownText: {
//     fontSize: 14,
//     color: '#050505',
//   },
//   recentEarningsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#050505',
//     marginBottom: 15,
//   },
//   earningsList: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   earningItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f2f5',
//   },
//   earningDateContainer: {},
//   earningDate: {
//     fontSize: 12,
//     color: '#65676B',
//     marginBottom: 3,
//   },
//   earningSource: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#050505',
//   },
//   earningAmountContainer: {
//     alignItems: 'flex-end',
//   },
//   earningAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#050505',
//     marginBottom: 3,
//   },
//   earningStatus: {
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//   },
//   statusPaid: {
//     backgroundColor: '#E8F5E9',
//   },
//   statusProcessing: {
//     backgroundColor: '#E3F2FD',
//   },
//   earningStatusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#050505',
//   },
//   withdrawButton: {
//     backgroundColor: '#4267B2',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   withdrawButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default CreatorDashboard;

import React, { useState } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList } from 'react-native';
// Removed chart imports
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const screenWidth = Dimensions.get('window').width;

const CreatorDashboard = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showMonetizationOptions, setShowMonetizationOptions] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: '',
    bio: '',
    website: '',
    taxInfo: '',
    paymentMethod: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setModalVisible(false);
  };

  // Data for custom charts
  const engagementData = [
    { day: 'Mon', value: 12500 },
    { day: 'Tue', value: 15000 },
    { day: 'Wed', value: 14200 },
    { day: 'Thu', value: 18900 },
    { day: 'Fri', value: 21000 },
    { day: 'Sat', value: 18500 },
    { day: 'Sun', value: 23000 },
  ];

  const earningsData = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1900 },
    { month: 'Mar', value: 2300 },
    { month: 'Apr', value: 2700 },
    { month: 'May', value: 3200 },
    { month: 'Jun', value: 3800 },
  ];

  const audienceData = [
    { name: "18-24", percentage: 35, color: "#0084ff" },
    { name: "25-34", percentage: 45, color: "#4267B2" },
    { name: "35-44", percentage: 15, color: "#8b9dc3" },
    { name: "45+", percentage: 5, color: "#dfe3ee" },
  ];

  // Monetization options
  const monetizationOptions = [
    { id: '1', icon: 'ad-units', name: 'In-Stream Ads', description: 'Earn money from ads played in your videos', enabled: true },
    { id: '2', icon: 'stars', name: 'Fan Subscriptions', description: 'Let fans support you with monthly payments', enabled: false },
    { id: '3', icon: 'shopping-bag', name: 'Brand Collaborations', description: 'Get matched with brands for sponsorships', enabled: true },
    { id: '4', icon: 'monetization-on', name: 'Premium Content', description: 'Charge for exclusive content', enabled: false },
    { id: '5', icon: 'supervisor-account', name: 'Affiliate Marketing', description: 'Earn commissions from product referrals', enabled: true },
  ];

  // Recent earnings
  const recentEarnings = [
    { id: '1', date: 'Jun 15, 2023', source: 'In-Stream Ads', amount: '$428.50', status: 'Processing' },
    { id: '2', date: 'May 31, 2023', source: 'Brand Collab', amount: '$1,200.00', status: 'Paid' },
    { id: '3', date: 'May 15, 2023', source: 'In-Stream Ads', amount: '$387.20', status: 'Paid' },
    { id: '4', date: 'Apr 30, 2023', source: 'Affiliate', amount: '$156.80', status: 'Paid' },
  ];

  // Performance metrics
  const performanceMetrics = [
    { id: '1', metric: 'Total Followers', value: '124,430', change: '+2.4%', trend: 'up' },
    { id: '2', metric: 'Engagement Rate', value: '8.4%', change: '+0.6%', trend: 'up' },
    { id: '3', metric: 'Avg. Watch Time', value: '2:45', change: '-0:12', trend: 'down' },
    { id: '4', metric: 'Post Frequency', value: '24/week', change: '+3', trend: 'up' },
    { id: '5', metric: 'Click-Through Rate', value: '3.2%', change: '+0.4%', trend: 'up' },
    { id: '6', metric: 'Earnings (30d)', value: '$3,812', change: '+12%', trend: 'up' },
  ];

  // Custom Chart Components
  const CustomBarChart = ({ data, title, yAxisLabel = '', color = '#4267B2' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const barWidth = (screenWidth - 80) / data.length;

    return (
      <View style={styles.customChartContainer}>
        {title && <Text style={styles.chartTitle}>{title}</Text>}
        <View style={styles.barChartContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: (item.value / maxValue) * 150,
                      backgroundColor: color,
                      width: barWidth > 40 ? 40 : barWidth - 10,
                    }
                  ]} 
                />
                <Text style={styles.barValue}>
                  {yAxisLabel}{item.value >= 1000 ? `${(item.value/1000).toFixed(1)}K` : item.value}
                </Text>
              </View>
              <Text style={styles.barLabel}>
                {item.day || item.month}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const CustomLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * (screenWidth - 80) + 40,
      y: 180 - (item.value / maxValue) * 150,
      value: item.value
    }));

    return (
      <View style={styles.customChartContainer}>
        {title && <Text style={styles.chartTitle}>{title}</Text>}
        <View style={styles.lineChartContainer}>
          <View style={styles.lineChartArea}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent, i) => (
              <View 
                key={i} 
                style={[styles.gridLine, { top: 10 + (150 - percent * 1.5) }]} 
              />
            ))}
            
            {/* Line path */}
            <View style={styles.linePath}>
              {points.map((point, index) => (
                <View 
                  key={index}
                  style={[
                    styles.linePoint,
                    { 
                      left: point.x - 5,
                      top: point.y - 5,
                      backgroundColor: '#0084ff'
                    }
                  ]}
                />
              ))}
              {/* Connecting lines between points */}
              {points.map((point, index) => {
                if (index < points.length - 1) {
                  const nextPoint = points[index + 1];
                  return (
                    <View
                      key={`line-${index}`}
                      style={[
                        styles.connectingLine,
                        {
                          left: point.x,
                          top: point.y,
                          width: nextPoint.x - point.x,
                          height: 2,
                          transform: [
                            {
                              rotate: `${Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)}rad`
                            }
                          ]
                        }
                      ]}
                    />
                  );
                }
                return null;
              })}
            </View>

            {/* X-axis labels */}
            <View style={styles.lineLabels}>
              {data.map((item, index) => (
                <Text key={index} style={styles.lineLabel}>
                  {item.day || item.month}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const CustomPieChart = ({ data, title }) => {
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.percentage, 0);

    return (
      <View style={styles.customChartContainer}>
        {title && <Text style={styles.chartTitle}>{title}</Text>}
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChartWrapper}>
            {data.map((item, index) => {
              const percentage = (item.percentage / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = startAngle + angle;
              
              // Simple pie slice representation using colored blocks
              const slice = {
                start: startAngle,
                end: endAngle,
                color: item.color,
                percentage: item.percentage
              };
              startAngle = endAngle;

              return (
                <View 
                  key={index}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: item.color,
                      width: 50,
                      height: 50,
                      margin: 2,
                      borderRadius: 4,
                    }
                  ]}
                />
              );
            })}
          </View>
          
          {/* Legend */}
          <View style={styles.pieLegend}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}: {item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderMetricItem = ({ item }) => (
    <View style={styles.metricItem}>
      <View style={styles.metricTextContainer}>
        <Text style={styles.metricName}>{item.metric}</Text>
        <Text style={styles.metricValue}>{item.value}</Text>
      </View>
      <View style={[styles.metricChange, item.trend === 'up' ? styles.positiveChange : styles.negativeChange]}>
        <Feather name={item.trend === 'up' ? 'arrow-up' : 'arrow-down'} size={14} color={item.trend === 'up' ? '#4CAF50' : '#F44336'} />
        <Text style={[styles.changeText, item.trend === 'up' ? styles.positiveText : styles.negativeText]}>{item.change}</Text>
      </View>
    </View>
  );

  const renderMonetizationOption = ({ item }) => (
    <View style={[styles.monetizationOption, !item.enabled && styles.disabledOption]}>
      <Icon name={item.icon} size={24} color={item.enabled ? '#4267B2' : '#BDBDBD'} />
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionName, !item.enabled && styles.disabledText]}>{item.name}</Text>
        <Text style={[styles.optionDesc, !item.enabled && styles.disabledText]}>{item.description}</Text>
      </View>
      {item.enabled ? (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.enableButton}>
          <Text style={styles.enableButtonText}>Enable</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEarningItem = ({ item }) => (
    <View style={styles.earningItem}>
      <View style={styles.earningDateContainer}>
        <Text style={styles.earningDate}>{item.date}</Text>
        <Text style={styles.earningSource}>{item.source}</Text>
      </View>
      <View style={styles.earningAmountContainer}>
        <Text style={styles.earningAmount}>{item.amount}</Text>
        <View style={[styles.earningStatus, item.status === 'Paid' ? styles.statusPaid : styles.statusProcessing]}>
          <Text style={styles.earningStatusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Icon 
          style={styles.backIcon} 
          name="arrow-back" 
          size={24} 
          color="#111827" 
          onPress={() => navigation.navigate('Explore')} 
        />
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: 'https://imgs.search.brave.com/g7K2Qs5E13qmfiZmXzPJ5B6RJ6fG3Vxt6B7ToOgxykE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bGFuY2lhbi5uZy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/Ny9mZW1hbGUtY29u/dGVudC1jcmVhdG9y/cy1pbi1uaWdlcmlh/LTUuanBn' }} 
            style={styles.profileImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Creator Dashboard</Text>
            <Text style={styles.headerSubtitle}>@Mary_mike</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#4267B2" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Monetization Status */}
      <View style={styles.monetizationStatus}>
        <View style={styles.statusLeft}>
          <Icon name="monetization-on" size={28} color="#FFD700" />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Monetization Status</Text>
            <Text style={styles.statusValue}>Active</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.earningsButton}
          onPress={() => setShowEarningsModal(true)}
        >
          <Text style={styles.earningsButtonText}>View Earnings</Text>
          <AntDesign name="right" size={16} color="#4267B2" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>$3,812</Text>
          <Text style={styles.statLabel}>30d Earnings</Text>
          <View style={styles.statTrend}>
            <Feather name="arrow-up" size={14} color="#4CAF50" />
            <Text style={styles.trendTextPositive}>12% from last month</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>124.4K</Text>
          <Text style={styles.statLabel}>Followers</Text>
          <View style={styles.statTrend}>
            <Feather name="arrow-up" size={14} color="#4CAF50" />
            <Text style={styles.trendTextPositive}>2.4% from last week</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>8.4%</Text>
          <Text style={styles.statLabel}>Engagement</Text>
          <View style={styles.statTrend}>
            <Feather name="arrow-up" size={14} color="#4CAF50" />
            <Text style={styles.trendTextPositive}>0.6% from last week</Text>
          </View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons name="analytics-outline" size={20} color={activeTab === 'analytics' ? '#4267B2' : '#65676B'} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'monetization' && styles.activeTab]}
          onPress={() => setActiveTab('monetization')}
        >
          <Icon name="monetization-on" size={20} color={activeTab === 'monetization' ? '#4267B2' : '#65676B'} />
          <Text style={[styles.tabText, activeTab === 'monetization' && styles.activeTabText]}>Monetization</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'content' && styles.activeTab]}
          onPress={() => setActiveTab('content')}
        >
          <Feather name="film" size={20} color={activeTab === 'content' ? '#4267B2' : '#65676B'} />
          <Text style={[styles.tabText, activeTab === 'content' && styles.activeTabText]}>Content</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <View style={styles.tabContent}>
          <CustomLineChart 
            data={engagementData} 
            title="Audience Engagement" 
          />
          
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <FlatList
            data={performanceMetrics}
            renderItem={renderMetricItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.metricsList}
          />

          <CustomPieChart 
            data={audienceData} 
            title="Audience Demographics" 
          />
        </View>
      )}

      {/* Monetization Tab Content */}
      {activeTab === 'monetization' && (
        <View style={styles.tabContent}>
          <TouchableOpacity 
            style={styles.monetizationHeader}
            onPress={() => setShowMonetizationOptions(!showMonetizationOptions)}
          >
            <Text style={styles.sectionTitle}>Monetization Options</Text>
            <Icon 
              name={showMonetizationOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={24} 
              color="#4267B2" 
            />
          </TouchableOpacity>

          {showMonetizationOptions && (
            <FlatList
              data={monetizationOptions}
              renderItem={renderMonetizationOption}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.optionsList}
            />
          )}

          <CustomBarChart 
            data={earningsData} 
            title="Earnings Overview" 
            yAxisLabel="$"
            color="#4267B2"
          />
        </View>
      )}

      {/* Content Tab Content */}
      {activeTab === 'content' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Top Performing Content</Text>
          <View style={styles.contentCard}>
            <Image 
              source={{ uri: 'https://imgs.search.brave.com/RhmpRJqkonBXX7xGiZlQLvNMsqWAcj7P0MVR7NBPOyU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMzY4/NTUzOC9wZXhlbHMt/cGhvdG8tMzY4NTUz/OC5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA' }} 
              style={styles.contentThumbnail}
            />
            <View style={styles.contentInfo}>
              <Text style={styles.contentTitle}>How to Create Engaging Content</Text>
              <View style={styles.contentStats}>
                <View style={styles.statItem}>
                  <Ionicons name="eye-outline" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>124.3K views</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>8.7K likes</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome name="dollar" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>$428 earned</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.contentCard}>
            <Image 
              source={{ uri: 'https://imgs.search.brave.com/ke0Hk18YKZJS9aTE-tvqkF0DQRvExSvX_-ty6cknKpo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAw/NzAvNzAzMi9hcnRp/Y2xlcy90cmVuZGlu/Zy1wcm9kdWN0c19l/NjgyMWI4Mi0zYThi/LTRkZGUtODU1NC0y/YTAzNGQ4MTFhODEu/cG5nP3Y9MTc1Mzk5/MzM2NyZvcmlnaW5h/bFdpZHRoPTE4NDgm/b3JpZ2luYWxIZWln/aHQ9Nzgy' }} 
              style={styles.contentThumbnail}
            />
            <View style={styles.contentInfo}>
              <Text style={styles.contentTitle}>Advanced Editing Techniques</Text>
              <View style={styles.contentStats}>
                <View style={styles.statItem}>
                  <Ionicons name="eye-outline" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>98.5K views</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>7.2K likes</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome name="dollar" size={16} color="#65676B" />
                  <Text style={styles.statItemText}>$387 earned</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Earnings Modal */}
      <Modal visible={showEarningsModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Earnings Details</Text>
            <TouchableOpacity onPress={() => setShowEarningsModal(false)}>
              <Ionicons name="close" size={24} color="#65676B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.earningsSummary}>
            <Text style={styles.earningsPeriod}>June 2023 Earnings</Text>
            <Text style={styles.earningsTotal}>$1,428.50</Text>
            <View style={styles.earningsBreakdown}>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownColor, { backgroundColor: '#0084ff' }]} />
                <Text style={styles.breakdownText}>In-Stream Ads: $428.50</Text>
              </View>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownColor, { backgroundColor: '#4267B2' }]} />
                <Text style={styles.breakdownText}>Brand Collab: $1,000.00</Text>
              </View>
            </View>
          </View>

          <Text style={styles.recentEarningsTitle}>Recent Earnings</Text>
          <FlatList
            data={recentEarnings}
            renderItem={renderEarningItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.earningsList}
          />

          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => console.log('Withdraw pressed')}
          >
            <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Monetization Application Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Monetization Application</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#65676B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDesc}>
            Complete your profile and meet our monetization policies to start earning money from your content.
          </Text>

          <Text style={styles.formSectionTitle}>Basic Information</Text>
          <TextInput
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Category (e.g., Sports, Music, Lifestyle)"
            value={formData.category}
            onChangeText={(text) => handleChange('category', text)}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Short Bio (Tell us about your content)"
            value={formData.bio}
            onChangeText={(text) => handleChange('bio', text)}
            multiline
            style={[styles.input, styles.bioInput]}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Website or Portfolio URL (optional)"
            value={formData.website}
            onChangeText={(text) => handleChange('website', text)}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.formSectionTitle}>Payment Information</Text>
          <TextInput
            placeholder="Tax Information (SSN or EIN)"
            value={formData.taxInfo}
            onChangeText={(text) => handleChange('taxInfo', text)}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Payment Method (PayPal, Bank Account)"
            value={formData.paymentMethod}
            onChangeText={(text) => handleChange('paymentMethod', text)}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Monetization Requirements</Text>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>10,000+ followers</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>5,000+ views in last 30 days</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Original content</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Complies with community standards</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Application</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerText: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#65676B',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  monetizationStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 10,
  },
  statusTitle: {
    fontSize: 14,
    color: '#65676B',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  earningsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e7f3ff',
    borderRadius: 20,
  },
  earningsButtonText: {
    color: '#4267B2',
    fontWeight: '600',
    marginRight: 5,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  statCard: {
    width: '30%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#65676B',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendTextPositive: {
    fontSize: 10,
    color: '#4CAF50',
    marginLeft: 3,
  },
  trendTextNegative: {
    fontSize: 10,
    color: '#F44336',
    marginLeft: 3,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  tab: {
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4267B2',
  },
  tabText: {
    marginLeft: 5,
    color: '#65676B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4267B2',
  },
  tabContent: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 15,
    marginTop: 20,
  },
  chartStyle: {
    borderRadius: 10,
    marginBottom: 20,
  },
  metricsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  metricTextContainer: {},
  metricName: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  positiveChange: {
    backgroundColor: '#E8F5E9',
  },
  negativeChange: {
    backgroundColor: '#FFEBEE',
  },
  changeText: {
    marginLeft: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#F44336',
  },
  monetizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monetizationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
  },
  optionDesc: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 3,
  },
  disabledText: {
    color: '#BDBDBD',
  },
  enableButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4267B2',
    borderRadius: 15,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  contentThumbnail: {
    width: 120,
    height: 80,
  },
  contentInfo: {
    flex: 1,
    padding: 10,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
    marginBottom: 8,
  },
  contentStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  statItemText: {
    fontSize: 12,
    color: '#65676B',
    marginLeft: 5,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    minHeight: '100%',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#050505',
  },
  modalDesc: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 25,
    lineHeight: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f7f8fa',
    fontSize: 14,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  requirementsContainer: {
    backgroundColor: '#f7f8fa',
    borderRadius: 8,
    padding: 15,
    marginVertical: 15,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#65676B',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  earningsSummary: {
    backgroundColor: '#f7f8fa',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  earningsPeriod: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 5,
  },
  earningsTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 15,
  },
  earningsBreakdown: {},
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  breakdownText: {
    fontSize: 14,
    color: '#050505',
  },
  recentEarningsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
    marginBottom: 15,
  },
  earningsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  earningDateContainer: {},
  earningDate: {
    fontSize: 12,
    color: '#65676B',
    marginBottom: 3,
  },
  earningSource: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
  },
  earningAmountContainer: {
    alignItems: 'flex-end',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 3,
  },
  earningStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusPaid: {
    backgroundColor: '#E8F5E9',
  },
  statusProcessing: {
    backgroundColor: '#E3F2FD',
  },
  earningStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#050505',
  },
  withdrawButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Custom Chart Styles
  customChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 15,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 10,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 160,
  },
  bar: {
    borderRadius: 4,
    minHeight: 5,
  },
  barValue: {
    fontSize: 10,
    color: '#65676B',
    marginTop: 5,
  },
  barLabel: {
    fontSize: 11,
    color: '#65676B',
    marginTop: 5,
  },
  lineChartContainer: {
    height: 220,
    paddingVertical: 10,
  },
  lineChartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e4e6eb',
  },
  linePath: {
    flex: 1,
    position: 'relative',
  },
  linePoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#0084ff',
  },
  lineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  lineLabel: {
    fontSize: 10,
    color: '#65676B',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  pieChartWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 120,
  },
  pieSlice: {
    width: 50,
    height: 50,
    margin: 2,
    borderRadius: 4,
  },
  pieLegend: {
    flex: 1,
    paddingLeft: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#050505',
  },
  backIcon: {
    marginRight: 10,
  },
});

export default CreatorDashboard;