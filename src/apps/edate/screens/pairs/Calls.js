import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CallsScreen = () => {
  const [search, setSearch] = useState("");
  const [callType, setCallType] = useState("all"); 

  const calls = [
    {
      id: "1",
      name: "Sarah Johnson",
      type: "outgoing",
      duration: "12:34",
      time: "2 hours ago",
      status: "completed",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "2",
      name: "Mike Chen",
      type: "incoming",
      duration: "5:21",
      time: "Yesterday",
      status: "missed",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "3",
      name: "Emma Davis",
      type: "incoming",
      duration: "23:15",
      time: "2 days ago",
      status: "completed",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      type: "outgoing",
      duration: "Missed",
      time: "3 days ago",
      status: "missed",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const filteredCalls = calls.filter(call => {
    if (callType === "all") return true;
    if (callType === "missed") return call.status === "missed";
    if (callType === "outgoing") return call.type === "outgoing";
    return true;
  });

  const getCallIcon = (call) => {
    if (call.status === "missed") {
      return call.type === "incoming" 
        ? { name: "call-missed", color: "#EF4444" }
        : { name: "call-missed-outgoing", color: "#EF4444" };
    }
    return call.type === "incoming"
      ? { name: "call-received", color: "#10B981" }
      : { name: "call-made", color: "#3B82F6" };
  };

  const renderItem = ({ item }) => {
    const callIcon = getCallIcon(item);
    
    return (
      <TouchableOpacity style={styles.callCard} activeOpacity={0.7}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.callInfo}>
          <Text style={[
            styles.name,
            item.status === 'missed' && styles.missedCall
          ]}>
            {item.name}
          </Text>
          <View style={styles.callDetails}>
            <MaterialCommunityIcons
              name={callIcon.name}
              size={16}
              color={callIcon.color}
            />
            <Text style={styles.callTypeText}>
              {item.type === 'incoming' ? 'Incoming' : 'Outgoing'} • {item.duration}
            </Text>
          </View>
        </View>

        <View style={styles.callMeta}>
          <Text style={styles.time}>{item.time}</Text>
          <TouchableOpacity style={styles.callButton}>
            <Icon name="call-outline" size={20} color="#FF3366" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="call-outline" size={22} color="#FF3366" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search calls..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Call Type Filters */}
      <View style={styles.filterContainer}>
        {[
          { key: "all", label: "All Calls", count: calls.length },
          { key: "missed", label: "Missed", count: calls.filter(c => c.status === "missed").length },
          { key: "outgoing", label: "Outgoing", count: calls.filter(c => c.type === "outgoing").length },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filter,
              callType === filter.key && styles.activeFilter
            ]}
            onPress={() => setCallType(filter.key)}
          >
            <Text style={[
              styles.filterText,
              callType === filter.key && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
            {filter.count > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{filter.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {calls.filter(c => c.status === "completed").length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {calls.filter(c => c.status === "missed").length}
          </Text>
          <Text style={styles.statLabel}>Missed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round(calls.filter(c => c.status === "completed").reduce((acc, call) => {
              if (call.duration !== 'Missed') {
                const [min, sec] = call.duration.split(':').map(Number);
                return acc + min * 60 + sec;
              }
              return acc;
            }, 0) / 60)}
          </Text>
          <Text style={styles.statLabel}>Total Min</Text>
        </View>
      </View>

     

      {/* List */}
      <FlatList
        data={filteredCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listTitle}>Recent Calls</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerButton: {
    padding: 8,
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F8FAFC",
  },
  activeFilter: {
    backgroundColor: "#FF3366",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  filterBadge: {
    backgroundColor: "#FF6F00",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF3366",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  quickCallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickCallIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF3366",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickCallText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  callCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFE4EC",
  },
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  missedCall: {
    color: "#EF4444",
  },
  callDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  callTypeText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
  callMeta: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  callButton: {
    padding: 8,
    backgroundColor: "#FFF0F5",
    borderRadius: 10,
  },
});

export default CallsScreen;