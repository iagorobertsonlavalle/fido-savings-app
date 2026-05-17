import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput
} from 'react-native';

const STEPS = ['pick', 'amount', 'plan', 'dashboard'];

const GOAL_TYPES = [
  { id: 'emergency', label: 'Emergency fund', icon: '🛡️', target: 1000, desc: 'Cover 3 months of essential costs' },
  { id: 'inventory', label: 'Business inventory', icon: '📦', target: 3000, desc: 'Restock and grow your business' },
  { id: 'school', label: 'School fees', icon: '📚', target: 1200, desc: 'Education for you or your family' },
  { id: 'equipment', label: 'Equipment', icon: '🔧', target: 2500, desc: 'Tools, devices, machinery' },
  { id: 'travel', label: 'Travel or event', icon: '✈️', target: 800, desc: 'Holiday, wedding, celebration' },
  { id: 'rent', label: 'Rent or bills', icon: '🏠', target: 1500, desc: 'Get ahead on housing costs' },
];

const PLANS = [
  { id: 'daily', label: 'Daily', multiplier: 30 },
  { id: 'weekly', label: 'Weekly', multiplier: 4.3 },
  { id: 'monthly', label: 'Monthly', multiplier: 1 },
];

const EXISTING_GOALS = [
  { id: 'emergency', label: 'Emergency fund', icon: '🛡️', saved: 600, target: 1000, color: '#6C63FF' },
  { id: 'inventory', label: 'Business inventory', icon: '📦', saved: 1500, target: 3000, color: '#E91E8C' },
  { id: 'school', label: 'School fees', icon: '📚', saved: 300, target: 1200, color: '#22C55E' },
];

