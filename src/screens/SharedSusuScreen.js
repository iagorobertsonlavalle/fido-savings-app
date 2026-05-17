import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput
} from 'react-native';

const STEPS = ['intro', 'create', 'rules', 'dashboard'];

const FREQ_OPTIONS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

const GROUP_MEMBERS = [
  { name: 'Kwame A.', initials: 'KA', color: '#E91E8C', paid: true, amount: 100 },
  { name: 'Abena M.', initials: 'AM', color: '#6C63FF', paid: true, amount: 100 },
  { name: 'Kofi B.', initials: 'KB', color: '#22C55E', paid: false, amount: 0 },
  { name: 'Ama T.', initials: 'AT', color: '#F59E0B', paid: true, amount: 100 },
];

export default function SharedSusuScreen({ navigation }) {
  const [step, setStep] = useState('intro');
  const [groupName, setGroupName] = useState('');
  const [memberCount, setMemberCount] = useState('4');
  const [contribution, setContribution] = useState('100');
  const [freq, setFreq] = useState('weekly');

  const next = (s) => setStep(s);
  const back = () => {
    if (step === 'intro') navigation.goBack();
    else if (step === 'create') setStep('intro');
    else if (step === 'rules') setStep('create');
    else if (step === 'dashboard') setStep('rules');
  };

  const totalPot = parseInt(memberCount || 0) * parseInt(contribution || 0);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={back} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Shared Susu</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <Text style={s.bigIcon}>🤝</Text>
            <Text style={s.title}>Save together, win together</Text>
            <Text style={s.subtitle}>
              Start a digital susu group with friends, family, or your trading circle. Everyone commits — everyone benefits.
            </Text>
            <View style={s.featureList}>
              <FeatureRow icon="💰" text="Each member contributes a fixed amount on schedule" />
              <FeatureRow icon="🔄" text="Pot rotates to each member in turn" />
              <FeatureRow icon="📊" text="Full transparency — everyone sees contributions" />
              <FeatureRow icon="🔒" text="Rules set upfront. No surprises." />
            </View>
            <View style={s.existingGroupCard}>
              <Text style={s.existingTitle}>Join with code</Text>
              <Text style={s.existingDesc}>Have an invite code from a group admin?</Text>
              <TouchableOpacity style={s.joinBtn} onPress={() => next('dashboard')}>
                <Text style={s.joinBtnText}>Enter group code</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => next('create')}>
              <Text style={s.primaryBtnText}>Create a group</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Create group */}
        {step === 'create' && (
          <View>
            <Text style={s.sectionTitle}>Name your group</Text>
            <TextInput
              style={s.nameInput}
              placeholder="e.g. Market women circle"
              placeholderTextColor="#bbb"
              value={groupName}
              onChangeText={setGroupName}
            />
            <Text style={s.sectionTitle}>Number of members</Text>
            <View style={s.memberRow}>
              {[3, 4, 6, 8, 10].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[s.numberChip, memberCount === String(n) && s.numberChipActive]}
                  onPress={() => setMemberCount(String(n))}
                >
                  <Text style={[s.numberText, memberCount === String(n) && s.numberTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.sectionTitle}>Contribution per period</Text>
            <View style={s.amountInput}>
              <Text style={s.currencySign}>₵</Text>
              <TextInput
                style={s.textInput}
                keyboardType="numeric"
                value={contribution}
                onChangeText={setContribution}
                placeholder="100"
                placeholderTextColor="#bbb"
              />
            </View>
            {totalPot > 0 && (
              <View style={s.potPreview}>
                <Text style={s.potLabel}>Pot per round</Text>
                <Text style={s.potValue}>₵{totalPot}</Text>
                <Text style={s.potNote}>{memberCount} members × ₵{contribution}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[s.primaryBtn, !groupName && s.primaryBtnDisabled]}
              onPress={groupName ? () => next('rules') : null}
            >
              <Text style={s.primaryBtnText}>Set the rules</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Rules */}
        {step === 'rules' && (
          <View>
            <Text style={s.subtitle}>These rules apply to all members.</Text>
            <Text style={s.sectionTitle}>Contribution frequency</Text>
            {FREQ_OPTIONS.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[s.ruleOption, freq === f.id && s.ruleOptionActive]}
                onPress={() => setFreq(f.id)}
              >
                <Text style={[s.ruleLabel, freq === f.id && s.ruleLabelActive]}>{f.label}</Text>
                <View style={[s.radioOuter, freq === f.id && s.radioOuterActive]}>
                  {freq === f.id && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
            <View style={s.rulesSummary}>
              <Text style={s.rulesSummaryTitle}>Group rules</Text>
              <RuleRow label="Group name" value={groupName} />
              <RuleRow label="Members" value={memberCount} />
              <RuleRow label="Contribution" value={`₵${contribution} ${freq}`} />
              <RuleRow label="Pot size" value={`₵${totalPot}`} />
              <RuleRow label="Late payment" value="Grace period: 3 days" last />
            </View>
            <View style={s.warningNote}>
              <Text style={s.warningText}>
                ⚠️ Missing contributions are flagged to the group. Fido does not guarantee payouts for missed rounds.
              </Text>
            </View>
            <TouchableOpacity style={s.importBtn} onPress={() => {}}>
              <Text style={s.importBtnText}>📋  Import from contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn} onPress={() => next('dashboard')}>
              <Text style={s.primaryBtnText}>Create group & invite members</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dashboard */}
        {step === 'dashboard' && (
          <View>
            <View style={s.groupHeader}>
              <Text style={s.groupName}>Market women circle</Text>
              <View style={s.roundBadge}><Text style={s.roundBadgeText}>Round 2 of 4</Text></View>
            </View>
            <View style={s.statsRow}>
              <StatBox label="This round" value="₵400" />
              <StatBox label="Contributed" value="₵300" accent />
              <StatBox label="Next payout" value="Kofi B." />
            </View>
            <Text style={s.sectionTitle}>Member contributions</Text>
            {GROUP_MEMBERS.map(m => (
              <MemberRow key={m.name} member={m} />
            ))}
            <View style={s.rotationCard}>
              <Text style={s.rotationTitle}>Payout rotation</Text>
              <Text style={s.rotationDesc}>
                Contributions collected → pot sent to next member → repeat until everyone has received.
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

function FeatureRow({ icon, text }) {
  return (
    <View style={s.featureRow}>
      <Text style={s.featureIcon}>{icon}</Text>
      <Text style={s.featureText}>{text}</Text>
    </View>
  );
}

function RuleRow({ label, value, last }) {
  return (
    <View style={[s.ruleRowItem, !last && s.ruleRowBorder]}>
      <Text style={s.ruleRowLabel}>{label}</Text>
      <Text style={s.ruleRowValue}>{value}</Text>
    </View>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <View style={s.statBox}>
      <Text style={[s.statValue, accent && s.statAccent]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function MemberRow({ member }) {
  return (
    <View style={s.memberCard}>
      <View style={[s.avatar, { backgroundColor: member.color }]}>
        <Text style={s.avatarText}>{member.initials}</Text>
      </View>
      <Text style={s.memberName}>{member.name}</Text>
      <View style={[s.paidBadge, !member.paid && s.pendingBadge]}>
        <Text style={[s.paidText, !member.paid && s.pendingText]}>
          {member.paid ? `₵${member.amount} paid` : 'Pending'}
        </Text>
      </View>
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
  featureList: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  featureText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },
  existingGroupCard: { backgroundColor: '#F5F0FF', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E0D0FF' },
  existingTitle: { fontSize: 14, fontWeight: '700', color: '#6C63FF', marginBottom: 4 },
  existingDesc: { fontSize: 13, color: '#888', marginBottom: 12 },
  joinBtn: { borderWidth: 1.5, borderColor: '#6C63FF', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  joinBtnText: { fontSize: 14, fontWeight: '600', color: '#6C63FF' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12, marginTop: 4 },
  nameInput: { borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 12, padding: 14, fontSize: 16, color: '#1a1a2e', backgroundColor: '#fff', marginBottom: 18 },
  memberRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  numberChip: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0D0E8', backgroundColor: '#fff', alignItems: 'center' },
  numberChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  numberText: { fontSize: 16, fontWeight: '600', color: '#888' },
  numberTextActive: { color: '#E91E8C' },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E91E8C', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', marginBottom: 14 },
  currencySign: { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  textInput: { flex: 1, fontSize: 22, fontWeight: '700', color: '#1a1a2e' },
  potPreview: { backgroundColor: '#F0FFF4', borderRadius: 12, padding: 14, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5' },
  potLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  potValue: { fontSize: 26, fontWeight: '800', color: '#22C55E', marginBottom: 2 },
  potNote: { fontSize: 12, color: '#888' },
  ruleOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: '#E0D0E8' },
  ruleOptionActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  ruleLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#555' },
  ruleLabelActive: { color: '#E91E8C', fontWeight: '600' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  rulesSummary: { backgroundColor: '#fff', borderRadius: 14, padding: 4, marginTop: 12, marginBottom: 12 },
  rulesSummaryTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', padding: 14, paddingBottom: 8 },
  ruleRowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11 },
  ruleRowBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  ruleRowLabel: { fontSize: 13, color: '#888' },
  ruleRowValue: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  warningNote: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FDE68A' },
  warningText: { fontSize: 13, color: '#78350F', lineHeight: 18 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  groupName: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  roundBadge: { backgroundColor: '#E91E8C', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  roundBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 3 },
  statAccent: { color: '#E91E8C' },
  statLabel: { fontSize: 11, color: '#888' },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  memberName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#333' },
  paidBadge: { backgroundColor: '#F0FFF4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  pendingBadge: { backgroundColor: '#FFF7ED' },
  paidText: { fontSize: 12, fontWeight: '600', color: '#22C55E' },
  pendingText: { color: '#F59E0B' },
  rotationCard: { backgroundColor: '#F5F0FF', borderRadius: 14, padding: 14, marginTop: 4, marginBottom: 16, borderWidth: 1, borderColor: '#E0D0FF' },
  rotationTitle: { fontSize: 14, fontWeight: '700', color: '#6C63FF', marginBottom: 6 },
  rotationDesc: { fontSize: 13, color: '#555', lineHeight: 18 },
  primaryBtn: { backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 10 },
  primaryBtnDisabled: { backgroundColor: '#E0D0E8' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  importBtn: { borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginBottom: 10, backgroundColor: '#fff' },
  importBtnText: { fontSize: 14, fontWeight: '600', color: '#555' },
});
