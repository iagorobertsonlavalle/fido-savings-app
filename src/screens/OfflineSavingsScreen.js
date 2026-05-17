import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

export default function OfflineSavingsScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Help & Support</Text>
        </View>

        <Text style={s.bigIcon}>💬</Text>
        <Text style={s.title}>We're always here</Text>
        <Text style={s.subtitle}>Multiple ways to reach Fido support, day or night.</Text>

        <View style={s.supportOptions}>
          <SupportOption icon="📞" title="Call us" value="0800-FIDO-1" note="Free · 24/7" />
          <SupportOption icon="💬" title="In-app chat" value="Tap the chat icon" note="Usually under 5 minutes" />
          <SupportOption icon="📧" title="Email" value="support@fido.loans" note="Response within 24 hours" last />
        </View>

        <View style={s.withdrawCard}>
          <Text style={s.withdrawTitle}>🔓  Need to withdraw?</Text>
          <Text style={s.withdrawBody}>
            Open the app, go to your savings balance, and tap Withdraw. Funds arrive in your MoMo wallet within minutes — including nights and weekends.
          </Text>
        </View>

        <View style={s.guaranteeCard}>
          <Text style={s.guaranteeTitle}>Our commitment</Text>
          <Text style={s.guaranteeBody}>
            If you're ever unable to access your funds, contact us immediately. We'll manually process your withdrawal within 2 business hours.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SupportOption({ icon, title, value, note, last }) {
  return (
    <View style={[s.supportOpt, !last && s.supportBorder]}>
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
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  supportOptions: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 16 },
  supportOpt: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 14 },
  supportBorder: { borderBottomWidth: 1, borderColor: '#F5E8F5' },
  supportIcon: { fontSize: 24, marginTop: 2 },
  supportMeta: { flex: 1 },
  supportTitle: { fontSize: 13, color: '#888', marginBottom: 2 },
  supportValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  supportNote: { fontSize: 12, color: '#aaa' },
  withdrawCard: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#BFDBFE' },
  withdrawTitle: { fontSize: 15, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
  withdrawBody: { fontSize: 13, color: '#3B82F6', lineHeight: 20 },
  guaranteeCard: { backgroundColor: '#F0FFF4', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#D1FAE5' },
  guaranteeTitle: { fontSize: 14, fontWeight: '700', color: '#166534', marginBottom: 6 },
  guaranteeBody: { fontSize: 13, color: '#166534', lineHeight: 18 },
});
