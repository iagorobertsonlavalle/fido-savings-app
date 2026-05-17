import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '🪙',
    emojiSize: 80,
    title: '10% ANNUAL INTEREST\n24/7 WITHDRAWALS',
    titleColor: colors.primary,
    titleSize: 26,
    bullets: [
      'Watch your money grow every day',
      'Enjoy flexible withdrawals anytime',
      'Save with a secure and trusted account',
    ],
    cta: 'Start saving',
  },
  {
    id: '2',
    emoji: '📈',
    emojiSize: 80,
    tag: '+10%',
    title: 'Maximize your savings',
    titleColor: colors.text,
    titleSize: 24,
    body: 'With an unbeatable 10% effective interest rate, your interest is calculated daily and automatically added to your balance.',
    cta: 'Make your first deposit',
  },
  {
    id: '3',
    emoji: '💰',
    emojiSize: 80,
    title: 'Your funds, on your terms',
    titleColor: colors.text,
    titleSize: 24,
    body: "Need your money? It's yours whenever you want it. Enjoy the freedom of accessing your funds at any time.",
    cta: 'Make your first deposit',
  },
  {
    id: '4',
    emoji: '📊',
    emojiSize: 80,
    tag: '0 ——————— 800',
    title: 'Improve your Fido Score\nby saving',
    titleColor: colors.text,
    titleSize: 24,
    body: "Saving isn't just about the future — it's about today. Your commitment to saving can help improve your Fido Score and enjoy better terms.",
    cta: 'Make your first deposit',
  },
];

function Slide({ item, onCta }) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.card}>
        <View style={styles.illustrationCircle}>
          <Text style={{ fontSize: item.emojiSize }}>{item.emoji}</Text>
          {item.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: item.titleColor, fontSize: item.titleSize }]}>
          {item.title}
        </Text>

        {item.bullets && item.bullets.map((b, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.bulletText}>{b}</Text>
          </View>
        ))}

        {item.body && <Text style={styles.body}>{item.body}</Text>}

        <PrimaryButton title={item.cta} onPress={onCta} style={styles.ctaBtn} />

        <View style={styles.poweredRow}>
          <Text style={styles.poweredText}>Powered by </Text>
          <Text style={styles.poweredBrand}>◆ access</Text>
        </View>

        {item.id !== '1' && (
          <Text style={styles.termsText}>
            By choosing to proceed, you are stating that you have read and agreed to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
          </Text>
        )}
      </View>
    </View>
  );
}

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const listRef = useRef(null);

  const handleScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(idx);
  };

  const handleCta = () => {
    if (current < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: current + 1, animated: true });
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {current > 0 && (
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.replace('Home')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} onCta={handleCta} />}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  closeBtn: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    backgroundColor: colors.white, borderRadius: 20, padding: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  closeText: { fontSize: 16, color: colors.textSecondary },
  slide: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 },
  card: {
    backgroundColor: colors.white, borderRadius: 28, padding: 28,
    alignItems: 'center', width: '100%',
    shadowColor: colors.primary, shadowOpacity: 0.08, shadowRadius: 20, elevation: 4,
  },
  illustrationCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, position: 'relative',
  },
  tagBadge: {
    position: 'absolute', bottom: 8, backgroundColor: colors.white,
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  tagText: { fontSize: 13, fontWeight: '700', color: colors.success },
  title: { fontWeight: '800', textAlign: 'center', marginBottom: 16, lineHeight: 34 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, alignSelf: 'flex-start' },
  checkmark: { color: colors.primary, fontSize: 14, marginRight: 8, marginTop: 1 },
  bulletText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  body: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  ctaBtn: { marginTop: 20, width: '100%' },
  poweredRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  poweredText: { fontSize: 12, color: colors.textLight },
  poweredBrand: { fontSize: 12, fontWeight: '700', color: colors.primary },
  termsText: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: 8, lineHeight: 16 },
  termsLink: { color: colors.primary, textDecorationLine: 'underline' },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
});
