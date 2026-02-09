
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const ResultsScreen = ({ route, navigation }) => {
  const { analysisResult, inputData } = route.params;
  const [showReasonsModal, setShowReasonsModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const analysis = analysisResult?.analysis || {};
  const analysisData = analysis?.analysis_data || {};
  const matches = analysisData.match_analyses || [];
  const emotionalVerdict = analysisData.emotional_verdict || {};
  const geminiSummary = analysisData.gemini_summary || {};

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'LOW_RISK': return '#24ad0cff';
      case 'MEDIUM_RISK': return '#f59e0b';
      case 'HIGH_RISK': return '#ef4444';
      default: return '#666666';
    }
  };

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'LOW_RISK': return '💎';
      case 'MEDIUM_RISK': return '⚠️';
      case 'HIGH_RISK': return '🚨';
      default: return '❓';
    }
  };

  const openReasonsModal = (match) => {
    setSelectedMatch(match);
    setShowReasonsModal(true);
  };

  const handleNewAnalysis = () => {
    navigation.navigate('Analysis');
  };

  const renderMatchItem = ({ item, index }) => (
    <View style={[styles.matchCard, { borderLeftColor: getRiskColor(item.risk_level) }]}>
      <View style={styles.matchHeader}>
        <View style={styles.matchTeams}>
          <Text style={styles.homeTeam}>{item.home_team}</Text>
          <Text style={styles.vsText}>vs</Text>
          <Text style={styles.awayTeam}>{item.away_team}</Text>
        </View>
        <View style={styles.matchRisk}>
          <Text style={styles.riskEmoji}>{getRiskEmoji(item.risk_level)}</Text>
          <Text style={[styles.riskLevel, { color: getRiskColor(item.risk_level) }]}>
            {item.risk_level?.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.matchStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Risk Score</Text>
          <Text style={styles.statValue}>{item.risk_score}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statValue}>{item.confidence || (100 - item.risk_score)}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Recommendation</Text>
          <Text style={[styles.statValue, { color: getRiskColor(item.risk_level) }]}>
            {item.risk_level === 'HIGH_RISK' ? 'Avoid' : item.risk_level === 'MEDIUM_RISK' ? 'Caution' : 'Good'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.viewReasonsButton}
        onPress={() => openReasonsModal(item)}
      >
        <Text style={styles.viewReasonsText}>View Detailed Analysis</Text>
        <Icon name="info" size={16} color="#24ad0cff" />
      </TouchableOpacity>
    </View>
  );

  const renderReasonsModal = () => {
    if (!selectedMatch) return null;

    return (
      <Modal visible={showReasonsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.reasonsModal}>
            <View style={styles.reasonsHeader}>
              <TouchableOpacity onPress={() => setShowReasonsModal(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
              <Text style={styles.reasonsTitle}>Detailed Analysis</Text>
              <Text style={styles.reasonsSubtitle}>{selectedMatch.home_team} vs {selectedMatch.away_team}</Text>
            </View>

            <ScrollView style={styles.reasonsContent}>
              {/* Risk Overview */}
              <View style={styles.reasonSection}>
                <Text style={styles.sectionTitle}>Risk Assessment</Text>
                <View style={styles.riskOverview}>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(selectedMatch.risk_level) }]}>
                    <Text style={styles.riskBadgeText}>
                      {getRiskEmoji(selectedMatch.risk_level)} {selectedMatch.risk_level?.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={styles.riskScores}>
                    <Text style={styles.riskScore}>Risk Score: {selectedMatch.risk_score}%</Text>
                    <Text style={styles.confidenceScore}>Confidence: {selectedMatch.confidence || (100 - selectedMatch.risk_score)}%</Text>
                  </View>
                </View>
              </View>

              {/* Key Risk Factors */}
              {selectedMatch.risk_factors && selectedMatch.risk_factors.length > 0 && (
                <View style={styles.reasonSection}>
                  <Text style={styles.sectionTitle}>Key Risk Factors</Text>
                  {selectedMatch.risk_factors.map((factor, index) => (
                    <View key={index} style={styles.factorItem}>
                      <View style={[styles.factorIcon, { backgroundColor: factor.risk_impact > 0 ? '#1a1a1a' : '#0a1a0a' }]}>
                        <Icon 
                          name={factor.risk_impact > 0 ? "warning" : "check-circle"} 
                          size={16} 
                          color={factor.risk_impact > 0 ? '#ef4444' : '#24ad0cff'} 
                        />
                      </View>
                      <View style={styles.factorContent}>
                        <Text style={styles.factorTitle}>{factor.factor}</Text>
                        <Text style={styles.factorDescription}>{factor.description}</Text>
                        <Text style={[
                          styles.factorImpact,
                          { color: factor.risk_impact > 0 ? '#ef4444' : '#24ad0cff' }
                        ]}>
                          Impact: {factor.risk_impact > 0 ? '+' : ''}{factor.risk_impact} risk points
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Insights */}
              {selectedMatch.risk_insights && selectedMatch.risk_insights.length > 0 && (
                <View style={styles.reasonSection}>
                  <Text style={styles.sectionTitle}>AI Insights</Text>
                  {selectedMatch.risk_insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Icon name="lightbulb" size={16} color="#24ad0cff" style={styles.insightIcon} />
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Recommendation */}
              {selectedMatch.recommendation && (
                <View style={styles.reasonSection}>
                  <Text style={styles.sectionTitle}>Expert Recommendation</Text>
                  <View style={styles.recommendationBox}>
                    <Icon name="tips-and-updates" size={20} color={getRiskColor(selectedMatch.risk_level)} />
                    <Text style={styles.recommendationText}>{selectedMatch.recommendation}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.resultsHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.resultsTitleContainer}>
          <Text style={styles.resultsTitle}>Analysis Results</Text>
          <Text style={styles.resultsSubtitle}>Professional Betting Insights</Text>
        </View>
        {/* <View style={styles.headerBadge}>
          <Icon name="analytics" size={16} color="#24ad0cff" />
          <Text style={styles.headerBadgeText}>AI POWERED</Text>
        </View> */}
      </View>

      <ScrollView style={styles.resultsContent} showsVerticalScrollIndicator={false}>
        {/* Emotional Verdict */}
        {emotionalVerdict.type && (
          <View style={[styles.verdictCard, { borderLeftColor: emotionalVerdict.color === 'green' ? '#24ad0cff' : emotionalVerdict.color === 'orange' ? '#f59e0b' : '#ef4444' }]}>
            <Text style={styles.verdictType}>{emotionalVerdict.type}</Text>
            <Text style={styles.verdictMessage}>{emotionalVerdict.verdict}</Text>
            <Text style={styles.verdictDescription}>{emotionalVerdict.message}</Text>
            <View style={styles.verdictRecommendation}>
              <Icon name="tips-and-updates" size={16} color={emotionalVerdict.color === 'green' ? '#24ad0cff' : emotionalVerdict.color === 'orange' ? '#f59e0b' : '#ef4444'} />
              <Text style={styles.recommendationText}>{emotionalVerdict.recommendation}</Text>
            </View>
          </View>
        )}

        {/* Confidence Score */}
        <View style={styles.confidenceCard}>
          <View style={styles.confidenceHeader}>
            <Icon name="auto-awesome" size={24} color="#24ad0cff" />
            <Text style={[styles.confidenceTitle,{marginLeft:19}]}>AI CONFIDENCE SCORE</Text>
          </View>
          <View style={styles.confidenceScoreContainer}>
            <Text style={[styles.confidenceScore,{fontSize:30,marginBottom:10}]}>{analysis.confidence_score || analysisData.overall_confidence || 50}%</Text>
            <View style={styles.confidenceMeter}>
              <View style={[styles.confidenceFill, { width: `${analysis.confidence_score || analysisData.overall_confidence || 50}%` }]} />
            </View>
          </View>
          <Text style={styles.confidenceDescription}>
            {geminiSummary.summary || "Professional analysis based on multiple risk factors"}
          </Text>
        </View>

        {/* Match Analyses */}
        <View style={styles.matchesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Match Analysis</Text>
            <Text style={styles.matchCount}>({matches.length} matches)</Text>
          </View>
          <FlatList
            data={matches}
            renderItem={renderMatchItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Key Insights */}
        {geminiSummary.key_insights && (
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Icon name="insights" size={20} color="#24ad0cff" />
              <Text style={styles.insightsTitle}>Key Insights</Text>
            </View>
            {geminiSummary.key_insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Icon name="chevron-right" size={16} color="#24ad0cff" style={styles.insightBullet} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={[styles.actionButtons,{marginBottom:60}]}>
          <TouchableOpacity 
            style={styles.newScanButton}
            onPress={handleNewAnalysis}
          >
            <Icon name="autorenew" size={20} color="#000000" />
            <Text style={styles.newScanButtonText}>New Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share" size={20} color="#24ad0cff" />
            <Text style={styles.shareButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderReasonsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  
  // Results Header
  resultsHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#111111', 
    borderBottomWidth: 1, 
    borderBottomColor: '#222222' 
  },
  backButton: { 
    padding: 8, 
    marginRight: 16 
  },
  resultsTitleContainer: { 
    flex: 1 
  },
  resultsTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginBottom: 4 
  },
  resultsSubtitle: { 
    fontSize: 14, 
    color: '#888888' 
  },
  headerBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(36, 173, 12, 0.1)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.2)',
  },
  headerBadgeText: { 
    color: '#24ad0cff', 
    fontSize: 12, 
    fontWeight: '600', 
    marginLeft: 4 
  },
  resultsContent: { 
    flex: 1, 
    padding: 24 
  },
  
  // Verdict Card
  verdictCard: { 
    backgroundColor: '#111111', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20, 
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#222222',
  },
  verdictType: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginBottom: 8 
  },
  verdictMessage: { 
    fontSize: 16, 
    color: '#FFFFFF', 
    marginBottom: 8,
    fontWeight: '500',
  },
  verdictDescription: { 
    fontSize: 14, 
    color: '#888888', 
    marginBottom: 16, 
    lineHeight: 20 
  },
  verdictRecommendation: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#000000', 
    padding: 16, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  recommendationText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    marginLeft: 8, 
    flex: 1, 
    lineHeight: 20,
    fontWeight: '500',
  },
  
  // Confidence Card
  confidenceCard: { 
    backgroundColor: '#111111', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  confidenceHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  confidenceTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#24ad0cff', 
    marginLeft: 8 
  },
  confidenceScoreContainer: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  confidenceScore: { 
    fontSize: 48, 
    fontWeight: '700', 
    color: '#24ad0cff', 
    marginBottom: 16 
  },
  confidenceMeter: { 
    width: '100%', 
    height: 12, 
    backgroundColor: '#000000', 
    borderRadius: 6, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  confidenceFill: { 
    height: '100%', 
    backgroundColor: '#24ad0cff', 
    borderRadius: 6 
  },
  confidenceDescription: { 
    color: '#888888', 
    fontSize: 14, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  
  // Matches Section
  matchesSection: { 
    marginBottom: 20 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginRight: 8,
  },
  matchCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  matchCard: { 
    backgroundColor: '#111111', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 12, 
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#222222',
  },
  matchHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 16 
  },
  matchTeams: { 
    flex: 1, 
    marginRight: 12 
  },
  homeTeam: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 4,
  },
  vsText: { 
    color: '#666666', 
    fontSize: 12, 
    textAlign: 'center', 
    marginVertical: 2 
  },
  awayTeam: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600',
    marginTop: 4,
  },
  matchRisk: { 
    alignItems: 'center' 
  },
  riskEmoji: { 
    fontSize: 16, 
    marginBottom: 4 
  },
  riskLevel: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  matchStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#222222' 
  },
  statItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  statLabel: { 
    color: '#666666', 
    fontSize: 11, 
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  viewReasonsButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(36, 173, 12, 0.1)', 
    padding: 16, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.2)',
  },
  viewReasonsText: { 
    color: '#24ad0cff', 
    fontSize: 14, 
    fontWeight: '600', 
    marginRight: 8 
  },
  
  // Insights Card
  insightsCard: { 
    backgroundColor: '#111111', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  insightsHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  insightsTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#24ad0cff', 
    marginLeft: 8 
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222222',
  },
  insightBullet: {
    marginRight: 12,
    marginTop: 2,
  },
  insightText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  
  // Action Buttons
  actionButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  newScanButton: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: '#24ad0cff', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#24ad0cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  newScanButtonText: { 
    color: '#000000', 
    fontWeight: '700', 
    marginLeft: 8,
    fontSize: 16,
  },
  shareButton: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: '#111111', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  shareButtonText: { 
    color: '#24ad0cff', 
    fontWeight: '700', 
    marginLeft: 8,
    fontSize: 16,
  },
  
  // Reasons Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.95)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  reasonsModal: { 
    backgroundColor: '#111111', 
    borderRadius: 24, 
    width: '100%', 
    maxWidth: 500, 
    height: '90%',
    borderWidth: 1,
    borderColor: '#222222',
  },
  reasonsHeader: { 
    padding: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222222' 
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    zIndex: 1,
    padding: 4,
  },
  reasonsTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 8,
  },
  reasonsSubtitle: { 
    fontSize: 14, 
    color: '#888888', 
    textAlign: 'center' 
  },
  reasonsContent: { 
    flex: 1, 
    padding: 24 
  },
  
  // Reason Sections
  reasonSection: { 
    marginBottom: 32 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginBottom: 16 
  },
  riskOverview: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  riskBadge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginBottom: 16 
  },
  riskBadgeText: { 
    color: '#000000', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  riskScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskScore: { 
    color: '#ef4444', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  confidenceScore: { 
    color: '#24ad0cff', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  
  // Factor Items
  factorItem: { 
    flexDirection: 'row', 
    backgroundColor: '#000000', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  factorIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  factorContent: { 
    flex: 1 
  },
  factorTitle: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  factorDescription: { 
    color: '#888888', 
    fontSize: 13, 
    marginBottom: 4, 
    lineHeight: 18 
  },
  factorImpact: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  
  // Insight Items in Modal
  insightIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  
  // Recommendation Box
  recommendationBox: { 
    flexDirection: 'row', 
    backgroundColor: '#000000', 
    padding: 20, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
    alignItems: 'flex-start',
  },
});

export default ResultsScreen;