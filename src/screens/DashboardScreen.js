import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

const TABS = ['Overview', 'Savings', 'Spending', 'Goals'];

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const SAVINGS_DATA = [180, 220, 300, 390, 420, 450];
const SPENDING_DATA = [2800, 3100, 2950, 2700, 2610, 2610];

const SPEND_CATEGORIES = [
  { label: 'Food & transport', amount: 980, color: '#E91E8C', pct: 38 },
  { label: 'Business costs', amount: 620, color: '#6C63FF', pct: 24 },
  { label: 'Utilities & bills', amount: 480, color: '#22C55E', pct: 18 },
  { label: 'Withdrawals', amount: 350, color: '#F59E0B', pct: 13 },
  { label: 'Other', amount: 180, color: '#94A3B8', pct: 7 },
];

const GOALS = [
  { label: 'Emergency fund', saved: 600, target: 1000, color: '#6C63FF' },
  { label: 'Business inventory', saved: 1500, target: 3000, color: '#E91E8C' },
  { label: 'School fees', saved: 300, target: 1200, color: '#22C55E' },
];

export default function DashboardScreen({ navigation }) {
  const [tab, setTab] = useState('Overview');

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Financial Health</Text>
        </View>

        {/* Month badge */}
        <View style={s.monthBadge}>
          <Text style={s.monthText}>April 2026</Text>
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[s.tab, tab === t && s.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview tab */}
        {tab === 'Overview' && (
          <View>
            <View style={s.heroRow}>
              <HeroStat label="Money in" value="₵3,200" color="#22C55E" />
              <HeroStat label="Money out" value="₵2,610" color="#EF4444" />
              <HeroStat label="Net saved" value="₵350" color="#E91E8C" />
            </View>
            <View style={s.streakCard}>
              <Text style={s.streakIcon}>🔥</Text>
              <View>
                <Text style={s.streakTitle}>3-week saving streak</Text>
                <Text style={s.streakSub}>You've moved money to Fido 3 weeks in a row. Keep it up!</Text>
              </View>
            </View>
            <View style={s.sectionCard}>
              <Text style={s.sectionTitle}>This month at a glance</Text>
              <OverviewRow icon="💰" label="Saved to Fido" value="₵450" positive />
              <OverviewRow icon="🏧" label="Withdrawn" value="₵100" />
              <OverviewRow icon="📈" label="Interest earned" value="₵48.20" positive />
              <OverviewRow icon="🛒" label="Biggest spend" value="Food & transport" />
            </View>
            <View style={s.fidoCard}>
              <View style={s.fidoLeft}>
                <Text style={s.fidoScore}>420</Text>
                <Text style={s.fidoLabel}>Fido Score</Text>
              </View>
              <View style={s.fidoRight}>
                <Text style={s.fidoNext}>Next milestone</Text>
                <Text style={s.fidoMilestone}>Save consistently for 3 months</Text>
                <Text style={s.fidoNote}>Consistent saving may strengthen your Fido profile.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Savings tab */}
        {tab === 'Savings' && (
          <View>
            <View style={s.savingsHero}>
              <Text style={s.savingsHeroLabel}>Total savings</Text>
              <Text style={s.savingsHeroBig}>₵4,820</Text>
              <View style={s.savingsRow}>
                <View style={s.savingsStat}>
                  <Text style={s.savingsStatValue}>₵3,600</Text>
                  <Text style={s.savingsStatLabel}>Available now</Text>
                </View>
                <View style={s.savingsDivider} />
                <View style={s.savingsStat}>
                  <Text style={s.savingsStatValue}>₵1,220</Text>
                  <Text style={s.savingsStatLabel}>Committed</Text>
                </View>
              </View>
            </View>
            <Text style={s.sectionLabel}>Savings growth</Text>
            <MiniBarChart data={SAVINGS_DATA} labels={MONTHS} color="#E91E8C" />
            <View style={s.interestCard}>
              <Text style={s.interestTitle}>Interest earned</Text>
              <InterestRow label="Today" value="₵2.10" />
              <InterestRow label="This month" value="₵48.20" />
              <InterestRow label="Projected this month" value="₵62.00" accent />
              <InterestRow label="All time" value="₵382.40" last />
            </View>
          </View>
        )}

        {/* Spending tab */}
        {tab === 'Spending' && (
          <View>
            <View style={s.spendHero}>
              <Text style={s.spendHeroLabel}>Total spending this month</Text>
              <Text style={s.spendHeroBig}>₵2,610</Text>
              <Text style={s.spendHeroChange}>↓ ₵90 vs last month</Text>
            </View>
            <Text style={s.sectionLabel}>Spending trend</Text>
            <MiniBarChart data={SPENDING_DATA} labels={MONTHS} color="#6C63FF" maxOverride={3500} />
            <Text style={s.sectionLabel}>Categories</Text>
            {SPEND_CATEGORIES.map(c => (
              <CategoryRow key={c.label} category={c} />
            ))}
          </View>
        )}

        {/* Goals tab */}
        {tab === 'Goals' && (
          <View>
            <View style={s.goalsSummary}>
              <Text style={s.goalsSummaryLabel}>Saved toward goals</Text>
              <Text style={s.goalsSummaryBig}>₵2,400</Text>
              <Text style={s.goalsSummaryMeta}>Across 3 goals</Text>
            </View>
            {GOALS.map(g => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <View key={g.label} style={s.goalCard}>
                  <View style={s.gcRow}>
                    <Text style={s.gcLabel}>{g.label}</Text>
                    <Text style={[s.gcPct, { color: g.color }]}>{pct}%</Text>
                  </View>
                  <View style={s.gcAmountRow}>
                    <Text style={s.gcSaved}>₵{g.saved}</Text>
                    <Text style={s.gcTarget}>of ₵{g.target}</Text>
                  </View>
                  <View style={s.gcBar}>
                    <View style={[s.gcFill, { width: `${pct}%`, backgroundColor: g.color }]} />
                  </View>
                </View>
              );
            })}
            <TouchableOpacity style={s.addGoalBtn} onPress={() => navigation.navigate('GoalSavings')}>
              <Text style={s.addGoalBtnText}>+ Add new goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroStat({ label, value, color }) {
  return (
    <View style={s.heroStat}>
      <Text style={[s.heroStatValue, { color }]}>{value}</Text>
      <Text style={s.heroStatLabel}>{label}</Text>
    </View>
  );
}

function OverviewRow({ icon, label, value, positive }) {
  return (
    <View style={s.overviewRow}>
      <Text style={s.ovIcon}>{icon}</Text>
      <Text style={s.ovLabel}>{label}</Text>
      <Text style={[s.ovValue, positive && s.ovPositive]}>{value}</Text>
    </View>
  );
}

function InterestRow({ label, value, accent, last }) {
  return (
    <View style={[s.interestRow, !last && s.interestBorder]}>
      <Text style={s.interestLabel}>{label}</Text>
      <Text style={[s.interestValue, accent && s.interestAccent]}>{value}</Text>
    </View>
  );
}

function CategoryRow({ category }) {
  return (
    <View style={s.catRow}>
      <View style={[s.catDot, { backgroundColor: category.color }]} />
      <Text style={s.catLabel}>{category.label}</Text>
      <View style={s.catBarWrap}>
        <View style={[s.catBar, { width: `${category.pct}%`, backgroundColor: category.color }]} />
      </View>
      <Text style={s.catAmount}>₵{category.amount}</Text>
    </View>
  );
}

function MiniBarChart({ data, labels, color, maxOverride }) {
  const max = maxOverride || Math.max(...data) * 1.15;
  return (
    <View style={s.chart}>
      <View style={s.chartBars}>
        {data.map((v, i) => (
          <View key={i} style={s.barWrap}>
            <View style={[s.bar, { height: Math.round((v / max) * 80), backgroundColor: color }]} />
            <Text style={s.barLabel}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { fontSize: 22, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  monthBadge: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 14, borderWidth: 1, borderColor: '#E0D0E8' },
  monthText: { fontSize: 13, fontWeight: '600', color: '#888' },
  tabs: { flexDirection: 'row', backgroundColor: '#F5E0F0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#999' },
  tabTextActive: { fontWeight: '700', color: '#E91E8C' },
  heroRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 14 },
  heroStat: { flex: 1, alignItems: 'center', padding: 12 },
  heroStatValue: { fontSize: 18, fontWeight: '800', marginBottom: 3 },
  heroStatLabel: { fontSize: 11, color: '#888' },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#FDE68A' },
  streakIcon: { fontSize: 28 },
  streakTitle: { fontSize: 15, fontWeight: '700', color: '#92400E', marginBottom: 3 },
  streakSub: { fontSize: 13, color: '#78350F', lineHeight: 17 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', padding: 14, paddingBottom: 8 },
  overviewRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderColor: '#F5E8F5' },
  ovIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  ovLabel: { flex: 1, fontSize: 14, color: '#555', marginLeft: 8 },
  ovValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  ovPositive: { color: '#22C55E' },
  fidoCard: { flexDirection: 'row', backgroundColor: '#1a1a2e', borderRadius: 16, padding: 18, gap: 16, marginBottom: 8 },
  fidoLeft: { alignItems: 'center', justifyContent: 'center' },
  fidoScore: { fontSize: 40, fontWeight: '900', color: '#E91E8C' },
  fidoLabel: { fontSize: 11, color: '#888', textAlign: 'center' },
  fidoRight: { flex: 1 },
  fidoNext: { fontSize: 11, color: '#888', marginBottom: 4 },
  fidoMilestone: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6, lineHeight: 19 },
  fidoNote: { fontSize: 12, color: '#aaa', lineHeight: 16 },
  savingsHero: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 20, marginBottom: 20, alignItems: 'center' },
  savingsHeroLabel: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  savingsHeroBig: { fontSize: 38, fontWeight: '800', color: '#fff', marginBottom: 14 },
  savingsRow: { flexDirection: 'row', width: '100%' },
  savingsStat: { flex: 1, alignItems: 'center' },
  savingsStatValue: { fontSize: 18, fontWeight: '700', color: '#E91E8C', marginBottom: 2 },
  savingsStatLabel: { fontSize: 12, color: '#888' },
  savingsDivider: { width: 1, backgroundColor: '#444', marginHorizontal: 10 },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  chart: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 },
  barWrap: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '70%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: '#999' },
  interestCard: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 8 },
  interestTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', padding: 14, paddingBottom: 8 },
  interestRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  interestBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  interestLabel: { fontSize: 14, color: '#888' },
  interestValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  interestAccent: { color: '#E91E8C' },
  spendHero: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' },
  spendHeroLabel: { fontSize: 13, color: '#888', marginBottom: 4 },
  spendHeroBig: { fontSize: 36, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  spendHeroChange: { fontSize: 13, color: '#22C55E', fontWeight: '600' },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catLabel: { fontSize: 13, color: '#555', width: 100 },
  catBarWrap: { flex: 1, height: 8, backgroundColor: '#F0E0F0', borderRadius: 4, overflow: 'hidden' },
  catBar: { height: 8, borderRadius: 4 },
  catAmount: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', width: 52, textAlign: 'right' },
  goalsSummary: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 18, marginBottom: 16, alignItems: 'center' },
  goalsSummaryLabel: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  goalsSummaryBig: { fontSize: 34, fontWeight: '800', color: '#fff', marginBottom: 2 },
  goalsSummaryMeta: { fontSize: 12, color: '#888' },
  goalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  gcRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  gcLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  gcPct: { fontSize: 14, fontWeight: '700' },
  gcAmountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 },
  gcSaved: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  gcTarget: { fontSize: 13, color: '#888' },
  gcBar: { height: 6, backgroundColor: '#F0E0F0', borderRadius: 3, overflow: 'hidden' },
  gcFill: { height: 6, borderRadius: 3 },
  addGoalBtn: { backgroundColor: '#E91E8C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  addGoalBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