export default function GoalSavingsScreen({ navigation }) {
  const [step, setStep] = useState('dashboard');
  const [goalType, setGoalType] = useState(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [months, setMonths] = useState('6');
  const [plan, setPlan] = useState('weekly');

  const goal = GOAL_TYPES.find(g => g.id === goalType);
  const target = parseFloat(targetAmount) || (goal ? goal.target : 0);
  const monthsNum = parseFloat(months) || 6;
  const selectedPlan = PLANS.find(p => p.id === plan);
  const perPeriod = selectedPlan && target > 0
    ? (target / monthsNum / selectedPlan.multiplier).toFixed(2)
    : '0.00';

  const back = () => {
    if (step === 'dashboard') navigation.goBack();
    else if (step === 'pick') setStep('dashboard');
    else if (step === 'amount') setStep('pick');
    else if (step === 'plan') setStep('amount');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={back} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            {step === 'dashboard' ? 'Goal Savings' :
             step === 'pick' ? 'Create a goal' :
             step === 'amount' ? 'Set your target' : 'Your plan'}
          </Text>
        </View>

        {/* Dashboard */}
        {step === 'dashboard' && (
          <View>
            <View style={s.summaryCard}>
              <Text style={s.summaryLabel}>Total saved toward goals</Text>
              <Text style={s.summaryBig}>₵2,400</Text>
              <Text style={s.summaryMeta}>Across 3 active goals · 10% interest p.a.</Text>
            </View>
            <TouchableOpacity style={s.newGoalBtn} onPress={() => setStep('pick')}>
              <Text style={s.newGoalBtnText}>+ Create new goal</Text>
            </TouchableOpacity>
            <Text style={s.sectionLabel}>Active goals</Text>
            {EXISTING_GOALS.map(g => (
              <GoalCard key={g.id} goal={g} />
            ))}
            <View style={s.tipCard}>
              <Text style={s.tipIcon}>💡</Text>
              <Text style={s.tipText}>
                Goals earn the same 10% p.a. as flexible savings — but staying on track may strengthen your Fido profile.
              </Text>
            </View>
          </View>
        )}

        {/* Pick goal type */}
        {step === 'pick' && (
          <View>
            <Text style={s.subtitle}>What are you saving toward?</Text>
            <View style={s.goalGrid}>
              {GOAL_TYPES.map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[s.goalChip, goalType === g.id && s.goalChipActive]}
                  onPress={() => setGoalType(g.id)}
                >
                  <Text style={s.goalIcon}>{g.icon}</Text>
                  <Text style={[s.goalLabel, goalType === g.id && s.goalLabelActive]}>{g.label}</Text>
                  <Text style={s.goalDesc}>{g.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.primaryBtn, !goalType && s.primaryBtnDisabled]}
              onPress={goalType ? () => {
                setTargetAmount(String(goal?.target || ''));
                setStep('amount');
              } : null}
            >
              <Text style={s.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Set amount */}
        {step === 'amount' && (
          <View>
            <Text style={s.goalPickedLabel}>{goal?.icon} {goal?.label}</Text>
            <Text style={s.subtitle}>How much do you want to save?</Text>
            <View style={s.inputCard}>
              <Text style={s.inputLabel}>Target amount</Text>
              <View style={s.amountInput}>
                <Text style={s.currencySign}>₵</Text>
                <TextInput
                  style={s.textInput}
                  keyboardType="numeric"
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder={String(goal?.target || '0')}
                  placeholderTextColor="#bbb"
                  autoFocus
                />
              </View>
            </View>
            <Text style={s.inputLabel2}>Timeline (months)</Text>
            <View style={s.monthsRow}>
              {[3, 6, 12, 24].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[s.monthChip, months === String(m) && s.monthChipActive]}
                  onPress={() => setMonths(String(m))}
                >
                  <Text style={[s.monthText, months === String(m) && s.monthTextActive]}>{m}mo</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.primaryBtn, target < 1 && s.primaryBtnDisabled]}
              onPress={target >= 1 ? () => setStep('plan') : null}
            >
              <Text style={s.primaryBtnText}>Set saving plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Plan */}
        {step === 'plan' && (
          <View>
            <Text style={s.goalPickedLabel}>{goal?.icon} {goal?.label} · ₵{target}</Text>
            <Text style={s.subtitle}>How often do you want to contribute?</Text>
            {PLANS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[s.planCard, plan === p.id && s.planCardActive]}
                onPress={() => setPlan(p.id)}
              >
                <View style={s.planLeft}>
                  <Text style={[s.planLabel, plan === p.id && s.planLabelActive]}>{p.label}</Text>
                  <Text style={s.planAmount}>
                    ₵{(target / monthsNum / p.multiplier).toFixed(2)} per {p.id.replace('ly', '')}
                  </Text>
                </View>
                <View style={[s.radioOuter, plan === p.id && s.radioOuterActive]}>
                  {plan === p.id && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
            <View style={s.planSummaryCard}>
              <Text style={s.planSummaryTitle}>Your plan</Text>
              <PlanRow label="Goal" value={`${goal?.icon} ${goal?.label}`} />
              <PlanRow label="Target" value={`₵${target}`} />
              <PlanRow label="Timeline" value={`${months} months`} />
              <PlanRow label={`${selectedPlan?.label} contribution`} value={`₵${perPeriod}`} last />
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => setStep('dashboard')}>
              <Text style={s.primaryBtnText}>Create goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function GoalCard({ goal }) {
  const pct = Math.round((goal.saved / goal.target) * 100);
  return (
    <View style={s.goalCard}>
      <View style={s.gcHeader}>
        <Text style={s.gcIcon}>{goal.icon}</Text>
        <View style={s.gcMeta}>
          <Text style={s.gcLabel}>{goal.label}</Text>
          <Text style={s.gcAmount}>₵{goal.saved} of ₵{goal.target}</Text>
        </View>
        <Text style={s.gcPct}>{pct}%</Text>
      </View>
      <View style={s.gcBar}>
        <View style={[s.gcBarFill, { width: `${pct}%`, backgroundColor: goal.color }]} />
      </View>
    </View>
  );
}

function PlanRow({ label, value, last }) {
  return (
    <View style={[s.planRow, !last && s.planRowBorder]}>
      <Text style={s.planRowLabel}>{label}</Text>
      <Text style={s.planRowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { fontSize: 22, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  summaryCard: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 20, marginBottom: 14, alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  summaryBig: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 4 },
  summaryMeta: { fontSize: 12, color: '#888' },
  newGoalBtn: { backgroundColor: '#E91E8C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  newGoalBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  goalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  gcHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  gcIcon: { fontSize: 24, marginRight: 12 },
  gcMeta: { flex: 1 },
  gcLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 2 },
  gcAmount: { fontSize: 13, color: '#888' },
  gcPct: { fontSize: 16, fontWeight: '700', color: '#E91E8C' },
  gcBar: { height: 6, backgroundColor: '#F0E0F0', borderRadius: 3, overflow: 'hidden' },
  gcBarFill: { height: 6, borderRadius: 3 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginTop: 8, gap: 10 },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 13, color: '#78350F', lineHeight: 18 },
  subtitle: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  goalChip: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#E0D0E8' },
  goalChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  goalIcon: { fontSize: 24, marginBottom: 6 },
  goalLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  goalLabelActive: { color: '#E91E8C' },
  goalDesc: { fontSize: 11, color: '#888', lineHeight: 16 },
  goalPickedLabel: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  inputCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 16, alignItems: 'center' },
  inputLabel: { fontSize: 13, color: '#888', marginBottom: 10 },
  inputLabel2: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', marginBottom: 10 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E91E8C', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  currencySign: { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  textInput: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', minWidth: 100 },
  monthsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  monthChip: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0D0E8', backgroundColor: '#fff', alignItems: 'center' },
  monthChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  monthText: { fontSize: 14, fontWeight: '600', color: '#888' },
  monthTextActive: { color: '#E91E8C' },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: '#E0D0E8' },
  planCardActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  planLeft: { flex: 1 },
  planLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 3 },
  planLabelActive: { color: '#E91E8C' },
  planAmount: { fontSize: 13, color: '#888' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  planSummaryCard: { backgroundColor: '#fff', borderRadius: 14, padding: 4, marginBottom: 20, marginTop: 8 },
  planSummaryTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', padding: 14, paddingBottom: 8 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  planRowBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  planRowLabel: { fontSize: 13, color: '#888' },
  planRowValue: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  primaryBtn: { backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnDisabled: { backgroundColor: '#E0D0E8' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
