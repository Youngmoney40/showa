// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import Icon from "react-native-vector-icons/Feather";
// import Colors from "../../globalshared/constants/colors";

// const AvailabilityScreen = ({ navigation, route }) => {

//   const {
//     name,age,language,profileImage,issues,job,customIssue,status
// } = route.params || {}

  
//   const [selectedDays, setSelectedDays] = useState([]);
//   const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

//   const days = [
//     { id: 1, label: "Monday", short: "MON" },
//     { id: 2, label: "Tuesday", short: "TUE" },
//     { id: 3, label: "Wednesday", short: "WED" },
//     { id: 4, label: "Thursday", short: "THU" },
//     { id: 5, label: "Friday", short: "FRI" },
//     { id: 6, label: "Saturday", short: "SAT" },
//     { id: 7, label: "Sunday", short: "SUN" },
//   ];

//   const timeSlots = [
//     "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
//     "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
//     "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
//     "09:00 PM", "10:00 PM", "11:00 PM"
//   ];

//   const toggleDay = (day) => {
//     setSelectedDays((prev) =>
//       prev.includes(day.id)
//         ? prev.filter((id) => id !== day.id)
//         : [...prev, day.id]
//     );
//   };

//   const toggleTimeSlot = (timeSlot) => {
//     setSelectedTimeSlots((prev) =>
//       prev.includes(timeSlot)
//         ? prev.filter((time) => time !== timeSlot)
//         : [...prev, timeSlot]
//     );
//   };

//   const selectAllDays = () => {
//     if (selectedDays.length === days.length) {
//       setSelectedDays([]);
//     } else {
//       setSelectedDays(days.map(day => day.id));
//     }
//   };

//   const getSelectedDaysLabels = () => {
//     return days.filter(day => selectedDays.includes(day.id)).map(day => day.label);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity>
//         <View style={styles.progressContainer}>
//           <Text style={styles.progressText}>Schedule Preferences</Text>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '100%' }]} />
//           </View>
//         </View>
//       </View>

//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.titleSection}>
//           <View style={styles.titleIcon}>
//             <Icon name="clock" size={24} color={Colors.primary} />
//           </View>
//           <Text style={styles.title}>When are you available to talk?</Text>
//           <Text style={styles.subtitle}>
//             Select your preferred days and times. Listeners will see your availability and can schedule sessions accordingly.
//           </Text>
//         </View>

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Select Days</Text>
//             <TouchableOpacity onPress={selectAllDays}>
//               <Text style={styles.selectAllText}>
//                 {selectedDays.length === days.length ? 'Deselect All' : 'Select All'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.daysGrid}>
//             {days.map((day) => (
//               <TouchableOpacity
//                 key={day.id}
//                 style={[
//                   styles.dayChip,
//                   selectedDays.includes(day.id) && styles.dayChipActive
//                 ]}
//                 onPress={() => toggleDay(day)}
//               >
//                 <Text style={[
//                   styles.dayLabel,
//                   selectedDays.includes(day.id) && styles.dayLabelActive
//                 ]}>
//                   {day.short}
//                 </Text>
//                 <Text style={[
//                   styles.dayFullLabel,
//                   selectedDays.includes(day.id) && styles.dayFullLabelActive
//                 ]}>
//                   {day.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Time Selection Section =============*/}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Select Time Slots</Text>
//             <Text style={styles.sectionSubtitle}>
//               {selectedTimeSlots.length} time slot{selectedTimeSlots.length !== 1 ? 's' : ''} selected
//             </Text>
//           </View>
          
//           <View style={styles.timeGrid}>
//             {timeSlots.map((timeSlot, index) => (
//               <TouchableOpacity
//                 key={timeSlot}
//                 style={[
//                   styles.timeChip,
//                   selectedTimeSlots.includes(timeSlot) && styles.timeChipActive
//                 ]}
//                 onPress={() => toggleTimeSlot(timeSlot)}
//               >
//                 <Text style={[
//                   styles.timeLabel,
//                   selectedTimeSlots.includes(timeSlot) && styles.timeLabelActive
//                 ]}>
//                   {timeSlot}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Selection Summary =====================*/}
//         {(selectedDays.length > 0 || selectedTimeSlots.length > 0) && (
//           <View style={styles.summarySection}>
//             <View style={styles.summaryHeader}>
//               <Icon name="calendar" size={18} color={Colors.primary} />
//               <Text style={styles.summaryTitle}>Your Availability</Text>
//             </View>
            
