import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const HERO = {
  totalSavings: '₵ 4,820.00',
  availableNow: '₵ 3,600.00',
  committed: '₵ 1,220.00',
  interestToday: '₵ 2.10',
  interestThisMonth: '₵ 48.20',
  interestAllTime: '₵ 382.40',
  projectedThisMonth: '₵ 62.00',
};

const HEALTH = {
  moneyIn: '₵ 3,200', moneyOut: '₵ 2,610',
  saved: '₵ 450', withdrawn: '₵ 100',
  netSaved: '₵ 350', biggestSpend: 'Food & transport', streak: 3,
};

const GOALS = [
  { id: 'emergency', name: 'Emergency Fund',  saved: 600,  target: 1000, emoji: '🛡️' },
  { id: 'inventory', name: 'Inventory Goal',   saved: 1500, target: 3000, emoji: '📦' },
  { id: 'school',    name: 'School Fees',       saved: 300,  target: 1200, emoji: '🎓' },
];

const JOURNEYS = [
  { id: 'FirstDeposit',     emoji: '💳', title: 'Flexible Savings',          subtitle: 'Earn interest, withdraw anytime',           badge: null },
  { id: 'TermSavings',      emoji: '🚀', title: 'Term Boost',                 subtitle: 'Commit & earn a bonus upfront',             badge: 'Bonus' },
  { id: 'GoalSavings',      emoji: '🎯', title: 'Goal Savings',               subtitle: 'Save toward what matters most',             badge: null },
  { id: 'TrustedProgress',  emoji: '🤝', title: 'Trusted Progress',           subtitle: 'Share your goal progress for motivation',   badge: 'New' },
  { id: 'SharedSusu',       emoji: '👥', title: 'Shared Susu',                subtitle: 'Save together toward a shared goal',        badge: 'New' },
  { id: 'LoanLinked',       emoji: '🔗', title: 'Loan-Linked Savings',        subtitle: 'Build your Fido profile as you save',       badge: null },
  { id: 'Dashboard',        emoji: '📊', title: 'Financial Health Dashboard', subtitle: 'Track spending, saving & interest',         badge: null },
  { id: 'OfflineSavings',   emoji: '💬', title: 'Help & Support',              subtitle: 'Contact us anytime, day or night',          badge: null },
];

// ─── Components ───────────────────────────────────────────────────────────────

const INTEREST_GROWTH = [40, 80, 121, 162, 203, 245, 286, 329, 371, 414, 457, 500];

function InterestGrowthChart() {
  const max = 500;
  const chartH = 52;
  return (
    <View style={s.chartWrap}>
      <View style={s.chartBars}>
        {INTEREST_GROWTH.map((v, i) => (
          <View key={i} style={[s.chartBar, { height: Math.max(4, Math.round((v / max) * chartH)) }]} />
        ))}
      </View>
      <Text style={s.chartLabel}>12-month cumulative interest growth</Text>
    </View>
  );
}

function TrustChip() {
  return (
    <View style={s.trustChip}>
      <View style={s.trustChipDot} />
      <Text style={s.trustChipText}>Withdraw anytime · Support available 24/7</Text>
    </View>
  );
}

