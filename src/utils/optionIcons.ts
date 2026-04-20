/**
 * Maps questionnaire options to appropriate icons.
 * Uses keyword matching (optionLower.includes(...)); add new cases for new option text.
 * Unknown options get a default icon per question (e.g. 'time', 'people', 'ellipse-outline').
 *
 * @param questionId - Numeric identifier used by questionnaire option icons
 * @param option - The option text as stored (e.g. from profile or MultiSelects)
 * @returns Icon name for Ionicons
 */
export const getOptionIcon = (questionId: number, option: string): string => {
  const optionLower = option.toLowerCase().trim();

  switch (questionId) {
    case 1: // Gender identity
      if (optionLower.includes('male') && !optionLower.includes('female')) {
        return 'man';
      }
      if (optionLower.includes('female')) {
        return 'woman';
      }
      if (
        optionLower.includes('non-binary') ||
        optionLower.includes('nonbinary')
      ) {
        return 'people';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'person';

    case 2: // Date of birth (handled in modal in questionnaire)
      return 'calendar';

    case 3: // Marital status
      if (optionLower.includes('never married')) {
        return 'heart-outline';
      }
      if (optionLower.includes('divorced')) {
        return 'heart-dislike';
      }
      if (optionLower.includes('widowed')) {
        return 'heart-dislike-outline';
      }
      if (optionLower.includes('separated')) {
        return 'heart-half';
      }
      if (optionLower.includes('annulled')) {
        return 'remove-circle-outline';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'heart-outline';

    case 4: // Marriage timeline
      if (optionLower.includes('6 months')) {
        return 'flash';
      }
      if (optionLower.includes('1 year')) {
        return 'calendar';
      }
      if (optionLower.includes('2 years')) {
        return 'timer-outline';
      }
      if (optionLower.includes('no rush')) {
        return 'hourglass';
      }
      return 'time';

    case 5: // Occupation
      if (
        optionLower.includes('doctor') ||
        optionLower.includes('surgeon') ||
        optionLower.includes('dentist')
      ) {
        return 'medkit';
      }
      if (
        optionLower.includes('engineer') ||
        optionLower.includes('developer')
      ) {
        return 'construct';
      }
      if (
        optionLower.includes('teacher') ||
        optionLower.includes('professor')
      ) {
        return 'school';
      }
      if (optionLower.includes('lawyer') || optionLower.includes('attorney')) {
        return 'document-text';
      }
      if (optionLower.includes('artist') || optionLower.includes('designer')) {
        return 'color-palette';
      }
      if (
        optionLower.includes('business owner') ||
        optionLower.includes('entrepreneur')
      ) {
        return 'rocket';
      }
      if (
        optionLower.includes('self-employed') ||
        optionLower.includes('freelancer')
      ) {
        return 'laptop-outline';
      }
      if (optionLower.includes('student')) {
        return 'school-outline';
      }
      if (optionLower.includes('retired')) {
        return 'sunny-outline';
      }
      if (optionLower.includes('unemployed')) {
        return 'search-outline';
      }
      if (optionLower.includes('homemaker')) {
        return 'home';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'briefcase';

    case 6: // Education
      if (optionLower.includes('no formal')) {
        return 'document-outline';
      }
      if (optionLower.includes('associate')) {
        return 'reader-outline';
      }
      if (optionLower.includes('high school')) {
        return 'school';
      }
      if (optionLower.includes("bachelor's")) {
        return 'school-sharp';
      }
      if (optionLower.includes("master's")) {
        return 'bookmarks';
      }
      if (optionLower.includes('doctorate') || optionLower.includes('phd')) {
        return 'trophy';
      }
      if (optionLower.includes('professional')) {
        return 'briefcase-sharp';
      }
      return 'school';

    case 7: // How religious
      if (optionLower.includes('very religious')) {
        return 'star';
      }
      if (optionLower.includes('moderately religious')) {
        return 'star-half';
      }
      if (optionLower.includes('slightly religious')) {
        return 'star-outline';
      }
      if (
        optionLower.includes('not religious') ||
        optionLower.includes('secular')
      ) {
        return 'close-circle-outline';
      }
      if (optionLower.includes('spiritual')) {
        return 'sparkles';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'star-outline';

    case 8: // Importance of religion in partner
      if (
        optionLower.includes('love to have religious partner') ||
        optionLower.includes('religious partner')
      ) {
        return 'heart';
      }
      if (optionLower.includes('somewhat important')) {
        return 'star-half';
      }
      if (optionLower.includes('not important')) {
        return 'remove-circle-outline';
      }
      if (optionLower.includes('difficult to decide')) {
        return 'help-circle-outline';
      }
      return 'star-outline';

    case 9: // Partner age range preference
      if (optionLower.includes('18') || optionLower.includes('24')) {
        return 'rocket';
      }
      if (optionLower.includes('25') || optionLower.includes('29')) {
        return 'trending-up';
      }
      if (optionLower.includes('30') || optionLower.includes('34')) {
        return 'star';
      }
      if (optionLower.includes('35') || optionLower.includes('39')) {
        return 'trophy';
      }
      if (optionLower.includes('40') || optionLower.includes('44')) {
        return 'diamond';
      }
      if (optionLower.includes('45') || optionLower.includes('49')) {
        return 'shield-checkmark';
      }
      if (optionLower.includes('50')) {
        return 'ribbon';
      }
      if (optionLower.includes('no preference')) {
        return 'infinite';
      }
      return 'person';

    case 10: // Ethnic background preference
      if (optionLower.includes('strongly prefer')) {
        return 'people';
      }
      if (optionLower.includes('somewhat prefer')) {
        return 'people-outline';
      }
      if (optionLower.includes('no preference')) {
        return 'globe';
      }
      return 'people';

    case 11: // Relocating
      if (optionLower.includes('willing to relocate')) {
        return 'airplane';
      }
      if (optionLower.includes('flexible')) {
        return 'chatbubbles';
      }
      if (optionLower.includes('prefer not to relocate')) {
        return 'close-circle';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'location-outline';

    case 12: // Skin tone
      if (optionLower.includes('very fair') || optionLower.includes('fair')) {
        return 'sunny-outline';
      }
      if (
        optionLower.includes('wheatish') ||
        optionLower.includes('olive') ||
        optionLower.includes('brown')
      ) {
        return 'color-fill-outline';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'color-palette-outline';

    case 13: // Living situation
      if (optionLower.includes('in-laws')) {
        return 'people';
      }
      if (
        optionLower.includes('separately') ||
        optionLower.includes('separate')
      ) {
        return 'key';
      }
      if (optionLower.includes('start with parents')) {
        return 'arrow-forward';
      }
      if (optionLower.includes('flexible')) {
        return 'options';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'home';

    case 14: // Children views
      if (optionLower.includes('want children soon')) {
        return 'happy';
      }
      if (optionLower.includes('want children later')) {
        return 'time';
      }
      if (optionLower.includes('not sure')) {
        return 'help-circle';
      }
      if (
        optionLower.includes("don't want") ||
        optionLower.includes('do not want')
      ) {
        return 'close-circle';
      }
      return 'people';

    case 15: // Family involvement
      if (optionLower.includes('family-led')) {
        return 'people';
      }
      if (optionLower.includes('shared decision')) {
        return 'git-compare';
      }
      if (optionLower.includes('independent')) {
        return 'person';
      }
      return 'people';

    case 16: // Dietary preferences
      if (optionLower.includes('halal')) {
        return 'restaurant';
      }
      if (optionLower.includes('vegetarian')) {
        return 'leaf';
      }
      if (optionLower.includes('non-vegetarian')) {
        return 'fish';
      }
      if (optionLower.includes('no restrictions')) {
        return 'fast-food';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'restaurant';

    case 17: // Smoking habit
      if (
        optionLower.includes('dont smoke') ||
        optionLower.includes("don't smoke")
      ) {
        return 'thumbs-up';
      }
      if (optionLower.includes('smoke')) {
        return 'flame';
      }
      if (optionLower.includes('sometimes')) {
        return 'time-outline';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'leaf-outline';

    case 18: // Drinking habit
      if (
        optionLower.includes('dont drink') ||
        optionLower.includes("don't drink")
      ) {
        return 'water-outline';
      }
      if (optionLower.includes('drink')) {
        return 'wine-outline';
      }
      if (optionLower.includes('sometimes')) {
        return 'time-outline';
      }
      if (optionLower.includes('prefer not')) {
        return 'eye-off';
      }
      return 'wine-outline';

    case 19: // Healthy lifestyle importance
      if (optionLower.includes('healthy lifestyle')) {
        return 'fitness';
      }
      if (optionLower.includes('balanced lifestyle')) {
        return 'scale-outline';
      }
      if (optionLower.includes('unhealthy lifestyle')) {
        return 'warning-outline';
      }
      return 'heart-outline';

    default:
      return 'ellipse-outline';
  }
};

// --- Profile pill icons (single canonical source for app icons) ---

/** Religion pill icon (Ionicons). */
export const getReligionIcon = (_value?: string): string => 'book';

/** Language pill icon (Ionicons). */
export const getLanguageIcon = (_value?: string): string => 'language-outline';

/** Smoking pill icon (MaterialCommunityIcons). */
export const getSmokingIcon = (_value?: string): string => 'smoking';

/** Drinking pill icon (Ionicons). */
export const getDrinkingIcon = (_value?: string): string => 'wine-outline';

/** Intention stage icon for timeline (Ionicons): Chatting, Family, Marriage. */
export const getIntentionStageIcon = (stageLabel: string): string => {
  const label = stageLabel.toLowerCase();
  if (label.includes('chatting')) return 'chatbubble-ellipses';
  if (label.includes('family')) return 'people';
  if (label.includes('marriage')) return 'heart';
  return 'ellipse-outline';
};

/**
 * Maps interest options to appropriate icons.
 * Add new if (interestLower.includes('your-interest')) return 'icon-name'; for new options.
 * Fallback: 'star-outline' when no keyword matches.
 *
 * @param interest - The interest text
 * @returns Icon name for Ionicons
 */
export const getInterestIcon = (interest: string): string => {
  const interestLower = interest.toLowerCase().trim();

  // Photography
  if (interestLower.includes('photography')) {
    return 'camera-outline';
  }

  // Fitness & Gym
  if (interestLower.includes('fitness') || interestLower.includes('gym')) {
    return 'barbell-outline';
  }

  // Hiking & Outdoors
  if (interestLower.includes('hiking') || interestLower.includes('outdoors')) {
    return 'map-outline';
  }

  // Gaming
  if (interestLower.includes('gaming')) {
    return 'game-controller-outline';
  }

  // Art & Painting
  if (interestLower.includes('art') || interestLower.includes('painting')) {
    return 'color-palette-outline';
  }

  // Technology & Gadgets
  if (
    interestLower.includes('technology') ||
    interestLower.includes('gadgets')
  ) {
    return 'phone-portrait-outline';
  }

  // Meditation & Yoga
  if (interestLower.includes('meditation') || interestLower.includes('yoga')) {
    return 'leaf-outline';
  }

  // Writing & Blogging
  if (interestLower.includes('writing') || interestLower.includes('blogging')) {
    return 'document-text-outline';
  }

  // Travel & Adventure
  if (interestLower.includes('travel') || interestLower.includes('adventure')) {
    return 'airplane-outline';
  }

  // Cooking & Baking
  if (interestLower.includes('cooking') || interestLower.includes('baking')) {
    return 'restaurant-outline';
  }

  // Volunteering
  if (interestLower.includes('volunteering')) {
    return 'heart-circle-outline';
  }

  // Music & Concerts
  if (interestLower.includes('music') || interestLower.includes('concerts')) {
    return 'musical-notes-outline';
  }

  // Fashion & Style
  if (interestLower.includes('fashion') || interestLower.includes('style')) {
    return 'shirt-outline';
  }

  // Movies & Series
  if (interestLower.includes('movies') || interestLower.includes('series')) {
    return 'film-outline';
  }

  // Entrepreneurship
  if (interestLower.includes('entrepreneurship')) {
    return 'rocket-outline';
  }

  // Dancing
  if (interestLower.includes('dancing')) {
    return 'musical-note-outline';
  }

  // Cycling
  if (interestLower.includes('cycling')) {
    return 'bicycle-outline';
  }

  // Board Games & Puzzles
  if (
    interestLower.includes('board games') ||
    interestLower.includes('puzzles')
  ) {
    return 'cube-outline';
  }

  // Language Learning
  if (interestLower.includes('language learning')) {
    return 'language-outline';
  }

  // Reading & Books
  if (interestLower.includes('reading') || interestLower.includes('books')) {
    return 'library-outline';
  }

  // Food Exploring
  if (interestLower.includes('food exploring')) {
    return 'restaurant-outline';
  }

  // Nature & Scenic Views
  if (interestLower.includes('nature') || interestLower.includes('scenic')) {
    return 'images-outline';
  }

  // Socializing & Meetups
  if (
    interestLower.includes('socializing') ||
    interestLower.includes('meetups')
  ) {
    return 'people-outline';
  }

  // Personal Growth
  if (interestLower.includes('personal growth')) {
    return 'trending-up-outline';
  }

  // Self-Care & Wellness
  if (
    interestLower.includes('self-care') ||
    interestLower.includes('wellness')
  ) {
    return 'heart-outline';
  }

  // Podcasts & Audiobooks
  if (
    interestLower.includes('podcasts') ||
    interestLower.includes('audiobooks')
  ) {
    return 'headphones-outline';
  }

  // Home & DIY Projects
  if (interestLower.includes('home') || interestLower.includes('diy')) {
    return 'hammer-outline';
  }

  // Learning New Skills
  if (interestLower.includes('learning new skills')) {
    return 'school-outline';
  }

  // Planning & Organizing
  if (
    interestLower.includes('planning') ||
    interestLower.includes('organizing')
  ) {
    return 'calendar-outline';
  }

  // Content Creation
  if (interestLower.includes('content creation')) {
    return 'videocam-outline';
  }

  // Minimalist Living
  if (interestLower.includes('minimalist')) {
    return 'remove-circle-outline';
  }

  // Mindfulness
  if (interestLower.includes('mindfulness')) {
    return 'leaf-outline';
  }

  // Road Trips
  if (interestLower.includes('road trips')) {
    return 'car-outline';
  }

  // Casual Sports
  if (interestLower.includes('casual sports')) {
    return 'football-outline';
  }

  // Default fallback
  return 'star-outline';
};

/**
 * Maps interest options to unique, visually appealing colors
 * Colors are chosen to match the theme and meaning of each interest
 * @param interest - The interest text
 * @returns Color hex code for the icon
 */
export const getInterestIconColor = (interest: string): string => {
  const interestLower = interest.toLowerCase().trim();

  // Photography - Dark blue (professional, creative)
  if (interestLower.includes('photography')) {
    return '#2563EB';
  }

  // Fitness & Gym - Red/Orange (energy, strength)
  if (interestLower.includes('fitness') || interestLower.includes('gym')) {
    return '#EF4444';
  }

  // Hiking & Outdoors - Green (nature, adventure)
  if (interestLower.includes('hiking') || interestLower.includes('outdoors')) {
    return '#10B981';
  }

  // Gaming - Purple (tech, entertainment)
  if (interestLower.includes('gaming')) {
    return '#8B5CF6';
  }

  // Art & Painting - Pink/Magenta (creativity, expression)
  if (interestLower.includes('art') || interestLower.includes('painting')) {
    return '#EC4899';
  }

  // Technology & Gadgets - Blue (tech, innovation)
  if (
    interestLower.includes('technology') ||
    interestLower.includes('gadgets')
  ) {
    return '#3B82F6';
  }

  // Meditation & Yoga - Teal (calm, peace)
  if (interestLower.includes('meditation') || interestLower.includes('yoga')) {
    return '#14B8A6';
  }

  // Writing & Blogging - Indigo (knowledge, communication)
  if (interestLower.includes('writing') || interestLower.includes('blogging')) {
    return '#6366F1';
  }

  // Travel & Adventure - Sky blue (exploration, freedom)
  if (interestLower.includes('travel') || interestLower.includes('adventure')) {
    return '#0EA5E9';
  }

  // Cooking & Baking - Orange (warmth, food)
  if (interestLower.includes('cooking') || interestLower.includes('baking')) {
    return '#F97316';
  }

  // Volunteering - Red (compassion, care)
  if (interestLower.includes('volunteering')) {
    return '#DC2626';
  }

  // Music & Concerts - Purple (rhythm, creativity)
  if (interestLower.includes('music') || interestLower.includes('concerts')) {
    return '#A855F7';
  }

  // Fashion & Style - Rose (elegance, style)
  if (interestLower.includes('fashion') || interestLower.includes('style')) {
    return '#F43F5E';
  }

  // Movies & Series - Dark purple (entertainment, drama)
  if (interestLower.includes('movies') || interestLower.includes('series')) {
    return '#7C3AED';
  }

  // Entrepreneurship - Amber (ambition, success)
  if (interestLower.includes('entrepreneurship')) {
    return '#F59E0B';
  }

  // Dancing - Hot pink (energy, movement)
  if (interestLower.includes('dancing')) {
    return '#DB2777';
  }

  // Cycling - Lime green (movement, outdoors)
  if (interestLower.includes('cycling')) {
    return '#84CC16';
  }

  // Board Games & Puzzles - Brown/Amber (strategy, thinking)
  if (
    interestLower.includes('board games') ||
    interestLower.includes('puzzles')
  ) {
    return '#D97706';
  }

  // Language Learning - Cyan (communication, learning)
  if (interestLower.includes('language learning')) {
    return '#06B6D4';
  }

  // Reading & Books - Deep blue (knowledge, wisdom)
  if (interestLower.includes('reading') || interestLower.includes('books')) {
    return '#1E40AF';
  }

  // Food Exploring - Orange red (culinary, taste)
  if (interestLower.includes('food exploring')) {
    return '#EA580C';
  }

  // Nature & Scenic Views - Emerald green (nature, beauty)
  if (interestLower.includes('nature') || interestLower.includes('scenic')) {
    return '#059669';
  }

  // Socializing & Meetups - Blue (connection, community)
  if (
    interestLower.includes('socializing') ||
    interestLower.includes('meetups')
  ) {
    return '#0284C7';
  }

  // Personal Growth - Indigo (development, progress)
  if (interestLower.includes('personal growth')) {
    return '#4F46E5';
  }

  // Self-Care & Wellness - Pink (care, health)
  if (
    interestLower.includes('self-care') ||
    interestLower.includes('wellness')
  ) {
    return '#EC4899';
  }

  // Podcasts & Audiobooks - Violet (audio, learning)
  if (
    interestLower.includes('podcasts') ||
    interestLower.includes('audiobooks')
  ) {
    return '#7C3AED';
  }

  // Home & DIY Projects - Brown (crafts, building)
  if (interestLower.includes('home') || interestLower.includes('diy')) {
    return '#92400E';
  }

  // Learning New Skills - Blue (education, growth)
  if (interestLower.includes('learning new skills')) {
    return '#2563EB';
  }

  // Planning & Organizing - Slate (organization, structure)
  if (
    interestLower.includes('planning') ||
    interestLower.includes('organizing')
  ) {
    return '#475569';
  }

  // Content Creation - Fuchsia (creativity, media)
  if (interestLower.includes('content creation')) {
    return '#C026D3';
  }

  // Minimalist Living - Gray (simplicity, minimalism)
  if (interestLower.includes('minimalist')) {
    return '#64748B';
  }

  // Mindfulness - Green (peace, balance)
  if (interestLower.includes('mindfulness')) {
    return '#16A34A';
  }

  // Road Trips - Sky blue (travel, adventure)
  if (interestLower.includes('road trips')) {
    return '#0EA5E9';
  }

  // Casual Sports - Green (activity, fitness)
  if (interestLower.includes('casual sports')) {
    return '#22C55E';
  }

  // Default fallback
  return '#6D4C61';
};

/**
 * Maps personality options to icons.
 * @param personality - The personality text
 * @returns Icon name for Ionicons
 */
export const getPersonalityIcon = (personality: string): string => {
  const p = personality.toLowerCase().trim();

  if (p.includes('kind') || p.includes('compassionate')) return 'heart-outline';
  if (p.includes('honest') || p.includes('loyal'))
    return 'shield-checkmark-outline';
  if (p.includes('calm') || p.includes('patient')) return 'leaf-outline';
  if (p.includes('ambitious') || p.includes('driven'))
    return 'trending-up-outline';
  if (p.includes('confident')) return 'ribbon-outline';
  if (p.includes('family-oriented')) return 'people-outline';
  if (p.includes('responsible')) return 'checkmark-done-outline';
  if (p.includes('funny') || p.includes('playful')) return 'happy-outline';
  if (p.includes('adventurous')) return 'compass-outline';
  if (p.includes('creative')) return 'color-palette-outline';
  if (p.includes('introverted')) return 'moon-outline';
  if (p.includes('extroverted')) return 'chatbubbles-outline';
  if (p.includes('empathetic')) return 'hand-left-outline';
  if (p.includes('open-minded')) return 'bulb-outline';
  if (p.includes('good listener')) return 'ear-outline';
  if (p.includes('optimistic')) return 'sunny-outline';
  if (p.includes('spontaneous')) return 'flash-outline';
  if (p.includes('disciplined')) return 'barbell-outline';
  if (p.includes('supportive')) return 'people-circle-outline';
  if (p.includes('independent')) return 'person-outline';

  return 'sparkles-outline';
};

/**
 * Maps personality options to icon colors.
 * @param personality - The personality text
 * @returns Color hex code
 */
export const getPersonalityIconColor = (personality: string): string => {
  const p = personality.toLowerCase().trim();

  if (p.includes('kind') || p.includes('compassionate')) return '#E11D48';
  if (p.includes('honest') || p.includes('loyal')) return '#1D4ED8';
  if (p.includes('calm') || p.includes('patient')) return '#0F766E';
  if (p.includes('ambitious') || p.includes('driven')) return '#EA580C';
  if (p.includes('confident')) return '#F59E0B';
  if (p.includes('family-oriented')) return '#7C3AED';
  if (p.includes('responsible')) return '#374151';
  if (p.includes('funny') || p.includes('playful')) return '#DB2777';
  if (p.includes('adventurous')) return '#0284C7';
  if (p.includes('creative')) return '#C026D3';
  if (p.includes('introverted')) return '#4F46E5';
  if (p.includes('extroverted')) return '#06B6D4';
  if (p.includes('empathetic')) return '#BE185D';
  if (p.includes('open-minded')) return '#2563EB';
  if (p.includes('good listener')) return '#0EA5E9';
  if (p.includes('optimistic')) return '#FBBF24';
  if (p.includes('spontaneous')) return '#F97316';
  if (p.includes('disciplined')) return '#475569';
  if (p.includes('supportive')) return '#16A34A';
  if (p.includes('independent')) return '#6366F1';

  return '#8B5CF6';
};
