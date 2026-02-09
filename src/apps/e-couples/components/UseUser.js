// context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // Basic Details
    basic: {
      fullName: '',
      age: '',
      gender: '',
      location: '',
      nationality: '',
    },
    // Family
    family: {
      familyValues: '',
      children: '',
      wantChildren: '',
      parentsStatus: '',
      siblings: '',
    },
    // Work
    work: {
      occupation: '',
      education: '',
      income: '',
      workHours: '',
      careerGoals: '',
    },
    // Habits
    habits: {
      smoking: '',
      drinking: '',
      exercise: '',
      diet: '',
      sleepSchedule: '',
    },
    // Medical History
    medical: {
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      disabilities: '',
      medication: '',
    },
    // Sexuality
    sexuality: {
      orientation: '',
      relationshipType: '',
      openTo: '',
      boundaries: '',
    },
    // Hobbies
    hobbies: {
      interests: [],
      activities: [],
      music: [],
      movies: [],
      books: [],
      sports: [],
    },
    // Preferences
    preferences: {
      ageRange: { min: 25, max: 35 },
      locationRange: '',
      relationshipGoals: '',
      dealBreakers: [],
      mustHaves: [],
    },
    // Appearance
    appearance: {
      height: '',
      bodyType: '',
      hairColor: '',
      eyeColor: '',
      style: '',
    },
    // About Me
    about: {
      bio: '',
      personality: [],
      lifeGoals: '',
      values: [],
    },
    // Images
    images: [],
  });

  const updateUserData = (section, data) => {
    setUserData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const submitProfile = async () => {
    // Here you would send userData to your backend
    console.log('Submitting profile:', userData);
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, submitProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};