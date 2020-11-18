import create from 'zustand';
import {TaiyakiUserModel, TrackingServiceTypes} from '../Models/taiyaki';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfiles = {
  profiles: TaiyakiUserModel[];
  isLoggedIn: (arg0: TrackingServiceTypes) => TaiyakiUserModel | undefined;
  addToProfile: (arg0: TaiyakiUserModel) => Promise<void>;
  removeProfile: (arg0: TrackingServiceTypes) => Promise<void>;
  init: () => void;
};

export const useUserProfiles = create<UserProfiles>((set, get) => ({
  profiles: [],
  isLoggedIn: (tracker) => {
    const item = get().profiles.find((i) => i.source === tracker);
    return item;
  },
  addToProfile: async (user) => {
    set((state) => ({...state, profiles: [...state.profiles, user]}));
    await AsyncStorage.setItem('auth', JSON.stringify(get().profiles));
  },
  removeProfile: async (user) => {
    set((state) => ({
      ...state,
      profiles: get().profiles.filter((i) => i.source !== user),
    }));
    await AsyncStorage.setItem('auth', JSON.stringify(get().profiles));
  },
  init: async () => {
    const file = await AsyncStorage.getItem('auth');
    if (file) {
      const profiles = JSON.parse(file) as TaiyakiUserModel[];
      set((state) => ({...state, profiles}));
    }
  },
}));
