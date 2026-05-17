import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

const VISIBILITY_OPTIONS = [
  { id: 'pct_only', label: 'Percentage only', desc: 'Friends see "60% toward goal" — not the amount.', icon: '📊' },
  { id: 'goal_name', label: 'Goal + percentage', desc: 'They see the goal name and progress %.', icon: '🎯' },
  { id: 'hidden', label: 'Private', desc: 'No one sees your progress. For you only.', icon: '🔒' },
];

export default function TrustedProgressScreen({ navigation }) {
  const [visibility, setVisibility] = useState('pct_only');
  const [shared, setShared] = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Trusted Progress</Text>
        </View>

        <Text style={s.subtitle}>
          Share your savings progress with people you trust — without revealing your balance.
        </Text>

        {/* Live preview card */}
        <View style={s.previewCard}>
          <Text style={s.previewLabel}>What your contact would see</Text>
          <View style={s.previewInner}>
            <Text style={s.previewName}>Kwame's progress</Text>
            {visibility !== 'hidden' && (
              <>
                {visibility === 'goal_name' && (
                  <Text style={s.previewGoal}>🛡️ Emergency fund</Text>
                )}
                <View style={s.previewBarWrap}>
                  <View style={s.previewBarFill} />
                </View>
                <Text style={s.previewPct}>60% toward goal</Text>
              </>
            )}
            {visibility === 'hidden' && (
              <Text style={s.previewHidden}>🔒 Progress is private</Text>
            )}
          </View>
        </View>

        {/* Visibility picker */}
        <Text style={s.sectionLabel}>What can contacts see?</Text>
        {VISIBILITY_OPTIONS.map(o => (
          <TouchableOpacity
            key={o.id}
            style={[s.optionCard, visibility === o.id && s.optionCardActive]}
            onPress={() => setVisibility(o.id)}
          >
            <Text style={s.optIcon}>{o.icon}</Text>
            <View style={s.optMeta}>
              <Text style={[s.optLabel, visibility === o.id && s.optLabelActive]}>{o.label}</Text>
              <Text style={s.optDesc}>{o.desc}</Text>
            </View>
            <View style={[s.radioOuter, visibility === o.id && s.radioOuterActive]}>
              {visibility === o.id && <View style={s.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Active goals to share */}
        <Text style={s.sectionLabel}>Choose a goal to share</Text>
        {[
          { id: 'emergency', label: '🛡️ Emergency fund', pct: 60 },
          { id: 'inventory', label: '📦 Business inventory', pct: 50 },
          { id: 'school', label: '📚 School fees', pct: 25 },
        ].map(g => (
          <View key={g.id} style={s.goalRow}>
            <Text style={s.goalName}>{g.label}</Text>
            <View style={s.goalBarWrap}>
              <View style={[s.goalBar, { width: `${g.pct}%` }]} />
            </View>
            <Text style={s.goalPct}>{g.pct}%</Text>
          </View>
        ))}

        <View style={s.privacyNote}>
          <Text style={s.privacyIcon}>🔐</Text>
          <Text style={s.privacyText}>
            Your actual balance and amount are never shared. Only the percentage you choose is visible.
          </Text>
        </View>

        <TouchableOpacity style={s.importBtn} onPress={() => {}}>
          <Text style={s.importBtnText}>📋  Import from contacts</Text>
        </TouchableOpacity>

        {!shared ? (
          <TouchableOpacity style={s.primaryBtn} onPress={() => setShared(true)}>
            <Text style={s.primaryBtnText}>Share via WhatsApp</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.sharedCard}>
            <Text style={s.sharedIcon}>✅</Text>
            <Text style={s.sharedTitle}>Link shared!</Text>
            <Text style={s.sharedDesc}>Your contact can view your progress — nothing more.</Text>
          </View>
        )}

        <TouchableOpacity style={s.linkBtn} onPress={() => setShared(true)}>
          <Text style={s.linkBtnText}>Copy shareable link instead</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8, marginRight: 8 },
  backArrow: { fontSize: 22, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 20 },
  previewCard: { backgroundColor: '#1a1a2e', borderRadius: 18, padding: 18, marginBottom: 20 },
  previewLabel: { fontSize: 11, color: '#888', marginBottom: 12, textAlign: 'center' },
  previewInner: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 },
  previewName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 10 },
  previewGoal: { fontSize: 13, color: '#ccc', marginBottom: 10 },
  previewBarWrap: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  previewBarFill: { width: '60%', height: 8, backgroundColor: '#E91E8C', borderRadius: 4 },
  previewPct: { fontSize: 13, color: '#aaa' },
  previewHidden: { fontSize: 14, color: '#888', fontStyle: 'italic' },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: '#E0D0E8', gap: 12 },
  optionCardActive: { borderColor: '#E91E8C', backgroundColor: '#FFF8FC' },
  optIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  optMeta: { flex: 1 },
  optLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 3 },
  optLabelActive: { color: '#E91E8C' },
  optDesc: { fontSize: 12, color: '#888', lineHeight: 17 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E8C' },
  goalRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, gap: 10 },
  goalName: { fontSize: 13, fontWeight: '500', color: '#333', width: 120 },
  goalBarWrap: { flex: 1, height: 6, backgroundColor: '#F0E0F0', borderRadius: 3, overflow: 'hidden' },
  goalBar: { height: 6, backgroundColor: '#E91E8C', borderRadius: 3 },
  goalPct: { fontSize: 13, fontWeight: '600', color: '#E91E8C', width: 34, textAlign: 'right' },
  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginBottom: 20, gap: 10, borderWidth: 1, borderColor: '#BFDBFE' },
  privacyIcon: { fontSize: 18 },
  privacyText: { flex: 1, fontSize: 13, color: '#1e40af', lineHeight: 18 },
  primaryBtn: { backgroundColor: '#25D366', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  importBtn: { borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginBottom: 10, backgroundColor: '#fff' },
  importBtnText: { fontSize: 14, fontWeight: '600', color: '#555' },
  linkBtn: { borderWidth: 1.5, borderColor: '#E0D0E8', borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  linkBtnText: { fontSize: 14, fontWeight: '600', color: '#888' },
  sharedCard: { backgroundColor: '#F0FFF4', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#D1FAE5' },
  sharedIcon: { fontSize: 32, marginBottom: 8 },
  sharedTitle: { fontSize: 17, fontWeight: '700', color: '#166534', marginBottom: 4 },
  sharedDesc: { fontSize: 13, color: '#4ADE80', textAlign: 'center' },
});
