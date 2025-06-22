import { QuizData, BusinessPath } from '../types';
import { businessPaths } from '../data/businessPaths';

export function calculateFitScore(pathId: string, data: QuizData): number {
  let score = 50; // Base score
  
  // Helper function to get value from new or legacy field
  const getValue = (newField: any, legacyField: any, defaultValue: any = 0) => {
    return newField !== undefined ? newField : (legacyField !== undefined ? legacyField : defaultValue);
  };

  // Income goal matching (20 points max)
  const incomeGoal = getValue(data.successIncomeGoal, data.incomeGoal, 1000);
  const timeToIncome = getValue(data.firstIncomeTimeline, data.timeToFirstIncome, '3-6-months');
  const budget = getValue(data.upfrontInvestment, data.startupBudget, 0);
  const timeCommitment = getValue(data.weeklyTimeCommitment, data.timeCommitment, 20);
  const techSkills = getValue(data.techSkillsRating, data.technologyComfort, 3);
  const selfMotivation = getValue(data.selfMotivationLevel, data.selfMotivation, 3);
  const riskTolerance = getValue(data.riskComfortLevel, data.riskTolerance, 3);
  
  if (pathId === 'content-creation-ugc') {
    if (incomeGoal <= 5000) score += 15;
    if (timeToIncome === '6-12-months' || timeToIncome === '1-year-plus' || timeToIncome === 'no-rush') score += 10;
    if (riskTolerance <= 2) score += 8;
    if (data.brandFaceComfort && data.brandFaceComfort >= 4) score += 10;
    if (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment >= 4) score += 8;
    if (data.socialMediaInterest && data.socialMediaInterest >= 4) score += 7;
  }
  
  if (pathId === 'youtube-automation') {
    if (incomeGoal >= 5000) score += 15;
    if (timeToIncome === '3-6-months' || timeToIncome === '6-12-months') score += 12;
    if (budget >= 500) score += 10;
    if (data.decisionMakingStyle === 'logical-process') score += 8;
    if (data.workCollaborationPreference === 'solo-only' || data.workCollaborationPreference === 'mostly-solo') score += 7;
    if (techSkills >= 4) score += 6;
  }
  
  if (pathId === 'local-service-arbitrage') {
    if (incomeGoal >= 2000 && incomeGoal <= 15000) score += 15;
    if (timeToIncome === 'under-1-month' || timeToIncome === '1-3-months') score += 15;
    if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 4) score += 12;
    if (data.clientCallsComfort === 'yes') score += 8;
    if (data.competitivenessLevel && data.competitivenessLevel >= 4) score += 7;
  }
  
  if (pathId === 'high-ticket-sales') {
    if (incomeGoal >= 5000) score += 18;
    if (timeToIncome === 'under-1-month' || timeToIncome === '1-3-months') score += 15;
    if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 4) score += 15;
    if (data.competitivenessLevel && data.competitivenessLevel >= 4) score += 10;
    if (data.clientCallsComfort === 'yes') score += 8;
    if (selfMotivation >= 4) score += 7;
  }
  
  if (pathId === 'app-saas-development') {
    if (incomeGoal >= 10000) score += 18;
    if (techSkills >= 4) score += 20;
    if (data.familiarTools?.includes('coding') || data.existingSkills?.includes('coding')) score += 15;
    if (data.decisionMakingStyle === 'logical-process') score += 10;
    if (data.workCollaborationPreference === 'solo-only' || data.workCollaborationPreference === 'mostly-solo') score += 8;
    if (timeCommitment >= 30) score += 6;
  }
  
  if (pathId === 'affiliate-marketing') {
    if (incomeGoal <= 10000) score += 15;
    if (timeToIncome === '3-6-months' || timeToIncome === '6-12-months' || timeToIncome === 'no-rush') score += 12;
    if (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment >= 3) score += 10;
    if (data.socialMediaInterest && data.socialMediaInterest >= 3) score += 8;
    if (data.workStylePreference === 'create-once-earn-passively') score += 7;
    if (selfMotivation >= 4) score += 5;
  }

  if (pathId === 'freelancing') {
    if (incomeGoal >= 1000 && incomeGoal <= 15000) score += 15;
    if (timeToIncome === 'under-1-month' || timeToIncome === '1-3-months') score += 12;
    if (data.workCollaborationPreference === 'solo-only' || data.workCollaborationPreference === 'mostly-solo') score += 10;
    if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 3) score += 8;
    if (selfMotivation >= 4) score += 7;
    if (budget <= 500) score += 6;
  }

  if (pathId === 'e-commerce-dropshipping') {
    if (incomeGoal >= 3000) score += 15;
    if (budget >= 500) score += 12;
    if (data.socialMediaInterest && data.socialMediaInterest >= 3) score += 10;
    if (techSkills >= 3) score += 8;
    if (data.physicalShippingOpenness === 'no') score -= 10; // Penalty for not wanting physical products
    if (timeCommitment >= 20) score += 6;
  }

  if (pathId === 'online-coaching-consulting') {
    if (incomeGoal >= 2000) score += 15;
    if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 4) score += 12;
    if (data.teachVsSolvePreference === 'teach' || data.teachVsSolvePreference === 'both') score += 10;
    if (data.brandFaceComfort && data.brandFaceComfort >= 4) score += 8;
    if (data.clientCallsComfort === 'yes') score += 7;
    if (data.meaningfulContributionImportance && data.meaningfulContributionImportance >= 4) score += 6;
  }

  if (pathId === 'print-on-demand') {
    if (incomeGoal <= 5000) score += 12;
    if (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment >= 4) score += 15;
    if (budget <= 500) score += 10;
    if (data.physicalShippingOpenness === 'no') score += 8; // POD doesn't require shipping
    if (data.workCollaborationPreference === 'solo-only' || data.workCollaborationPreference === 'mostly-solo') score += 7;
    if (data.socialMediaInterest && data.socialMediaInterest >= 3) score += 6;
  }

  if (pathId === 'virtual-assistant') {
    if (incomeGoal <= 5000) score += 15;
    if (timeToIncome === 'under-1-month' || timeToIncome === '1-3-months') score += 12;
    if (data.organizationLevel && data.organizationLevel >= 4) score += 10;
    if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 3) score += 8;
    if (budget <= 100) score += 7;
    if (techSkills >= 3) score += 6;
  }
  
  // Universal adjustments based on personality and preferences
  
  // Self-motivation impact (applies to all paths)
  if (selfMotivation >= 4) score += 8;
  if (selfMotivation <= 2) score -= 5;
  
  // Tech comfort impact
  if (techSkills <= 2) {
    if (pathId === 'content-creation-ugc' || pathId === 'youtube-automation' || pathId === 'app-saas-development') score -= 8;
  }
  if (techSkills >= 4) {
    score += 5; // Bonus for all digital paths
  }
  
  // Time commitment vs path requirements
  if (timeCommitment <= 10) {
    if (pathId === 'affiliate-marketing' || pathId === 'content-creation-ugc' || pathId === 'virtual-assistant') score += 10;
    if (pathId === 'app-saas-development') score -= 8;
  } else if (timeCommitment >= 40) {
    if (pathId === 'app-saas-development' || pathId === 'youtube-automation' || pathId === 'e-commerce-dropshipping') score += 10;
  }
  
  // Risk tolerance matching
  if (riskTolerance <= 2 && (pathId === 'affiliate-marketing' || pathId === 'virtual-assistant' || pathId === 'freelancing')) score += 8;
  if (riskTolerance >= 4 && (pathId === 'high-ticket-sales' || pathId === 'app-saas-development' || pathId === 'e-commerce-dropshipping')) score += 8;
  
  // Budget constraints
  if (budget === 0) {
    if (pathId === 'content-creation-ugc' || pathId === 'affiliate-marketing' || pathId === 'virtual-assistant' || pathId === 'freelancing') score += 10;
    if (pathId === 'e-commerce-dropshipping' || pathId === 'youtube-automation') score -= 10;
  }
  
  // Communication comfort
  if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment <= 2) {
    if (pathId === 'high-ticket-sales' || pathId === 'local-service-arbitrage' || pathId === 'online-coaching-consulting') score -= 10;
    if (pathId === 'affiliate-marketing' || pathId === 'youtube-automation' || pathId === 'print-on-demand') score += 6;
  }
  if (data.directCommunicationEnjoyment && data.directCommunicationEnjoyment >= 4) {
    if (pathId === 'high-ticket-sales' || pathId === 'local-service-arbitrage' || pathId === 'online-coaching-consulting') score += 6;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

export function generatePersonalizedPaths(data: QuizData): BusinessPath[] {
  const paths = businessPaths.map(path => ({
    ...path,
    fitScore: calculateFitScore(path.id, data)
  }));
  
  return paths.sort((a, b) => b.fitScore - a.fitScore);
}

export function getNextAdaptiveQuestion(currentStep: number, data: Partial<QuizData>): boolean {
  // Logic to determine if adaptive questions should be shown
  
  if (currentStep === 4 && data.upfrontInvestment && data.upfrontInvestment > 500) {
    return true; // Show inventory comfort question
  }
  
  if (currentStep === 12 && (data.familiarTools?.includes('canva') || (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment >= 4))) {
    return true; // Show digital content comfort question
  }
  
  return false;
}