//             {selectedDays.length > 0 && (
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Selected Days:</Text>
//                 <View style={styles.tagsContainer}>
//                   {getSelectedDaysLabels().slice(0, 3).map((day) => (
//                     <View key={day} style={styles.summaryTag}>
//                       <Text style={styles.summaryTagText}>{day}</Text>
//                     </View>
//                   ))}
//                   {getSelectedDaysLabels().length > 3 && (
//                     <View style={styles.moreTag}>
//                       <Text style={styles.moreTagText}>+{getSelectedDaysLabels().length - 3} more</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
            
//             {selectedTimeSlots.length > 0 && (
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Selected Times:</Text>
//                 <View style={styles.tagsContainer}>
//                   {selectedTimeSlots.slice(0, 2).map((time) => (
//                     <View key={time} style={styles.summaryTag}>
//                       <Text style={styles.summaryTagText}>{time}</Text>
//                     </View>
//                   ))}
//                   {selectedTimeSlots.length > 2 && (
//                     <View style={styles.moreTag}>
//                       <Text style={styles.moreTagText}>+{selectedTimeSlots.length - 2} more</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>
//         )}

//         <View style={styles.infoSection}>
//           <View style={styles.infoBox}>
//             <Icon name="info" size={18} color={Colors.primary} />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoTitle}>Flexible Scheduling</Text>
//               <Text style={styles.infoText}>
//                 You can always update your availability later in settings. Listeners will only see times when you're marked as available.
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.buttonSection}>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.secondaryButtonText}>Back</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               (selectedDays.length === 0 || selectedTimeSlots.length === 0) && styles.primaryButtonDisabled
//             ]}
//             // onPress={() => {
//             //   // Handle completion
//             // //   console.log('Selected days:', selectedDays);
//             // //   console.log('Selected time slots:', selectedTimeSlots);
//             //   navigation.navigate('CPricing');
              

//             // }}
//              onPress={() => navigation.navigate("CPricing",{
//                   customIssue:customIssue,
//                   status:status,
//                   name:name,
//                   age:age,
//                   language:language,
//                   profileImage:profileImage,
//                   job:job,
//                   issues:issues,
//                   schedule_date:selectedDays,
//                   schedule_time: selectedTimeSlots
//             })}
            
