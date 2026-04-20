import type { FilterParams } from '../types/filter';

export type LocalProfile = {
  id: string;
  full_name: string;
  date_of_birth: string;
  occupation: string;
  education_level: string;
  country: string;
  height: string;
  bio: string;
  isPremium: boolean;
  isVerified: boolean;
  isShowingOnlineStatus: boolean;
  last_active_at: string;
  religion: string;
  sect: string;
  caste: string;
  marital_status: string;
  languages: string[];
  interests: string[];
  personalities: string[];
  skin_tone: string;
  healthy_lifestyle_importance: string;
  religiosity_level: string;
  smoking_habit: string;
  drinking_habit: string;
  dietary_preference: string;
  family_involvement_importance: string;
  marriage_timeline: string;
  relationship_preference: string;
  children_views: string;
  living_situation: string;
  relocation_preference: string;
  partner_age_range_preference: string;
  image_urls: string[];
};

export const HARD_CODED_PROFILES: LocalProfile[] = [
  {
    id: 'profile-1',
    full_name: 'Ayesha Khan',
    date_of_birth: '1997-03-21',
    occupation: 'Product Designer',
    education_level: 'Masters',
    country: 'Pakistan',
    height: "5'5\"",
    bio: 'Family-oriented, creative, and looking for a meaningful connection.',
    isPremium: true,
    isVerified: true,
    isShowingOnlineStatus: true,
    last_active_at: new Date().toISOString(),
    religion: 'Islam',
    sect: 'Sunni',
    caste: 'Khan',
    marital_status: 'Never Married',
    languages: ['Urdu', 'English'],
    interests: ['Travel', 'Reading', 'Cooking'],
    personalities: ['Calm', 'Empathetic'],
    skin_tone: 'Fair',
    healthy_lifestyle_importance: 'High',
    religiosity_level: 'Moderate',
    smoking_habit: 'Never',
    drinking_habit: 'Never',
    dietary_preference: 'Halal',
    family_involvement_importance: 'Very important',
    marriage_timeline: 'Within 1 year',
    relationship_preference: 'Serious Relationship',
    children_views: 'Want children',
    living_situation: 'With family',
    relocation_preference: 'Open to relocation',
    partner_age_range_preference: '26-34',
    image_urls: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900',
    ],
  },
  {
    id: 'profile-2',
    full_name: 'Sara Iqbal',
    date_of_birth: '1995-11-09',
    occupation: 'Software Engineer',
    education_level: 'Bachelors',
    country: 'United Arab Emirates',
    height: "5'3\"",
    bio: 'Tech professional who values deen, growth, and honest communication.',
    isPremium: false,
    isVerified: true,
    isShowingOnlineStatus: false,
    last_active_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    religion: 'Islam',
    sect: 'Sunni',
    caste: 'Sheikh',
    marital_status: 'Never Married',
    languages: ['English', 'Arabic'],
    interests: ['Fitness', 'Podcasts'],
    personalities: ['Focused', 'Warm'],
    skin_tone: 'Wheatish',
    healthy_lifestyle_importance: 'High',
    religiosity_level: 'High',
    smoking_habit: 'Never',
    drinking_habit: 'Never',
    dietary_preference: 'Halal',
    family_involvement_importance: 'Important',
    marriage_timeline: 'Within 2 years',
    relationship_preference: 'Marriage',
    children_views: 'Open to children',
    living_situation: 'Independent',
    relocation_preference: 'Prefer same country',
    partner_age_range_preference: '27-36',
    image_urls: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900',
    ],
  },
  {
    id: 'profile-3',
    full_name: 'Mariam Yusuf',
    date_of_birth: '1999-07-02',
    occupation: 'Doctor',
    education_level: 'MBBS',
    country: 'Saudi Arabia',
    height: "5'7\"",
    bio: 'Compassionate and ambitious. Looking for a supportive life partner.',
    isPremium: true,
    isVerified: false,
    isShowingOnlineStatus: true,
    last_active_at: new Date().toISOString(),
    religion: 'Islam',
    sect: 'Sunni',
    caste: 'Syed',
    marital_status: 'Never Married',
    languages: ['Urdu', 'English', 'Arabic'],
    interests: ['Volunteering', 'Travel'],
    personalities: ['Positive', 'Disciplined'],
    skin_tone: 'Medium',
    healthy_lifestyle_importance: 'High',
    religiosity_level: 'Moderate',
    smoking_habit: 'Never',
    drinking_habit: 'Never',
    dietary_preference: 'Halal',
    family_involvement_importance: 'Very important',
    marriage_timeline: 'Within 6 months',
    relationship_preference: 'Marriage',
    children_views: 'Want children',
    living_situation: 'With family',
    relocation_preference: 'Open to relocation',
    partner_age_range_preference: '25-33',
    image_urls: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900',
    ],
  },
  {
    id: 'profile-4',
    full_name: 'Noor Fatima',
    date_of_birth: '1994-01-18',
    occupation: 'Teacher',
    education_level: 'M.Ed',
    country: 'India',
    height: "5'4\"",
    bio: 'Simple, sincere, and family-centric. Believes in patience and respect.',
    isPremium: false,
    isVerified: true,
    isShowingOnlineStatus: false,
    last_active_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    religion: 'Islam',
    sect: 'Shia',
    caste: 'Ansari',
    marital_status: 'Divorced',
    languages: ['Hindi', 'Urdu'],
    interests: ['Teaching', 'Poetry'],
    personalities: ['Kind', 'Thoughtful'],
    skin_tone: 'Fair',
    healthy_lifestyle_importance: 'Medium',
    religiosity_level: 'High',
    smoking_habit: 'Never',
    drinking_habit: 'Never',
    dietary_preference: 'Halal',
    family_involvement_importance: 'Important',
    marriage_timeline: 'No rush',
    relationship_preference: 'Serious Relationship',
    children_views: 'Open to children',
    living_situation: 'With family',
    relocation_preference: 'Not willing to relocate',
    partner_age_range_preference: '30-40',
    image_urls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900',
      'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=900',
    ],
  },
  {
    id: 'profile-5',
    full_name: 'Hiba Rahman',
    date_of_birth: '1998-09-30',
    occupation: 'Marketing Specialist',
    education_level: 'MBA',
    country: 'United Kingdom',
    height: "5'6\"",
    bio: 'Outgoing but grounded. Looking for partnership built on trust.',
    isPremium: true,
    isVerified: true,
    isShowingOnlineStatus: true,
    last_active_at: new Date().toISOString(),
    religion: 'Islam',
    sect: 'Sunni',
    caste: 'Qureshi',
    marital_status: 'Never Married',
    languages: ['English', 'Bengali', 'Urdu'],
    interests: ['Photography', 'Hiking', 'Coffee'],
    personalities: ['Confident', 'Friendly'],
    skin_tone: 'Wheatish',
    healthy_lifestyle_importance: 'Medium',
    religiosity_level: 'Moderate',
    smoking_habit: 'Never',
    drinking_habit: 'Never',
    dietary_preference: 'Halal',
    family_involvement_importance: 'Important',
    marriage_timeline: 'Within 1 year',
    relationship_preference: 'Marriage',
    children_views: 'Want children',
    living_situation: 'Independent',
    relocation_preference: 'Open to relocation',
    partner_age_range_preference: '26-35',
    image_urls: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=900',
      'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=900',
    ],
  },
];

export const getHardcodedProfiles = (filters?: FilterParams | null): LocalProfile[] => {
  if (!filters) return HARD_CODED_PROFILES;

  return HARD_CODED_PROFILES.filter(profile => {
    const age = Math.max(
      0,
      new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear(),
    );
    if (typeof filters.min_age === 'number' && age < filters.min_age) return false;
    if (typeof filters.max_age === 'number' && age > filters.max_age) return false;
    if (filters.religion && profile.religion !== filters.religion) return false;
    if (filters.country && profile.country !== filters.country) return false;
    if (filters.height && profile.height !== filters.height) return false;
    if (filters.marital_status && profile.marital_status !== filters.marital_status) {
      return false;
    }
    if (filters.caste && profile.caste !== filters.caste) return false;
    return true;
  });
};

export const getHardcodedProfileById = (profileId?: string) =>
  HARD_CODED_PROFILES.find(profile => profile.id === profileId);
