import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput,
} from 'react-native';

const MOMO_RATE = 0.02;

const HORIZONS = [
  { label: '6mo', months: 6 },
  { label: '1yr', months: 12 },
  { label: '3yr', months: 36 },
  { label: '5yr', months: 60 },
];

function fv(monthly, months, annualRate) {
  const r = annualRate / 12;
  if (r === 0 || months === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r);
}

function monthlyForGoal(target, months, annualRate) {
  const r = annualRate / 12;
  if (r === 0 || months === 0) return target / Math.max(months, 1);
  return (target * r) / (Math.pow(1 + r, months) - 1);
}

function fmt(n) {
  return Math.round(n).toLocaleString();
}

const CHART_H = 110;

export default function SavingsCalculatorScreen({ navigation }) {
  const [mode, setMode] = useState('contribution');
  const [monthly, setMonthly] = useState(150);
  const [goalAmount, setGoalAmount] = useState('');
  const [horizonIdx, setHorizonIdx] = useState(1);
  const [fidoRate, setFidoRate] = useState(10);

  const horizon = HORIZONS[horizonIdx];
  const fidoRateDecimal = fidoRate / 100;

  const goalNum = parseFloat(goalAmount) || 0;
  const effectiveMonthly = mode === 'contribution'
    ? monthly
    : (goalNum > 0 ? monthlyForGoal(goalNum, horizon.months, fidoRateDecimal) : 0);

  const fidoTotal   = fv(effectiveMonthly, horizon.months, fidoRateDecimal);
  const momoTotal   = fv(effectiveMonthly, horizon.months, MOMO_RATE);
  const principal   = effectiveMonthly * horizon.months;
  const fidoInterest = Math.max(0, fidoTotal - principal);
  const momoInterest = Math.max(0, momoTotal - principal);
  const advantage   = fidoTotal - momoTotal;
  const multiplier  = momoInterest > 0.5 ? Math.round(fidoInterest / momoInterest) : null;

  const chartPoints = Array.from({ length: 6 }, (_, i) => {
    const m = Math.max(1, Math.round((horizon.months / 6) * (i + 1)));
    return {
      label: m >= 12 ? `${Math.round(m / 12)}yr` : `${m}mo`,
      fido: fv(effectiveMonthly, m, fidoRateDecimal),
      momo: fv(effectiveMonthly, m, MOMO_RATE),
      principal: effectiveMonthly * m,
    };
  });

  const chartMax = Math.max(chartPoints[chartPoints.length - 1].fido, 1);
  const hasData  = effectiveMonthly > 0;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Savings Calculator</Text>
        </View>

        {/* Mode toggle */}
        <View style={s.modeToggle}>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'contribution' && s.modeBtnActive]}
            onPress={() => setMode('contribution')}
          >
            <Text style={[s.modeBtnText, mode === 'contribution' && s.modeBtnTextActive]}>
              What can I save?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'goal' && s.modeBtnActive]}
            onPress={() => setMode('goal')}
          >
            <Text style={[s.modeBtnText, mode === 'goal' && s.modeBtnTextActive]}>
              I have a goal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={s.inputCard}>
          {mode === 'contribution' ? (
            <>
              <Text style={s.inputCardLabel}>I can save each month</Text>
              <View style={s.stepper}>
                <TouchableOpacity
                  style={s.stepBtn}
                  onPress={() => setMonthly(m => Math.max(25, m - 25))}
                >
                  <Text style={s.stepBtnText}>−</Text>
                </TouchableOpacity>
                <View style={s.stepValueWrap}>
                  <Text style={s.stepCurrency}>₵</Text>
                  <Text style={s.stepAmount}>{monthly}</Text>
                </View>
                <TouchableOpacity
                  style={s.stepBtn}
                  onPress={() => setMonthly(m => m + 25)}
                >
                  <Text style={s.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={s.inputCardLabel}>I want to save</Text>
              <View style={s.goalInputRow}>
                <Text style={s.goalCurrency}>₵</Text>
                <TextInput
                  style={s.goalInput}
                  keyboardType="numeric"
                  placeholder="5,000"
                  placeholderTextColor="#bbb"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                  autoFocus
                />
              </View>
              {goalNum > 0 && (
                <View style={s.goalRequired}>
                  <Text style={s.goalRequiredLabel}>You'd need to save</Text>
                  <Text style={s.goalRequiredAmt}>₵{Math.ceil(effectiveMonthly)}/month</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Timeline */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Over how long?</Text>
          <View style={s.horizonRow}>
            {HORIZONS.map((h, i) => (
              <TouchableOpacity
                key={h.label}
                style={[s.horizonChip, horizonIdx === i && s.horizonChipActive]}
                onPress={() => setHorizonIdx(i)}
              >
                <Text style={[s.horizonText, horizonIdx === i && s.horizonTextActive]}>
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rate dials */}
        <View style={s.rateCard}>
          <View style={s.rateItem}>
            <Text style={s.rateLabel}>Fido rate</Text>
            <View style={s.rateStepper}>
              <TouchableOpacity
                style={s.rateBtn}
                onPress={() => setFidoRate(r => Math.max(1, parseFloat((r - 0.5).toFixed(1))))}
              >
                <Text style={s.rateBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.rateVal}>{fidoRate}%</Text>
              <TouchableOpacity
                style={s.rateBtn}
                onPress={() => setFidoRate(r => Math.min(20, parseFloat((r + 0.5).toFixed(1))))}
              >
                <Text style={s.rateBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={s.rateVs}>
            <Text style={s.rateVsText}>vs</Text>
          </View>
          <View style={s.rateItem}>
            <Text style={s.rateLabel}>MoMo rate</Text>
            <View style={s.rateStepper}>
              <Text style={s.rateVal}>2%</Text>
              <Text style={s.rateFixed}>fixed</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        {hasData && (
          <View style={s.chartCard}>
            <View style={s.chartLegend}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: '#E91E8C' }]} />
                <Text style={s.legendText}>Fido {fidoRate}%</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: '#94A3B8' }]} />
                <Text style={s.legendText}>MoMo 2%</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: 'rgba(233,30,140,0.3)', borderWidth: 1, borderColor: '#E91E8C' }]} />
                <Text style={s.legendText}>Principal</Text>
              </View>
            </View>

            <View style={s.chartArea}>
              {chartPoints.map((pt, i) => {
                const fidoH = Math.max(4, (pt.fido / chartMax) * CHART_H);
                const momoH = Math.max(4, (pt.momo / chartMax) * CHART_H);
                const fidoPH = Math.min(fidoH, (pt.principal / chartMax) * CHART_H);
                const fidoIH = fidoH - fidoPH;
                const momoPH = Math.min(momoH, (pt.principal / chartMax) * CHART_H);
                const momoIH = momoH - momoPH;
                return (
                  <View key={i} style={s.barGroup}>
                    <View style={[s.chartCol, { height: CHART_H }]}>
                      {/* Fido bar */}
                      <View style={{ height: fidoH, width: 14, justifyContent: 'flex-start', borderRadius: 3, overflow: 'hidden' }}>
                        <View style={{ height: fidoIH, backgroundColor: '#E91E8C' }} />
                        <View style={{ height: fidoPH, backgroundColor: 'rgba(233,30,140,0.3)' }} />
                      </View>
                      {/* MoMo bar */}
                      <View style={{ height: momoH, width: 14, justifyContent: 'flex-start', borderRadius: 3, overflow: 'hidden', marginLeft: 3 }}>
                        <View style={{ height: momoIH, backgroundColor: '#94A3B8' }} />
                        <View style={{ height: momoPH, backgroundColor: 'rgba(148,163,184,0.3)' }} />
                      </View>
                    </View>
                    <Text style={s.barLabel}>{pt.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Summary */}
        {hasData && (
          <>
            <View style={s.summaryRow}>
              <View style={[s.summaryBox, s.summaryBoxFido]}>
                <Text style={s.summaryBoxLabelFido}>Fido after {horizon.label}</Text>
                <Text style={s.summaryBoxValueFido}>₵{fmt(fidoTotal)}</Text>
                <Text style={s.summaryBoxSubFido}>+₵{fmt(fidoInterest)} interest</Text>
              </View>
              <View style={s.summaryBox}>
                <Text style={s.summaryBoxLabel}>MoMo after {horizon.label}</Text>
                <Text style={s.summaryBoxValue}>₵{fmt(momoTotal)}</Text>
                <Text style={s.summaryBoxSub}>+₵{fmt(momoInterest)} interest</Text>
              </View>
            </View>

            <View style={s.advantageBanner}>
              <Text style={s.advantageIcon}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.advantageTitle}>
                  ₵{fmt(advantage)} more with Fido
                </Text>
                <Text style={s.advantageSub}>
                  {multiplier
                    ? `That's ${multiplier}× more interest than MoMo`
                    : `Fido's ${fidoRate}% vs MoMo's 2% makes a big difference`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.ctaBtn}
              onPress={() => navigation.navigate('FirstDeposit')}
            >
              <Text style={s.ctaBtnText}>
                Start saving ₵{mode === 'contribution' ? monthly : Math.ceil(effectiveMonthly)}/month →
              </Text>
            </TouchableOpacity>

            <View style={s.disclaimer}>
              <Text style={s.disclaimerText}>
                Projections assume consistent monthly contributions and a fixed rate. Actual returns may vary.
              </Text>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#FDF0F8' },
  scroll: { padding: 20, paddingBottom: 50 },

  header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn:     { padding: 8, marginRight: 8 },
  backArrow:   { fontSize: 22, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },

  modeToggle: {
    flexDirection: 'row', backgroundColor: '#F0E0F0',
    borderRadius: 14, padding: 4, marginBottom: 18,
  },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  modeBtnText:   { fontSize: 14, fontWeight: '600', color: '#999' },
  modeBtnTextActive: { color: '#E91E8C' },

  inputCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  inputCardLabel: { fontSize: 14, color: '#666', marginBottom: 16 },

  stepper:       { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepBtn:       { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0F8', borderWidth: 1.5, borderColor: '#E91E8C', alignItems: 'center', justifyContent: 'center' },
  stepBtnText:   { fontSize: 22, fontWeight: '600', color: '#E91E8C', lineHeight: 26 },
  stepValueWrap: { flexDirection: 'row', alignItems: 'flex-end', minWidth: 100, justifyContent: 'center' },
  stepCurrency:  { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginBottom: 2, marginRight: 2 },
  stepAmount:    { fontSize: 42, fontWeight: '800', color: '#1a1a2e' },

  goalInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E91E8C', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 10, marginBottom: 12,
  },
  goalCurrency: { fontSize: 22, fontWeight: '700', color: '#E91E8C', marginRight: 8 },
  goalInput:    { fontSize: 28, fontWeight: '700', color: '#1a1a2e', minWidth: 120 },
  goalRequired: { backgroundColor: '#FFF0F8', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  goalRequiredLabel: { fontSize: 13, color: '#888' },
  goalRequiredAmt:   { fontSize: 16, fontWeight: '800', color: '#E91E8C' },

  section:      { marginBottom: 14 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 10 },
  horizonRow:   { flexDirection: 'row', gap: 8 },
  horizonChip:  { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0D0E8', backgroundColor: '#fff', alignItems: 'center' },
  horizonChipActive: { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  horizonText:  { fontSize: 14, fontWeight: '600', color: '#888' },
  horizonTextActive: { color: '#E91E8C' },

  rateCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
  },
  rateItem:    { flex: 1, alignItems: 'center' },
  rateLabel:   { fontSize: 12, color: '#888', marginBottom: 8, fontWeight: '500' },
  rateStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateBtn:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF0F8', borderWidth: 1, borderColor: '#E91E8C', alignItems: 'center', justifyContent: 'center' },
  rateBtnText: { fontSize: 18, fontWeight: '600', color: '#E91E8C', lineHeight: 22 },
  rateVal:     { fontSize: 20, fontWeight: '800', color: '#1a1a2e', minWidth: 48, textAlign: 'center' },
  rateFixed:   { fontSize: 11, color: '#aaa', marginLeft: 2 },
  rateVs:      { width: 30, alignItems: 'center' },
  rateVsText:  { fontSize: 13, color: '#bbb', fontWeight: '600' },

  chartCard:   { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  chartLegend: { flexDirection: 'row', gap: 14, marginBottom: 14, flexWrap: 'wrap' },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 10, height: 10, borderRadius: 5 },
  legendText:  { fontSize: 11, color: '#666' },

  chartArea: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barGroup:  { alignItems: 'center', flex: 1 },
  chartCol:  { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 },
  barLabel:  { fontSize: 9, color: '#999', marginTop: 4 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 1.5, borderColor: '#E0D0E8',
  },
  summaryBoxFido:    { borderColor: '#E91E8C', backgroundColor: '#FFF0F8' },
  summaryBoxLabel:   { fontSize: 11, color: '#888', marginBottom: 6 },
  summaryBoxLabelFido: { fontSize: 11, color: '#E91E8C', marginBottom: 6, fontWeight: '600' },
  summaryBoxValue:   { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginBottom: 3 },
  summaryBoxValueFido: { fontSize: 20, fontWeight: '800', color: '#E91E8C', marginBottom: 3 },
  summaryBoxSub:     { fontSize: 11, color: '#888' },
  summaryBoxSubFido: { fontSize: 11, color: '#E91E8C', fontWeight: '500' },

  advantageBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 16,
  },
  advantageIcon:  { fontSize: 28 },
  advantageTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 3 },
  advantageSub:   { fontSize: 12, color: '#aaa' },

  ctaBtn: {
    backgroundColor: '#E91E8C', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  disclaimer:     { paddingHorizontal: 4 },
  disclaimerText: { fontSize: 11, color: '#bbb', textAlign: 'center', lineHeight: 16 },
});
