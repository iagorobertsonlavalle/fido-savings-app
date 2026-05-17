import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const milestones = [
  { score: 300, label: 'Basic loan access', unlocked: true },
  { score: 400, label: 'Lower interest rates', unlocked: true },
  { score: 500, label: 'Priority loan queue', unlocked: false },
  { score: 600, label: 'Higher loan limits', unlocked: false },
  { score: 700, label: 'Premium rates', unlocked: false },
];

const savingsPlans = [
  { amount: 100, pointsPerMonth: 5, label: 'Starter' },
  { amount: 250, pointsPerMonth: 10, label: 'Growing', recommended: true },
  { amount: 500, pointsPerMonth: 18, label: 'Accelerator' },
];

const currentScore = 420;
const maxScore = 800;

function ScoreArc({ score }) {
  const pct = score / maxScore;
  const scoreColor = pct < 0.4 ? colors.error : pct < 0.65 ? colors.warning : colors.success;

  return (
    <View style={styles.scoreArcContainer}>
      <View style={styles.scoreTrack}>
        <View style={[styles.scoreFill, { width: `${pct * 100}%`, backgroundColor: scoreColor }]} />
        <View style={[styles.scoreThumb, { left: `${pct * 100}%`, borderColor: scoreColor }]} />
      </View>
      <View style={styles.scoreLabels}>
        <Text style={styles.scoreMin}>0</Text>
        <Text style={styles.scoreMax}>800</Text>
      </View>
      <View style={styles.scoreDisplay}>
        <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreLabel}>Your Fido Score</Text>
      </View>
    </View>
  );
}

export default function FidoScoreScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [enrolled, setEnrolled] = useState(false);

  const plan = savingsPlans[selectedPlan];
  const monthsToNextMilestone = Math.ceil((500 - currentScore) / plan.pointsPerMonth);

  if (enrolled) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <Text style={styles.successEmoji}>⭐</Text>
          <Text style={styles.successTitle}>Score boost activated!</Text>
          <Text style={styles.successSub}>
            Save ₵{plan.amount}/month and earn +{plan.pointsPerMonth} Fido points every month.{'\n\n'}
            You'll hit 500 and unlock Priority Loan Queue in {monthsToNextMilestone} months!
          </Text>
          <PrimaryButton title="Back to Home" onPress={() => navigation.navigate('Home')} style={{ marginTop: 32 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Boost Your Fido Score</Text>

        {/* Score arc */}
        <View style={styles.scoreCard}>
          <ScoreArc score={currentScore} />
          <View style={styles.scoreNext}>
            <Text style={styles.scoreNextLabel}>Next milestone</Text>
            <Text style={styles.scoreNextValue}>500 — Priority Loan Queue</Text>
            <Text style={styles.scoreGap}>+{500 - currentScore} points needed</Text>
          </View>
        </View>

        {/* Milestones */}
        <Text style={styles.sectionLabel}>Score Milestones</Text>
        <View style={styles.milestonesCard}>
          {milestones.map((m, i) => (
            <View key={m.score} style={[styles.milestoneRow, i < milestones.length - 1 && styles.milestoneRowBorder]}>
              <View style={[styles.milestoneDot, m.unlocked ? styles.milestoneDotUnlocked : styles.milestoneDotLocked]} >
                <Text style={{ fontSize: 10 }}>{m.unlocked ? '✓' : '🔒'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.milestoneName, m.unlocked && styles.milestoneNameUnlocked]}>{m.label}</Text>
                <Text style={styles.milestoneScore}>{m.score} points</Text>
              </View>
              {m.unlocked && <Text style={styles.unlockedBadge}>Unlocked</Text>}
            </View>
          ))}
        </View>

        {/* Savings plan selector */}
        <Text style={styles.sectionLabel}>Choose a savings plan</Text>
        <Text style={styles.sectionSub}>Save monthly to earn Fido points automatically</Text>
        {savingsPlans.map((p, i) => (
          <TouchableOpacity
            key={p.amount}
            style={[styles.planCard, selectedPlan === i && styles.planCardActive]}
            onPress={() => setSelectedPlan(i)}
          >
            {p.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={[styles.planLabel, selectedPlan === i && styles.planLabelActive]}>{p.label}</Text>
              <Text style={[styles.planAmount, selectedPlan === i && styles.planAmountActive]}>₵{p.amount}/mo</Text>
            </View>
            <View style={styles.planPoints}>
              <Text style={styles.planPointsText}>+{p.pointsPerMonth} Fido points per month</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Projection */}
        <View style={styles.projectionCard}>
          <Text style={styles.projectionTitle}>Your score projection</Text>
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Monthly saving</Text>
            <Text style={styles.projectionValue}>₵{plan.amount}</Text>
          </View>
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Points earned/month</Text>
            <Text style={styles.projectionValue}>+{plan.pointsPerMonth}</Text>
          </View>
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Months to score 500</Text>
            <Text style={[styles.projectionValue, { color: colors.primary }]}>{monthsToNextMilestone} months</Text>
          </View>
        </View>

        <PrimaryButton
          title={`Start saving ₵${plan.amount}/month`}
          onPress={() => setEnrolled(true)}
          style={{ marginTop: 8, marginBottom: 40 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 16 },
  scoreCard: {
    backgroundColor: colors.white, borderRadius: 24, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  scoreArcContainer: { alignItems: 'center', marginBottom: 16 },
  scoreTrack: {
    width: '100%', height: 16, backgroundColor: colors.border,
    borderRadius: 8, marginBottom: 6, overflow: 'visible', position: 'relative',
  },
  scoreFill: { height: '100%', borderRadius: 8 },
  scoreThumb: {
    position: 'absolute', top: -6, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white, borderWidth: 3, marginLeft: -14,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  scoreLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 4 },
  scoreMin: { fontSize: 12, color: colors.textLight },
  scoreMax: { fontSize: 12, color: colors.textLight },
  scoreDisplay: { alignItems: 'center', marginTop: 16 },
  scoreNumber: { fontSize: 56, fontWeight: '900' },
  scoreLabel: { fontSize: 14, color: colors.textSecondary, marginTop: -4 },
  scoreNext: { backgroundColor: colors.background, borderRadius: 12, padding: 14 },
  scoreNextLabel: { fontSize: 12, color: colors.textSecondary },
  scoreNextValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  scoreGap: { fontSize: 12, color: colors.primary, marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  milestonesCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  milestoneRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  milestoneDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  milestoneDotUnlocked: { backgroundColor: colors.successLight },
  milestoneDotLocked: { backgroundColor: colors.border },
  milestoneName: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  milestoneNameUnlocked: { color: colors.text },
  milestoneScore: { fontSize: 12, color: colors.textLight, marginTop: 1 },
  unlockedBadge: { fontSize: 11, fontWeight: '700', color: colors.success },
  planCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    position: 'relative',
  },
  planCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '44' },
  recommendedBadge: {
    position: 'absolute', top: -10, right: 16,
    backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3,
  },
  recommendedText: { fontSize: 11, fontWeight: '700', color: colors.white },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planLabel: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  planLabelActive: { color: colors.primary },
  planAmount: { fontSize: 20, fontWeight: '800', color: colors.text },
  planAmountActive: { color: colors.primary },
  planPoints: { marginTop: 6 },
  planPointsText: { fontSize: 13, color: colors.textSecondary },
  projectionCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginTop: 8, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  projectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  projectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  projectionLabel: { fontSize: 14, color: colors.textSecondary },
  projectionValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  successEmoji: { fontSize: 72, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  successSub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