function SavingsHeroCard({ onAddMoney, onWithdraw }) {
  return (
    <View style={s.heroCard}>
      <Text style={s.heroLabel}>Total Savings</Text>
      <Text style={s.heroAmount}>{HERO.totalSavings}</Text>

      <View style={s.heroAvailRow}>
        <View style={s.heroAvailItem}>
          <Text style={s.heroAvailLabel}>Available now</Text>
          <Text style={s.heroAvailValue}>{HERO.availableNow}</Text>
        </View>
        <View style={s.heroAvailDivider} />
        <View style={s.heroAvailItem}>
          <Text style={s.heroAvailLabel}>Committed</Text>
          <Text style={s.heroAvailValue}>{HERO.committed}</Text>
        </View>
      </View>

      <View style={s.heroInterestRow}>
        {[['Today', HERO.interestToday], ['This month', HERO.interestThisMonth], ['All time', HERO.interestAllTime]].map(([label, val]) => (
          <View key={label} style={s.heroInterestItem}>
            <Text style={s.heroInterestLabel}>{label}</Text>
            <Text style={s.heroInterestValue}>{val}</Text>
          </View>
        ))}
      </View>

      <View style={s.heroProjectedRow}>
        <Text style={s.heroProjectedText}>📈  Projected this month  </Text>
        <Text style={s.heroProjectedValue}>{HERO.projectedThisMonth}</Text>
      </View>

      <InterestGrowthChart />

      <View style={s.heroBtnRow}>
        <TouchableOpacity style={s.heroAddBtn} onPress={onAddMoney}>
          <Text style={s.heroAddBtnText}>+ Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.heroWithdrawBtn} onPress={onWithdraw}>
          <Text style={s.heroWithdrawBtnText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SmartRecommendationCard({ onPress }) {
  return (
    <TouchableOpacity style={s.recCard} onPress={onPress} activeOpacity={0.85}>
      <View style={s.recIconWrap}>
        <Text style={{ fontSize: 20 }}>💡</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.recTitle}>You have extra money in MoMo</Text>
        <Text style={s.recDesc}>Move the rest to Fido and earn interest while keeping your daily spending in MoMo.</Text>
        <Text style={s.recCta}>Save from MoMo →</Text>
      </View>
    </TouchableOpacity>
  );
}

function FinancialHealthCard() {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <Text style={s.cardTitle}>Financial Health</Text>
        <View style={s.streakBadge}>
          <Text style={s.streakText}>🔥 {HEALTH.streak}-week streak</Text>
        </View>
      </View>
      <View style={s.healthGrid}>
        {[
          ['Money in', HEALTH.moneyIn, true],
          ['Money out', HEALTH.moneyOut, false],
          ['Saved', HEALTH.saved, true],
          ['Withdrawn', HEALTH.withdrawn, false],
        ].map(([label, val, positive]) => (
          <View key={label} style={s.healthMetric}>
            <Text style={s.healthMetricLabel}>{label}</Text>
            <Text style={[s.healthMetricValue, positive && s.positive]}>{val}</Text>
          </View>
        ))}
      </View>
      <View style={s.healthNetRow}>
        <Text style={s.healthNetLabel}>Net saved this month</Text>
        <Text style={s.healthNetValue}>{HEALTH.netSaved}</Text>
      </View>
      <View style={s.healthSpendRow}>
        <Text style={s.healthSpendLabel}>Biggest spend</Text>
        <View style={s.healthSpendBadge}>
          <Text style={s.healthSpendBadgeText}>{HEALTH.biggestSpend}</Text>
        </View>
      </View>
    </View>
  );
}

