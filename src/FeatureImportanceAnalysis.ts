
  
import { FeatureImportanceAnalysis as FeatureImportanceAnalysisType } from './generated/typegraphql-prisma/models/FeatureImportanceAnalysis';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the FeatureImportanceAnalysis model.
   */

  const selectionSet = `
    
  id
  modelVersionId
  modelVersion {
    id
    modelName
    version
    status
    parentVersionId
    parentVersion {
id
    }
    childVersions {
id
    }
    artifacts {
      id
      modelVersionId
      modelArtifactId
      modelArtifact {
        id
        modelName
        version
        artifactType
        storageUrl
        storageProvider
        fileSize
        checksum
        compressionType
        metadataFramework
        metadataPythonVersion
        metadataDependencies
        metadataTrainingDate
        metadataDatasetSize
        metadataHyperparameters
        createdAt
        updatedAt
      }
      createdAt
    }
    performanceAccuracy
    performancePrecision
    performanceRecall
    performanceF1Score
    performanceAuc
    performanceSharpeRatio
    performanceMaxDrawdown
    performanceWinRate
    performanceAvgReturn
    performanceCalibrationScore
    performanceStabilityScore
    validationCrossValidationScore
    validationOutOfSamplePerformance
    validationBacktestResults
    validationStatTestResults
    deploymentEnvironment
    deploymentTrafficAllocation
    deploymentRolloutStrategy
    deploymentHealthCheckConfig
    trainingStartTime
    trainingEndTime
    trainingDuration
    trainingDatasetSize
    trainingFeaturesUsed
    trainingHyperparameters
    trainingResourcePeakMemoryMB
    trainingResourceTotalCpuHours
    trainingResourceGpuHours
    createdAt
    updatedAt
    deployedAt
    deprecatedAt
  }
  analysisType
  featureImportances
  globalImportance
  localImportance
  analysisMetadataSampleSize
  analysisMetadataBaselineAccuracy
  analysisMetadataAnalysisDate
  analysisMetadataComputationTime
  analysisMetadataAnalysisParameters
  insightsTopFeatures
  insightsRedundantFeatures
  insightsUnexpectedImportances
  insightsStabilityScore
  insightsRecommendations
  createdAt
  updatedAt

  `;

  export const FeatureImportanceAnalysis = {

    /**
     * Create a new FeatureImportanceAnalysis record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created FeatureImportanceAnalysis or null.
     */

    /**
     * Create a new FeatureImportanceAnalysis record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created FeatureImportanceAnalysis or null.
     */
    async create(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<FeatureImportanceAnalysisType> {
      // Maximum number of retries for database connection issues
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let lastError: unknown = null;

      // Retry loop to handle potential database connection issues
      while (retryCount < MAX_RETRIES) {
        try {
          const [modules, client] = await Promise.all([
            getApolloModules(),
            globalClient
              ? Promise.resolve(globalClient)
              : getApolloClient()
          ]);

          const { gql, ApolloError } = modules;

          const CREATE_ONE_FEATUREIMPORTANCEANALYSIS = gql`
              mutation createOneFeatureImportanceAnalysis($data: FeatureImportanceAnalysisCreateInput!) {
                createOneFeatureImportanceAnalysis(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                analysisType: props.analysisType !== undefined ? props.analysisType : undefined,
  featureImportances: props.featureImportances !== undefined ? props.featureImportances : undefined,
  globalImportance: props.globalImportance !== undefined ? props.globalImportance : undefined,
  localImportance: props.localImportance !== undefined ? props.localImportance : undefined,
  analysisMetadataSampleSize: props.analysisMetadataSampleSize !== undefined ? props.analysisMetadataSampleSize : undefined,
  analysisMetadataBaselineAccuracy: props.analysisMetadataBaselineAccuracy !== undefined ? props.analysisMetadataBaselineAccuracy : undefined,
  analysisMetadataAnalysisDate: props.analysisMetadataAnalysisDate !== undefined ? props.analysisMetadataAnalysisDate : undefined,
  analysisMetadataComputationTime: props.analysisMetadataComputationTime !== undefined ? props.analysisMetadataComputationTime : undefined,
  analysisMetadataAnalysisParameters: props.analysisMetadataAnalysisParameters !== undefined ? props.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: props.insightsTopFeatures !== undefined ? props.insightsTopFeatures : undefined,
  insightsRedundantFeatures: props.insightsRedundantFeatures !== undefined ? props.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: props.insightsUnexpectedImportances !== undefined ? props.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: props.insightsStabilityScore !== undefined ? props.insightsStabilityScore : undefined,
  insightsRecommendations: props.insightsRecommendations !== undefined ? props.insightsRecommendations : undefined,
  modelVersion: props.modelVersion ? 
    typeof props.modelVersion === 'object' && Object.keys(props.modelVersion).length === 1 && Object.keys(props.modelVersion)[0] === 'id'
    ? { connect: {
        id: props.modelVersion.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.modelVersion.id !== undefined ? props.modelVersion.id : undefined,
        status: props.modelVersion.status !== undefined ? {
            equals: props.modelVersion.status 
           } : undefined,
      },
      create: {
        modelName: props.modelVersion.modelName !== undefined ? props.modelVersion.modelName : undefined,
        version: props.modelVersion.version !== undefined ? props.modelVersion.version : undefined,
        status: props.modelVersion.status !== undefined ? props.modelVersion.status : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? props.modelVersion.performanceAccuracy : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? props.modelVersion.performancePrecision : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? props.modelVersion.performanceRecall : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? props.modelVersion.performanceF1Score : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? props.modelVersion.performanceAuc : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? props.modelVersion.performanceSharpeRatio : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.performanceMaxDrawdown : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? props.modelVersion.performanceWinRate : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? props.modelVersion.performanceAvgReturn : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? props.modelVersion.performanceCalibrationScore : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? props.modelVersion.performanceStabilityScore : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? props.modelVersion.validationCrossValidationScore : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? props.modelVersion.deploymentEnvironment : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.deploymentTrafficAllocation : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.deploymentRolloutStrategy : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? props.modelVersion.trainingStartTime : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? props.modelVersion.trainingEndTime : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? props.modelVersion.trainingDuration : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? props.modelVersion.trainingDatasetSize : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.trainingResourcePeakMemoryMB : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.trainingResourceTotalCpuHours : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.trainingResourceGpuHours : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? props.modelVersion.deployedAt : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? props.modelVersion.deprecatedAt : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
          id: props.modelVersion.parentVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.id : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status 
             } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
      Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 &&  props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.childVersions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
      Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 &&  props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.artifacts.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId 
             } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId 
             } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 &&  props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsControl.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsTreatment.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_FEATUREIMPORTANCEANALYSIS,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneFeatureImportanceAnalysis) {
            return response.data.createOneFeatureImportanceAnalysis;
          } else {
            return null as unknown as FeatureImportanceAnalysisType;
          }
        } catch (caughtError: unknown) {
          const error = caughtError as Error & { networkError?: { message?: string } };
          lastError = error;

          // Check for constraint violations FIRST - these are NEVER retryable
          const isConstraintViolation =
            error.message?.includes('violates check constraint') ||
            error.message?.includes('violates unique constraint') ||
            error.message?.includes('violates foreign key constraint') ||
            error.message?.includes('unique constraint') ||
            error.message?.includes('23514') ||
            error.message?.includes('23505') ||
            error.message?.includes('P2002') ||
            error.message?.includes('P2003');

          if (isConstraintViolation) {
            const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
            logger.error("Non-retryable constraint violation in createOneFeatureImportanceAnalysis", {
              operation: 'createOneFeatureImportanceAnalysis',
              model: 'FeatureImportanceAnalysis',
              error: String(error),
              constraintName: constraintMatch ? constraintMatch[1] : undefined,
              errorCategory: 'CONSTRAINT_VIOLATION',
              isRetryable: false,
            });
            throw error;
          }

          // Check if this is a database connection error that we should retry.
          // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
          // pool exhaustion, and transient gateway statuses. Must stay consistent
          // with the transient classifier in client.ts (onError link + enqueueOperation).
          const isConnectionError =
            error.message?.includes('Server has closed the connection') ||
            error.message?.includes('Cannot reach database server') ||
            error.message?.includes('Connection timed out') ||
            error.message?.includes('aborted due to timeout') ||
            error.message?.includes('TimeoutError') ||
            error.message?.includes('fetch failed') ||
            error.message?.includes('socket hang up') ||
            error.message?.includes('ECONNRESET') ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('Connection pool timeout') ||
            error.message?.includes('P2024') ||
            error.message?.includes('status code 408') ||
            error.message?.includes('status code 502') ||
            error.message?.includes('status code 503') ||
            error.message?.includes('status code 504') ||
            error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
            (error.networkError && (
              error.networkError.message?.includes('Failed to fetch') ||
              error.networkError.message?.includes('fetch failed') ||
              error.networkError.message?.includes('aborted due to timeout') ||
              error.networkError.message?.includes('TimeoutError')
            ));

          if (isConnectionError && retryCount < MAX_RETRIES - 1) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
            logger.warn("Database connection error in createOneFeatureImportanceAnalysis, retrying...", {
              operation: 'createOneFeatureImportanceAnalysis',
              model: 'FeatureImportanceAnalysis',
              attempt: retryCount,
              maxRetries: MAX_RETRIES,
            });
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          // Log structured error details and rethrow.
          // Demote transient failures to WARN with explicit transient+recoveryHint
          // metadata so log analytics can distinguish recoverable upstream retries
          // from true defects.
          if (isConnectionError) {
            logger.warn("Database create operation failed (transient after retries)", {
              operation: 'createOneFeatureImportanceAnalysis',
              model: 'FeatureImportanceAnalysis',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneFeatureImportanceAnalysis',
              model: 'FeatureImportanceAnalysis',
              error: String(error),
              isRetryable: false,
            });
          }
          throw error;
        }
      }

      // If we exhausted retries, throw the last error
      throw lastError;
    },

  /**
   * Create multiple FeatureImportanceAnalysis records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of FeatureImportanceAnalysis objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: FeatureImportanceAnalysisType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const CREATE_MANY_FEATUREIMPORTANCEANALYSIS = gql`
          mutation createManyFeatureImportanceAnalysis($data: [FeatureImportanceAnalysisCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyFeatureImportanceAnalysis(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      modelVersionId: prop.modelVersionId !== undefined ? prop.modelVersionId : undefined,
  analysisType: prop.analysisType !== undefined ? prop.analysisType : undefined,
  featureImportances: prop.featureImportances !== undefined ? prop.featureImportances : undefined,
  globalImportance: prop.globalImportance !== undefined ? prop.globalImportance : undefined,
  localImportance: prop.localImportance !== undefined ? prop.localImportance : undefined,
  analysisMetadataSampleSize: prop.analysisMetadataSampleSize !== undefined ? prop.analysisMetadataSampleSize : undefined,
  analysisMetadataBaselineAccuracy: prop.analysisMetadataBaselineAccuracy !== undefined ? prop.analysisMetadataBaselineAccuracy : undefined,
  analysisMetadataAnalysisDate: prop.analysisMetadataAnalysisDate !== undefined ? prop.analysisMetadataAnalysisDate : undefined,
  analysisMetadataComputationTime: prop.analysisMetadataComputationTime !== undefined ? prop.analysisMetadataComputationTime : undefined,
  analysisMetadataAnalysisParameters: prop.analysisMetadataAnalysisParameters !== undefined ? prop.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: prop.insightsTopFeatures !== undefined ? prop.insightsTopFeatures : undefined,
  insightsRedundantFeatures: prop.insightsRedundantFeatures !== undefined ? prop.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: prop.insightsUnexpectedImportances !== undefined ? prop.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: prop.insightsStabilityScore !== undefined ? prop.insightsStabilityScore : undefined,
  insightsRecommendations: prop.insightsRecommendations !== undefined ? prop.insightsRecommendations : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyFeatureImportanceAnalysis) {
          return response.data.createManyFeatureImportanceAnalysis;
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.warn("Duplicate key in createManyFeatureImportanceAnalysis (expected during overlapping fetches)", {
            operation: 'createManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in createManyFeatureImportanceAnalysis, retrying...", {
            operation: 'createManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update a single FeatureImportanceAnalysis record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated FeatureImportanceAnalysis or null.
   */
  async update(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<FeatureImportanceAnalysisType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_ONE_FEATUREIMPORTANCEANALYSIS = gql`
          mutation updateOneFeatureImportanceAnalysis($data: FeatureImportanceAnalysisUpdateInput!, $where: FeatureImportanceAnalysisWhereUniqueInput!) {
            updateOneFeatureImportanceAnalysis(data: $data, where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
      },
          data: {
      id: props.id !== undefined ? {
            set: props.id 
           } : undefined,
  analysisType: props.analysisType !== undefined ? {
            set: props.analysisType 
           } : undefined,
  featureImportances: props.featureImportances !== undefined ? props.featureImportances : undefined,
  globalImportance: props.globalImportance !== undefined ? props.globalImportance : undefined,
  localImportance: props.localImportance !== undefined ? props.localImportance : undefined,
  analysisMetadataSampleSize: props.analysisMetadataSampleSize !== undefined ? {
            set: props.analysisMetadataSampleSize 
           } : undefined,
  analysisMetadataBaselineAccuracy: props.analysisMetadataBaselineAccuracy !== undefined ? {
            set: props.analysisMetadataBaselineAccuracy 
           } : undefined,
  analysisMetadataAnalysisDate: props.analysisMetadataAnalysisDate !== undefined ? {
            set: props.analysisMetadataAnalysisDate 
           } : undefined,
  analysisMetadataComputationTime: props.analysisMetadataComputationTime !== undefined ? {
            set: props.analysisMetadataComputationTime 
           } : undefined,
  analysisMetadataAnalysisParameters: props.analysisMetadataAnalysisParameters !== undefined ? props.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: props.insightsTopFeatures !== undefined ? props.insightsTopFeatures : undefined,
  insightsRedundantFeatures: props.insightsRedundantFeatures !== undefined ? props.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: props.insightsUnexpectedImportances !== undefined ? props.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: props.insightsStabilityScore !== undefined ? {
            set: props.insightsStabilityScore 
           } : undefined,
  insightsRecommendations: props.insightsRecommendations !== undefined ? props.insightsRecommendations : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  modelVersion: props.modelVersion ? 
  typeof props.modelVersion === 'object' && Object.keys(props.modelVersion).length === 1 && (Object.keys(props.modelVersion)[0] === 'id' || Object.keys(props.modelVersion)[0] === 'symbol')
? {
  connect: {
    id: props.modelVersion.id
  }
} : { upsert: {
      where: {
        id: props.modelVersion.id !== undefined ? {
            equals: props.modelVersion.id
          } : undefined,
        status: props.modelVersion.status !== undefined ? {
            equals: props.modelVersion.status
          } : undefined,
        parentVersionId: props.modelVersion.parentVersionId !== undefined ? {
            equals: props.modelVersion.parentVersionId
          } : undefined,
      },
      update: {
        id: props.modelVersion.id !== undefined ? {
            set: props.modelVersion.id
          } : undefined,
        modelName: props.modelVersion.modelName !== undefined ? {
            set: props.modelVersion.modelName
          } : undefined,
        version: props.modelVersion.version !== undefined ? {
            set: props.modelVersion.version
          } : undefined,
        status: props.modelVersion.status !== undefined ? {
            set: props.modelVersion.status
          } : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? {
            set: props.modelVersion.performanceAccuracy
          } : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? {
            set: props.modelVersion.performancePrecision
          } : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? {
            set: props.modelVersion.performanceRecall
          } : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? {
            set: props.modelVersion.performanceF1Score
          } : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? {
            set: props.modelVersion.performanceAuc
          } : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? {
            set: props.modelVersion.performanceSharpeRatio
          } : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? {
            set: props.modelVersion.performanceMaxDrawdown
          } : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? {
            set: props.modelVersion.performanceWinRate
          } : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? {
            set: props.modelVersion.performanceAvgReturn
          } : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? {
            set: props.modelVersion.performanceCalibrationScore
          } : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? {
            set: props.modelVersion.performanceStabilityScore
          } : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? {
            set: props.modelVersion.validationCrossValidationScore
          } : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? {
            set: props.modelVersion.deploymentEnvironment
          } : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? {
            set: props.modelVersion.deploymentTrafficAllocation
          } : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? {
            set: props.modelVersion.deploymentRolloutStrategy
          } : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? {
            set: props.modelVersion.trainingStartTime
          } : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? {
            set: props.modelVersion.trainingEndTime
          } : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? {
            set: props.modelVersion.trainingDuration
          } : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? {
            set: props.modelVersion.trainingDatasetSize
          } : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
            set: props.modelVersion.trainingResourcePeakMemoryMB
          } : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
            set: props.modelVersion.trainingResourceTotalCpuHours
          } : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? {
            set: props.modelVersion.trainingResourceGpuHours
          } : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? {
            set: props.modelVersion.deployedAt
          } : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? {
            set: props.modelVersion.deprecatedAt
          } : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
    typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && (Object.keys(props.modelVersion.parentVersion)[0] === 'id' || Object.keys(props.modelVersion.parentVersion)[0] === 'symbol')
? {
    connect: {
      id: props.modelVersion.parentVersion.id
    }
} : { upsert: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? {
              equals: props.modelVersion.parentVersion.id
            } : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status
            } : undefined,
          parentVersionId: props.modelVersion.parentVersion.parentVersionId !== undefined ? {
              equals: props.modelVersion.parentVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: props.modelVersion.parentVersion.id !== undefined ? {
              set: props.modelVersion.parentVersion.id
            } : undefined,
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? {
              set: props.modelVersion.parentVersion.modelName
            } : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? {
              set: props.modelVersion.parentVersion.version
            } : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              set: props.modelVersion.parentVersion.status
            } : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAccuracy
            } : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? {
              set: props.modelVersion.parentVersion.performancePrecision
            } : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? {
              set: props.modelVersion.parentVersion.performanceRecall
            } : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? {
              set: props.modelVersion.parentVersion.performanceF1Score
            } : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
              set: props.modelVersion.parentVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
              set: props.modelVersion.parentVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? {
              set: props.modelVersion.parentVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
              set: props.modelVersion.parentVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
              set: props.modelVersion.parentVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
              set: props.modelVersion.parentVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? {
              set: props.modelVersion.parentVersion.trainingStartTime
            } : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? {
              set: props.modelVersion.parentVersion.trainingEndTime
            } : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? {
              set: props.modelVersion.parentVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
              set: props.modelVersion.parentVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? {
              set: props.modelVersion.parentVersion.deployedAt
            } : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? {
              set: props.modelVersion.parentVersion.deprecatedAt
            } : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && (Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id' || Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: props.modelVersion.parentVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            parentVersionId: props.modelVersion.parentVersion.parentVersion.parentVersionId !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.modelName
              } : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.version
              } : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
      Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 && props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 && props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 && props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
      Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 && props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
    Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 && props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.childVersions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          parentVersionId: item.parentVersionId !== undefined ? {
              equals: item.parentVersionId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          modelName: item.modelName !== undefined ? {
              set: item.modelName
            } : undefined,
          version: item.version !== undefined ? {
              set: item.version
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? {
              set: item.performanceAccuracy
            } : undefined,
          performancePrecision: item.performancePrecision !== undefined ? {
              set: item.performancePrecision
            } : undefined,
          performanceRecall: item.performanceRecall !== undefined ? {
              set: item.performanceRecall
            } : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? {
              set: item.performanceF1Score
            } : undefined,
          performanceAuc: item.performanceAuc !== undefined ? {
              set: item.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
              set: item.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
              set: item.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? {
              set: item.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
              set: item.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
              set: item.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
              set: item.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
              set: item.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
              set: item.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
              set: item.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
              set: item.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? {
              set: item.trainingStartTime
            } : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? {
              set: item.trainingEndTime
            } : undefined,
          trainingDuration: item.trainingDuration !== undefined ? {
              set: item.trainingDuration
            } : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
              set: item.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
              set: item.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
              set: item.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.deployedAt !== undefined ? {
              set: item.deployedAt
            } : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? {
              set: item.deprecatedAt
            } : undefined,
      childVersions: item.childVersions ? 
      Array.isArray(item.childVersions) && item.childVersions.length > 0 && item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            parentVersionId: item.parentVersionId !== undefined ? {
                equals: item.parentVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            modelName: item.modelName !== undefined ? {
                set: item.modelName
              } : undefined,
            version: item.version !== undefined ? {
                set: item.version
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? {
                set: item.performanceAccuracy
              } : undefined,
            performancePrecision: item.performancePrecision !== undefined ? {
                set: item.performancePrecision
              } : undefined,
            performanceRecall: item.performanceRecall !== undefined ? {
                set: item.performanceRecall
              } : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? {
                set: item.performanceF1Score
              } : undefined,
            performanceAuc: item.performanceAuc !== undefined ? {
                set: item.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
                set: item.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
                set: item.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? {
                set: item.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
                set: item.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
                set: item.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
                set: item.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
                set: item.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
                set: item.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
                set: item.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
                set: item.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? {
                set: item.trainingStartTime
              } : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? {
                set: item.trainingEndTime
              } : undefined,
            trainingDuration: item.trainingDuration !== undefined ? {
                set: item.trainingDuration
              } : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
                set: item.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
                set: item.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
                set: item.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.deployedAt !== undefined ? {
                set: item.deployedAt
              } : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? {
                set: item.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
      Array.isArray(item.artifacts) && item.artifacts.length > 0 && item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
      Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 && item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
      Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 && item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
      Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 && item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
    Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 && props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.artifacts.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId
            } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
      modelArtifact: item.modelArtifact ? 
      typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && (Object.keys(item.modelArtifact)[0] === 'id' || Object.keys(item.modelArtifact)[0] === 'symbol')
? {
      connect: {
        id: item.modelArtifact.id
      }
} : { upsert: {
          where: {
            id: item.modelArtifact.id !== undefined ? {
                equals: item.modelArtifact.id
              } : undefined,
          },
          update: {
            id: item.modelArtifact.id !== undefined ? {
                set: item.modelArtifact.id
              } : undefined,
            modelName: item.modelArtifact.modelName !== undefined ? {
                set: item.modelArtifact.modelName
              } : undefined,
            version: item.modelArtifact.version !== undefined ? {
                set: item.modelArtifact.version
              } : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? {
                set: item.modelArtifact.artifactType
              } : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? {
                set: item.modelArtifact.storageUrl
              } : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? {
                set: item.modelArtifact.storageProvider
              } : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? {
                set: item.modelArtifact.fileSize
              } : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? {
                set: item.modelArtifact.checksum
              } : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? {
                set: item.modelArtifact.compressionType
              } : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? {
                set: item.modelArtifact.metadataFramework
              } : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? {
                set: item.modelArtifact.metadataPythonVersion
              } : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? {
                set: item.modelArtifact.metadataTrainingDate
              } : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? {
                set: item.modelArtifact.metadataDatasetSize
              } : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
    Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 && props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.abTestsAsControl.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      treatmentVersion: item.treatmentVersion ? 
      typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && (Object.keys(item.treatmentVersion)[0] === 'id' || Object.keys(item.treatmentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.treatmentVersion.id
      }
} : { upsert: {
          where: {
            id: item.treatmentVersion.id !== undefined ? {
                equals: item.treatmentVersion.id
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status
              } : undefined,
            parentVersionId: item.treatmentVersion.parentVersionId !== undefined ? {
                equals: item.treatmentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.treatmentVersion.id !== undefined ? {
                set: item.treatmentVersion.id
              } : undefined,
            modelName: item.treatmentVersion.modelName !== undefined ? {
                set: item.treatmentVersion.modelName
              } : undefined,
            version: item.treatmentVersion.version !== undefined ? {
                set: item.treatmentVersion.version
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                set: item.treatmentVersion.status
              } : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? {
                set: item.treatmentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? {
                set: item.treatmentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? {
                set: item.treatmentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? {
                set: item.treatmentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? {
                set: item.treatmentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? {
                set: item.treatmentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.treatmentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? {
                set: item.treatmentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? {
                set: item.treatmentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? {
                set: item.treatmentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? {
                set: item.treatmentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? {
                set: item.treatmentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? {
                set: item.treatmentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.treatmentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.treatmentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? {
                set: item.treatmentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? {
                set: item.treatmentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? {
                set: item.treatmentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? {
                set: item.treatmentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.treatmentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? {
                set: item.treatmentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? {
                set: item.treatmentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
    Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 && props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.abTestsAsTreatment.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      controlVersion: item.controlVersion ? 
      typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && (Object.keys(item.controlVersion)[0] === 'id' || Object.keys(item.controlVersion)[0] === 'symbol')
? {
      connect: {
        id: item.controlVersion.id
      }
} : { upsert: {
          where: {
            id: item.controlVersion.id !== undefined ? {
                equals: item.controlVersion.id
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status
              } : undefined,
            parentVersionId: item.controlVersion.parentVersionId !== undefined ? {
                equals: item.controlVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.controlVersion.id !== undefined ? {
                set: item.controlVersion.id
              } : undefined,
            modelName: item.controlVersion.modelName !== undefined ? {
                set: item.controlVersion.modelName
              } : undefined,
            version: item.controlVersion.version !== undefined ? {
                set: item.controlVersion.version
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                set: item.controlVersion.status
              } : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? {
                set: item.controlVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? {
                set: item.controlVersion.performancePrecision
              } : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? {
                set: item.controlVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? {
                set: item.controlVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? {
                set: item.controlVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? {
                set: item.controlVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? {
                set: item.controlVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? {
                set: item.controlVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? {
                set: item.controlVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? {
                set: item.controlVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? {
                set: item.controlVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? {
                set: item.controlVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? {
                set: item.controlVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.controlVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.controlVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? {
                set: item.controlVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? {
                set: item.controlVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? {
                set: item.controlVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? {
                set: item.controlVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.controlVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? {
                set: item.controlVersion.deployedAt
              } : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? {
                set: item.controlVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        modelName: props.modelVersion.modelName !== undefined ? props.modelVersion.modelName : undefined,
        version: props.modelVersion.version !== undefined ? props.modelVersion.version : undefined,
        status: props.modelVersion.status !== undefined ? props.modelVersion.status : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? props.modelVersion.performanceAccuracy : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? props.modelVersion.performancePrecision : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? props.modelVersion.performanceRecall : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? props.modelVersion.performanceF1Score : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? props.modelVersion.performanceAuc : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? props.modelVersion.performanceSharpeRatio : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.performanceMaxDrawdown : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? props.modelVersion.performanceWinRate : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? props.modelVersion.performanceAvgReturn : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? props.modelVersion.performanceCalibrationScore : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? props.modelVersion.performanceStabilityScore : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? props.modelVersion.validationCrossValidationScore : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? props.modelVersion.deploymentEnvironment : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.deploymentTrafficAllocation : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.deploymentRolloutStrategy : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? props.modelVersion.trainingStartTime : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? props.modelVersion.trainingEndTime : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? props.modelVersion.trainingDuration : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? props.modelVersion.trainingDatasetSize : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.trainingResourcePeakMemoryMB : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.trainingResourceTotalCpuHours : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.trainingResourceGpuHours : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? props.modelVersion.deployedAt : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? props.modelVersion.deprecatedAt : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
          id: props.modelVersion.parentVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.id : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status 
             } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
      Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 &&  props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.childVersions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
      Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 &&  props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.artifacts.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId 
             } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId 
             } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 &&  props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsControl.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsTreatment.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneFeatureImportanceAnalysis) {
          return response.data.updateOneFeatureImportanceAnalysis;
        } else {
          return null as unknown as FeatureImportanceAnalysisType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateOneFeatureImportanceAnalysis", {
            operation: 'updateOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateOneFeatureImportanceAnalysis, retrying...", {
            operation: 'updateOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database update operation failed (transient after retries)", {
            operation: 'updateOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Upsert a single FeatureImportanceAnalysis record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated FeatureImportanceAnalysis or null.
   */
  async upsert(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<FeatureImportanceAnalysisType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPSERT_ONE_FEATUREIMPORTANCEANALYSIS = gql`
          mutation upsertOneFeatureImportanceAnalysis($where: FeatureImportanceAnalysisWhereUniqueInput!, $create: FeatureImportanceAnalysisCreateInput!, $update: FeatureImportanceAnalysisUpdateInput!) {
            upsertOneFeatureImportanceAnalysis(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  modelVersionId: props.modelVersionId !== undefined ? {
    equals: props.modelVersionId 
  } : undefined,
      },
          create: {
        analysisType: props.analysisType !== undefined ? props.analysisType : undefined,
  featureImportances: props.featureImportances !== undefined ? props.featureImportances : undefined,
  globalImportance: props.globalImportance !== undefined ? props.globalImportance : undefined,
  localImportance: props.localImportance !== undefined ? props.localImportance : undefined,
  analysisMetadataSampleSize: props.analysisMetadataSampleSize !== undefined ? props.analysisMetadataSampleSize : undefined,
  analysisMetadataBaselineAccuracy: props.analysisMetadataBaselineAccuracy !== undefined ? props.analysisMetadataBaselineAccuracy : undefined,
  analysisMetadataAnalysisDate: props.analysisMetadataAnalysisDate !== undefined ? props.analysisMetadataAnalysisDate : undefined,
  analysisMetadataComputationTime: props.analysisMetadataComputationTime !== undefined ? props.analysisMetadataComputationTime : undefined,
  analysisMetadataAnalysisParameters: props.analysisMetadataAnalysisParameters !== undefined ? props.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: props.insightsTopFeatures !== undefined ? props.insightsTopFeatures : undefined,
  insightsRedundantFeatures: props.insightsRedundantFeatures !== undefined ? props.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: props.insightsUnexpectedImportances !== undefined ? props.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: props.insightsStabilityScore !== undefined ? props.insightsStabilityScore : undefined,
  insightsRecommendations: props.insightsRecommendations !== undefined ? props.insightsRecommendations : undefined,
  modelVersion: props.modelVersion ? 
    typeof props.modelVersion === 'object' && Object.keys(props.modelVersion).length === 1 && Object.keys(props.modelVersion)[0] === 'id'
    ? { connect: {
        id: props.modelVersion.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.modelVersion.id !== undefined ? props.modelVersion.id : undefined,
        status: props.modelVersion.status !== undefined ? {
            equals: props.modelVersion.status 
           } : undefined,
      },
      create: {
        modelName: props.modelVersion.modelName !== undefined ? props.modelVersion.modelName : undefined,
        version: props.modelVersion.version !== undefined ? props.modelVersion.version : undefined,
        status: props.modelVersion.status !== undefined ? props.modelVersion.status : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? props.modelVersion.performanceAccuracy : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? props.modelVersion.performancePrecision : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? props.modelVersion.performanceRecall : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? props.modelVersion.performanceF1Score : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? props.modelVersion.performanceAuc : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? props.modelVersion.performanceSharpeRatio : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.performanceMaxDrawdown : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? props.modelVersion.performanceWinRate : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? props.modelVersion.performanceAvgReturn : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? props.modelVersion.performanceCalibrationScore : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? props.modelVersion.performanceStabilityScore : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? props.modelVersion.validationCrossValidationScore : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? props.modelVersion.deploymentEnvironment : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.deploymentTrafficAllocation : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.deploymentRolloutStrategy : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? props.modelVersion.trainingStartTime : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? props.modelVersion.trainingEndTime : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? props.modelVersion.trainingDuration : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? props.modelVersion.trainingDatasetSize : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.trainingResourcePeakMemoryMB : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.trainingResourceTotalCpuHours : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.trainingResourceGpuHours : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? props.modelVersion.deployedAt : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? props.modelVersion.deprecatedAt : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
          id: props.modelVersion.parentVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.id : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status 
             } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
      Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 &&  props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.childVersions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
      Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 &&  props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.artifacts.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId 
             } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId 
             } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 &&  props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsControl.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsTreatment.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
          update: {
      analysisType: props.analysisType !== undefined ? {
            set: props.analysisType 
           } : undefined,
  featureImportances: props.featureImportances !== undefined ? props.featureImportances : undefined,
  globalImportance: props.globalImportance !== undefined ? props.globalImportance : undefined,
  localImportance: props.localImportance !== undefined ? props.localImportance : undefined,
  analysisMetadataSampleSize: props.analysisMetadataSampleSize !== undefined ? {
            set: props.analysisMetadataSampleSize 
           } : undefined,
  analysisMetadataBaselineAccuracy: props.analysisMetadataBaselineAccuracy !== undefined ? {
            set: props.analysisMetadataBaselineAccuracy 
           } : undefined,
  analysisMetadataAnalysisDate: props.analysisMetadataAnalysisDate !== undefined ? {
            set: props.analysisMetadataAnalysisDate 
           } : undefined,
  analysisMetadataComputationTime: props.analysisMetadataComputationTime !== undefined ? {
            set: props.analysisMetadataComputationTime 
           } : undefined,
  analysisMetadataAnalysisParameters: props.analysisMetadataAnalysisParameters !== undefined ? props.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: props.insightsTopFeatures !== undefined ? props.insightsTopFeatures : undefined,
  insightsRedundantFeatures: props.insightsRedundantFeatures !== undefined ? props.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: props.insightsUnexpectedImportances !== undefined ? props.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: props.insightsStabilityScore !== undefined ? {
            set: props.insightsStabilityScore 
           } : undefined,
  insightsRecommendations: props.insightsRecommendations !== undefined ? props.insightsRecommendations : undefined,
  modelVersion: props.modelVersion ? 
  typeof props.modelVersion === 'object' && Object.keys(props.modelVersion).length === 1 && (Object.keys(props.modelVersion)[0] === 'id' || Object.keys(props.modelVersion)[0] === 'symbol')
? {
  connect: {
    id: props.modelVersion.id
  }
} : { upsert: {
      where: {
        id: props.modelVersion.id !== undefined ? {
            equals: props.modelVersion.id
          } : undefined,
        status: props.modelVersion.status !== undefined ? {
            equals: props.modelVersion.status
          } : undefined,
        parentVersionId: props.modelVersion.parentVersionId !== undefined ? {
            equals: props.modelVersion.parentVersionId
          } : undefined,
      },
      update: {
        id: props.modelVersion.id !== undefined ? {
            set: props.modelVersion.id
          } : undefined,
        modelName: props.modelVersion.modelName !== undefined ? {
            set: props.modelVersion.modelName
          } : undefined,
        version: props.modelVersion.version !== undefined ? {
            set: props.modelVersion.version
          } : undefined,
        status: props.modelVersion.status !== undefined ? {
            set: props.modelVersion.status
          } : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? {
            set: props.modelVersion.performanceAccuracy
          } : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? {
            set: props.modelVersion.performancePrecision
          } : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? {
            set: props.modelVersion.performanceRecall
          } : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? {
            set: props.modelVersion.performanceF1Score
          } : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? {
            set: props.modelVersion.performanceAuc
          } : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? {
            set: props.modelVersion.performanceSharpeRatio
          } : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? {
            set: props.modelVersion.performanceMaxDrawdown
          } : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? {
            set: props.modelVersion.performanceWinRate
          } : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? {
            set: props.modelVersion.performanceAvgReturn
          } : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? {
            set: props.modelVersion.performanceCalibrationScore
          } : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? {
            set: props.modelVersion.performanceStabilityScore
          } : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? {
            set: props.modelVersion.validationCrossValidationScore
          } : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? {
            set: props.modelVersion.deploymentEnvironment
          } : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? {
            set: props.modelVersion.deploymentTrafficAllocation
          } : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? {
            set: props.modelVersion.deploymentRolloutStrategy
          } : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? {
            set: props.modelVersion.trainingStartTime
          } : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? {
            set: props.modelVersion.trainingEndTime
          } : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? {
            set: props.modelVersion.trainingDuration
          } : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? {
            set: props.modelVersion.trainingDatasetSize
          } : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
            set: props.modelVersion.trainingResourcePeakMemoryMB
          } : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
            set: props.modelVersion.trainingResourceTotalCpuHours
          } : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? {
            set: props.modelVersion.trainingResourceGpuHours
          } : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? {
            set: props.modelVersion.deployedAt
          } : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? {
            set: props.modelVersion.deprecatedAt
          } : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
    typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && (Object.keys(props.modelVersion.parentVersion)[0] === 'id' || Object.keys(props.modelVersion.parentVersion)[0] === 'symbol')
? {
    connect: {
      id: props.modelVersion.parentVersion.id
    }
} : { upsert: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? {
              equals: props.modelVersion.parentVersion.id
            } : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status
            } : undefined,
          parentVersionId: props.modelVersion.parentVersion.parentVersionId !== undefined ? {
              equals: props.modelVersion.parentVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: props.modelVersion.parentVersion.id !== undefined ? {
              set: props.modelVersion.parentVersion.id
            } : undefined,
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? {
              set: props.modelVersion.parentVersion.modelName
            } : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? {
              set: props.modelVersion.parentVersion.version
            } : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              set: props.modelVersion.parentVersion.status
            } : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAccuracy
            } : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? {
              set: props.modelVersion.parentVersion.performancePrecision
            } : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? {
              set: props.modelVersion.parentVersion.performanceRecall
            } : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? {
              set: props.modelVersion.parentVersion.performanceF1Score
            } : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
              set: props.modelVersion.parentVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
              set: props.modelVersion.parentVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? {
              set: props.modelVersion.parentVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
              set: props.modelVersion.parentVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
              set: props.modelVersion.parentVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
              set: props.modelVersion.parentVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
              set: props.modelVersion.parentVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
              set: props.modelVersion.parentVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? {
              set: props.modelVersion.parentVersion.trainingStartTime
            } : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? {
              set: props.modelVersion.parentVersion.trainingEndTime
            } : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? {
              set: props.modelVersion.parentVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
              set: props.modelVersion.parentVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
              set: props.modelVersion.parentVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? {
              set: props.modelVersion.parentVersion.deployedAt
            } : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? {
              set: props.modelVersion.parentVersion.deprecatedAt
            } : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && (Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id' || Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: props.modelVersion.parentVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            parentVersionId: props.modelVersion.parentVersion.parentVersion.parentVersionId !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.modelName
              } : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.version
              } : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? {
                set: props.modelVersion.parentVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
      Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 && props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 && props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 && props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
      Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 && props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
    Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 && props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.childVersions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          parentVersionId: item.parentVersionId !== undefined ? {
              equals: item.parentVersionId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          modelName: item.modelName !== undefined ? {
              set: item.modelName
            } : undefined,
          version: item.version !== undefined ? {
              set: item.version
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? {
              set: item.performanceAccuracy
            } : undefined,
          performancePrecision: item.performancePrecision !== undefined ? {
              set: item.performancePrecision
            } : undefined,
          performanceRecall: item.performanceRecall !== undefined ? {
              set: item.performanceRecall
            } : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? {
              set: item.performanceF1Score
            } : undefined,
          performanceAuc: item.performanceAuc !== undefined ? {
              set: item.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
              set: item.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
              set: item.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? {
              set: item.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
              set: item.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
              set: item.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
              set: item.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
              set: item.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
              set: item.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
              set: item.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
              set: item.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? {
              set: item.trainingStartTime
            } : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? {
              set: item.trainingEndTime
            } : undefined,
          trainingDuration: item.trainingDuration !== undefined ? {
              set: item.trainingDuration
            } : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
              set: item.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
              set: item.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
              set: item.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.deployedAt !== undefined ? {
              set: item.deployedAt
            } : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? {
              set: item.deprecatedAt
            } : undefined,
      childVersions: item.childVersions ? 
      Array.isArray(item.childVersions) && item.childVersions.length > 0 && item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            parentVersionId: item.parentVersionId !== undefined ? {
                equals: item.parentVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            modelName: item.modelName !== undefined ? {
                set: item.modelName
              } : undefined,
            version: item.version !== undefined ? {
                set: item.version
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? {
                set: item.performanceAccuracy
              } : undefined,
            performancePrecision: item.performancePrecision !== undefined ? {
                set: item.performancePrecision
              } : undefined,
            performanceRecall: item.performanceRecall !== undefined ? {
                set: item.performanceRecall
              } : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? {
                set: item.performanceF1Score
              } : undefined,
            performanceAuc: item.performanceAuc !== undefined ? {
                set: item.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
                set: item.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
                set: item.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? {
                set: item.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
                set: item.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
                set: item.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
                set: item.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
                set: item.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
                set: item.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
                set: item.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
                set: item.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? {
                set: item.trainingStartTime
              } : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? {
                set: item.trainingEndTime
              } : undefined,
            trainingDuration: item.trainingDuration !== undefined ? {
                set: item.trainingDuration
              } : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
                set: item.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
                set: item.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
                set: item.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.deployedAt !== undefined ? {
                set: item.deployedAt
              } : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? {
                set: item.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
      Array.isArray(item.artifacts) && item.artifacts.length > 0 && item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
      Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 && item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
      Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 && item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
      Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 && item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
    Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 && props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.artifacts.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId
            } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
      modelArtifact: item.modelArtifact ? 
      typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && (Object.keys(item.modelArtifact)[0] === 'id' || Object.keys(item.modelArtifact)[0] === 'symbol')
? {
      connect: {
        id: item.modelArtifact.id
      }
} : { upsert: {
          where: {
            id: item.modelArtifact.id !== undefined ? {
                equals: item.modelArtifact.id
              } : undefined,
          },
          update: {
            id: item.modelArtifact.id !== undefined ? {
                set: item.modelArtifact.id
              } : undefined,
            modelName: item.modelArtifact.modelName !== undefined ? {
                set: item.modelArtifact.modelName
              } : undefined,
            version: item.modelArtifact.version !== undefined ? {
                set: item.modelArtifact.version
              } : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? {
                set: item.modelArtifact.artifactType
              } : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? {
                set: item.modelArtifact.storageUrl
              } : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? {
                set: item.modelArtifact.storageProvider
              } : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? {
                set: item.modelArtifact.fileSize
              } : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? {
                set: item.modelArtifact.checksum
              } : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? {
                set: item.modelArtifact.compressionType
              } : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? {
                set: item.modelArtifact.metadataFramework
              } : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? {
                set: item.modelArtifact.metadataPythonVersion
              } : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? {
                set: item.modelArtifact.metadataTrainingDate
              } : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? {
                set: item.modelArtifact.metadataDatasetSize
              } : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
    Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 && props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.abTestsAsControl.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      treatmentVersion: item.treatmentVersion ? 
      typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && (Object.keys(item.treatmentVersion)[0] === 'id' || Object.keys(item.treatmentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.treatmentVersion.id
      }
} : { upsert: {
          where: {
            id: item.treatmentVersion.id !== undefined ? {
                equals: item.treatmentVersion.id
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status
              } : undefined,
            parentVersionId: item.treatmentVersion.parentVersionId !== undefined ? {
                equals: item.treatmentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.treatmentVersion.id !== undefined ? {
                set: item.treatmentVersion.id
              } : undefined,
            modelName: item.treatmentVersion.modelName !== undefined ? {
                set: item.treatmentVersion.modelName
              } : undefined,
            version: item.treatmentVersion.version !== undefined ? {
                set: item.treatmentVersion.version
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                set: item.treatmentVersion.status
              } : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? {
                set: item.treatmentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? {
                set: item.treatmentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? {
                set: item.treatmentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? {
                set: item.treatmentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? {
                set: item.treatmentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? {
                set: item.treatmentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.treatmentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? {
                set: item.treatmentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? {
                set: item.treatmentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? {
                set: item.treatmentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? {
                set: item.treatmentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? {
                set: item.treatmentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? {
                set: item.treatmentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.treatmentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.treatmentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? {
                set: item.treatmentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? {
                set: item.treatmentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? {
                set: item.treatmentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? {
                set: item.treatmentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.treatmentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? {
                set: item.treatmentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? {
                set: item.treatmentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
    Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 && props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.modelVersion.abTestsAsTreatment.map((item) => ({
      id: item.id
    }))
} : { upsert: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      controlVersion: item.controlVersion ? 
      typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && (Object.keys(item.controlVersion)[0] === 'id' || Object.keys(item.controlVersion)[0] === 'symbol')
? {
      connect: {
        id: item.controlVersion.id
      }
} : { upsert: {
          where: {
            id: item.controlVersion.id !== undefined ? {
                equals: item.controlVersion.id
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status
              } : undefined,
            parentVersionId: item.controlVersion.parentVersionId !== undefined ? {
                equals: item.controlVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.controlVersion.id !== undefined ? {
                set: item.controlVersion.id
              } : undefined,
            modelName: item.controlVersion.modelName !== undefined ? {
                set: item.controlVersion.modelName
              } : undefined,
            version: item.controlVersion.version !== undefined ? {
                set: item.controlVersion.version
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                set: item.controlVersion.status
              } : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? {
                set: item.controlVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? {
                set: item.controlVersion.performancePrecision
              } : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? {
                set: item.controlVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? {
                set: item.controlVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? {
                set: item.controlVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? {
                set: item.controlVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? {
                set: item.controlVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? {
                set: item.controlVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? {
                set: item.controlVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? {
                set: item.controlVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? {
                set: item.controlVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? {
                set: item.controlVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? {
                set: item.controlVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.controlVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.controlVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? {
                set: item.controlVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? {
                set: item.controlVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? {
                set: item.controlVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? {
                set: item.controlVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.controlVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? {
                set: item.controlVersion.deployedAt
              } : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? {
                set: item.controlVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        modelName: props.modelVersion.modelName !== undefined ? props.modelVersion.modelName : undefined,
        version: props.modelVersion.version !== undefined ? props.modelVersion.version : undefined,
        status: props.modelVersion.status !== undefined ? props.modelVersion.status : undefined,
        performanceAccuracy: props.modelVersion.performanceAccuracy !== undefined ? props.modelVersion.performanceAccuracy : undefined,
        performancePrecision: props.modelVersion.performancePrecision !== undefined ? props.modelVersion.performancePrecision : undefined,
        performanceRecall: props.modelVersion.performanceRecall !== undefined ? props.modelVersion.performanceRecall : undefined,
        performanceF1Score: props.modelVersion.performanceF1Score !== undefined ? props.modelVersion.performanceF1Score : undefined,
        performanceAuc: props.modelVersion.performanceAuc !== undefined ? props.modelVersion.performanceAuc : undefined,
        performanceSharpeRatio: props.modelVersion.performanceSharpeRatio !== undefined ? props.modelVersion.performanceSharpeRatio : undefined,
        performanceMaxDrawdown: props.modelVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.performanceMaxDrawdown : undefined,
        performanceWinRate: props.modelVersion.performanceWinRate !== undefined ? props.modelVersion.performanceWinRate : undefined,
        performanceAvgReturn: props.modelVersion.performanceAvgReturn !== undefined ? props.modelVersion.performanceAvgReturn : undefined,
        performanceCalibrationScore: props.modelVersion.performanceCalibrationScore !== undefined ? props.modelVersion.performanceCalibrationScore : undefined,
        performanceStabilityScore: props.modelVersion.performanceStabilityScore !== undefined ? props.modelVersion.performanceStabilityScore : undefined,
        validationCrossValidationScore: props.modelVersion.validationCrossValidationScore !== undefined ? props.modelVersion.validationCrossValidationScore : undefined,
        validationOutOfSamplePerformance: props.modelVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: props.modelVersion.validationBacktestResults !== undefined ? props.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: props.modelVersion.validationStatTestResults !== undefined ? props.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: props.modelVersion.deploymentEnvironment !== undefined ? props.modelVersion.deploymentEnvironment : undefined,
        deploymentTrafficAllocation: props.modelVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.deploymentTrafficAllocation : undefined,
        deploymentRolloutStrategy: props.modelVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.deploymentRolloutStrategy : undefined,
        deploymentHealthCheckConfig: props.modelVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: props.modelVersion.trainingStartTime !== undefined ? props.modelVersion.trainingStartTime : undefined,
        trainingEndTime: props.modelVersion.trainingEndTime !== undefined ? props.modelVersion.trainingEndTime : undefined,
        trainingDuration: props.modelVersion.trainingDuration !== undefined ? props.modelVersion.trainingDuration : undefined,
        trainingDatasetSize: props.modelVersion.trainingDatasetSize !== undefined ? props.modelVersion.trainingDatasetSize : undefined,
        trainingFeaturesUsed: props.modelVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: props.modelVersion.trainingHyperparameters !== undefined ? props.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: props.modelVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.trainingResourcePeakMemoryMB : undefined,
        trainingResourceTotalCpuHours: props.modelVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.trainingResourceTotalCpuHours : undefined,
        trainingResourceGpuHours: props.modelVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.trainingResourceGpuHours : undefined,
        deployedAt: props.modelVersion.deployedAt !== undefined ? props.modelVersion.deployedAt : undefined,
        deprecatedAt: props.modelVersion.deprecatedAt !== undefined ? props.modelVersion.deprecatedAt : undefined,
    parentVersion: props.modelVersion.parentVersion ? 
      typeof props.modelVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
          id: props.modelVersion.parentVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.modelVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.id : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? {
              equals: props.modelVersion.parentVersion.status 
             } : undefined,
        },
        create: {
          modelName: props.modelVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.modelName : undefined,
          version: props.modelVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.version : undefined,
          status: props.modelVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: props.modelVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: props.modelVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: props.modelVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: props.modelVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: props.modelVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: props.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: props.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: props.modelVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: props.modelVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: props.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: props.modelVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: props.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: props.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: props.modelVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: props.modelVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: props.modelVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: props.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: props.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: props.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: props.modelVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: props.modelVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: props.modelVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: props.modelVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: props.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: props.modelVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: props.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: props.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: props.modelVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: props.modelVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: props.modelVersion.parentVersion.parentVersion ? 
        typeof props.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(props.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(props.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: props.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.modelVersion.parentVersion.parentVersion.id !== undefined ? props.modelVersion.parentVersion.parentVersion.id : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: props.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: props.modelVersion.parentVersion.parentVersion.modelName !== undefined ? props.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: props.modelVersion.parentVersion.parentVersion.version !== undefined ? props.modelVersion.parentVersion.parentVersion.version : undefined,
            status: props.modelVersion.parentVersion.parentVersion.status !== undefined ? props.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: props.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: props.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? props.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: props.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: props.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: props.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: props.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: props.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: props.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? props.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? props.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? props.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: props.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: props.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? props.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: props.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? props.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: props.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: props.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: props.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: props.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: props.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? props.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: props.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: props.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? props.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: props.modelVersion.parentVersion.artifacts ? 
        Array.isArray(props.modelVersion.parentVersion.artifacts) && props.modelVersion.parentVersion.artifacts.length > 0 &&  props.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: props.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsControl) && props.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  props.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: props.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(props.modelVersion.parentVersion.abTestsAsTreatment) && props.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: props.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(props.modelVersion.parentVersion.featureImportanceAnalyses) && props.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  props.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: props.modelVersion.childVersions ? 
      Array.isArray(props.modelVersion.childVersions) && props.modelVersion.childVersions.length > 0 &&  props.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.childVersions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: props.modelVersion.artifacts ? 
      Array.isArray(props.modelVersion.artifacts) && props.modelVersion.artifacts.length > 0 &&  props.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.artifacts.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId 
             } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId 
             } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: props.modelVersion.abTestsAsControl ? 
      Array.isArray(props.modelVersion.abTestsAsControl) && props.modelVersion.abTestsAsControl.length > 0 &&  props.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsControl.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: props.modelVersion.abTestsAsTreatment ? 
      Array.isArray(props.modelVersion.abTestsAsTreatment) && props.modelVersion.abTestsAsTreatment.length > 0 &&  props.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.modelVersion.abTestsAsTreatment.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneFeatureImportanceAnalysis) {
          return response.data.upsertOneFeatureImportanceAnalysis;
        } else {
          return null as unknown as FeatureImportanceAnalysisType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in upsertOneFeatureImportanceAnalysis", {
            operation: 'upsertOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in upsertOneFeatureImportanceAnalysis, retrying...", {
            operation: 'upsertOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database upsert operation failed (transient after retries)", {
            operation: 'upsertOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update multiple FeatureImportanceAnalysis records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of FeatureImportanceAnalysis objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: FeatureImportanceAnalysisType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_MANY_FEATUREIMPORTANCEANALYSIS = gql`
          mutation updateManyFeatureImportanceAnalysis($data: [FeatureImportanceAnalysisCreateManyInput!]!) {
            updateManyFeatureImportanceAnalysis(data: $data) {
              count
            }
          }`;

        const variables = props.map(prop => ({
          where: {
              id: prop.id !== undefined ? prop.id : undefined,

          },
          data: {
              id: prop.id !== undefined ? {
            set: prop.id 
           } : undefined,
  analysisType: prop.analysisType !== undefined ? {
            set: prop.analysisType 
           } : undefined,
  featureImportances: prop.featureImportances !== undefined ? prop.featureImportances : undefined,
  globalImportance: prop.globalImportance !== undefined ? prop.globalImportance : undefined,
  localImportance: prop.localImportance !== undefined ? prop.localImportance : undefined,
  analysisMetadataSampleSize: prop.analysisMetadataSampleSize !== undefined ? {
            set: prop.analysisMetadataSampleSize 
           } : undefined,
  analysisMetadataBaselineAccuracy: prop.analysisMetadataBaselineAccuracy !== undefined ? {
            set: prop.analysisMetadataBaselineAccuracy 
           } : undefined,
  analysisMetadataAnalysisDate: prop.analysisMetadataAnalysisDate !== undefined ? {
            set: prop.analysisMetadataAnalysisDate 
           } : undefined,
  analysisMetadataComputationTime: prop.analysisMetadataComputationTime !== undefined ? {
            set: prop.analysisMetadataComputationTime 
           } : undefined,
  analysisMetadataAnalysisParameters: prop.analysisMetadataAnalysisParameters !== undefined ? prop.analysisMetadataAnalysisParameters : undefined,
  insightsTopFeatures: prop.insightsTopFeatures !== undefined ? prop.insightsTopFeatures : undefined,
  insightsRedundantFeatures: prop.insightsRedundantFeatures !== undefined ? prop.insightsRedundantFeatures : undefined,
  insightsUnexpectedImportances: prop.insightsUnexpectedImportances !== undefined ? prop.insightsUnexpectedImportances : undefined,
  insightsStabilityScore: prop.insightsStabilityScore !== undefined ? {
            set: prop.insightsStabilityScore 
           } : undefined,
  insightsRecommendations: prop.insightsRecommendations !== undefined ? prop.insightsRecommendations : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  modelVersion: prop.modelVersion ? 
  typeof prop.modelVersion === 'object' && Object.keys(prop.modelVersion).length === 1 && (Object.keys(prop.modelVersion)[0] === 'id' || Object.keys(prop.modelVersion)[0] === 'symbol')
? {
  connect: {
    id: prop.modelVersion.id
  }
} : { upsert: {
      where: {
        id: prop.modelVersion.id !== undefined ? {
            equals: prop.modelVersion.id
          } : undefined,
        status: prop.modelVersion.status !== undefined ? {
            equals: prop.modelVersion.status
          } : undefined,
        parentVersionId: prop.modelVersion.parentVersionId !== undefined ? {
            equals: prop.modelVersion.parentVersionId
          } : undefined,
      },
      update: {
        id: prop.modelVersion.id !== undefined ? {
            set: prop.modelVersion.id
          } : undefined,
        modelName: prop.modelVersion.modelName !== undefined ? {
            set: prop.modelVersion.modelName
          } : undefined,
        version: prop.modelVersion.version !== undefined ? {
            set: prop.modelVersion.version
          } : undefined,
        status: prop.modelVersion.status !== undefined ? {
            set: prop.modelVersion.status
          } : undefined,
        performanceAccuracy: prop.modelVersion.performanceAccuracy !== undefined ? {
            set: prop.modelVersion.performanceAccuracy
          } : undefined,
        performancePrecision: prop.modelVersion.performancePrecision !== undefined ? {
            set: prop.modelVersion.performancePrecision
          } : undefined,
        performanceRecall: prop.modelVersion.performanceRecall !== undefined ? {
            set: prop.modelVersion.performanceRecall
          } : undefined,
        performanceF1Score: prop.modelVersion.performanceF1Score !== undefined ? {
            set: prop.modelVersion.performanceF1Score
          } : undefined,
        performanceAuc: prop.modelVersion.performanceAuc !== undefined ? {
            set: prop.modelVersion.performanceAuc
          } : undefined,
        performanceSharpeRatio: prop.modelVersion.performanceSharpeRatio !== undefined ? {
            set: prop.modelVersion.performanceSharpeRatio
          } : undefined,
        performanceMaxDrawdown: prop.modelVersion.performanceMaxDrawdown !== undefined ? {
            set: prop.modelVersion.performanceMaxDrawdown
          } : undefined,
        performanceWinRate: prop.modelVersion.performanceWinRate !== undefined ? {
            set: prop.modelVersion.performanceWinRate
          } : undefined,
        performanceAvgReturn: prop.modelVersion.performanceAvgReturn !== undefined ? {
            set: prop.modelVersion.performanceAvgReturn
          } : undefined,
        performanceCalibrationScore: prop.modelVersion.performanceCalibrationScore !== undefined ? {
            set: prop.modelVersion.performanceCalibrationScore
          } : undefined,
        performanceStabilityScore: prop.modelVersion.performanceStabilityScore !== undefined ? {
            set: prop.modelVersion.performanceStabilityScore
          } : undefined,
        validationCrossValidationScore: prop.modelVersion.validationCrossValidationScore !== undefined ? {
            set: prop.modelVersion.validationCrossValidationScore
          } : undefined,
        validationOutOfSamplePerformance: prop.modelVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: prop.modelVersion.validationBacktestResults !== undefined ? prop.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: prop.modelVersion.validationStatTestResults !== undefined ? prop.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: prop.modelVersion.deploymentEnvironment !== undefined ? {
            set: prop.modelVersion.deploymentEnvironment
          } : undefined,
        deploymentTrafficAllocation: prop.modelVersion.deploymentTrafficAllocation !== undefined ? {
            set: prop.modelVersion.deploymentTrafficAllocation
          } : undefined,
        deploymentRolloutStrategy: prop.modelVersion.deploymentRolloutStrategy !== undefined ? {
            set: prop.modelVersion.deploymentRolloutStrategy
          } : undefined,
        deploymentHealthCheckConfig: prop.modelVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: prop.modelVersion.trainingStartTime !== undefined ? {
            set: prop.modelVersion.trainingStartTime
          } : undefined,
        trainingEndTime: prop.modelVersion.trainingEndTime !== undefined ? {
            set: prop.modelVersion.trainingEndTime
          } : undefined,
        trainingDuration: prop.modelVersion.trainingDuration !== undefined ? {
            set: prop.modelVersion.trainingDuration
          } : undefined,
        trainingDatasetSize: prop.modelVersion.trainingDatasetSize !== undefined ? {
            set: prop.modelVersion.trainingDatasetSize
          } : undefined,
        trainingFeaturesUsed: prop.modelVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: prop.modelVersion.trainingHyperparameters !== undefined ? prop.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: prop.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
            set: prop.modelVersion.trainingResourcePeakMemoryMB
          } : undefined,
        trainingResourceTotalCpuHours: prop.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
            set: prop.modelVersion.trainingResourceTotalCpuHours
          } : undefined,
        trainingResourceGpuHours: prop.modelVersion.trainingResourceGpuHours !== undefined ? {
            set: prop.modelVersion.trainingResourceGpuHours
          } : undefined,
        deployedAt: prop.modelVersion.deployedAt !== undefined ? {
            set: prop.modelVersion.deployedAt
          } : undefined,
        deprecatedAt: prop.modelVersion.deprecatedAt !== undefined ? {
            set: prop.modelVersion.deprecatedAt
          } : undefined,
    parentVersion: prop.modelVersion.parentVersion ? 
    typeof prop.modelVersion.parentVersion === 'object' && Object.keys(prop.modelVersion.parentVersion).length === 1 && (Object.keys(prop.modelVersion.parentVersion)[0] === 'id' || Object.keys(prop.modelVersion.parentVersion)[0] === 'symbol')
? {
    connect: {
      id: prop.modelVersion.parentVersion.id
    }
} : { upsert: {
        where: {
          id: prop.modelVersion.parentVersion.id !== undefined ? {
              equals: prop.modelVersion.parentVersion.id
            } : undefined,
          status: prop.modelVersion.parentVersion.status !== undefined ? {
              equals: prop.modelVersion.parentVersion.status
            } : undefined,
          parentVersionId: prop.modelVersion.parentVersion.parentVersionId !== undefined ? {
              equals: prop.modelVersion.parentVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: prop.modelVersion.parentVersion.id !== undefined ? {
              set: prop.modelVersion.parentVersion.id
            } : undefined,
          modelName: prop.modelVersion.parentVersion.modelName !== undefined ? {
              set: prop.modelVersion.parentVersion.modelName
            } : undefined,
          version: prop.modelVersion.parentVersion.version !== undefined ? {
              set: prop.modelVersion.parentVersion.version
            } : undefined,
          status: prop.modelVersion.parentVersion.status !== undefined ? {
              set: prop.modelVersion.parentVersion.status
            } : undefined,
          performanceAccuracy: prop.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceAccuracy
            } : undefined,
          performancePrecision: prop.modelVersion.parentVersion.performancePrecision !== undefined ? {
              set: prop.modelVersion.parentVersion.performancePrecision
            } : undefined,
          performanceRecall: prop.modelVersion.parentVersion.performanceRecall !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceRecall
            } : undefined,
          performanceF1Score: prop.modelVersion.parentVersion.performanceF1Score !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceF1Score
            } : undefined,
          performanceAuc: prop.modelVersion.parentVersion.performanceAuc !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: prop.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: prop.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: prop.modelVersion.parentVersion.performanceWinRate !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: prop.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: prop.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: prop.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
              set: prop.modelVersion.parentVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: prop.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
              set: prop.modelVersion.parentVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: prop.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: prop.modelVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: prop.modelVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: prop.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
              set: prop.modelVersion.parentVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: prop.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
              set: prop.modelVersion.parentVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: prop.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
              set: prop.modelVersion.parentVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: prop.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: prop.modelVersion.parentVersion.trainingStartTime !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingStartTime
            } : undefined,
          trainingEndTime: prop.modelVersion.parentVersion.trainingEndTime !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingEndTime
            } : undefined,
          trainingDuration: prop.modelVersion.parentVersion.trainingDuration !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: prop.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: prop.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: prop.modelVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: prop.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
              set: prop.modelVersion.parentVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: prop.modelVersion.parentVersion.deployedAt !== undefined ? {
              set: prop.modelVersion.parentVersion.deployedAt
            } : undefined,
          deprecatedAt: prop.modelVersion.parentVersion.deprecatedAt !== undefined ? {
              set: prop.modelVersion.parentVersion.deprecatedAt
            } : undefined,
      parentVersion: prop.modelVersion.parentVersion.parentVersion ? 
      typeof prop.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(prop.modelVersion.parentVersion.parentVersion).length === 1 && (Object.keys(prop.modelVersion.parentVersion.parentVersion)[0] === 'id' || Object.keys(prop.modelVersion.parentVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: prop.modelVersion.parentVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: prop.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                equals: prop.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: prop.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            parentVersionId: prop.modelVersion.parentVersion.parentVersion.parentVersionId !== undefined ? {
                equals: prop.modelVersion.parentVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: prop.modelVersion.parentVersion.parentVersion.id !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.id
              } : undefined,
            modelName: prop.modelVersion.parentVersion.parentVersion.modelName !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.modelName
              } : undefined,
            version: prop.modelVersion.parentVersion.parentVersion.version !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.version
              } : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: prop.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: prop.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: prop.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: prop.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: prop.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: prop.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: prop.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: prop.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: prop.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: prop.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: prop.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: prop.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: prop.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? {
                set: prop.modelVersion.parentVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: prop.modelVersion.parentVersion.parentVersion.modelName !== undefined ? prop.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: prop.modelVersion.parentVersion.parentVersion.version !== undefined ? prop.modelVersion.parentVersion.parentVersion.version : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? prop.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: prop.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: prop.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? prop.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: prop.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: prop.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: prop.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: prop.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: prop.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: prop.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: prop.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: prop.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: prop.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: prop.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: prop.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: prop.modelVersion.parentVersion.artifacts ? 
      Array.isArray(prop.modelVersion.parentVersion.artifacts) && prop.modelVersion.parentVersion.artifacts.length > 0 && prop.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.modelVersion.parentVersion.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: prop.modelVersion.parentVersion.abTestsAsControl ? 
      Array.isArray(prop.modelVersion.parentVersion.abTestsAsControl) && prop.modelVersion.parentVersion.abTestsAsControl.length > 0 && prop.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: prop.modelVersion.parentVersion.abTestsAsTreatment ? 
      Array.isArray(prop.modelVersion.parentVersion.abTestsAsTreatment) && prop.modelVersion.parentVersion.abTestsAsTreatment.length > 0 && prop.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: prop.modelVersion.parentVersion.featureImportanceAnalyses ? 
      Array.isArray(prop.modelVersion.parentVersion.featureImportanceAnalyses) && prop.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 && prop.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: prop.modelVersion.parentVersion.modelName !== undefined ? prop.modelVersion.parentVersion.modelName : undefined,
          version: prop.modelVersion.parentVersion.version !== undefined ? prop.modelVersion.parentVersion.version : undefined,
          status: prop.modelVersion.parentVersion.status !== undefined ? prop.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: prop.modelVersion.parentVersion.performanceAccuracy !== undefined ? prop.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: prop.modelVersion.parentVersion.performancePrecision !== undefined ? prop.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: prop.modelVersion.parentVersion.performanceRecall !== undefined ? prop.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: prop.modelVersion.parentVersion.performanceF1Score !== undefined ? prop.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: prop.modelVersion.parentVersion.performanceAuc !== undefined ? prop.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: prop.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: prop.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: prop.modelVersion.parentVersion.performanceWinRate !== undefined ? prop.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: prop.modelVersion.parentVersion.performanceAvgReturn !== undefined ? prop.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: prop.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: prop.modelVersion.parentVersion.performanceStabilityScore !== undefined ? prop.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: prop.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: prop.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: prop.modelVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: prop.modelVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: prop.modelVersion.parentVersion.deploymentEnvironment !== undefined ? prop.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: prop.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: prop.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: prop.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: prop.modelVersion.parentVersion.trainingStartTime !== undefined ? prop.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: prop.modelVersion.parentVersion.trainingEndTime !== undefined ? prop.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: prop.modelVersion.parentVersion.trainingDuration !== undefined ? prop.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: prop.modelVersion.parentVersion.trainingDatasetSize !== undefined ? prop.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: prop.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: prop.modelVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: prop.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: prop.modelVersion.parentVersion.deployedAt !== undefined ? prop.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: prop.modelVersion.parentVersion.deprecatedAt !== undefined ? prop.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: prop.modelVersion.parentVersion.parentVersion ? 
        typeof prop.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(prop.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(prop.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: prop.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.modelVersion.parentVersion.parentVersion.id !== undefined ? prop.modelVersion.parentVersion.parentVersion.id : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: prop.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: prop.modelVersion.parentVersion.parentVersion.modelName !== undefined ? prop.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: prop.modelVersion.parentVersion.parentVersion.version !== undefined ? prop.modelVersion.parentVersion.parentVersion.version : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? prop.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: prop.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: prop.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? prop.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: prop.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: prop.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: prop.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: prop.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: prop.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: prop.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: prop.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: prop.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: prop.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: prop.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: prop.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: prop.modelVersion.parentVersion.artifacts ? 
        Array.isArray(prop.modelVersion.parentVersion.artifacts) && prop.modelVersion.parentVersion.artifacts.length > 0 &&  prop.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: prop.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(prop.modelVersion.parentVersion.abTestsAsControl) && prop.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  prop.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: prop.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(prop.modelVersion.parentVersion.abTestsAsTreatment) && prop.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  prop.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: prop.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(prop.modelVersion.parentVersion.featureImportanceAnalyses) && prop.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  prop.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: prop.modelVersion.childVersions ? 
    Array.isArray(prop.modelVersion.childVersions) && prop.modelVersion.childVersions.length > 0 && prop.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.modelVersion.childVersions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          parentVersionId: item.parentVersionId !== undefined ? {
              equals: item.parentVersionId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          modelName: item.modelName !== undefined ? {
              set: item.modelName
            } : undefined,
          version: item.version !== undefined ? {
              set: item.version
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? {
              set: item.performanceAccuracy
            } : undefined,
          performancePrecision: item.performancePrecision !== undefined ? {
              set: item.performancePrecision
            } : undefined,
          performanceRecall: item.performanceRecall !== undefined ? {
              set: item.performanceRecall
            } : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? {
              set: item.performanceF1Score
            } : undefined,
          performanceAuc: item.performanceAuc !== undefined ? {
              set: item.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
              set: item.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
              set: item.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? {
              set: item.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
              set: item.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
              set: item.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
              set: item.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
              set: item.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
              set: item.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
              set: item.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
              set: item.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? {
              set: item.trainingStartTime
            } : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? {
              set: item.trainingEndTime
            } : undefined,
          trainingDuration: item.trainingDuration !== undefined ? {
              set: item.trainingDuration
            } : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
              set: item.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
              set: item.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
              set: item.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.deployedAt !== undefined ? {
              set: item.deployedAt
            } : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? {
              set: item.deprecatedAt
            } : undefined,
      childVersions: item.childVersions ? 
      Array.isArray(item.childVersions) && item.childVersions.length > 0 && item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            parentVersionId: item.parentVersionId !== undefined ? {
                equals: item.parentVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            modelName: item.modelName !== undefined ? {
                set: item.modelName
              } : undefined,
            version: item.version !== undefined ? {
                set: item.version
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? {
                set: item.performanceAccuracy
              } : undefined,
            performancePrecision: item.performancePrecision !== undefined ? {
                set: item.performancePrecision
              } : undefined,
            performanceRecall: item.performanceRecall !== undefined ? {
                set: item.performanceRecall
              } : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? {
                set: item.performanceF1Score
              } : undefined,
            performanceAuc: item.performanceAuc !== undefined ? {
                set: item.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? {
                set: item.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? {
                set: item.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? {
                set: item.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? {
                set: item.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? {
                set: item.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? {
                set: item.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? {
                set: item.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? {
                set: item.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? {
                set: item.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? {
                set: item.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? {
                set: item.trainingStartTime
              } : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? {
                set: item.trainingEndTime
              } : undefined,
            trainingDuration: item.trainingDuration !== undefined ? {
                set: item.trainingDuration
              } : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? {
                set: item.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? {
                set: item.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? {
                set: item.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.deployedAt !== undefined ? {
                set: item.deployedAt
              } : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? {
                set: item.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
      Array.isArray(item.artifacts) && item.artifacts.length > 0 && item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.artifacts.map((item) => ({
        id: item.id
      }))
} : { upsert: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
      Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 && item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
      Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 && item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId
              } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
                set: item.trafficSplitControlPercent
              } : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
                set: item.trafficSplitTreatmentPercent
              } : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
                set: item.successCriteriaPrimaryMetric
              } : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
                set: item.successCriteriaMinimumDetectableEffect
              } : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
                set: item.successCriteriaSignificanceLevel
              } : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
                set: item.successCriteriaPowerLevel
              } : undefined,
            startDate: item.startDate !== undefined ? {
                set: item.startDate
              } : undefined,
            endDate: item.endDate !== undefined ? {
                set: item.endDate
              } : undefined,
            plannedDuration: item.plannedDuration !== undefined ? {
                set: item.plannedDuration
              } : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? {
                set: item.resultsRecommendation
              } : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? {
                set: item.metadataEnvironment
              } : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? {
                set: item.completedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
      Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 && item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            analysisType: item.analysisType !== undefined ? {
                set: item.analysisType
              } : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? {
                set: item.analysisMetadataSampleSize
              } : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? {
                set: item.analysisMetadataBaselineAccuracy
              } : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? {
                set: item.analysisMetadataAnalysisDate
              } : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? {
                set: item.analysisMetadataComputationTime
              } : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? {
                set: item.insightsStabilityScore
              } : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: prop.modelVersion.artifacts ? 
    Array.isArray(prop.modelVersion.artifacts) && prop.modelVersion.artifacts.length > 0 && prop.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.modelVersion.artifacts.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId
            } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
      modelArtifact: item.modelArtifact ? 
      typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && (Object.keys(item.modelArtifact)[0] === 'id' || Object.keys(item.modelArtifact)[0] === 'symbol')
? {
      connect: {
        id: item.modelArtifact.id
      }
} : { upsert: {
          where: {
            id: item.modelArtifact.id !== undefined ? {
                equals: item.modelArtifact.id
              } : undefined,
          },
          update: {
            id: item.modelArtifact.id !== undefined ? {
                set: item.modelArtifact.id
              } : undefined,
            modelName: item.modelArtifact.modelName !== undefined ? {
                set: item.modelArtifact.modelName
              } : undefined,
            version: item.modelArtifact.version !== undefined ? {
                set: item.modelArtifact.version
              } : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? {
                set: item.modelArtifact.artifactType
              } : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? {
                set: item.modelArtifact.storageUrl
              } : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? {
                set: item.modelArtifact.storageProvider
              } : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? {
                set: item.modelArtifact.fileSize
              } : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? {
                set: item.modelArtifact.checksum
              } : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? {
                set: item.modelArtifact.compressionType
              } : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? {
                set: item.modelArtifact.metadataFramework
              } : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? {
                set: item.modelArtifact.metadataPythonVersion
              } : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? {
                set: item.modelArtifact.metadataTrainingDate
              } : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? {
                set: item.modelArtifact.metadataDatasetSize
              } : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: prop.modelVersion.abTestsAsControl ? 
    Array.isArray(prop.modelVersion.abTestsAsControl) && prop.modelVersion.abTestsAsControl.length > 0 && prop.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.modelVersion.abTestsAsControl.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      treatmentVersion: item.treatmentVersion ? 
      typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && (Object.keys(item.treatmentVersion)[0] === 'id' || Object.keys(item.treatmentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.treatmentVersion.id
      }
} : { upsert: {
          where: {
            id: item.treatmentVersion.id !== undefined ? {
                equals: item.treatmentVersion.id
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status
              } : undefined,
            parentVersionId: item.treatmentVersion.parentVersionId !== undefined ? {
                equals: item.treatmentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.treatmentVersion.id !== undefined ? {
                set: item.treatmentVersion.id
              } : undefined,
            modelName: item.treatmentVersion.modelName !== undefined ? {
                set: item.treatmentVersion.modelName
              } : undefined,
            version: item.treatmentVersion.version !== undefined ? {
                set: item.treatmentVersion.version
              } : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                set: item.treatmentVersion.status
              } : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? {
                set: item.treatmentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? {
                set: item.treatmentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? {
                set: item.treatmentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? {
                set: item.treatmentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? {
                set: item.treatmentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? {
                set: item.treatmentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.treatmentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? {
                set: item.treatmentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? {
                set: item.treatmentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? {
                set: item.treatmentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? {
                set: item.treatmentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? {
                set: item.treatmentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? {
                set: item.treatmentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.treatmentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.treatmentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? {
                set: item.treatmentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? {
                set: item.treatmentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? {
                set: item.treatmentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? {
                set: item.treatmentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.treatmentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.treatmentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? {
                set: item.treatmentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? {
                set: item.treatmentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: prop.modelVersion.abTestsAsTreatment ? 
    Array.isArray(prop.modelVersion.abTestsAsTreatment) && prop.modelVersion.abTestsAsTreatment.length > 0 && prop.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.modelVersion.abTestsAsTreatment.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId
            } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          name: item.name !== undefined ? {
              set: item.name
            } : undefined,
          description: item.description !== undefined ? {
              set: item.description
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? {
              set: item.trafficSplitControlPercent
            } : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? {
              set: item.trafficSplitTreatmentPercent
            } : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? {
              set: item.successCriteriaPrimaryMetric
            } : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? {
              set: item.successCriteriaMinimumDetectableEffect
            } : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? {
              set: item.successCriteriaSignificanceLevel
            } : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? {
              set: item.successCriteriaPowerLevel
            } : undefined,
          startDate: item.startDate !== undefined ? {
              set: item.startDate
            } : undefined,
          endDate: item.endDate !== undefined ? {
              set: item.endDate
            } : undefined,
          plannedDuration: item.plannedDuration !== undefined ? {
              set: item.plannedDuration
            } : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? {
              set: item.resultsRecommendation
            } : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? {
              set: item.metadataEnvironment
            } : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? {
              set: item.completedAt
            } : undefined,
      controlVersion: item.controlVersion ? 
      typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && (Object.keys(item.controlVersion)[0] === 'id' || Object.keys(item.controlVersion)[0] === 'symbol')
? {
      connect: {
        id: item.controlVersion.id
      }
} : { upsert: {
          where: {
            id: item.controlVersion.id !== undefined ? {
                equals: item.controlVersion.id
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status
              } : undefined,
            parentVersionId: item.controlVersion.parentVersionId !== undefined ? {
                equals: item.controlVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.controlVersion.id !== undefined ? {
                set: item.controlVersion.id
              } : undefined,
            modelName: item.controlVersion.modelName !== undefined ? {
                set: item.controlVersion.modelName
              } : undefined,
            version: item.controlVersion.version !== undefined ? {
                set: item.controlVersion.version
              } : undefined,
            status: item.controlVersion.status !== undefined ? {
                set: item.controlVersion.status
              } : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? {
                set: item.controlVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? {
                set: item.controlVersion.performancePrecision
              } : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? {
                set: item.controlVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? {
                set: item.controlVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? {
                set: item.controlVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? {
                set: item.controlVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? {
                set: item.controlVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? {
                set: item.controlVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? {
                set: item.controlVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? {
                set: item.controlVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? {
                set: item.controlVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? {
                set: item.controlVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? {
                set: item.controlVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.controlVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.controlVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? {
                set: item.controlVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? {
                set: item.controlVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? {
                set: item.controlVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? {
                set: item.controlVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.controlVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? {
                set: item.controlVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? {
                set: item.controlVersion.deployedAt
              } : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? {
                set: item.controlVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        modelName: prop.modelVersion.modelName !== undefined ? prop.modelVersion.modelName : undefined,
        version: prop.modelVersion.version !== undefined ? prop.modelVersion.version : undefined,
        status: prop.modelVersion.status !== undefined ? prop.modelVersion.status : undefined,
        performanceAccuracy: prop.modelVersion.performanceAccuracy !== undefined ? prop.modelVersion.performanceAccuracy : undefined,
        performancePrecision: prop.modelVersion.performancePrecision !== undefined ? prop.modelVersion.performancePrecision : undefined,
        performanceRecall: prop.modelVersion.performanceRecall !== undefined ? prop.modelVersion.performanceRecall : undefined,
        performanceF1Score: prop.modelVersion.performanceF1Score !== undefined ? prop.modelVersion.performanceF1Score : undefined,
        performanceAuc: prop.modelVersion.performanceAuc !== undefined ? prop.modelVersion.performanceAuc : undefined,
        performanceSharpeRatio: prop.modelVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.performanceSharpeRatio : undefined,
        performanceMaxDrawdown: prop.modelVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.performanceMaxDrawdown : undefined,
        performanceWinRate: prop.modelVersion.performanceWinRate !== undefined ? prop.modelVersion.performanceWinRate : undefined,
        performanceAvgReturn: prop.modelVersion.performanceAvgReturn !== undefined ? prop.modelVersion.performanceAvgReturn : undefined,
        performanceCalibrationScore: prop.modelVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.performanceCalibrationScore : undefined,
        performanceStabilityScore: prop.modelVersion.performanceStabilityScore !== undefined ? prop.modelVersion.performanceStabilityScore : undefined,
        validationCrossValidationScore: prop.modelVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.validationCrossValidationScore : undefined,
        validationOutOfSamplePerformance: prop.modelVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.validationOutOfSamplePerformance : undefined,
        validationBacktestResults: prop.modelVersion.validationBacktestResults !== undefined ? prop.modelVersion.validationBacktestResults : undefined,
        validationStatTestResults: prop.modelVersion.validationStatTestResults !== undefined ? prop.modelVersion.validationStatTestResults : undefined,
        deploymentEnvironment: prop.modelVersion.deploymentEnvironment !== undefined ? prop.modelVersion.deploymentEnvironment : undefined,
        deploymentTrafficAllocation: prop.modelVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.deploymentTrafficAllocation : undefined,
        deploymentRolloutStrategy: prop.modelVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.deploymentRolloutStrategy : undefined,
        deploymentHealthCheckConfig: prop.modelVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.deploymentHealthCheckConfig : undefined,
        trainingStartTime: prop.modelVersion.trainingStartTime !== undefined ? prop.modelVersion.trainingStartTime : undefined,
        trainingEndTime: prop.modelVersion.trainingEndTime !== undefined ? prop.modelVersion.trainingEndTime : undefined,
        trainingDuration: prop.modelVersion.trainingDuration !== undefined ? prop.modelVersion.trainingDuration : undefined,
        trainingDatasetSize: prop.modelVersion.trainingDatasetSize !== undefined ? prop.modelVersion.trainingDatasetSize : undefined,
        trainingFeaturesUsed: prop.modelVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.trainingFeaturesUsed : undefined,
        trainingHyperparameters: prop.modelVersion.trainingHyperparameters !== undefined ? prop.modelVersion.trainingHyperparameters : undefined,
        trainingResourcePeakMemoryMB: prop.modelVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.trainingResourcePeakMemoryMB : undefined,
        trainingResourceTotalCpuHours: prop.modelVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.trainingResourceTotalCpuHours : undefined,
        trainingResourceGpuHours: prop.modelVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.trainingResourceGpuHours : undefined,
        deployedAt: prop.modelVersion.deployedAt !== undefined ? prop.modelVersion.deployedAt : undefined,
        deprecatedAt: prop.modelVersion.deprecatedAt !== undefined ? prop.modelVersion.deprecatedAt : undefined,
    parentVersion: prop.modelVersion.parentVersion ? 
      typeof prop.modelVersion.parentVersion === 'object' && Object.keys(prop.modelVersion.parentVersion).length === 1 && Object.keys(prop.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
          id: prop.modelVersion.parentVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.modelVersion.parentVersion.id !== undefined ? prop.modelVersion.parentVersion.id : undefined,
          status: prop.modelVersion.parentVersion.status !== undefined ? {
              equals: prop.modelVersion.parentVersion.status 
             } : undefined,
        },
        create: {
          modelName: prop.modelVersion.parentVersion.modelName !== undefined ? prop.modelVersion.parentVersion.modelName : undefined,
          version: prop.modelVersion.parentVersion.version !== undefined ? prop.modelVersion.parentVersion.version : undefined,
          status: prop.modelVersion.parentVersion.status !== undefined ? prop.modelVersion.parentVersion.status : undefined,
          performanceAccuracy: prop.modelVersion.parentVersion.performanceAccuracy !== undefined ? prop.modelVersion.parentVersion.performanceAccuracy : undefined,
          performancePrecision: prop.modelVersion.parentVersion.performancePrecision !== undefined ? prop.modelVersion.parentVersion.performancePrecision : undefined,
          performanceRecall: prop.modelVersion.parentVersion.performanceRecall !== undefined ? prop.modelVersion.parentVersion.performanceRecall : undefined,
          performanceF1Score: prop.modelVersion.parentVersion.performanceF1Score !== undefined ? prop.modelVersion.parentVersion.performanceF1Score : undefined,
          performanceAuc: prop.modelVersion.parentVersion.performanceAuc !== undefined ? prop.modelVersion.parentVersion.performanceAuc : undefined,
          performanceSharpeRatio: prop.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.parentVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: prop.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: prop.modelVersion.parentVersion.performanceWinRate !== undefined ? prop.modelVersion.parentVersion.performanceWinRate : undefined,
          performanceAvgReturn: prop.modelVersion.parentVersion.performanceAvgReturn !== undefined ? prop.modelVersion.parentVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: prop.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.parentVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: prop.modelVersion.parentVersion.performanceStabilityScore !== undefined ? prop.modelVersion.parentVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: prop.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.parentVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: prop.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: prop.modelVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.validationBacktestResults : undefined,
          validationStatTestResults: prop.modelVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.validationStatTestResults : undefined,
          deploymentEnvironment: prop.modelVersion.parentVersion.deploymentEnvironment !== undefined ? prop.modelVersion.parentVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: prop.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: prop.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: prop.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: prop.modelVersion.parentVersion.trainingStartTime !== undefined ? prop.modelVersion.parentVersion.trainingStartTime : undefined,
          trainingEndTime: prop.modelVersion.parentVersion.trainingEndTime !== undefined ? prop.modelVersion.parentVersion.trainingEndTime : undefined,
          trainingDuration: prop.modelVersion.parentVersion.trainingDuration !== undefined ? prop.modelVersion.parentVersion.trainingDuration : undefined,
          trainingDatasetSize: prop.modelVersion.parentVersion.trainingDatasetSize !== undefined ? prop.modelVersion.parentVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: prop.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: prop.modelVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: prop.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
          deployedAt: prop.modelVersion.parentVersion.deployedAt !== undefined ? prop.modelVersion.parentVersion.deployedAt : undefined,
          deprecatedAt: prop.modelVersion.parentVersion.deprecatedAt !== undefined ? prop.modelVersion.parentVersion.deprecatedAt : undefined,
      parentVersion: prop.modelVersion.parentVersion.parentVersion ? 
        typeof prop.modelVersion.parentVersion.parentVersion === 'object' && Object.keys(prop.modelVersion.parentVersion.parentVersion).length === 1 && Object.keys(prop.modelVersion.parentVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: prop.modelVersion.parentVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.modelVersion.parentVersion.parentVersion.id !== undefined ? prop.modelVersion.parentVersion.parentVersion.id : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? {
                equals: prop.modelVersion.parentVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: prop.modelVersion.parentVersion.parentVersion.modelName !== undefined ? prop.modelVersion.parentVersion.parentVersion.modelName : undefined,
            version: prop.modelVersion.parentVersion.parentVersion.version !== undefined ? prop.modelVersion.parentVersion.parentVersion.version : undefined,
            status: prop.modelVersion.parentVersion.parentVersion.status !== undefined ? prop.modelVersion.parentVersion.parentVersion.status : undefined,
            performanceAccuracy: prop.modelVersion.parentVersion.parentVersion.performanceAccuracy !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: prop.modelVersion.parentVersion.parentVersion.performancePrecision !== undefined ? prop.modelVersion.parentVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: prop.modelVersion.parentVersion.parentVersion.performanceRecall !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: prop.modelVersion.parentVersion.parentVersion.performanceF1Score !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: prop.modelVersion.parentVersion.parentVersion.performanceAuc !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: prop.modelVersion.parentVersion.parentVersion.performanceWinRate !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: prop.modelVersion.parentVersion.parentVersion.validationBacktestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: prop.modelVersion.parentVersion.parentVersion.validationStatTestResults !== undefined ? prop.modelVersion.parentVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? prop.modelVersion.parentVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: prop.modelVersion.parentVersion.parentVersion.trainingStartTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: prop.modelVersion.parentVersion.parentVersion.trainingEndTime !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: prop.modelVersion.parentVersion.parentVersion.trainingDuration !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours !== undefined ? prop.modelVersion.parentVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: prop.modelVersion.parentVersion.parentVersion.deployedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: prop.modelVersion.parentVersion.parentVersion.deprecatedAt !== undefined ? prop.modelVersion.parentVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      artifacts: prop.modelVersion.parentVersion.artifacts ? 
        Array.isArray(prop.modelVersion.parentVersion.artifacts) && prop.modelVersion.parentVersion.artifacts.length > 0 &&  prop.modelVersion.parentVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: prop.modelVersion.parentVersion.abTestsAsControl ? 
        Array.isArray(prop.modelVersion.parentVersion.abTestsAsControl) && prop.modelVersion.parentVersion.abTestsAsControl.length > 0 &&  prop.modelVersion.parentVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: prop.modelVersion.parentVersion.abTestsAsTreatment ? 
        Array.isArray(prop.modelVersion.parentVersion.abTestsAsTreatment) && prop.modelVersion.parentVersion.abTestsAsTreatment.length > 0 &&  prop.modelVersion.parentVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: prop.modelVersion.parentVersion.featureImportanceAnalyses ? 
        Array.isArray(prop.modelVersion.parentVersion.featureImportanceAnalyses) && prop.modelVersion.parentVersion.featureImportanceAnalyses.length > 0 &&  prop.modelVersion.parentVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.modelVersion.parentVersion.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    childVersions: prop.modelVersion.childVersions ? 
      Array.isArray(prop.modelVersion.childVersions) && prop.modelVersion.childVersions.length > 0 &&  prop.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.modelVersion.childVersions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.modelVersion.childVersions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          modelName: item.modelName !== undefined ? item.modelName : undefined,
          version: item.version !== undefined ? item.version : undefined,
          status: item.status !== undefined ? item.status : undefined,
          performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
          performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
          performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
          performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
          performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
          performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
          performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
          performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
          validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
          deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
          trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
          trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
          trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
          deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
          deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
      childVersions: item.childVersions ? 
        Array.isArray(item.childVersions) && item.childVersions.length > 0 &&  item.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.childVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            modelName: item.modelName !== undefined ? item.modelName : undefined,
            version: item.version !== undefined ? item.version : undefined,
            status: item.status !== undefined ? item.status : undefined,
            performanceAccuracy: item.performanceAccuracy !== undefined ? item.performanceAccuracy : undefined,
            performancePrecision: item.performancePrecision !== undefined ? item.performancePrecision : undefined,
            performanceRecall: item.performanceRecall !== undefined ? item.performanceRecall : undefined,
            performanceF1Score: item.performanceF1Score !== undefined ? item.performanceF1Score : undefined,
            performanceAuc: item.performanceAuc !== undefined ? item.performanceAuc : undefined,
            performanceSharpeRatio: item.performanceSharpeRatio !== undefined ? item.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.performanceMaxDrawdown !== undefined ? item.performanceMaxDrawdown : undefined,
            performanceWinRate: item.performanceWinRate !== undefined ? item.performanceWinRate : undefined,
            performanceAvgReturn: item.performanceAvgReturn !== undefined ? item.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.performanceCalibrationScore !== undefined ? item.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.performanceStabilityScore !== undefined ? item.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.validationCrossValidationScore !== undefined ? item.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.validationOutOfSamplePerformance !== undefined ? item.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.validationBacktestResults !== undefined ? item.validationBacktestResults : undefined,
            validationStatTestResults: item.validationStatTestResults !== undefined ? item.validationStatTestResults : undefined,
            deploymentEnvironment: item.deploymentEnvironment !== undefined ? item.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.deploymentTrafficAllocation !== undefined ? item.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.deploymentRolloutStrategy !== undefined ? item.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.deploymentHealthCheckConfig !== undefined ? item.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.trainingStartTime !== undefined ? item.trainingStartTime : undefined,
            trainingEndTime: item.trainingEndTime !== undefined ? item.trainingEndTime : undefined,
            trainingDuration: item.trainingDuration !== undefined ? item.trainingDuration : undefined,
            trainingDatasetSize: item.trainingDatasetSize !== undefined ? item.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.trainingFeaturesUsed !== undefined ? item.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.trainingHyperparameters !== undefined ? item.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.trainingResourcePeakMemoryMB !== undefined ? item.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.trainingResourceTotalCpuHours !== undefined ? item.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.trainingResourceGpuHours !== undefined ? item.trainingResourceGpuHours : undefined,
            deployedAt: item.deployedAt !== undefined ? item.deployedAt : undefined,
            deprecatedAt: item.deprecatedAt !== undefined ? item.deprecatedAt : undefined,
          },
        }))
      } : undefined,
      artifacts: item.artifacts ? 
        Array.isArray(item.artifacts) && item.artifacts.length > 0 &&  item.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.artifacts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.artifacts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
            modelArtifactId: item.modelArtifactId !== undefined ? {
                equals: item.modelArtifactId 
               } : undefined,
          },
          create: {
          },
        }))
      } : undefined,
      abTestsAsControl: item.abTestsAsControl ? 
        Array.isArray(item.abTestsAsControl) && item.abTestsAsControl.length > 0 &&  item.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsControl.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      abTestsAsTreatment: item.abTestsAsTreatment ? 
        Array.isArray(item.abTestsAsTreatment) && item.abTestsAsTreatment.length > 0 &&  item.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.abTestsAsTreatment.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            modelVersionAId: item.modelVersionAId !== undefined ? {
                equals: item.modelVersionAId 
               } : undefined,
            modelVersionBId: item.modelVersionBId !== undefined ? {
                equals: item.modelVersionBId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
            trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
            targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
            successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
            successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
            successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
            successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
            startDate: item.startDate !== undefined ? item.startDate : undefined,
            endDate: item.endDate !== undefined ? item.endDate : undefined,
            plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
            resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
            resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
            resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
            resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
            resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
            resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
            metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
            metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
            metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
            metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
            completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
          },
        }))
      } : undefined,
      featureImportanceAnalyses: item.featureImportanceAnalyses ? 
        Array.isArray(item.featureImportanceAnalyses) && item.featureImportanceAnalyses.length > 0 &&  item.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.featureImportanceAnalyses.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            modelVersionId: item.modelVersionId !== undefined ? {
                equals: item.modelVersionId 
               } : undefined,
          },
          create: {
            analysisType: item.analysisType !== undefined ? item.analysisType : undefined,
            featureImportances: item.featureImportances !== undefined ? item.featureImportances : undefined,
            globalImportance: item.globalImportance !== undefined ? item.globalImportance : undefined,
            localImportance: item.localImportance !== undefined ? item.localImportance : undefined,
            analysisMetadataSampleSize: item.analysisMetadataSampleSize !== undefined ? item.analysisMetadataSampleSize : undefined,
            analysisMetadataBaselineAccuracy: item.analysisMetadataBaselineAccuracy !== undefined ? item.analysisMetadataBaselineAccuracy : undefined,
            analysisMetadataAnalysisDate: item.analysisMetadataAnalysisDate !== undefined ? item.analysisMetadataAnalysisDate : undefined,
            analysisMetadataComputationTime: item.analysisMetadataComputationTime !== undefined ? item.analysisMetadataComputationTime : undefined,
            analysisMetadataAnalysisParameters: item.analysisMetadataAnalysisParameters !== undefined ? item.analysisMetadataAnalysisParameters : undefined,
            insightsTopFeatures: item.insightsTopFeatures !== undefined ? item.insightsTopFeatures : undefined,
            insightsRedundantFeatures: item.insightsRedundantFeatures !== undefined ? item.insightsRedundantFeatures : undefined,
            insightsUnexpectedImportances: item.insightsUnexpectedImportances !== undefined ? item.insightsUnexpectedImportances : undefined,
            insightsStabilityScore: item.insightsStabilityScore !== undefined ? item.insightsStabilityScore : undefined,
            insightsRecommendations: item.insightsRecommendations !== undefined ? item.insightsRecommendations : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    artifacts: prop.modelVersion.artifacts ? 
      Array.isArray(prop.modelVersion.artifacts) && prop.modelVersion.artifacts.length > 0 &&  prop.modelVersion.artifacts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.modelVersion.artifacts.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.modelVersion.artifacts.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          modelVersionId: item.modelVersionId !== undefined ? {
              equals: item.modelVersionId 
             } : undefined,
          modelArtifactId: item.modelArtifactId !== undefined ? {
              equals: item.modelArtifactId 
             } : undefined,
        },
        create: {
      modelArtifact: item.modelArtifact ? 
        typeof item.modelArtifact === 'object' && Object.keys(item.modelArtifact).length === 1 && Object.keys(item.modelArtifact)[0] === 'id'
    ? { connect: {
            id: item.modelArtifact.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelArtifact.id !== undefined ? item.modelArtifact.id : undefined,
          },
          create: {
            modelName: item.modelArtifact.modelName !== undefined ? item.modelArtifact.modelName : undefined,
            version: item.modelArtifact.version !== undefined ? item.modelArtifact.version : undefined,
            artifactType: item.modelArtifact.artifactType !== undefined ? item.modelArtifact.artifactType : undefined,
            storageUrl: item.modelArtifact.storageUrl !== undefined ? item.modelArtifact.storageUrl : undefined,
            storageProvider: item.modelArtifact.storageProvider !== undefined ? item.modelArtifact.storageProvider : undefined,
            fileSize: item.modelArtifact.fileSize !== undefined ? item.modelArtifact.fileSize : undefined,
            checksum: item.modelArtifact.checksum !== undefined ? item.modelArtifact.checksum : undefined,
            compressionType: item.modelArtifact.compressionType !== undefined ? item.modelArtifact.compressionType : undefined,
            metadataFramework: item.modelArtifact.metadataFramework !== undefined ? item.modelArtifact.metadataFramework : undefined,
            metadataPythonVersion: item.modelArtifact.metadataPythonVersion !== undefined ? item.modelArtifact.metadataPythonVersion : undefined,
            metadataDependencies: item.modelArtifact.metadataDependencies !== undefined ? item.modelArtifact.metadataDependencies : undefined,
            metadataTrainingDate: item.modelArtifact.metadataTrainingDate !== undefined ? item.modelArtifact.metadataTrainingDate : undefined,
            metadataDatasetSize: item.modelArtifact.metadataDatasetSize !== undefined ? item.modelArtifact.metadataDatasetSize : undefined,
            metadataHyperparameters: item.modelArtifact.metadataHyperparameters !== undefined ? item.modelArtifact.metadataHyperparameters : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsControl: prop.modelVersion.abTestsAsControl ? 
      Array.isArray(prop.modelVersion.abTestsAsControl) && prop.modelVersion.abTestsAsControl.length > 0 &&  prop.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.modelVersion.abTestsAsControl.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.modelVersion.abTestsAsControl.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      treatmentVersion: item.treatmentVersion ? 
        typeof item.treatmentVersion === 'object' && Object.keys(item.treatmentVersion).length === 1 && Object.keys(item.treatmentVersion)[0] === 'id'
    ? { connect: {
            id: item.treatmentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.treatmentVersion.id !== undefined ? item.treatmentVersion.id : undefined,
            status: item.treatmentVersion.status !== undefined ? {
                equals: item.treatmentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.treatmentVersion.modelName !== undefined ? item.treatmentVersion.modelName : undefined,
            version: item.treatmentVersion.version !== undefined ? item.treatmentVersion.version : undefined,
            status: item.treatmentVersion.status !== undefined ? item.treatmentVersion.status : undefined,
            performanceAccuracy: item.treatmentVersion.performanceAccuracy !== undefined ? item.treatmentVersion.performanceAccuracy : undefined,
            performancePrecision: item.treatmentVersion.performancePrecision !== undefined ? item.treatmentVersion.performancePrecision : undefined,
            performanceRecall: item.treatmentVersion.performanceRecall !== undefined ? item.treatmentVersion.performanceRecall : undefined,
            performanceF1Score: item.treatmentVersion.performanceF1Score !== undefined ? item.treatmentVersion.performanceF1Score : undefined,
            performanceAuc: item.treatmentVersion.performanceAuc !== undefined ? item.treatmentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.treatmentVersion.performanceSharpeRatio !== undefined ? item.treatmentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.treatmentVersion.performanceMaxDrawdown !== undefined ? item.treatmentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.treatmentVersion.performanceWinRate !== undefined ? item.treatmentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.treatmentVersion.performanceAvgReturn !== undefined ? item.treatmentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.treatmentVersion.performanceCalibrationScore !== undefined ? item.treatmentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.treatmentVersion.performanceStabilityScore !== undefined ? item.treatmentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.treatmentVersion.validationCrossValidationScore !== undefined ? item.treatmentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.treatmentVersion.validationOutOfSamplePerformance !== undefined ? item.treatmentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.treatmentVersion.validationBacktestResults !== undefined ? item.treatmentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.treatmentVersion.validationStatTestResults !== undefined ? item.treatmentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.treatmentVersion.deploymentEnvironment !== undefined ? item.treatmentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.treatmentVersion.deploymentTrafficAllocation !== undefined ? item.treatmentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.treatmentVersion.deploymentRolloutStrategy !== undefined ? item.treatmentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.treatmentVersion.deploymentHealthCheckConfig !== undefined ? item.treatmentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.treatmentVersion.trainingStartTime !== undefined ? item.treatmentVersion.trainingStartTime : undefined,
            trainingEndTime: item.treatmentVersion.trainingEndTime !== undefined ? item.treatmentVersion.trainingEndTime : undefined,
            trainingDuration: item.treatmentVersion.trainingDuration !== undefined ? item.treatmentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.treatmentVersion.trainingDatasetSize !== undefined ? item.treatmentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.treatmentVersion.trainingFeaturesUsed !== undefined ? item.treatmentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.treatmentVersion.trainingHyperparameters !== undefined ? item.treatmentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.treatmentVersion.trainingResourcePeakMemoryMB !== undefined ? item.treatmentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.treatmentVersion.trainingResourceTotalCpuHours !== undefined ? item.treatmentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.treatmentVersion.trainingResourceGpuHours !== undefined ? item.treatmentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.treatmentVersion.deployedAt !== undefined ? item.treatmentVersion.deployedAt : undefined,
            deprecatedAt: item.treatmentVersion.deprecatedAt !== undefined ? item.treatmentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    abTestsAsTreatment: prop.modelVersion.abTestsAsTreatment ? 
      Array.isArray(prop.modelVersion.abTestsAsTreatment) && prop.modelVersion.abTestsAsTreatment.length > 0 &&  prop.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.modelVersion.abTestsAsTreatment.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.modelVersion.abTestsAsTreatment.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          name: item.name !== undefined ? {
              equals: item.name 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
          modelVersionAId: item.modelVersionAId !== undefined ? {
              equals: item.modelVersionAId 
             } : undefined,
          modelVersionBId: item.modelVersionBId !== undefined ? {
              equals: item.modelVersionBId 
             } : undefined,
        },
        create: {
          name: item.name !== undefined ? item.name : undefined,
          description: item.description !== undefined ? item.description : undefined,
          status: item.status !== undefined ? item.status : undefined,
          trafficSplitControlPercent: item.trafficSplitControlPercent !== undefined ? item.trafficSplitControlPercent : undefined,
          trafficSplitTreatmentPercent: item.trafficSplitTreatmentPercent !== undefined ? item.trafficSplitTreatmentPercent : undefined,
          targetMetrics: item.targetMetrics !== undefined ? item.targetMetrics : undefined,
          successCriteriaPrimaryMetric: item.successCriteriaPrimaryMetric !== undefined ? item.successCriteriaPrimaryMetric : undefined,
          successCriteriaMinimumDetectableEffect: item.successCriteriaMinimumDetectableEffect !== undefined ? item.successCriteriaMinimumDetectableEffect : undefined,
          successCriteriaSignificanceLevel: item.successCriteriaSignificanceLevel !== undefined ? item.successCriteriaSignificanceLevel : undefined,
          successCriteriaPowerLevel: item.successCriteriaPowerLevel !== undefined ? item.successCriteriaPowerLevel : undefined,
          startDate: item.startDate !== undefined ? item.startDate : undefined,
          endDate: item.endDate !== undefined ? item.endDate : undefined,
          plannedDuration: item.plannedDuration !== undefined ? item.plannedDuration : undefined,
          resultsControlMetrics: item.resultsControlMetrics !== undefined ? item.resultsControlMetrics : undefined,
          resultsTreatmentMetrics: item.resultsTreatmentMetrics !== undefined ? item.resultsTreatmentMetrics : undefined,
          resultsStatisticalSignificance: item.resultsStatisticalSignificance !== undefined ? item.resultsStatisticalSignificance : undefined,
          resultsPValues: item.resultsPValues !== undefined ? item.resultsPValues : undefined,
          resultsConfidenceIntervals: item.resultsConfidenceIntervals !== undefined ? item.resultsConfidenceIntervals : undefined,
          resultsRecommendation: item.resultsRecommendation !== undefined ? item.resultsRecommendation : undefined,
          metadataEnvironment: item.metadataEnvironment !== undefined ? item.metadataEnvironment : undefined,
          metadataEligibilityCriteria: item.metadataEligibilityCriteria !== undefined ? item.metadataEligibilityCriteria : undefined,
          metadataExclusionCriteria: item.metadataExclusionCriteria !== undefined ? item.metadataExclusionCriteria : undefined,
          metadataSegmentationRules: item.metadataSegmentationRules !== undefined ? item.metadataSegmentationRules : undefined,
          completedAt: item.completedAt !== undefined ? item.completedAt : undefined,
      controlVersion: item.controlVersion ? 
        typeof item.controlVersion === 'object' && Object.keys(item.controlVersion).length === 1 && Object.keys(item.controlVersion)[0] === 'id'
    ? { connect: {
            id: item.controlVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.controlVersion.id !== undefined ? item.controlVersion.id : undefined,
            status: item.controlVersion.status !== undefined ? {
                equals: item.controlVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.controlVersion.modelName !== undefined ? item.controlVersion.modelName : undefined,
            version: item.controlVersion.version !== undefined ? item.controlVersion.version : undefined,
            status: item.controlVersion.status !== undefined ? item.controlVersion.status : undefined,
            performanceAccuracy: item.controlVersion.performanceAccuracy !== undefined ? item.controlVersion.performanceAccuracy : undefined,
            performancePrecision: item.controlVersion.performancePrecision !== undefined ? item.controlVersion.performancePrecision : undefined,
            performanceRecall: item.controlVersion.performanceRecall !== undefined ? item.controlVersion.performanceRecall : undefined,
            performanceF1Score: item.controlVersion.performanceF1Score !== undefined ? item.controlVersion.performanceF1Score : undefined,
            performanceAuc: item.controlVersion.performanceAuc !== undefined ? item.controlVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.controlVersion.performanceSharpeRatio !== undefined ? item.controlVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.controlVersion.performanceMaxDrawdown !== undefined ? item.controlVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.controlVersion.performanceWinRate !== undefined ? item.controlVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.controlVersion.performanceAvgReturn !== undefined ? item.controlVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.controlVersion.performanceCalibrationScore !== undefined ? item.controlVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.controlVersion.performanceStabilityScore !== undefined ? item.controlVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.controlVersion.validationCrossValidationScore !== undefined ? item.controlVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.controlVersion.validationOutOfSamplePerformance !== undefined ? item.controlVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.controlVersion.validationBacktestResults !== undefined ? item.controlVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.controlVersion.validationStatTestResults !== undefined ? item.controlVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.controlVersion.deploymentEnvironment !== undefined ? item.controlVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.controlVersion.deploymentTrafficAllocation !== undefined ? item.controlVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.controlVersion.deploymentRolloutStrategy !== undefined ? item.controlVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.controlVersion.deploymentHealthCheckConfig !== undefined ? item.controlVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.controlVersion.trainingStartTime !== undefined ? item.controlVersion.trainingStartTime : undefined,
            trainingEndTime: item.controlVersion.trainingEndTime !== undefined ? item.controlVersion.trainingEndTime : undefined,
            trainingDuration: item.controlVersion.trainingDuration !== undefined ? item.controlVersion.trainingDuration : undefined,
            trainingDatasetSize: item.controlVersion.trainingDatasetSize !== undefined ? item.controlVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.controlVersion.trainingFeaturesUsed !== undefined ? item.controlVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.controlVersion.trainingHyperparameters !== undefined ? item.controlVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.controlVersion.trainingResourcePeakMemoryMB !== undefined ? item.controlVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.controlVersion.trainingResourceTotalCpuHours !== undefined ? item.controlVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.controlVersion.trainingResourceGpuHours !== undefined ? item.controlVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.controlVersion.deployedAt !== undefined ? item.controlVersion.deployedAt : undefined,
            deprecatedAt: item.controlVersion.deprecatedAt !== undefined ? item.controlVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyFeatureImportanceAnalysis) {
          return response.data.updateManyFeatureImportanceAnalysis;
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateManyFeatureImportanceAnalysis", {
            operation: 'updateManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateManyFeatureImportanceAnalysis, retrying...", {
            operation: 'updateManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Delete a single FeatureImportanceAnalysis record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted FeatureImportanceAnalysis or null.
   */
  async delete(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<FeatureImportanceAnalysisType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const DELETE_ONE_FEATUREIMPORTANCEANALYSIS = gql`
          mutation deleteOneFeatureImportanceAnalysis($where: FeatureImportanceAnalysisWhereUniqueInput!) {
            deleteOneFeatureImportanceAnalysis(where: $where) {
              id
            }
          }`;

        const variables = {
          where: {
            id: props.id ? props.id : undefined,
          }
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: DELETE_ONE_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneFeatureImportanceAnalysis) {
          return response.data.deleteOneFeatureImportanceAnalysis;
        } else {
          return null as unknown as FeatureImportanceAnalysisType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        // (e.g., foreign key constraints preventing deletion)
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('23503') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003') ||
          error.message?.includes('P2014');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in deleteOneFeatureImportanceAnalysis", {
            operation: 'deleteOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in deleteOneFeatureImportanceAnalysis, retrying...", {
            operation: 'deleteOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database delete operation failed (transient after retries)", {
            operation: 'deleteOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve a single FeatureImportanceAnalysis record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved FeatureImportanceAnalysis or null.
   */
  async get(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<FeatureImportanceAnalysisType | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_FEATUREIMPORTANCEANALYSIS = gql`
          query getFeatureImportanceAnalysis($where: FeatureImportanceAnalysisWhereUniqueInput!) {
            getFeatureImportanceAnalysis(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  modelVersionId: props.modelVersionId !== undefined ? {
    equals: props.modelVersionId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getFeatureImportanceAnalysis ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No FeatureImportanceAnalysis found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in getFeatureImportanceAnalysis, retrying...", {
            operation: 'getFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve all FeatureImportanceAnalyses records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of FeatureImportanceAnalysis records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<FeatureImportanceAnalysisType[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_ALL_FEATUREIMPORTANCEANALYSIS = gql`
          query getAllFeatureImportanceAnalysis {
            featureImportanceAnalyses {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_FEATUREIMPORTANCEANALYSIS,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.featureImportanceAnalyses ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No FeatureImportanceAnalysis found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in getAllFeatureImportanceAnalysis, retrying...", {
            operation: 'getAllFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Find multiple FeatureImportanceAnalysis records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found FeatureImportanceAnalysis records or null.
   */
  async findMany(props: FeatureImportanceAnalysisType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<FeatureImportanceAnalysisType[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const FIND_MANY_FEATUREIMPORTANCEANALYSIS = gql`
          query findManyFeatureImportanceAnalysis($where: FeatureImportanceAnalysisWhereInput!) {
            featureImportanceAnalyses(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  modelVersionId: props.modelVersionId !== undefined ? {
    equals: props.modelVersionId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyFeatureImportanceAnalysis requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_FEATUREIMPORTANCEANALYSIS,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.featureImportanceAnalyses) {
          return response.data.featureImportanceAnalyses;
        } else {
          return [] as FeatureImportanceAnalysisType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No FeatureImportanceAnalysis found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in findManyFeatureImportanceAnalysis, retrying...", {
            operation: 'findManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyFeatureImportanceAnalysis',
            model: 'FeatureImportanceAnalysis',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  }
};
