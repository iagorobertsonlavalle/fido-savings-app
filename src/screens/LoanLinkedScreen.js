import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput
} from 'react-native';

const STEPS = ['intro', 'purpose', 'plan', 'progress'];

const PURPOSES = [
  { id: 'inventory', label: 'Business inventory', icon: '📦', target: 3000 },
  { id: 'equipment', label: 'Equipment or tools', icon: '🔧', target: 2500 },
  { id: 'education', label: 'Education / training', icon: '📚', target: 1500 },
  { id: 'expansion', label: 'Business expansion', icon: '🏪', target: 5000 },
  { id: 'emergency', label: 'Emergency buffer', icon: '🛡️', target: 1000 },
];

const PAST_LOANS = [
  { label: 'Loan #2847', amount: 1200, status: 'Repaid', date: 'Mar 2026' },
  { label: 'Loan #1953', amount: 800, status: 'Repaid', date: 'Dec 2025' },
];

export default function LoanLinkedScreen({ navigation }) {
  const [step, setStep] = useState('intro');
  const [purpose, setPurpose] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const presetGoal = PURPOSES.find(p => p.id === purpose);
  const goal = isCustom
    ? { id: 'custom', label: customLabel || 'My goal', icon: '🎯', target: parseInt(customAmount) || 0 }
    : presetGoal
      ? { ...presetGoal, target: parseInt(customAmount) || presetGoal.target }
      : null;

  const canContinue = isCustom
    ? customLabel.trim().length > 0 && parseInt(customAmount) > 0
    : purpose !== null;

  const next = (s) => setStep(s);
  const back = () => {
    if (step === 'intro') navigation.goBack();
    else if (step === 'purpose') setStep('intro');
    else if (step === 'plan') setStep('purpose');
    else if (step === 'progress') setStep('plan');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={back} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Loan-Linked Savings</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <Text style={s.bigIcon}>🔗</Text>
            <Text style={s.title}>Save toward your next big need</Text>
            <Text style={s.subtitle}>
              Build savings toward a specific goal. Consistent saving may strengthen your Fido profile over time.
            </Text>
            <View style={s.pastLoansCard}>
              <Text style={s.pastTitle}>Your loan history</Text>
              {PAST_LOANS.map(l => (
                <View key={l.label} style={s.loanRow}>
                  <View style={s.loanLeft}>
                    <Text style={s.loanLabel}>{l.label}</Text>
                    <Text style={s.loanDate}>{l.date}</Text>
                  </View>
                  <Text style={s.loanAmount}>₵{l.amount}</Text>
                  <View style={s.repaidBadge}>
                    <Text style={s.repaidText}>{l.status}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={s.nudgeCard}>
              <Text style={s.nudgeIcon}>💡</Text>
              <View style={s.nudgeText}>
                <Text style={s.nudgeTitle}>You've repaid 2 loans on time</Text>
                <Text style={s.nudgeBody}>
                  Consistent saving may help with earlier consideration for future loan offers. Save toward your next big need.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => next('purpose')}>
              <Text style={s.primaryBtnText}>Start saving toward a goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Purpose */}
        {step === 'purpose' && (
          <View>
            <Text style={s.subtitle}>What's your next big need?</Text>
            {PURPOSES.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[s.purposeCard, !isCustom && purpose === p.id && s.purposeCardActive]}
                onPress={() => { setPurpose(p.id); setIsCustom(false); setCustomAmount(String(p.target)); }}
              >
                <Text style={s.purposeIcon}>{p.icon}</Text>
                <View style={s.purposeMeta}>
                  <Text style={[s.purposeLabel, !isCustom && purpose === p.id && s.purposeLabelActive]}>{p.label}</Text>
                  <Text style={s.purposeTarget}>Suggested: ₵{p.target}</Text>
                </View>
                <View style={[s.radioOuter, !isCustom && purpose === p.id && s.radioOuterActive]}>
                  {!isCustom && purpose === p.id && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}

            {/* Create your own */}
            <TouchableOpacity
              style={[s.purposeCard, isCustom && s.purposeCardActive]}
              onPress={() => { setIsCustom(true); setPurpose(null); }}
            >
              <Text style={s.purposeIcon}>✏️</Text>
              <View style={s.purposeMeta}>
                <Text style={[s.purposeLabel, isCustom && s.purposeLabelActive]}>Create your own</Text>
                <Text style={s.purposeTarget}>Name it and set your own target</Text>
              </View>
              <View style={[s.radioOuter, isCustom && s.radioOuterActive]}>
                {isCustom && <View style={s.radioInner} />}
              </View>
            </TouchableOpacity>

            {/* Amount editor — shown when preset selected or custom */}
            {(purpose || isCustom) && (
              <View style={s.amountEditor}>
                {isCustom && (
                  <>
                    <Text style={s.amountEditorLabel}>Goal name</Text>
                    <TextInput
                      style={s.nameInput}
                      placeholder="e.g. New motorbike"
                      placeholderTextColor="#bbb"
                      value={customLabel}
                      onChangeText={setCustomLabel}
                    />
                  </>
                )}
                <Text style={s.amountEditorLabel}>
                  {isCustom ? 'Target amount' : `Your target (suggested ₵${presetGoal?.target})`}
                </Text>
                <View style={s.amountInputRow}>
                  <Text style={s.currencySign}>₵</Text>
                  <TextInput
                    style={s.amountInput}
                    keyboardType="numeric"
                    placeholder={String(presetGoal?.target || '0')}
                    placeholderTextColor="#bbb"
                    value={customAmount}
                    onChangeText={setCustomAmount}
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[s.primaryBtn, !canContinue && s.primaryBtnDisabled]}
              onPress={canContinue ? () => next('plan') : null}
            >
              <Text style={s.primaryBtnText}>See recommended plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Plan */}
        {step === 'plan' && goal && (
          <View>
            <View style={s.goalChosen}>
              <Text style={s.goalChosenIcon}>{goal.icon}</Text>
              <View>
                <Text style={s.goalChosenLabel}>{goal.label}</Text>
                <Text style={s.goalChosenTarget}>Target: ₵{goal.target}</Text>
              </View>
            </View>
            <View style={s.recommendedPlan}>
              <Text style={s.planTitle}>Recommended plan</Text>
              <PlanStat label="Weekly contribution" value="₵150" />
              <PlanStat label="Timeline" value="~5 months" />
              <PlanStat label="Interest earned" value="≈₵24" />
              <PlanStat label="Total at goal" value={`₵${goal.target}`} accent last />
            </View>
            <View style={s.benefitsCard}>
              <Text style={s.benefitsTitle}>Benefits of saving toward a goal</Text>
              <BenefitRow text="Keeps money earmarked — less temptation to spend" />
              <BenefitRow text="Earns 10% p.a. interest while you build toward the target" />
              <BenefitRow text="Consistent saving may strengthen your Fido profile" />
              <BenefitRow text="May help with earlier consideration for future loan offers" />
            </View>
            <View style={s.copyNote}>
              <Text style={s.copyNoteText}>
                Saving consistently may strengthen your Fido profile. This does not guarantee any loan approval or specific rate.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => next('progress')}>
              <Text style={s.primaryBtnText}>Start this plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Progress */}
        {step === 'progress' && goal && (
          <View>
            <View style={s.progressHero}>
              <Text style={s.progressGoal}>{goal.icon} {goal.label}</Text>
              <Text style={s.progressBig}>₵0</Text>
              <Text style={s.progressTarget}>of ₵{goal.target}</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: '0%' }]} />
              </View>
              <Text style={s.progressPct}>0% — just getting started!</Text>
            </View>
            <View style={s.nextContrib}>
              <Text style={s.nextContribLabel}>Next contribution</Text>
              <Text style={s.nextContribValue}>₵150 · Monday</Text>
              <Text style={s.nextContribNote}>Auto-sweep from MoMo if enabled</Text>
            </View>
            <View style={s.profileNote}>
              <Text style={s.profileNoteText}>
                📈 Consistent saving may strengthen your Fido profile and may help with earlier consideration for future loan offers.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={s.primaryBtnText}>Go to Savings Hub</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanStat({ label, value, accent, last }) {
  return (
    <View style={[s.planStat, !last && s.planStatBorder]}>
      <Text style={s.planStatLabel}>{label}</Text>
      <Text style={[s.planStatValue, accent && s.planStatAccent]}>{value}</Text>
    </View>
  );
}

function BenefitRow({ text }) {
  return (
    <View style={s.benefitRow}>
      <Text style={s.benefitDot}>✓</Text>
      <Text style={s.benefitText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { fontSize: 22, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  bigIcon: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  pastLoansCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  pastTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  loanRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#F5E8F5' },
  loanLeft: { flex: 1 },
  loanLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  loanDate: { fontSize: 12, color: '#aaa', marginTop: 2 },
  loanAmount: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginRight: 10 },
  repaidBadge: { backgroundColor: '#F0FFF4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  repaidText: { fontSize: 12, fontWeight: '600', color: '#22C55E' },
  nudgeCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, marginBottom: 20, gap: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  nudgeIcon: { fontSize: 22 },
  nudgeText: { flex: 1 },
  nudgeTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  nudgeBody: { fontSize: 13, color: '#3B82F6', lineHeight: 18 },
  purposeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: '#E0D0E8', gap: 12 },
  purposeCardActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  purposeIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  purposeMeta: { flex: 1 },
  purposeLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 3 },
  purposeLabelActive: { color: '#E91E8C' },
  purposeTarget: { fontSize: 12, color: '#888' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  goalChosen: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16 },
  goalChosenIcon: { fontSize: 32 },
  goalChosenLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  goalChosenTarget: { fontSize: 13, color: '#888' },
  recommendedPlan: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  planTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', padding: 14, paddingBottom: 8 },
  planStat: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  planStatBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  planStatLabel: { fontSize: 14, color: '#888' },
  planStatValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  planStatAccent: { color: '#22C55E' },
  benefitsCard: { backgroundColor: '#F0FFF4', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#D1FAE5' },
  benefitsTitle: { fontSize: 14, fontWeight: '700', color: '#166534', marginBottom: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  benefitDot: { fontSize: 14, color: '#22C55E', fontWeight: '700' },
  benefitText: { flex: 1, fontSize: 13, color: '#166534', lineHeight: 18 },
  copyNote: { backgroundColor: '#F8F0FF', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E8D0F8' },
  copyNoteText: { fontSize: 12, color: '#888', lineHeight: 17, fontStyle: 'italic' },
  progressHero: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 16 },
  progressGoal: { fontSize: 14, color: '#aaa', marginBottom: 8 },
  progressBig: { fontSize: 42, fontWeight: '800', color: '#fff', marginBottom: 2 },
  progressTarget: { fontSize: 13, color: '#888', marginBottom: 14 },
  progressBar: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: '#E91E8C', borderRadius: 4 },
  progressPct: { fontSize: 13, color: '#E91E8C' },
  nextContrib: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  nextContribLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  nextContribValue: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 3 },
  nextContribNote: { fontSize: 12, color: '#aaa' },
  profileNote: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' },
  profileNoteText: { fontSize: 13, color: '#1e40af', lineHeight: 18 },
  primaryBtn: { backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnDisabled: { backgroundColor: '#E0D0E8' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  amountEditor: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: '#E91E8C' },
  amountEditorLabel: { fontSize: 12, color: '#888', marginBottom: 8 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  currencySign: { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 22, fontWeight: '700', color: '#1a1a2e' },
  nameInput: { borderWidth: 1, borderColor: '#E0D0E8', borderRadius: 10, padding: 12, fontSize: 15, color: '#1a1a2e', marginBottom: 14 },
});