function FidoProfileCard({ onPress }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.9}>
      <View style={s.cardHeader}>
        <Text style={s.cardTitle}>Fido Score</Text>
        <Text style={s.arrowText}>›</Text>
      </View>
      <View style={s.fidoRow}>
        <View>
          <Text style={s.fidoScore}>420</Text>
          <Text style={s.fidoScoreLabel}>Your Fido Score</Text>
        </View>
        <View style={s.fidoBarWrap}>
          <View style={s.fidoBarBg}>
            <View style={[s.fidoBarFill, { width: '52.5%' }]} />
          </View>
          <View style={s.fidoBarRange}>
            <Text style={s.fidoBarRangeText}>0</Text>
            <Text style={s.fidoBarRangeText}>800</Text>
          </View>
        </View>
      </View>
      <View style={s.fidoMilestone}>
        <Text style={{ fontSize: 14, marginRight: 8 }}>🎯</Text>
        <Text style={s.fidoMilestoneText}>
          Save consistently for 3 months —{' '}
          <Text style={s.fidoEmphasis}>may strengthen your Fido profile</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ActiveGoalsCard({ onAdd, onView }) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <Text style={s.cardTitle}>Active Goals</Text>
        <TouchableOpacity onPress={onView}>
          <Text style={s.seeAll}>See all ›</Text>
        </TouchableOpacity>
      </View>
      {GOALS.map((g) => {
        const pct = (g.saved / g.target) * 100;
        return (
          <View key={g.id} style={s.goalRow}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>{g.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View style={s.goalRowTop}>
                <Text style={s.goalName}>{g.name}</Text>
                <Text style={s.goalAmounts}>₵{g.saved.toLocaleString()} / ₵{g.target.toLocaleString()}</Text>
              </View>
              <View style={s.goalBarBg}>
                <View style={[s.goalBarFill, { width: `${pct}%` }]} />
              </View>
            </View>
            <TouchableOpacity style={s.goalAddBtn} onPress={() => onAdd(g.id)}>
              <Text style={s.goalAddBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

function TrustSupportCard() {
  return (
    <View style={s.trustCard}>
      <Text style={{ fontSize: 22, marginRight: 12 }}>🔒</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.trustCardTitle}>Need your money?</Text>
        <Text style={s.trustCardText}>
          Withdraw to MoMo anytime. Support is available 24/7 if you need help.
        </Text>
      </View>
    </View>
  );
}

function ReferralCard({ onPress }) {
  return (
    <TouchableOpacity style={s.referralCard} onPress={onPress} activeOpacity={0.85}>
      <View style={s.referralLeft}>
        <Text style={s.referralEmoji}>🎁</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.referralTitle}>Invite friends — earn more</Text>
        <Text style={s.referralDesc}>
          Share your code. When a friend starts saving, you both get a <Text style={s.referralHighlight}>+1% rate boost for 3 months</Text>.
        </Text>
        <View style={s.referralCodeRow}>
          <Text style={s.referralCode}>KWAME-F3D9</Text>
          <View style={s.referralCopyBtn}><Text style={s.referralCopyText}>Copy</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const nav = (id) => { try { navigation.navigate(id); } catch (_) {} };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning 👋</Text>
            <Text style={s.pageTitle}>Your Savings Hub</Text>
          </View>
          <TouchableOpacity style={s.avatar}>
            <Text style={s.avatarText}>JS</Text>
          </TouchableOpacity>
        </View>

        <TrustChip />

        <SavingsHeroCard
          onAddMoney={() => nav('FirstDeposit')}
          onWithdraw={() => nav('OfflineSavings')}
        />

        <SmartRecommendationCard onPress={() => nav('MoMoOverflow')} />

        <FinancialHealthCard />

        <FidoProfileCard onPress={() => nav('FidoScore')} />

        <ActiveGoalsCard
          onAdd={() => nav('GoalSavings')}
          onView={() => nav('GoalSavings')}
        />

        <Text style={s.journeysTitle}>Your Money, Your Move</Text>
        {JOURNEYS.map((j, i) => (
          <TouchableOpacity key={i} style={s.journeyCard} onPress={() => nav(j.id)} activeOpacity={0.8}>
            <View style={s.journeyIconWrap}>
              <Text style={{ fontSize: 22 }}>{j.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.journeyTitle}>{j.title}</Text>
              <Text style={s.journeySubtitle}>{j.subtitle}</Text>
            </View>
            {j.badge && (
              <View style={[s.badge, j.badge === 'New' && s.badgeAccent]}>
                <Text style={[s.badgeText, j.badge === 'New' && s.badgeTextAccent]}>{j.badge}</Text>
              </View>
            )}
            <Text style={s.arrowText}>›</Text>
          </TouchableOpacity>
        ))}

        <ReferralCard onPress={() => {}} />

        <TrustSupportCard />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  scroll:     { paddingHorizontal: 16, paddingTop: 20 },

  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  greeting:  { fontSize: 12, color: colors.textSecondary },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  avatar:    { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:{ color: colors.white, fontWeight: '700', fontSize: 14 },

  trustChip:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 14 },
  trustChipDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success, marginRight: 7 },
  trustChipText:{ fontSize: 11, color: '#15803D', fontWeight: '600' },

  // Hero
  heroCard:           { backgroundColor: colors.primary, borderRadius: 24, padding: 20, marginBottom: 12, shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  heroLabel:          { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  heroAmount:         { fontSize: 32, fontWeight: '800', color: colors.white, marginBottom: 14 },
  heroAvailRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, marginBottom: 12 },
  heroAvailItem:      { flex: 1, alignItems: 'center' },
  heroAvailLabel:     { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  heroAvailValue:     { fontSize: 15, fontWeight: '700', color: colors.white },
  heroAvailDivider:   { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroInterestRow:    { flexDirection: 'row', marginBottom: 10 },
  heroInterestItem:   { flex: 1, alignItems: 'center' },
  heroInterestLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
  heroInterestValue:  { fontSize: 13, fontWeight: '700', color: colors.white },
  heroProjectedRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 16 },
  heroProjectedText:  { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  heroProjectedValue: { fontSize: 13, fontWeight: '800', color: colors.white },
  heroBtnRow:         { flexDirection: 'row', gap: 10 },
  heroAddBtn:         { flex: 2, backgroundColor: colors.white, borderRadius: 20, paddingVertical: 12, alignItems: 'center' },
  heroAddBtnText:     { color: colors.primary, fontWeight: '700', fontSize: 14 },
  heroWithdrawBtn:    { flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 20, paddingVertical: 12, alignItems: 'center' },
  heroWithdrawBtnText:{ color: colors.white, fontWeight: '600', fontSize: 14 },

  // Rec card
  recCard:    { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: colors.primary },
  recIconWrap:{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  recTitle:   { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 3 },
  recDesc:    { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 8 },
  recCta:     { fontSize: 12, fontWeight: '700', color: colors.primary },

  // Shared card
  card:       { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle:  { fontSize: 15, fontWeight: '800', color: colors.text },
  arrowText:  { fontSize: 22, color: colors.primary },
  seeAll:     { fontSize: 12, fontWeight: '600', color: colors.primary },

  // Health
  streakBadge:        { backgroundColor: '#FFF7ED', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  streakText:         { fontSize: 11, fontWeight: '700', color: colors.warning },
  healthGrid:         { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  healthMetric:       { width: '50%', marginBottom: 10 },
  healthMetricLabel:  { fontSize: 11, color: colors.textSecondary, marginBottom: 2 },
  healthMetricValue:  { fontSize: 15, fontWeight: '700', color: colors.text },
  positive:           { color: colors.success },
  healthNetRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.successLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  healthNetLabel:     { fontSize: 12, color: '#15803D', fontWeight: '600' },
  healthNetValue:     { fontSize: 14, fontWeight: '800', color: '#15803D' },
  healthSpendRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthSpendLabel:   { fontSize: 12, color: colors.textSecondary },
  healthSpendBadge:   { backgroundColor: colors.background, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  healthSpendBadgeText:{ fontSize: 11, fontWeight: '600', color: colors.textSecondary },

  // Fido
  fidoRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  fidoScore:        { fontSize: 34, fontWeight: '800', color: colors.primary },
  fidoScoreLabel:   { fontSize: 11, color: colors.textSecondary },
  fidoBarWrap:      { flex: 1, marginLeft: 16 },
  fidoBarBg:        { height: 8, backgroundColor: colors.border, borderRadius: 4, marginBottom: 4, overflow: 'hidden' },
  fidoBarFill:      { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  fidoBarRange:     { flexDirection: 'row', justifyContent: 'space-between' },
  fidoBarRangeText: { fontSize: 10, color: colors.textLight },
  fidoMilestone:    { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.background, borderRadius: 10, padding: 10 },
  fidoMilestoneText:{ fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 17 },
  fidoEmphasis:     { color: colors.primary, fontWeight: '600' },

  // Goals
  goalRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  goalRowTop:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalName:     { fontSize: 13, fontWeight: '700', color: colors.text },
  goalAmounts:  { fontSize: 11, color: colors.textSecondary },
  goalBarBg:    { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  goalBarFill:  { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  goalAddBtn:   { marginLeft: 12, backgroundColor: colors.primaryLight, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  goalAddBtnText:{ fontSize: 12, fontWeight: '700', color: colors.primary },

  // Journeys
  journeysTitle:  { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10, marginTop: 4 },
  journeyCard:    { backgroundColor: colors.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  journeyIconWrap:{ width: 44, height: 44, borderRadius: 13, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  journeyTitle:   { fontSize: 14, fontWeight: '700', color: colors.text },
  journeySubtitle:{ fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  badge:          { backgroundColor: colors.successLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 },
  badgeAccent:    { backgroundColor: '#EEECFF' },
  badgeText:      { fontSize: 10, fontWeight: '700', color: colors.success },
  badgeTextAccent:{ color: colors.accent },

  // Interest chart
  chartWrap:   { marginBottom: 14 },
  chartBars:   { flexDirection: 'row', alignItems: 'flex-end', height: 52, gap: 2 },
  chartBar:    { flex: 1, backgroundColor: 'rgba(34, 197, 94, 0.75)', borderRadius: 3 },
  chartLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 5 },

  // Trust card
  trustCard:     { backgroundColor: '#F0FDF4', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginTop: 4, borderWidth: 1, borderColor: '#BBF7D0' },
  trustCardTitle:{ fontSize: 13, fontWeight: '700', color: '#15803D', marginBottom: 3 },
  trustCardText: { fontSize: 12, color: '#166534', lineHeight: 17 },

  // Referral card
  referralCard:      { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 16, flexDirection: 'row', marginBottom: 10, marginTop: 6 },
  referralLeft:      { marginRight: 12, paddingTop: 2 },
  referralEmoji:     { fontSize: 28 },
  referralTitle:     { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 5 },
  referralDesc:      { fontSize: 12, color: '#aaa', lineHeight: 18, marginBottom: 10 },
  referralHighlight: { color: '#E91E8C', fontWeight: '700' },
  referralCodeRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  referralCode:      { fontSize: 15, fontWeight: '800', color: '#E91E8C', letterSpacing: 1 },
  referralCopyBtn:   { backgroundColor: '#E91E8C', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  referralCopyText:  { fontSize: 12, fontWeight: '700', color: '#fff' },
});
