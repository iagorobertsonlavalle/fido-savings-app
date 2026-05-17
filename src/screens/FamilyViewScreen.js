import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const familyMembers = [
  {
    id: '1', name: 'Joy', initials: 'JO', goal: 'Inventory purchase', target: 2000,
    saved: 1020, color: '#E91E8C',
  },
  {
    id: '2', name: 'Kwame', initials: 'KW', goal: 'School fees', target: 1500,
    saved: 900, color: '#6C63FF',
  },
  {
    id: '3', name: 'Abena', initials: 'AB', goal: 'Emergency fund', target: 500,
    saved: 500, color: '#22C55E',
  },
];

function ProgressBar({ progress, color }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

function MemberCard({ member, visible }) {
  const progress = member.saved / member.target;
  const pct = Math.round(progress * 100);
  const done = pct >= 100;

  return (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={[styles.memberAvatar, { backgroundColor: member.color + '22' }]}>
          <Text style={[styles.memberInitials, { color: member.color }]}>{member.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberGoal}>{member.goal}</Text>
        </View>
        {done && <Text style={styles.doneBadge}>✓ Done</Text>}
      </View>
      {visible ? (
        <>
          <ProgressBar progress={progress} color={member.color} />
          <View style={styles.memberAmounts}>
            <Text style={styles.memberSaved}>₵{member.saved.toLocaleString()} saved</Text>
            <Text style={styles.memberTarget}>{pct}% of ₵{member.target.toLocaleString()}</Text>
          </View>
        </>
      ) : (
        <View style={styles.hiddenRow}>
          <Text style={styles.hiddenText}>Progress hidden by {member.name}</Text>
        </View>
      )}
    </View>
  );
}

export default function FamilyViewScreen({ navigation }) {
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const [shareMyProgress, setShareMyProgress] = useState(true);
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Family Savings</Text>
          <Text style={styles.subheading}>
            Save together, stay motivated. Opt-in to see your family's savings progress.
          </Text>
          <View style={styles.illustrationBox}>
            <Text style={styles.illustrationEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.illustrationCaption}>Your family is already saving!</Text>
            <Text style={styles.illustrationSub}>3 members • ₵2,420 saved combined</Text>
          </View>
          <View style={styles.featureList}>
            {[
              ['👁', 'See each other\'s goal progress (opt-in)'],
              ['🔒', 'You control what you share'],
              ['💬', 'Cheer each other on'],
              ['🎯', 'Set shared family goals'],
            ].map(([e, t]) => (
              <View key={t} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{e}</Text>
                <Text style={styles.featureText}>{t}</Text>
              </View>
            ))}
          </View>
          <PrimaryButton title="Join Family Savings" onPress={() => setJoined(true)} style={{ marginTop: 8, marginBottom: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Family Savings</Text>

        {/* Privacy toggles */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Your Privacy Settings</Text>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>See family progress</Text>
              <Text style={styles.toggleSub}>View your family's savings goals</Text>
            </View>
            <Switch
              value={sharingEnabled}
              onValueChange={setSharingEnabled}
              trackColor={{ true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Share my progress</Text>
              <Text style={styles.toggleSub}>Let family see your goals</Text>
            </View>
            <Switch
              value={shareMyProgress}
              onValueChange={setShareMyProgress}
              trackColor={{ true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Combined total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Family total saved</Text>
          <Text style={styles.totalAmount}>₵ 2,420</Text>
          <Text style={styles.totalSub}>Across 3 members · 3 active goals</Text>
        </View>

        <Text style={styles.sectionLabel}>Family Members</Text>
        {familyMembers.map((m) => (
          <MemberCard key={m.id} member={m} visible={sharingEnabled} />
        ))}

        <TouchableOpacity style={styles.inviteBtn}>
          <Text style={styles.inviteBtnText}>+ Invite a family member</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subheading: { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },
  illustrationBox: {
    backgroundColor: colors.white, borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  illustrationEmoji: { fontSize: 60, marginBottom: 12 },
  illustrationCaption: { fontSize: 18, fontWeight: '700', color: colors.text },
  illustrationSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  featureList: { marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureEmoji: { fontSize: 22, marginRight: 12 },
  featureText: { fontSize: 14, color: colors.text },
  privacyCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  privacyTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  toggleSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  totalCard: {
    backgroundColor: colors.primary, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20,
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  totalAmount: { fontSize: 32, fontWeight: '800', color: colors.white, marginVertical: 4 },
  totalSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
  memberCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  memberHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  memberAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  memberInitials: { fontSize: 16, fontWeight: '800' },
  memberName: { fontSize: 15, fontWeight: '700', color: colors.text },
  memberGoal: { fontSize: 12, color: colors.textSecondary },
  doneBadge: { fontSize: 12, fontWeight: '700', color: colors.success, backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  memberAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
  memberSaved: { fontSize: 13, fontWeight: '600', color: colors.text },
  memberTarget: { fontSize: 13, color: colors.textSecondary },
  hiddenRow: { backgroundColor: colors.background, borderRadius: 8, padding: 10, alignItems: 'center' },
  hiddenText: { fontSize: 13, color: colors.textLight, fontStyle: 'italic' },
  inviteBtn: {
    borderWidth: 2, borderColor: colors.primary, borderRadius: 20, paddingVertical: 14,
    alignItems: 'center', marginTop: 8, borderStyle: 'dashed',
  },
  inviteBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
