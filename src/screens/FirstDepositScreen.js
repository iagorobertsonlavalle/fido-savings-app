import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput
} from 'react-native';

const STEPS = ['intro', 'trust', 'purpose', 'amount', 'success'];

const PURPOSES = [
  { id: 'emergency', label: 'Emergency fund', icon: '🛡️' },
  { id: 'inventory', label: 'Business inventory', icon: '📦' },
  { id: 'school', label: 'School fees', icon: '📚' },
  { id: 'equipment', label: 'Equipment / tools', icon: '🔧' },
  { id: 'travel', label: 'Travel or event', icon: '✈️' },
  { id: 'rent', label: 'Rent or bills', icon: '🏠' },
  { id: 'other', label: 'Something else', icon: '💡' },
];

const AMOUNTS = [20, 50, 100, 200];

function monthlyInterest(amount) {
  return (amount * 0.10 / 12).toFixed(2);
}

export default function FirstDepositScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const current = STEPS[step];
  const finalAmount = useCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step === 0) navigation.goBack();
    else setStep(s => s - 1);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
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

        {/* Step: Intro */}
        {current === 'intro' && (
          <View style={s.body}>
            <Text style={s.bigIcon}>💰</Text>
            <Text style={s.title}>Start saving with Fido</Text>
            <Text style={s.subtitle}>
              Move money from MoMo into your Fido savings account. It earns 10% interest and you can withdraw anytime.
            </Text>
            <View style={s.highlights}>
              <HighlightRow icon="📈" text="10% interest per year — credited daily" />
              <HighlightRow icon="🔓" text="Withdraw to MoMo anytime" />
              <HighlightRow icon="💬" text="24/7 support via call, chat, or email" />
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>Get started</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={s.linkText}>Is my money safe?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Trust */}
        {current === 'trust' && (
          <View style={s.body}>
            <Text style={s.bigIcon}>🔐</Text>
            <Text style={s.title}>Your money stays accessible</Text>
            <Text style={s.subtitle}>
              We know trust matters. Here's exactly how your savings work.
            </Text>
            <View style={s.trustCard}>
              <TrustPoint icon="✅" title="Withdraw anytime" body="Move to MoMo in minutes, even nights and weekends." />
              <TrustPoint icon="💬" title="Support always available" body="Call 0800-FIDO-1 or chat in-app, any time of day." />
              <TrustPoint icon="🏦" title="Fido-held" body="Savings are held by Fido, licensed in Ghana." />
              <TrustPoint icon="💬" title="Support always available" body="In-app chat or call 0800-FIDO-1 anytime." />
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={next}>
              <Text style={s.primaryBtnText}>I'm in — let's continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Purpose */}
        {current === 'purpose' && (
          <View style={s.body}>
            <Text style={s.title}>What are you saving for?</Text>
            <Text style={s.subtitle}>This helps us personalize your experience.</Text>
            <View style={s.purposeGrid}>
              {PURPOSES.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[s.purposeChip, purpose === p.id && s.purposeChipActive]}
                  onPress={() => setPurpose(p.id)}
                >
                  <Text style={s.purposeIcon}>{p.icon}</Text>
                  <Text style={[s.purposeLabel, purpose === p.id && s.purposeLabelActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.primaryBtn, !purpose && s.primaryBtnDisabled]}
              onPress={purpose ? next : null}
            >
              <Text style={s.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Amount */}
        {current === 'amount' && (
          <View style={s.body}>
            <Text style={s.title}>How much do you want to save?</Text>
            <Text style={s.subtitle}>From MoMo. You can add more anytime.</Text>
            <View style={s.amountGrid}>
              {AMOUNTS.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[s.amountChip, !useCustom && selectedAmount === a && s.amountChipActive]}
                  onPress={() => { setSelectedAmount(a); setUseCustom(false); }}
                >
                  <Text style={[s.amountChipText, !useCustom && selectedAmount === a && s.amountChipTextActive]}>
                    ₵{a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.amountChip, s.customChip, useCustom && s.amountChipActive]}
              onPress={() => setUseCustom(true)}
            >
              <Text style={[s.amountChipText, useCustom && s.amountChipTextActive]}>Custom amount</Text>
            </TouchableOpacity>
            {useCustom && (
              <View style={s.customInput}>
                <Text style={s.currencySign}>₵</Text>
                <TextInput
                  style={s.textInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  autoFocus
                />
              </View>
            )}
            {finalAmount > 0 && (
              <View style={s.interestPreview}>
                <Text style={s.interestLabel}>Estimated monthly interest</Text>
                <Text style={s.interestValue}>+₵{monthlyInterest(finalAmount)}</Text>
                <Text style={s.interestNote}>Based on 10% p.a. — credited daily</Text>
              </View>
            )}
            <TouchableOpacity
              style={[s.primaryBtn, finalAmount < 1 && s.primaryBtnDisabled]}
              onPress={finalAmount >= 1 ? next : null}
            >
              <Text style={s.primaryBtnText}>Deposit ₵{finalAmount > 0 ? finalAmount : '—'} from MoMo</Text>
            </TouchableOpacity>
            <Text style={s.momoNote}>You'll confirm the MoMo push on your phone.</Text>
          </View>
        )}

        {/* Step: Success */}
        {current === 'success' && (
          <View style={s.body}>
            <View style={s.successCircle}>
              <Text style={s.successIcon}>🎉</Text>
            </View>
            <Text style={s.successTitle}>You saved ₵{finalAmount}!</Text>
            <Text style={s.subtitle}>Your money is in Fido and already earning interest.</Text>
            <View style={s.statsRow}>
              <StatBox label="Earning" value="10% p.a." />
              <StatBox label="Est. monthly" value={`+₵${monthlyInterest(finalAmount)}`} />
              <StatBox label="Withdraw" value="Anytime" />
            </View>
            <View style={s.autosaveCard}>
              <Text style={s.autosaveTitle}>Turn on auto-save</Text>
              <Text style={s.autosaveBody}>
                Set a weekly amount and Fido sweeps it automatically — no hassle.
              </Text>
              <TouchableOpacity style={s.autosaveBtn} onPress={() => navigation.navigate('MoMoOverflow')}>
                <Text style={s.autosaveBtnText}>Set up auto-save →</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={s.secondaryBtnText}>Go to Savings Hub</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HighlightRow({ icon, text }) {
  return (
    <View style={s.highlightRow}>
      <Text style={s.hlIcon}>{icon}</Text>
      <Text style={s.hlText}>{text}</Text>
    </View>
  );
}

function TrustPoint({ icon, title, body }) {
  return (
    <View style={s.trustPoint}>
      <Text style={s.tpIcon}>{icon}</Text>
      <View style={s.tpText}>
        <Text style={s.tpTitle}>{title}</Text>
        <Text style={s.tpBody}>{body}</Text>
      </View>
    </View>
  );
}

function StatBox({ label, value }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
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
  highlights: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, gap: 12 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hlIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  hlText: { fontSize: 14, color: '#333', flex: 1 },
  trustCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, gap: 16 },
  trustPoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tpIcon: { fontSize: 20, width: 28, textAlign: 'center', marginTop: 1 },
  tpText: { flex: 1 },
  tpTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 2 },
  tpBody: { fontSize: 13, color: '#666', lineHeight: 18 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  purposeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#fff',
    width: '47%',
  },
  purposeChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  purposeIcon: { fontSize: 18 },
  purposeLabel: { fontSize: 13, color: '#555', fontWeight: '500', flex: 1 },
  purposeLabelActive: { color: '#E91E8C', fontWeight: '600' },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  amountChip: {
    borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#fff',
    alignItems: 'center', width: '47%',
  },
  customChip: { width: '100%', marginBottom: 12 },
  amountChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  amountChipText: { fontSize: 18, fontWeight: '600', color: '#555' },
  amountChipTextActive: { color: '#E91E8C' },
  customInput: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E91E8C', borderRadius: 12,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
  },
  currencySign: { fontSize: 20, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  textInput: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1a1a2e' },
  interestPreview: {
    backgroundColor: '#F0FFF4', borderRadius: 12, padding: 16, marginBottom: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5',
  },
  interestLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  interestValue: { fontSize: 22, fontWeight: '700', color: '#22C55E', marginBottom: 2 },
  interestNote: { fontSize: 11, color: '#888' },
  momoNote: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 10 },
  primaryBtn: {
    backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginBottom: 12,
  },
  primaryBtnDisabled: { backgroundColor: '#E0D0E8' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryBtn: {
    borderWidth: 2, borderColor: '#E91E8C', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 8,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#E91E8C' },
  linkText: { fontSize: 14, color: '#E91E8C', textAlign: 'center', textDecorationLine: 'underline' },
  successCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0F8',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16,
  },
  successIcon: { fontSize: 52 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#EEE',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#E91E8C', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#888' },
  autosaveCard: {
    backgroundColor: '#1a1a2e', borderRadius: 16, padding: 18, marginBottom: 14,
  },
  autosaveTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 6 },
  autosaveBody: { fontSize: 13, color: '#ccc', lineHeight: 18, marginBottom: 14 },
  autosaveBtn: {
    backgroundColor: '#E91E8C', borderRadius: 10, paddingVertical: 12, alignItems: 'center',
  },
  autosaveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
