import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput
} from 'react-native';

const STEPS = ['entry', 'comfort', 'rule', 'confirm'];

const RULES = [
  {
    id: 'manual',
    title: 'Save manually',
    desc: 'You choose when to move money.',
    icon: '✋',
  },
  {
    id: 'weekly',
    title: 'Save weekly',
    desc: 'We sweep a fixed amount every Monday.',
    icon: '📅',
  },
  {
    id: 'smart',
    title: 'Smart sweep',
    desc: 'We move anything above your comfort balance at end of week.',
    icon: '✨',
    badge: 'Recommended',
  },
];

export default function MoMoOverflowScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [comfortBalance, setComfortBalance] = useState('500');
  const [weeklyAmount, setWeeklyAmount] = useState('100');
  const [rule, setRule] = useState('smart');

  const current = STEPS[step];
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step === 0) navigation.goBack();
    else setStep(s => s - 1);
  };

  const comfortNum = parseFloat(comfortBalance) || 0;
  const weeklyNum = parseFloat(weeklyAmount) || 0;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={back} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={s.progress}>
            {STEPS.map((_, i) => (
              <View key={i} style={[s.dot, i <= step && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* Step: Entry */}
        {current === 'entry' && (
          <View style={s.body}>
            <Text style={s.bigIcon}>💸</Text>
            <Text style={s.title}>MoMo Overflow</Text>
            <Text style={s.subtitle}>
              Keep a comfortable balance on MoMo and let Fido quietly save the rest for you.
            </Text>
            <View style={s.exampleCard}>
              <Text style={s.exampleTitle}>How it works</Text>
              <ExampleRow step="1" text="You set a comfort balance — say ₵500" />
              <ExampleRow step="2" text="If MoMo hits ₵800, Fido saves the ₵300 overflow" />
              <ExampleRow step="3" text="You keep full control. Withdraw anytime." />
            </View>
            <View style={s.benefitRow}>
              <Text style={s.benefitIcon}>📈</Text>
              <Text style={s.benefitText}>Overflow earns 10% interest while it waits for you</Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>Set up Smart Sweep</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Comfort balance */}
        {current === 'comfort' && (
          <View style={s.body}>
            <Text style={s.title}>Your MoMo comfort balance</Text>
            <Text style={s.subtitle}>
              This is the minimum you always want to keep on MoMo. Anything above it can be swept to savings.
            </Text>
            <View style={s.inputCard}>
              <Text style={s.inputLabel}>I always want at least</Text>
              <View style={s.amountInput}>
                <Text style={s.currencySign}>₵</Text>
                <TextInput
                  style={s.textInput}
                  keyboardType="numeric"
                  value={comfortBalance}
                  onChangeText={setComfortBalance}
                  placeholder="500"
                  placeholderTextColor="#bbb"
                />
              </View>
              <Text style={s.inputNote}>on MoMo at all times</Text>
            </View>
            <View style={s.suggestions}>
              {[300, 500, 1000].map(a => (
                <TouchableOpacity
                  key={a}
                  style={[s.suggestChip, comfortBalance === String(a) && s.suggestChipActive]}
                  onPress={() => setComfortBalance(String(a))}
                >
                  <Text style={[s.suggestText, comfortBalance === String(a) && s.suggestTextActive]}>₵{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {comfortNum > 0 && (
              <View style={s.previewCard}>
                <Text style={s.previewText}>
                  If your MoMo reaches <Text style={s.previewBold}>₵{comfortNum + 500}</Text>, we'll move{' '}
                  <Text style={s.previewBold}>₵500</Text> to savings automatically.
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[s.primaryBtn, comfortNum < 1 && s.primaryBtnDisabled]}
              onPress={comfortNum >= 1 ? next : null}
            >
              <Text style={s.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Savings rule */}
        {current === 'rule' && (
          <View style={s.body}>
            <Text style={s.title}>How should we save for you?</Text>
            <Text style={s.subtitle}>Choose the style that fits how you work.</Text>
            {RULES.map(r => (
              <TouchableOpacity
                key={r.id}
                style={[s.ruleCard, rule === r.id && s.ruleCardActive]}
                onPress={() => setRule(r.id)}
              >
                <View style={s.ruleHeader}>
                  <Text style={s.ruleIcon}>{r.icon}</Text>
                  <View style={s.ruleMeta}>
                    <View style={s.ruleTitleRow}>
                      <Text style={[s.ruleTitle, rule === r.id && s.ruleTitleActive]}>{r.title}</Text>
                      {r.badge && <View style={s.badge}><Text style={s.badgeText}>{r.badge}</Text></View>}
                    </View>
                    <Text style={s.ruleDesc}>{r.desc}</Text>
                  </View>
                  <View style={[s.radioOuter, rule === r.id && s.radioOuterActive]}>
                    {rule === r.id && <View style={s.radioInner} />}
                  </View>
                </View>
                {r.id === 'weekly' && rule === 'weekly' && (
                  <View style={s.weeklyInput}>
                    <Text style={s.weeklyLabel}>Amount every Monday</Text>
                    <View style={s.amountInput}>
                      <Text style={s.currencySign}>₵</Text>
                      <TextInput
                        style={s.textInput}
                        keyboardType="numeric"
                        value={weeklyAmount}
                        onChangeText={setWeeklyAmount}
                        placeholder="100"
                        placeholderTextColor="#bbb"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Confirmation */}
        {current === 'confirm' && (
          <View style={s.body}>
            <View style={s.successCircle}>
              <Text style={s.successIcon}>⚡</Text>
            </View>
            <Text style={s.successTitle}>Smart Sweep is on!</Text>
            <Text style={s.subtitle}>Your overflow will quietly grow in Fido.</Text>
            <View style={s.summaryCard}>
              <SummaryRow label="Comfort balance" value={`₵${comfortBalance}`} />
              <SummaryRow label="Rule" value={
                rule === 'smart' ? 'Smart sweep' :
                rule === 'weekly' ? `Weekly ₵${weeklyAmount}` : 'Manual'
              } />
              <SummaryRow label="Interest rate" value="10% p.a." />
              <SummaryRow label="Withdraw" value="Anytime to MoMo" last />
            </View>
            <View style={s.noteCard}>
              <Text style={s.noteText}>
                ⚡ You can change or pause this anytime from Savings Hub settings.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={s.primaryBtnText}>Go to Savings Hub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={s.secondaryBtnText}>View my savings</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExampleRow({ step, text }) {
  return (
    <View style={s.exRow}>
      <View style={s.exStep}><Text style={s.exStepText}>{step}</Text></View>
      <Text style={s.exText}>{text}</Text>
    </View>
  );
}

function SummaryRow({ label, value, last }) {
  return (
    <View style={[s.summaryRow, !last && s.summaryBorder]}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
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
  exampleCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, gap: 12 },
  exampleTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  exRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  exStep: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#E91E8C',
    alignItems: 'center', justifyContent: 'center',
  },
  exStepText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  exText: { fontSize: 14, color: '#444', flex: 1, lineHeight: 20 },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F0FFF4', borderRadius: 12, padding: 14, marginBottom: 24,
  },
  benefitIcon: { fontSize: 20 },
  benefitText: { fontSize: 13, color: '#166534', flex: 1, fontWeight: '500' },
  inputCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 14, alignItems: 'center' },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 12 },
  amountInput: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E91E8C', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  currencySign: { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  textInput: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', minWidth: 80 },
  inputNote: { fontSize: 13, color: '#888', marginTop: 10 },
  suggestions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  suggestChip: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E0D0E8', backgroundColor: '#fff', alignItems: 'center',
  },
  suggestChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  suggestText: { fontSize: 14, fontWeight: '600', color: '#888' },
  suggestTextActive: { color: '#E91E8C' },
  previewCard: {
    backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  previewText: { fontSize: 13, color: '#1e40af', lineHeight: 20 },
  previewBold: { fontWeight: '700' },
  ruleCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 10, borderWidth: 1.5, borderColor: '#E0D0E8',
  },
  ruleCardActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  ruleHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ruleIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  ruleMeta: { flex: 1 },
  ruleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  ruleTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  ruleTitleActive: { color: '#E91E8C' },
  ruleDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  badge: { backgroundColor: '#E91E8C', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  weeklyInput: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#F0E0F0' },
  weeklyLabel: { fontSize: 13, color: '#666', marginBottom: 8 },
  primaryBtn: {
    backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 10,
  },
  primaryBtnDisabled: { backgroundColor: '#E0D0E8' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryBtn: {
    borderWidth: 2, borderColor: '#E91E8C', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#E91E8C' },
  successCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0F8',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16,
  },
  successIcon: { fontSize: 52 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  summaryBorder: { borderBottomWidth: 1, borderColor: '#F0E0F0' },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  noteCard: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  noteText: { fontSize: 13, color: '#92400E', lineHeight: 18 },
});
