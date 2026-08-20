import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTE } from "../api_routing/api";
import { useTheme } from "../src/context/ThemeContext";
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

const MyServicePostsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    company: "",
    location: "",
    price_range: "",
    description: "",
    contactinfo: "",
    email: "",
    experience_level: "",
    availability: "",
    categories: "",
  });
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/service-posts-categories/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200 || res.status === 201) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log('Error fetching categories:', error.message);
    }
  };

  // Fetch user's service posts
  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/service-posts/my-posts/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching posts:', error.message);
      Alert.alert('Error', 'Failed to load your service posts');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Handle edit
  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      company: post.company || "",
      location: post.location || "",
      price_range: post.price_range || "",
      description: post.description || "",
      contactinfo: post.contactinfo || "",
      email: post.email || "",
      experience_level: post.experience_level || "",
      availability: post.availability || "Immediately",
      categories: post.categories.length > 0 ? post.categories[0].id : "",
    });
    setNewImages([]);
    setEditModalVisible(true);
  };

  // Handle delete
  const handleDelete = (post) => {
    setPostToDelete(post);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(
        `${API_ROUTE}/service-posts/my-posts/${postToDelete.id}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Service post deleted successfully');
        setDeleteModalVisible(false);
        setPostToDelete(null);
        fetchPosts(); // Refresh the list
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the post');
      console.log('Delete error:', error.message);
    }
  };

  // Update post
  const updatePost = async () => {
    if (!selectedPost) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = new FormData();
      
      // Add all fields
      Object.keys(editForm).forEach(key => {
        if (editForm[key]) {
          data.append(key, editForm[key]);
        }
      });
      
      // Add new images
      newImages.forEach((uri) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        data.append('uploaded_images', {
          uri: uri,
          name: filename,
          type: type,
        });
      });

      const response = await axios.put(
        `${API_ROUTE}/service-posts/my-posts/${selectedPost.id}/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Service post updated successfully');
        setEditModalVisible(false);
        setSelectedPost(null);
        fetchPosts(); // Refresh the list
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update the post');
      console.log('Update error:', error.message);
    }
  };

  const selectNewImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5,
        includeBase64: false
      });

      if (!result.didCancel && !result.errorCode) {
        const uris = result.assets.map(asset => asset.uri);
        setNewImages(prev => [...prev, ...uris].slice(0, 5));
      }
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const styles = createStyles(colors, isDark);

  // Render loading state gtg
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading your posts...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Deal Services</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Supplyrequest')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="post-add" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Service Posts Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Create your first service post to get started
            </Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Supplyrequest')}
            >
              <Text style={styles.createButtonText}>Create New Service </Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={[styles.postCard, { 
              backgroundColor: colors.surface,
              borderColor: isDark ? colors.border : '#e9ecef',
            }]}>
              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollView}
                >
                  {post.images.slice(0, 3).map((img, index) => (
                    <Image 
                      key={index} 
                      source={{ uri: img.image }} 
                      style={styles.postImage} 
                    />
                  ))}
                  {post.images.length > 3 && (
                    <View style={[styles.moreImagesBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.moreImagesText}>+{post.images.length - 3}</Text>
                    </View>
                  )}
                </ScrollView>
              )}

              <View style={styles.postContent}>
                {/* Category Badge */}
                {post.category_names && post.category_names.length > 0 && (
                  <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                      {post.category_names[0]}
                    </Text>
                  </View>
                )}

                <Text style={[styles.postTitle, { color: colors.text }]}>
                  {post.title}
                </Text>

                {post.company && (
                  <View style={styles.postInfoRow}>
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.postInfoText, { color: colors.textSecondary }]}>
                      {post.company}
                    </Text>
                  </View>
                )}

                {post.location && (
                  <View style={styles.postInfoRow}>
                    <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.postInfoText, { color: colors.textSecondary }]}>
                      {post.location}
                    </Text>
                  </View>
                )}

                {post.price_range && (
                  <View style={styles.postInfoRow}>
                    <MaterialIcons name="attach-money" size={16} color={colors.textSecondary} />
                    <Text style={[styles.postInfoText, { color: colors.textSecondary }]}>
                      {post.price_range}
                    </Text>
                  </View>
                )}

                {post.experience_level && (
                  <View style={styles.experienceBadge}>
                    <Text style={styles.experienceText}>{post.experience_level}</Text>
                  </View>
                )}

                <Text style={[styles.postDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {post.description}
                </Text>

                <View style={styles.postFooter}>
                  <Text style={[styles.postDate, { color: colors.textTertiary }]}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Text>
                  
                  <View style={styles.postActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                      onPress={() => handleEdit(post)}
                    >
                      <MaterialIcons name="edit" size={18} color={colors.primary} />
                      <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FF3B30' + '15' }]}
                      onPress={() => handleDelete(post)}
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#FF3B30" />
                      <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Service Post</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Title *"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.title}
                  onChangeText={(text) => setEditForm({...editForm, title: text})}
                />

                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Company"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.company}
                  onChangeText={(text) => setEditForm({...editForm, company: text})}
                />

                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Location *"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.location}
                  onChangeText={(text) => setEditForm({...editForm, location: text})}
                />

                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Price Range"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.price_range}
                  onChangeText={(text) => setEditForm({...editForm, price_range: text})}
                />

                <TextInput
                  style={[styles.modalInput, styles.modalTextArea, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Description *"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.description}
                  onChangeText={(text) => setEditForm({...editForm, description: text})}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Email"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({...editForm, email: text})}
                  keyboardType="email-address"
                />

                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: isDark ? colors.background : '#f8f9fa',
                    borderColor: isDark ? colors.border : '#e9ecef',
                    color: colors.text
                  }]}
                  placeholder="Contact Info"
                  placeholderTextColor={colors.textTertiary}
                  value={editForm.contactinfo}
                  onChangeText={(text) => setEditForm({...editForm, contactinfo: text})}
                />

                {/* Category Selection */}
                <View style={styles.modalCategoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.modalCategoryButton,
                        editForm.categories === cat.id && styles.modalCategorySelected,
                        { 
                          backgroundColor: editForm.categories === cat.id ? colors.primary : (isDark ? colors.background : '#f8f9fa'),
                          borderColor: editForm.categories === cat.id ? colors.primary : (isDark ? colors.border : '#e9ecef'),
                        }
                      ]}
                      onPress={() => setEditForm({...editForm, categories: cat.id})}
                    >
                      <Text style={[
                        styles.modalCategoryText,
                        { color: editForm.categories === cat.id ? '#fff' : colors.text }
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Experience Level */}
                <View style={styles.modalOptionContainer}>
                  {['Beginner', 'Intermediate', 'Expert'].map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.modalOptionButton,
                        editForm.experience_level === level && styles.modalOptionSelected,
                        { 
                          backgroundColor: editForm.experience_level === level ? colors.primary : (isDark ? colors.background : '#f8f9fa'),
                          borderColor: editForm.experience_level === level ? colors.primary : (isDark ? colors.border : '#e9ecef'),
                        }
                      ]}
                      onPress={() => setEditForm({...editForm, experience_level: level})}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        { color: editForm.experience_level === level ? '#fff' : colors.text }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Availability */}
                <View style={styles.modalOptionContainer}>
                  {['Immediately', 'Within 1 week', 'Flexible'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.modalOptionButton,
                        editForm.availability === option && styles.modalOptionSelected,
                        { 
                          backgroundColor: editForm.availability === option ? colors.primary : (isDark ? colors.background : '#f8f9fa'),
                          borderColor: editForm.availability === option ? colors.primary : (isDark ? colors.border : '#e9ecef'),
                        }
                      ]}
                      onPress={() => setEditForm({...editForm, availability: option})}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        { color: editForm.availability === option ? '#fff' : colors.text }
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Add New Images */}
                <View style={styles.modalImageSection}>
                  <Text style={[styles.modalImageLabel, { color: colors.text }]}>
                    Add New Images
                  </Text>
                  <View style={styles.modalImageContainer}>
                    {newImages.map((uri, index) => (
                      <View key={index} style={styles.modalImageWrapper}>
                        <Image source={{ uri }} style={styles.modalImage} />
                        <TouchableOpacity 
                          style={styles.modalRemoveImage}
                          onPress={() => removeNewImage(index)}
                        >
                          <Ionicons name="close-circle" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {newImages.length < 5 && (
                      <TouchableOpacity 
                        style={[styles.modalAddImage, { 
                          borderColor: colors.primary,
                          backgroundColor: isDark ? colors.background : '#f8f9fa',
                        }]}
                        onPress={selectNewImages}
                      >
                        <Ionicons name="add" size={30} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
                  onPress={updatePost}
                >
                  <Text style={styles.modalSaveButtonText}>Update Post</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.deleteModalCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="warning" size={50} color="#FF3B30" />
            <Text style={[styles.deleteModalTitle, { color: colors.text }]}>
              Delete Service Post?
            </Text>
            <Text style={[styles.deleteModalSubtitle, { color: colors.textSecondary }]}>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteModalCancel, { borderColor: colors.border }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={[styles.deleteModalCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteModalConfirm, { backgroundColor: '#FF3B30' }]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageScrollView: {
    maxHeight: 150,
  },
  postImage: {
    width: 150,
    height: 150,
    marginRight: 4,
  },
  moreImagesBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  postInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  postInfoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  experienceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  experienceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  postDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  postDate: {
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalInput: {
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 12,
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalCategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  modalCategoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  modalCategorySelected: {
    borderWidth: 1,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  modalOptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  modalOptionSelected: {
    borderWidth: 1,
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalImageSection: {
    marginBottom: 12,
  },
  modalImageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalImageWrapper: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalRemoveImage: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  modalAddImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Delete Modal
  deleteModalCard: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  deleteModalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  deleteModalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  deleteModalCancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteModalConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteModalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyServicePostsScreen;