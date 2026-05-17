import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

const WITHDRAW_OPTIONS = [
  {
    id: 'app',
    icon: '📱',
    title: 'Withdraw in app',
    desc: 'Fastest — usually 2–5 minutes to MoMo.',
    available: true,
  },
  {
    id: 'ussd',
    icon: '📶',
    title: 'USSD backup (*713#)',
    desc: 'Works without internet or the app.',
    available: true,
    badge: 'No data needed',
  },
  {
    id: 'support',
    icon: '💬',
    title: 'Call support',
    desc: 'Dial 0800-FIDO-1 anytime, 24/7.',
    available: true,
  },
];

const USSD_STEPS = [
  { step: '1', text: 'Dial *713#' },
  { step: '2', text: 'Select "Savings"' },
  { step: '3', text: 'Select "Withdraw"' },
  { step: '4', text: 'Enter amount' },
  { step: '5', text: 'Confirm with PIN' },
];

export default function OfflineSavingsScreen({ navigation }) {
  const [view, setView] = useState('main');

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => {
              if (view === 'main') navigation.goBack();
              else setView('main');
            }}
            style={s.backBtn}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            {view === 'main' ? 'USSD Withdrawal Backup' :
             view === 'ussd' ? 'USSD Withdrawal Guide' : 'Contact Support'}
          </Text>
        </View>

        {/* Main view */}
        {view === 'main' && (
          <View>
            <View style={s.trustBanner}>
              <Text style={s.trustBannerIcon}>🔓</Text>
              <View>
                <Text style={s.trustBannerTitle}>Your money is always accessible</Text>
                <Text style={s.trustBannerSub}>
                  Even if the app is down, you have 3 ways to withdraw.
                </Text>
              </View>
            </View>

            <Text style={s.sectionLabel}>How to withdraw</Text>
            {WITHDRAW_OPTIONS.map(o => (
              <TouchableOpacity
                key={o.id}
                style={s.optionCard}
                onPress={() => {
                  if (o.id === 'ussd') setView('ussd');
                  else if (o.id === 'support') setView('support');
                }}
              >
                <Text style={s.optIcon}>{o.icon}</Text>
                <View style={s.optMeta}>
                  <View style={s.optTitleRow}>
                    <Text style={s.optTitle}>{o.title}</Text>
                    {o.badge && <View style={s.optBadge}><Text style={s.optBadgeText}>{o.badge}</Text></View>}
                  </View>
                  <Text style={s.optDesc}>{o.desc}</Text>
                </View>
                <Text style={s.optArrow}>›</Text>
              </TouchableOpacity>
            ))}

            <View style={s.availabilityCard}>
              <Text style={s.availTitle}>Current status</Text>
              <StatusRow icon="🟢" label="App withdrawal" status="Available" />
              <StatusRow icon="🟢" label="USSD (*713#)" status="Available" />
              <StatusRow icon="🟢" label="Support line" status="Available 24/7" />
            </View>

            <View style={s.infoCard}>
              <Text style={s.infoTitle}>About USSD backup</Text>
              <Text style={s.infoBody}>
                The USSD system runs on a separate network from the app. Even during internet outages or app maintenance, *713# continues to work on any mobile network.
              </Text>
            </View>
          </View>
        )}

        {/* USSD guide */}
        {view === 'ussd' && (
          <View>
            <View style={s.ussdhero}>
              <Text style={s.ussdCode}>*713#</Text>
              <Text style={s.ussdTagline}>Works on any network · No internet needed</Text>
            </View>
            <Text style={s.sectionLabel}>Step-by-step</Text>
            <View style={s.stepsCard}>
              {USSD_STEPS.map(step => (
                <View key={step.step} style={s.stepRow}>
                  <View style={s.stepNum}>
                    <Text style={s.stepNumText}>{step.step}</Text>
                  </View>
                  <Text style={s.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
            <View style={s.ussdNote}>
              <Text style={s.ussdNoteTitle}>What you need</Text>
              <NoteRow text="Your registered phone number" />
              <NoteRow text="Your Fido PIN (set in app settings)" />
              <NoteRow text="Any mobile signal — no data needed" />
            </View>
            <View style={s.ussdTipCard}>
              <Text style={s.ussdTip}>
                💡 Tip: Set your Fido PIN before you need emergency access — you can set it now in app Settings.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => setView('main')}>
              <Text style={s.primaryBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Support view */}
        {view === 'support' && (
          <View>
            <Text style={s.bigIcon}>💬</Text>
            <Text style={s.title}>We're always here</Text>
            <Text style={s.subtitle}>Multiple ways to reach Fido support, day or night.</Text>
            <View style={s.supportOptions}>
              <SupportOption icon="📞" title="Call us" value="0800-FIDO-1" note="Free · 24/7" />
              <SupportOption icon="💬" title="In-app chat" value="Tap the chat icon" note="Usually under 5 minutes" />
              <SupportOption icon="📧" title="Email" value="support@fido.loans" note="Response within 24 hours" />
            </View>
            <View style={s.withdrawGuarantee}>
              <Text style={s.guaranteeTitle}>Our commitment</Text>
              <Text style={s.guaranteeBody}>
                If you are unable to access your funds through any channel, contact support immediately. We will manually process your withdrawal within 2 business hours.
              </Text>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => setView('main')}>
              <Text style={s.primaryBtnText}>Back to withdrawal options</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusRow({ icon, label, status }) {
  return (
    <View style={s.statusRow}>
      <Text style={s.statusIcon}>{icon}</Text>
      <Text style={s.statusLabel}>{label}</Text>
      <Text style={s.statusValue}>{status}</Text>
    </View>
  );
}

function NoteRow({ text }) {
  return (
    <View style={s.noteRow}>
      <Text style={s.noteDot}>•</Text>
      <Text style={s.noteText}>{text}</Text>
    </View>
  );
}

function SupportOption({ icon, title, value, note }) {
  return (
    <View style={s.supportOpt}>
      <Text style={s.supportIcon}>{icon}</Text>
      <View style={s.supportMeta}>
        <Text style={s.supportTitle}>{title}</Text>
        <Text style={s.supportValue}>{value}</Text>
        <Text style={s.supportNote}>{note}</Text>
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
  trustBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 20 },
  trustBannerIcon: { fontSize: 32 },
  trustBannerTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3 },
  trustBannerSub: { fontSize: 13, color: '#aaa', lineHeight: 17 },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, gap: 12 },
  optIcon: { fontSize: 26, width: 36, textAlign: 'center' },
  optMeta: { flex: 1 },
  optTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  optTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  optBadge: { backgroundColor: '#E91E8C', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  optBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  optDesc: { fontSize: 13, color: '#888', lineHeight: 17 },
  optArrow: { fontSize: 22, color: '#ccc', fontWeight: '300' },
  availabilityCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 14 },
  availTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderColor: '#F5E8F5' },
  statusIcon: { fontSize: 14, marginRight: 10 },
  statusLabel: { flex: 1, fontSize: 14, color: '#555' },
  statusValue: { fontSize: 13, fontWeight: '600', color: '#22C55E' },
  infoCard: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#BFDBFE' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 6 },
  infoBody: { fontSize: 13, color: '#3B82F6', lineHeight: 18 },
  ussdhero: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 20 },
  ussdCode: { fontSize: 48, fontWeight: '900', color: '#E91E8C', letterSpacing: 2, marginBottom: 8 },
  ussdTagline: { fontSize: 13, color: '#aaa', textAlign: 'center' },
  stepsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E91E8C', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  stepText: { fontSize: 15, color: '#333', fontWeight: '500' },
  ussdNote: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 14 },
  ussdNoteTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 10 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  noteDot: { fontSize: 16, color: '#E91E8C', lineHeight: 20 },
  noteText: { flex: 1, fontSize: 14, color: '#555', lineHeight: 20 },
  ussdTipCard: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  ussdTip: { fontSize: 13, color: '#78350F', lineHeight: 18 },
  supportOptions: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  supportOpt: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderBottomWidth: 1, borderColor: '#F5E8F5', gap: 14 },
  supportIcon: { fontSize: 24, marginTop: 2 },
  supportMeta: { flex: 1 },
  supportTitle: { fontSize: 13, color: '#888', marginBottom: 2 },
  supportValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  supportNote: { fontSize: 12, color: '#aaa' },
  withdrawGuarantee: { backgroundColor: '#F0FFF4', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#D1FAE5' },
  guaranteeTitle: { fontSize: 14, fontWeight: '700', color: '#166534', marginBottom: 6 },
  guaranteeBody: { fontSize: 13, color: '#166534', lineHeight: 18 },
  primaryBtn: { backgroundColor: '#E91E8C', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
