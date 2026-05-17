import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

const STEPS = ['intro', 'pick', 'bonus_explain', 'confirm', 'success'];

const TERMS = [
  { months: 1, rate: 11, bonus: 15 },
  { months: 3, rate: 12, bonus: 45 },
  { months: 6, rate: 13.5, bonus: 90, badge: 'Popular' },
  { months: 12, rate: 15, bonus: 200, badge: 'Best value' },
];

const AMOUNTS = [500, 1000, 2000, 5000];

function calcBonus(amount, term) {
  return Math.round(amount * (term.bonus / 1000));
}

function calcInterest(amount, term) {
  return Math.round(amount * (term.rate / 100) * (term.months / 12));
}

export default function TermSavingsScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState(TERMS[2]);
  const [selectedAmount, setSelectedAmount] = useState(1000);

  const current = STEPS[step];
  const bonus = calcBonus(selectedAmount, selectedTerm);
  const totalInterest = calcInterest(selectedAmount, selectedTerm);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step === 0) navigation.goBack();
    else setStep(s => s - 1);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={back} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          {step < 4 && (
            <View style={s.progress}>
              {STEPS.slice(0, 4).map((_, i) => (
                <View key={i} style={[s.dot, i <= step && s.dotActive]} />
              ))}
            </View>
          )}
        </View>

        {/* Intro */}
        {current === 'intro' && (
          <View style={s.body}>
            <Text style={s.bigIcon}>⚡</Text>
            <Text style={s.title}>Term Boost</Text>
            <Text style={s.subtitle}>
              Commit money for a fixed period and receive your bonus upfront — today, not later.
            </Text>
            <View style={s.heroCard}>
              <Text style={s.heroLabel}>Example: commit ₵1,000 for 6 months</Text>
              <View style={s.heroRow}>
                <View style={s.heroStat}>
                  <Text style={s.heroValue}>₵90</Text>
                  <Text style={s.heroDesc}>Bonus in your account today</Text>
                </View>
                <View style={s.heroDivider} />
                <View style={s.heroStat}>
                  <Text style={s.heroValue}>13.5%</Text>
                  <Text style={s.heroDesc}>Interest rate p.a.</Text>
                </View>
              </View>
            </View>
            <View style={s.emergencyNote}>
              <Text style={s.emergencyTitle}>Emergency withdrawal</Text>
              <Text style={s.emergencyBody}>
                If you need to withdraw early, the upfront bonus is deducted from your payout. You'll always get back at least your original amount.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>Choose my term</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pick term + amount */}
        {current === 'pick' && (
          <View style={s.body}>
            <Text style={s.title}>Choose your term</Text>
            <Text style={s.subtitle}>Longer terms earn more — and a bigger upfront bonus.</Text>
            {TERMS.map(t => (
              <TouchableOpacity
                key={t.months}
                style={[s.termCard, selectedTerm.months === t.months && s.termCardActive]}
                onPress={() => setSelectedTerm(t)}
              >
                <View style={s.termLeft}>
                  <View style={s.termTitleRow}>
                    <Text style={[s.termMonths, selectedTerm.months === t.months && s.termMonthsActive]}>
                      {t.months} month{t.months > 1 ? 's' : ''}
                    </Text>
                    {t.badge && <View style={s.termBadge}><Text style={s.termBadgeText}>{t.badge}</Text></View>}
                  </View>
                  <Text style={s.termRate}>{t.rate}% p.a.</Text>
                </View>
                <View style={s.termRight}>
                  <Text style={s.termBonusLabel}>Upfront bonus</Text>
                  <Text style={[s.termBonus, selectedTerm.months === t.months && s.termBonusActive]}>
                    ₵{calcBonus(selectedAmount, t)}
                  </Text>
                </View>
                <View style={[s.radioOuter, selectedTerm.months === t.months && s.radioOuterActive]}>
                  {selectedTerm.months === t.months && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
            <Text style={s.sectionLabel}>Amount to commit</Text>
            <View style={s.amountGrid}>
              {AMOUNTS.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[s.amountChip, selectedAmount === a && s.amountChipActive]}
                  onPress={() => setSelectedAmount(a)}
                >
                  <Text style={[s.amountText, selectedAmount === a && s.amountTextActive]}>₵{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>See your bonus</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bonus explain */}
        {current === 'bonus_explain' && (
          <View style={s.body}>
            <Text style={s.bigIcon}>🎁</Text>
            <Text style={s.title}>Your bonus is ready</Text>
            <Text style={s.subtitle}>Here's exactly what happens when you commit.</Text>
            <View style={s.bonusBreakdown}>
              <BreakdownRow icon="💰" label="You commit" value={`₵${selectedAmount}`} />
              <BreakdownRow icon="🎁" label="Bonus in your account today" value={`+₵${bonus}`} accent />
              <BreakdownRow icon="📈" label={`Interest over ${selectedTerm.months} months`} value={`+₵${totalInterest}`} />
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Total at maturity</Text>
                <Text style={s.totalValue}>₵{selectedAmount + totalInterest}</Text>
              </View>
            </View>
            <View style={s.earlyWithdrawCard}>
              <Text style={s.ewTitle}>⚠️ If you withdraw early</Text>
              <Text style={s.ewBody}>
                The upfront bonus (₵{bonus}) is deducted from your payout. You still get your full ₵{selectedAmount} back — the bonus deduction never takes you below your original deposit.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>I understand — confirm commitment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={back}>
              <Text style={s.secondaryBtnText}>Change term or amount</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirm */}
        {current === 'confirm' && (
          <View style={s.body}>
            <Text style={s.title}>Confirm your Term Boost</Text>
            <View style={s.summaryCard}>
              <SummaryRow label="Amount" value={`₵${selectedAmount}`} />
              <SummaryRow label="Term" value={`${selectedTerm.months} month${selectedTerm.months > 1 ? 's' : ''}`} />
              <SummaryRow label="Rate" value={`${selectedTerm.rate}% p.a.`} />
              <SummaryRow label="Upfront bonus" value={`₵${bonus}`} accent />
              <SummaryRow label="Early withdrawal" value={`Bonus (₵${bonus}) deducted`} />
              <SummaryRow label="At maturity" value={`₵${selectedAmount + totalInterest}`} last />
            </View>
            <View style={s.consentNote}>
              <Text style={s.consentText}>
                By tapping "Start Term Boost" you agree that the upfront bonus of ₵{bonus} will be deducted from your payout if you withdraw before {selectedTerm.months} month{selectedTerm.months > 1 ? 's' : ''}.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>Start Term Boost — get ₵{bonus} now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Success */}
        {current === 'success' && (
          <View style={s.body}>
            <View style={s.successCircle}>
              <Text style={s.successEmoji}>⚡</Text>
            </View>
            <Text style={s.successTitle}>₵{bonus} bonus added!</Text>
            <Text style={s.subtitle}>Your Term Boost is live. Keep it for {selectedTerm.months} month{selectedTerm.months > 1 ? 's' : ''} to earn the full ₵{totalInterest} in interest.</Text>
            <View style={s.liveCard}>
              <LiveStat label="Committed" value={`₵${selectedAmount}`} />
              <LiveStat label="Bonus received" value={`₵${bonus}`} highlight />
              <LiveStat label="Matures in" value={`${selectedTerm.months}mo`} />
            </View>
            <View style={s.withdrawNote}>
              <Text style={s.withdrawNoteText}>
                Need it early? Withdraw anytime — the ₵{bonus} bonus is deducted but your ₵{selectedAmount} is always yours.
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

function BreakdownRow({ icon, label, value, accent }) {
  return (
    <View style={s.breakdownRow}>
      <Text style={s.bdIcon}>{icon}</Text>
      <Text style={s.bdLabel}>{label}</Text>
      <Text style={[s.bdValue, accent && s.bdValueAccent]}>{value}</Text>
    </View>
  );
}

function SummaryRow({ label, value, accent, last }) {
  return (
    <View style={[s.summaryRow, !last && s.summaryBorder]}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={[s.summaryValue, accent && s.summaryValueAccent]}>{value}</Text>
    </View>
  );
}

function LiveStat({ label, value, highlight }) {
  return (
    <View style={s.liveStat}>
      <Text style={[s.liveStatValue, highlight && s.liveStatHighlight]}>{value}</Text>
      <Text style={s.liveStatLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { fontSize: 22, color: '#333' },
  progress: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0D0E8' },
  dotActive: { backgroundColor: '#E91E8C' },
  body: { paddingTop: 12 },
  bigIcon: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  heroCard: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 20, marginBottom: 16 },
  heroLabel: { fontSize: 12, color: '#aaa', marginBottom: 12, textAlign: 'center' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroValue: { fontSize: 28, fontWeight: '800', color: '#E91E8C', marginBottom: 4 },
  heroDesc: { fontSize: 12, color: '#ccc', textAlign: 'center' },
  heroDivider: { width: 1, height: 50, backgroundColor: '#444' },
  emergencyNote: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#FDE68A' },
  emergencyTitle: { fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  emergencyBody: { fontSize: 13, color: '#78350F', lineHeight: 18 },
  termCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: '#E0D0E8' },
  termCardActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  termLeft: { flex: 1 },
  termTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  termMonths: { fontSize: 16, fontWeight: '700', color: '#333' },
  termMonthsActive: { color: '#E91E8C' },
  termBadge: { backgroundColor: '#E91E8C', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  termBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  termRate: { fontSize: 13, color: '#888' },
  termRight: { alignItems: 'flex-end', marginRight: 12 },
  termBonusLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  termBonus: { fontSize: 18, fontWeight: '700', color: '#555' },
  termBonusActive: { color: '#E91E8C' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginTop: 16, marginBottom: 10 },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  amountChip: { width: '47%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#E0D0E8', backgroundColor: '#fff' },
  amountChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  amountText: { fontSize: 18, fontWeight: '600', color: '#666' },
  amountTextActive: { color: '#E91E8C' },
  bonusBreakdown: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F5E8F5' },
  bdIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  bdLabel: { flex: 1, fontSize: 14, color: '#555', marginLeft: 8 },
  bdValue: { fontSize: 15, fontWeight: '700', color: '#333' },
  bdValueAccent: { color: '#E91E8C' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#22C55E' },
  earlyWithdrawCard: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  ewTitle: { fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 6 },
  ewBody: { fontSize: 13, color: '#78350F', lineHeight: 19 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  summaryBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  summaryValueAccent: { color: '#E91E8C' },
  consentNote: { backgroundColor: '#F8F0FF', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#E8D0F8' },
  consentText: { fontSize: 12, color: '#666', lineHeight: 18 },
  primaryBtn: { backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryBtn: { borderWidth: 2, borderColor: '#E91E8C', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#E91E8C' },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  successEmoji: { fontSize: 52 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  liveCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  liveStat: { flex: 1, alignItems: 'center', padding: 14 },
  liveStatValue: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  liveStatHighlight: { color: '#E91E8C' },
  liveStatLabel: { fontSize: 11, color: '#888' },
  withdrawNote: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  withdrawNoteText: { fontSize: 13, color: '#78350F', lineHeight: 18 },
});