//             disabled={selectedDays.length === 0 || selectedTimeSlots.length === 0}
//           >
//             <Text style={styles.primaryButtonText}>
//               Save & Next
//             </Text>
//             <Icon name="chevron-right" size={18} color={Colors.white} />
//             <Icon style={{marginLeft:-20}} name="chevron-right" size={18} color={Colors.white} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 10,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: Colors.white,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     alignSelf: 'flex-start',
//     marginBottom: 20,
//   },
//   progressContainer: {
//     marginBottom: 10,
//   },
//   progressText: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: Colors.border,
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: 3,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//   },
//   titleSection: {
//     marginBottom: 30,
//   },
//   titleIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 12,
//     lineHeight: 34,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//   },
//   section: {
//     marginBottom: 30,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     fontWeight: '500',
//   },
//   selectAllText: {
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   daysGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   dayChip: {
//     flex: 1,
//     minWidth: '30%',
//     backgroundColor: Colors.white,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   dayChipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//     shadowColor: Colors.primary,
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   dayLabel: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   dayLabelActive: {
//     color: Colors.white,
//   },
//   dayFullLabel: {
//     fontSize: 12,
//     color: Colors.textTertiary,
//     fontWeight: '500',
//   },
//   dayFullLabelActive: {
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
//   timeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   timeChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     backgroundColor: Colors.white,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   timeChipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//     shadowColor: Colors.primary,
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   timeLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.textPrimary,
//   },
//   timeLabelActive: {
//     color: Colors.white,
//   },
//   summarySection: {
//     backgroundColor: 'rgba(255, 51, 102, 0.05)',
//     padding: 20,
//     borderRadius: 16,
//     borderLeftWidth: 3,
//     borderLeftColor: Colors.primary,
//     marginBottom: 20,
//   },
//   summaryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.primary,
//     marginLeft: 8,
//   },
//   summaryItem: {
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     marginBottom: 8,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   summaryTag: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   summaryTagText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: Colors.white,
//   },
//   moreTag: {
//     backgroundColor: 'rgba(255, 51, 102, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   moreTagText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: Colors.primary,
//   },
//   infoSection: {
//     marginBottom: 20,
//   },
//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: Colors.white,
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     lineHeight: 18,
//   },
//   buttonSection: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   secondaryButton: {
//     flex: 1,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//   },
//   secondaryButtonText: {
//     color: Colors.textSecondary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   primaryButton: {
//     flex: 2,
//     backgroundColor: Colors.primary,
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 8,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   primaryButtonDisabled: {
//     backgroundColor: Colors.textTertiary,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.1,
//   },
//   primaryButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default AvailabilityScreen;


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../globalshared/constants/colors";

const AvailabilityScreen = ({ navigation, route }) => {
  const {
    name, age, language, profileImage, issues, job, customIssue, status
  } = route.params || {};

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);

  const days = [
    { id: 1, label: "Monday", short: "MON" },
    { id: 2, label: "Tuesday", short: "TUE" },
    { id: 3, label: "Wednesday", short: "WED" },
    { id: 4, label: "Thursday", short: "THU" },
    { id: 5, label: "Friday", short: "FRI" },
    { id: 6, label: "Saturday", short: "SAT" },
    { id: 7, label: "Sunday", short: "SUN" },
  ];

  const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM", "11:00 PM"
  ];

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      const dateValue = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      dates.push({
        label: formattedDate,
        value: dateValue,
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return dates;
  };

  const availableDates = generateDates();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day.id)
        ? prev.filter((id) => id !== day.id)
        : [...prev, day.id]
    );
  };

  const toggleTimeSlot = (timeSlot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(timeSlot)
        ? prev.filter((time) => time !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  const selectAllDays = () => {
    if (selectedDays.length === days.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(days.map(day => day.id));
    }
  };

 

  const handleDateSelect = (date) => {
    setSelectedDate(date.value);
    setShowDateModal(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "Select a date";
    
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const DateSelectionModal = () => (
    <Modal
      visible={showDateModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDateModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowDateModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Text style={styles.modalSubtitle}>
                  Choose your preferred session date
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowDateModal(false)}
                >
                  <Icon name="x" size={24} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.datesList}>
                {availableDates.map((date, index) => (
                  <TouchableOpacity
                    key={date.value}
                    style={[
                      styles.dateItem,
                      selectedDate === date.value && styles.dateItemActive
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <View style={styles.dateIcon}>
                      <Icon 
                        name="calendar" 
                        size={20} 
                        color={selectedDate === date.value ? Colors.white : Colors.primary} 
                      />
                    </View>
                    <View style={styles.dateInfo}>
                      <Text style={[
                        styles.dateWeekday,
                        selectedDate === date.value && styles.dateTextActive
                      ]}>
                        {date.weekday}
                      </Text>
                      <Text style={[
                        styles.dateFull,
                        selectedDate === date.value && styles.dateTextActive
                      ]}>
                        {date.label}
                      </Text>
                    </View>
                    {selectedDate === date.value && (
                      <Icon name="check" size={20} color={Colors.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Schedule Preferences</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleIcon}>
            <Icon name="clock" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>When are you available to talk?</Text>
          <Text style={styles.subtitle}>
            Select your preferred date, days and times. Listeners will see your availability and can schedule sessions accordingly.
          </Text>
        </View>

        {/* Date Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate("")}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowDateModal(true)}
          >
            <View style={styles.dateSelectorLeft}>
              <Icon name="calendar" size={20} color={Colors.primary} />
              <Text style={[
                styles.dateSelectorText,
                selectedDate && styles.dateSelectorTextSelected
              ]}>
                {formatSelectedDate()}
              </Text>
            </View>
            <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
          
          {selectedDate && (
            <View style={styles.selectedDateBadge}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.selectedDateText}>
                Date selected: {formatSelectedDate()}
              </Text>
            </View>
          )}
        </View>

        

        {/* Time Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Time Slots</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedTimeSlots.length} time slot{selectedTimeSlots.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
          
          <View style={styles.timeGrid}>
            {timeSlots.map((timeSlot, index) => (
              <TouchableOpacity
                key={timeSlot}
                style={[
                  styles.timeChip,
                  selectedTimeSlots.includes(timeSlot) && styles.timeChipActive
                ]}
                onPress={() => toggleTimeSlot(timeSlot)}
              >
                <Text style={[
                  styles.timeLabel,
                  selectedTimeSlots.includes(timeSlot) && styles.timeLabelActive
                ]}>
                  {timeSlot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selection Summary */}
        {(selectedDate || selectedDays.length > 0 || selectedTimeSlots.length > 0) && (
          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Icon name="calendar" size={18} color={Colors.primary} />
              <Text style={styles.summaryTitle}>Your Availability</Text>
            </View>
            
            {selectedDate && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Selected Date:</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.summaryTag}>
                    <Text style={styles.summaryTagText}>{formatSelectedDate()}</Text>
                  </View>
                </View>
              </View>
            )}
            
            
            {selectedTimeSlots.length > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Selected Times:</Text>
                <View style={styles.tagsContainer}>
                  {selectedTimeSlots.slice(0, 2).map((time) => (
                    <View key={time} style={styles.summaryTag}>
                      <Text style={styles.summaryTagText}>{time}</Text>
                    </View>
                  ))}
                  {selectedTimeSlots.length > 2 && (
                    <View style={styles.moreTag}>
                      <Text style={styles.moreTagText}>+{selectedTimeSlots.length - 2} more</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="info" size={18} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Flexible Scheduling</Text>
              <Text style={styles.infoText}>
                You can always update your availability later in settings. Listeners will only see times when you're marked as available.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (selectedDate.length === 0  || selectedTimeSlots.length === 0) && styles.primaryButtonDisabled
            ]}
            onPress={() => navigation.navigate("CPricing", {
              customIssue: customIssue,
              status: status,
              name: name,
              age: age,
              language: language,
              profileImage: profileImage,
              job: job,
              issues: issues,
              schedule_date: selectedDate, 
              schedule_time: selectedTimeSlots[0] || selectedTimeSlots[0] 
            })}
            disabled={selectedDate.length === 0 || selectedTimeSlots.length === 0}
          >
            <Text style={styles.primaryButtonText}>
              Save & Next
            </Text>
            <Icon name="chevron-right" size={18} color={Colors.white} />
            <Icon style={{marginLeft: -20}} name="chevron-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selection Modal */}
      <DateSelectionModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 30,
  },
  titleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  selectAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  // Date Selector Styles
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateSelectorText: {
    fontSize: 16,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  dateSelectorTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  selectedDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  selectedDateText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  success: {
    color: Colors.success,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 0,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  datesList: {
    maxHeight: 400,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  dateItemActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  dateWeekday: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dateFull: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dateTextActive: {
    color: Colors.primary,
  },
  // Existing styles remain the same...
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayChip: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dayLabelActive: {
    color: Colors.white,
  },
  dayFullLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  dayFullLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  timeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  timeLabelActive: {
    color: Colors.white,
  },
  summarySection: {
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  moreTag: {
    backgroundColor: 'rgba(255, 51, 102, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moreTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonSection: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: Colors.error,
  },
  borderLight: {
    borderColor: Colors.borderLight,
  },
});

export default AvailabilityScreen;