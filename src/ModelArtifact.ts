
  
import { ModelArtifact as ModelArtifactType } from './generated/typegraphql-prisma/models/ModelArtifact';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the ModelArtifact model.
   */

  const selectionSet = `
    
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
  modelVersions {
    id
    modelVersionId
    modelArtifactId
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
    modelArtifact {
id
    }
    createdAt
  }

  `;

  export const ModelArtifact = {

    /**
     * Create a new ModelArtifact record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created ModelArtifact or null.
     */

    /**
     * Create a new ModelArtifact record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created ModelArtifact or null.
     */
    async create(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ModelArtifactType> {
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

          const CREATE_ONE_MODELARTIFACT = gql`
              mutation createOneModelArtifact($data: ModelArtifactCreateInput!) {
                createOneModelArtifact(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                modelName: props.modelName !== undefined ? props.modelName : undefined,
  version: props.version !== undefined ? props.version : undefined,
  artifactType: props.artifactType !== undefined ? props.artifactType : undefined,
  storageUrl: props.storageUrl !== undefined ? props.storageUrl : undefined,
  storageProvider: props.storageProvider !== undefined ? props.storageProvider : undefined,
  fileSize: props.fileSize !== undefined ? props.fileSize : undefined,
  checksum: props.checksum !== undefined ? props.checksum : undefined,
  compressionType: props.compressionType !== undefined ? props.compressionType : undefined,
  metadataFramework: props.metadataFramework !== undefined ? props.metadataFramework : undefined,
  metadataPythonVersion: props.metadataPythonVersion !== undefined ? props.metadataPythonVersion : undefined,
  metadataDependencies: props.metadataDependencies !== undefined ? props.metadataDependencies : undefined,
  metadataTrainingDate: props.metadataTrainingDate !== undefined ? props.metadataTrainingDate : undefined,
  metadataDatasetSize: props.metadataDatasetSize !== undefined ? props.metadataDatasetSize : undefined,
  metadataHyperparameters: props.metadataHyperparameters !== undefined ? props.metadataHyperparameters : undefined,
  modelVersions: props.modelVersions ? 
    Array.isArray(props.modelVersions) && props.modelVersions.length > 0 &&  props.modelVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.modelVersions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.modelVersions.map((item) => ({
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
    modelVersion: item.modelVersion ? 
      typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && Object.keys(item.modelVersion)[0] === 'id'
    ? { connect: {
          id: item.modelVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.modelVersion.id !== undefined ? item.modelVersion.id : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status 
             } : undefined,
        },
        create: {
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
    }))
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_MODELARTIFACT,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneModelArtifact) {
            return response.data.createOneModelArtifact;
          } else {
            return null as unknown as ModelArtifactType;
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
            logger.error("Non-retryable constraint violation in createOneModelArtifact", {
              operation: 'createOneModelArtifact',
              model: 'ModelArtifact',
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
            logger.warn("Database connection error in createOneModelArtifact, retrying...", {
              operation: 'createOneModelArtifact',
              model: 'ModelArtifact',
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
              operation: 'createOneModelArtifact',
              model: 'ModelArtifact',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneModelArtifact',
              model: 'ModelArtifact',
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
   * Create multiple ModelArtifact records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of ModelArtifact objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: ModelArtifactType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_MODELARTIFACT = gql`
          mutation createManyModelArtifact($data: [ModelArtifactCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyModelArtifact(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      modelName: prop.modelName !== undefined ? prop.modelName : undefined,
  version: prop.version !== undefined ? prop.version : undefined,
  artifactType: prop.artifactType !== undefined ? prop.artifactType : undefined,
  storageUrl: prop.storageUrl !== undefined ? prop.storageUrl : undefined,
  storageProvider: prop.storageProvider !== undefined ? prop.storageProvider : undefined,
  fileSize: prop.fileSize !== undefined ? prop.fileSize : undefined,
  checksum: prop.checksum !== undefined ? prop.checksum : undefined,
  compressionType: prop.compressionType !== undefined ? prop.compressionType : undefined,
  metadataFramework: prop.metadataFramework !== undefined ? prop.metadataFramework : undefined,
  metadataPythonVersion: prop.metadataPythonVersion !== undefined ? prop.metadataPythonVersion : undefined,
  metadataDependencies: prop.metadataDependencies !== undefined ? prop.metadataDependencies : undefined,
  metadataTrainingDate: prop.metadataTrainingDate !== undefined ? prop.metadataTrainingDate : undefined,
  metadataDatasetSize: prop.metadataDatasetSize !== undefined ? prop.metadataDatasetSize : undefined,
  metadataHyperparameters: prop.metadataHyperparameters !== undefined ? prop.metadataHyperparameters : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_MODELARTIFACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyModelArtifact) {
          return response.data.createManyModelArtifact;
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
          logger.warn("Duplicate key in createManyModelArtifact (expected during overlapping fetches)", {
            operation: 'createManyModelArtifact',
            model: 'ModelArtifact',
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
          logger.warn("Database connection error in createManyModelArtifact, retrying...", {
            operation: 'createManyModelArtifact',
            model: 'ModelArtifact',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyModelArtifact',
            model: 'ModelArtifact',
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
   * Update a single ModelArtifact record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated ModelArtifact or null.
   */
  async update(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ModelArtifactType> {
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

        const UPDATE_ONE_MODELARTIFACT = gql`
          mutation updateOneModelArtifact($data: ModelArtifactUpdateInput!, $where: ModelArtifactWhereUniqueInput!) {
            updateOneModelArtifact(data: $data, where: $where) {
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
  modelName: props.modelName !== undefined ? {
            set: props.modelName 
           } : undefined,
  version: props.version !== undefined ? {
            set: props.version 
           } : undefined,
  artifactType: props.artifactType !== undefined ? {
            set: props.artifactType 
           } : undefined,
  storageUrl: props.storageUrl !== undefined ? {
            set: props.storageUrl 
           } : undefined,
  storageProvider: props.storageProvider !== undefined ? {
            set: props.storageProvider 
           } : undefined,
  fileSize: props.fileSize !== undefined ? {
            set: props.fileSize 
           } : undefined,
  checksum: props.checksum !== undefined ? {
            set: props.checksum 
           } : undefined,
  compressionType: props.compressionType !== undefined ? {
            set: props.compressionType 
           } : undefined,
  metadataFramework: props.metadataFramework !== undefined ? {
            set: props.metadataFramework 
           } : undefined,
  metadataPythonVersion: props.metadataPythonVersion !== undefined ? {
            set: props.metadataPythonVersion 
           } : undefined,
  metadataDependencies: props.metadataDependencies !== undefined ? props.metadataDependencies : undefined,
  metadataTrainingDate: props.metadataTrainingDate !== undefined ? {
            set: props.metadataTrainingDate 
           } : undefined,
  metadataDatasetSize: props.metadataDatasetSize !== undefined ? {
            set: props.metadataDatasetSize 
           } : undefined,
  metadataHyperparameters: props.metadataHyperparameters !== undefined ? props.metadataHyperparameters : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  modelVersions: props.modelVersions ? 
  Array.isArray(props.modelVersions) && props.modelVersions.length > 0 && props.modelVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.modelVersions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.modelVersions.map((item) => ({
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
    modelVersion: item.modelVersion ? 
    typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && (Object.keys(item.modelVersion)[0] === 'id' || Object.keys(item.modelVersion)[0] === 'symbol')
? {
    connect: {
      id: item.modelVersion.id
    }
} : { upsert: {
        where: {
          id: item.modelVersion.id !== undefined ? {
              equals: item.modelVersion.id
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status
            } : undefined,
          parentVersionId: item.modelVersion.parentVersionId !== undefined ? {
              equals: item.modelVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: item.modelVersion.id !== undefined ? {
              set: item.modelVersion.id
            } : undefined,
          modelName: item.modelVersion.modelName !== undefined ? {
              set: item.modelVersion.modelName
            } : undefined,
          version: item.modelVersion.version !== undefined ? {
              set: item.modelVersion.version
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              set: item.modelVersion.status
            } : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? {
              set: item.modelVersion.performanceAccuracy
            } : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? {
              set: item.modelVersion.performancePrecision
            } : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? {
              set: item.modelVersion.performanceRecall
            } : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? {
              set: item.modelVersion.performanceF1Score
            } : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? {
              set: item.modelVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? {
              set: item.modelVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? {
              set: item.modelVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? {
              set: item.modelVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? {
              set: item.modelVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? {
              set: item.modelVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? {
              set: item.modelVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? {
              set: item.modelVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? {
              set: item.modelVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? {
              set: item.modelVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? {
              set: item.modelVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? {
              set: item.modelVersion.trainingStartTime
            } : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? {
              set: item.modelVersion.trainingEndTime
            } : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? {
              set: item.modelVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? {
              set: item.modelVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.modelVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? {
              set: item.modelVersion.deployedAt
            } : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? {
              set: item.modelVersion.deprecatedAt
            } : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
      typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && (Object.keys(item.modelVersion.parentVersion)[0] === 'id' || Object.keys(item.modelVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.modelVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                equals: item.modelVersion.parentVersion.id
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status
              } : undefined,
            parentVersionId: item.modelVersion.parentVersion.parentVersionId !== undefined ? {
                equals: item.modelVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                set: item.modelVersion.parentVersion.id
              } : undefined,
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? {
                set: item.modelVersion.parentVersion.modelName
              } : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? {
                set: item.modelVersion.parentVersion.version
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                set: item.modelVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? {
                set: item.modelVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? {
                set: item.modelVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? {
                set: item.modelVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: item.modelVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.modelVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? {
                set: item.modelVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: item.modelVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
      Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 && item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
      Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 && item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
      Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 && item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
      Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 && item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
      create: {
    modelVersion: item.modelVersion ? 
      typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && Object.keys(item.modelVersion)[0] === 'id'
    ? { connect: {
          id: item.modelVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.modelVersion.id !== undefined ? item.modelVersion.id : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status 
             } : undefined,
        },
        create: {
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
    }))
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_MODELARTIFACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneModelArtifact) {
          return response.data.updateOneModelArtifact;
        } else {
          return null as unknown as ModelArtifactType;
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
          logger.error("Non-retryable constraint violation in updateOneModelArtifact", {
            operation: 'updateOneModelArtifact',
            model: 'ModelArtifact',
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
          logger.warn("Database connection error in updateOneModelArtifact, retrying...", {
            operation: 'updateOneModelArtifact',
            model: 'ModelArtifact',
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
            operation: 'updateOneModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneModelArtifact',
            model: 'ModelArtifact',
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
   * Upsert a single ModelArtifact record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated ModelArtifact or null.
   */
  async upsert(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ModelArtifactType> {
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

        const UPSERT_ONE_MODELARTIFACT = gql`
          mutation upsertOneModelArtifact($where: ModelArtifactWhereUniqueInput!, $create: ModelArtifactCreateInput!, $update: ModelArtifactUpdateInput!) {
            upsertOneModelArtifact(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
      },
          create: {
        modelName: props.modelName !== undefined ? props.modelName : undefined,
  version: props.version !== undefined ? props.version : undefined,
  artifactType: props.artifactType !== undefined ? props.artifactType : undefined,
  storageUrl: props.storageUrl !== undefined ? props.storageUrl : undefined,
  storageProvider: props.storageProvider !== undefined ? props.storageProvider : undefined,
  fileSize: props.fileSize !== undefined ? props.fileSize : undefined,
  checksum: props.checksum !== undefined ? props.checksum : undefined,
  compressionType: props.compressionType !== undefined ? props.compressionType : undefined,
  metadataFramework: props.metadataFramework !== undefined ? props.metadataFramework : undefined,
  metadataPythonVersion: props.metadataPythonVersion !== undefined ? props.metadataPythonVersion : undefined,
  metadataDependencies: props.metadataDependencies !== undefined ? props.metadataDependencies : undefined,
  metadataTrainingDate: props.metadataTrainingDate !== undefined ? props.metadataTrainingDate : undefined,
  metadataDatasetSize: props.metadataDatasetSize !== undefined ? props.metadataDatasetSize : undefined,
  metadataHyperparameters: props.metadataHyperparameters !== undefined ? props.metadataHyperparameters : undefined,
  modelVersions: props.modelVersions ? 
    Array.isArray(props.modelVersions) && props.modelVersions.length > 0 &&  props.modelVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.modelVersions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.modelVersions.map((item) => ({
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
    modelVersion: item.modelVersion ? 
      typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && Object.keys(item.modelVersion)[0] === 'id'
    ? { connect: {
          id: item.modelVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.modelVersion.id !== undefined ? item.modelVersion.id : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status 
             } : undefined,
        },
        create: {
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
    }))
  } : undefined,
      },
          update: {
      modelName: props.modelName !== undefined ? {
            set: props.modelName 
           } : undefined,
  version: props.version !== undefined ? {
            set: props.version 
           } : undefined,
  artifactType: props.artifactType !== undefined ? {
            set: props.artifactType 
           } : undefined,
  storageUrl: props.storageUrl !== undefined ? {
            set: props.storageUrl 
           } : undefined,
  storageProvider: props.storageProvider !== undefined ? {
            set: props.storageProvider 
           } : undefined,
  fileSize: props.fileSize !== undefined ? {
            set: props.fileSize 
           } : undefined,
  checksum: props.checksum !== undefined ? {
            set: props.checksum 
           } : undefined,
  compressionType: props.compressionType !== undefined ? {
            set: props.compressionType 
           } : undefined,
  metadataFramework: props.metadataFramework !== undefined ? {
            set: props.metadataFramework 
           } : undefined,
  metadataPythonVersion: props.metadataPythonVersion !== undefined ? {
            set: props.metadataPythonVersion 
           } : undefined,
  metadataDependencies: props.metadataDependencies !== undefined ? props.metadataDependencies : undefined,
  metadataTrainingDate: props.metadataTrainingDate !== undefined ? {
            set: props.metadataTrainingDate 
           } : undefined,
  metadataDatasetSize: props.metadataDatasetSize !== undefined ? {
            set: props.metadataDatasetSize 
           } : undefined,
  metadataHyperparameters: props.metadataHyperparameters !== undefined ? props.metadataHyperparameters : undefined,
  modelVersions: props.modelVersions ? 
  Array.isArray(props.modelVersions) && props.modelVersions.length > 0 && props.modelVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.modelVersions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.modelVersions.map((item) => ({
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
    modelVersion: item.modelVersion ? 
    typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && (Object.keys(item.modelVersion)[0] === 'id' || Object.keys(item.modelVersion)[0] === 'symbol')
? {
    connect: {
      id: item.modelVersion.id
    }
} : { upsert: {
        where: {
          id: item.modelVersion.id !== undefined ? {
              equals: item.modelVersion.id
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status
            } : undefined,
          parentVersionId: item.modelVersion.parentVersionId !== undefined ? {
              equals: item.modelVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: item.modelVersion.id !== undefined ? {
              set: item.modelVersion.id
            } : undefined,
          modelName: item.modelVersion.modelName !== undefined ? {
              set: item.modelVersion.modelName
            } : undefined,
          version: item.modelVersion.version !== undefined ? {
              set: item.modelVersion.version
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              set: item.modelVersion.status
            } : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? {
              set: item.modelVersion.performanceAccuracy
            } : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? {
              set: item.modelVersion.performancePrecision
            } : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? {
              set: item.modelVersion.performanceRecall
            } : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? {
              set: item.modelVersion.performanceF1Score
            } : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? {
              set: item.modelVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? {
              set: item.modelVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? {
              set: item.modelVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? {
              set: item.modelVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? {
              set: item.modelVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? {
              set: item.modelVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? {
              set: item.modelVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? {
              set: item.modelVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? {
              set: item.modelVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? {
              set: item.modelVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? {
              set: item.modelVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? {
              set: item.modelVersion.trainingStartTime
            } : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? {
              set: item.modelVersion.trainingEndTime
            } : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? {
              set: item.modelVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? {
              set: item.modelVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.modelVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? {
              set: item.modelVersion.deployedAt
            } : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? {
              set: item.modelVersion.deprecatedAt
            } : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
      typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && (Object.keys(item.modelVersion.parentVersion)[0] === 'id' || Object.keys(item.modelVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.modelVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                equals: item.modelVersion.parentVersion.id
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status
              } : undefined,
            parentVersionId: item.modelVersion.parentVersion.parentVersionId !== undefined ? {
                equals: item.modelVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                set: item.modelVersion.parentVersion.id
              } : undefined,
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? {
                set: item.modelVersion.parentVersion.modelName
              } : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? {
                set: item.modelVersion.parentVersion.version
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                set: item.modelVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? {
                set: item.modelVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? {
                set: item.modelVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? {
                set: item.modelVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: item.modelVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.modelVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? {
                set: item.modelVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: item.modelVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
      Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 && item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
      Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 && item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
      Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 && item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
      Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 && item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
      create: {
    modelVersion: item.modelVersion ? 
      typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && Object.keys(item.modelVersion)[0] === 'id'
    ? { connect: {
          id: item.modelVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.modelVersion.id !== undefined ? item.modelVersion.id : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status 
             } : undefined,
        },
        create: {
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
    }))
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_MODELARTIFACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneModelArtifact) {
          return response.data.upsertOneModelArtifact;
        } else {
          return null as unknown as ModelArtifactType;
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
          logger.error("Non-retryable constraint violation in upsertOneModelArtifact", {
            operation: 'upsertOneModelArtifact',
            model: 'ModelArtifact',
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
          logger.warn("Database connection error in upsertOneModelArtifact, retrying...", {
            operation: 'upsertOneModelArtifact',
            model: 'ModelArtifact',
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
            operation: 'upsertOneModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneModelArtifact',
            model: 'ModelArtifact',
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
   * Update multiple ModelArtifact records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of ModelArtifact objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: ModelArtifactType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_MODELARTIFACT = gql`
          mutation updateManyModelArtifact($data: [ModelArtifactCreateManyInput!]!) {
            updateManyModelArtifact(data: $data) {
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
  modelName: prop.modelName !== undefined ? {
            set: prop.modelName 
           } : undefined,
  version: prop.version !== undefined ? {
            set: prop.version 
           } : undefined,
  artifactType: prop.artifactType !== undefined ? {
            set: prop.artifactType 
           } : undefined,
  storageUrl: prop.storageUrl !== undefined ? {
            set: prop.storageUrl 
           } : undefined,
  storageProvider: prop.storageProvider !== undefined ? {
            set: prop.storageProvider 
           } : undefined,
  fileSize: prop.fileSize !== undefined ? {
            set: prop.fileSize 
           } : undefined,
  checksum: prop.checksum !== undefined ? {
            set: prop.checksum 
           } : undefined,
  compressionType: prop.compressionType !== undefined ? {
            set: prop.compressionType 
           } : undefined,
  metadataFramework: prop.metadataFramework !== undefined ? {
            set: prop.metadataFramework 
           } : undefined,
  metadataPythonVersion: prop.metadataPythonVersion !== undefined ? {
            set: prop.metadataPythonVersion 
           } : undefined,
  metadataDependencies: prop.metadataDependencies !== undefined ? prop.metadataDependencies : undefined,
  metadataTrainingDate: prop.metadataTrainingDate !== undefined ? {
            set: prop.metadataTrainingDate 
           } : undefined,
  metadataDatasetSize: prop.metadataDatasetSize !== undefined ? {
            set: prop.metadataDatasetSize 
           } : undefined,
  metadataHyperparameters: prop.metadataHyperparameters !== undefined ? prop.metadataHyperparameters : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  modelVersions: prop.modelVersions ? 
  Array.isArray(prop.modelVersions) && prop.modelVersions.length > 0 && prop.modelVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.modelVersions.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.modelVersions.map((item) => ({
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
    modelVersion: item.modelVersion ? 
    typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && (Object.keys(item.modelVersion)[0] === 'id' || Object.keys(item.modelVersion)[0] === 'symbol')
? {
    connect: {
      id: item.modelVersion.id
    }
} : { upsert: {
        where: {
          id: item.modelVersion.id !== undefined ? {
              equals: item.modelVersion.id
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status
            } : undefined,
          parentVersionId: item.modelVersion.parentVersionId !== undefined ? {
              equals: item.modelVersion.parentVersionId
            } : undefined,
        },
        update: {
          id: item.modelVersion.id !== undefined ? {
              set: item.modelVersion.id
            } : undefined,
          modelName: item.modelVersion.modelName !== undefined ? {
              set: item.modelVersion.modelName
            } : undefined,
          version: item.modelVersion.version !== undefined ? {
              set: item.modelVersion.version
            } : undefined,
          status: item.modelVersion.status !== undefined ? {
              set: item.modelVersion.status
            } : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? {
              set: item.modelVersion.performanceAccuracy
            } : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? {
              set: item.modelVersion.performancePrecision
            } : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? {
              set: item.modelVersion.performanceRecall
            } : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? {
              set: item.modelVersion.performanceF1Score
            } : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? {
              set: item.modelVersion.performanceAuc
            } : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? {
              set: item.modelVersion.performanceSharpeRatio
            } : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? {
              set: item.modelVersion.performanceMaxDrawdown
            } : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? {
              set: item.modelVersion.performanceWinRate
            } : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? {
              set: item.modelVersion.performanceAvgReturn
            } : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? {
              set: item.modelVersion.performanceCalibrationScore
            } : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? {
              set: item.modelVersion.performanceStabilityScore
            } : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? {
              set: item.modelVersion.validationCrossValidationScore
            } : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? {
              set: item.modelVersion.deploymentEnvironment
            } : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? {
              set: item.modelVersion.deploymentTrafficAllocation
            } : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? {
              set: item.modelVersion.deploymentRolloutStrategy
            } : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? {
              set: item.modelVersion.trainingStartTime
            } : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? {
              set: item.modelVersion.trainingEndTime
            } : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? {
              set: item.modelVersion.trainingDuration
            } : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? {
              set: item.modelVersion.trainingDatasetSize
            } : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? {
              set: item.modelVersion.trainingResourcePeakMemoryMB
            } : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceTotalCpuHours
            } : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? {
              set: item.modelVersion.trainingResourceGpuHours
            } : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? {
              set: item.modelVersion.deployedAt
            } : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? {
              set: item.modelVersion.deprecatedAt
            } : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
      typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && (Object.keys(item.modelVersion.parentVersion)[0] === 'id' || Object.keys(item.modelVersion.parentVersion)[0] === 'symbol')
? {
      connect: {
        id: item.modelVersion.parentVersion.id
      }
} : { upsert: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                equals: item.modelVersion.parentVersion.id
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status
              } : undefined,
            parentVersionId: item.modelVersion.parentVersion.parentVersionId !== undefined ? {
                equals: item.modelVersion.parentVersion.parentVersionId
              } : undefined,
          },
          update: {
            id: item.modelVersion.parentVersion.id !== undefined ? {
                set: item.modelVersion.parentVersion.id
              } : undefined,
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? {
                set: item.modelVersion.parentVersion.modelName
              } : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? {
                set: item.modelVersion.parentVersion.version
              } : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                set: item.modelVersion.parentVersion.status
              } : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAccuracy
              } : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? {
                set: item.modelVersion.parentVersion.performancePrecision
              } : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? {
                set: item.modelVersion.parentVersion.performanceRecall
              } : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? {
                set: item.modelVersion.parentVersion.performanceF1Score
              } : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAuc
              } : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? {
                set: item.modelVersion.parentVersion.performanceSharpeRatio
              } : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? {
                set: item.modelVersion.parentVersion.performanceMaxDrawdown
              } : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? {
                set: item.modelVersion.parentVersion.performanceWinRate
              } : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? {
                set: item.modelVersion.parentVersion.performanceAvgReturn
              } : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceCalibrationScore
              } : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? {
                set: item.modelVersion.parentVersion.performanceStabilityScore
              } : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? {
                set: item.modelVersion.parentVersion.validationCrossValidationScore
              } : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentEnvironment
              } : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentTrafficAllocation
              } : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? {
                set: item.modelVersion.parentVersion.deploymentRolloutStrategy
              } : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingStartTime
              } : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? {
                set: item.modelVersion.parentVersion.trainingEndTime
              } : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDuration
              } : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? {
                set: item.modelVersion.parentVersion.trainingDatasetSize
              } : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB
              } : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceTotalCpuHours
              } : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? {
                set: item.modelVersion.parentVersion.trainingResourceGpuHours
              } : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deployedAt
              } : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? {
                set: item.modelVersion.parentVersion.deprecatedAt
              } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
      Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 && item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.childVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
      Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 && item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsControl.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
      Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 && item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.abTestsAsTreatment.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
      Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 && item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.modelVersion.featureImportanceAnalyses.map((item) => ({
        id: item.id
      }))
} : { upsert: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
      create: {
    modelVersion: item.modelVersion ? 
      typeof item.modelVersion === 'object' && Object.keys(item.modelVersion).length === 1 && Object.keys(item.modelVersion)[0] === 'id'
    ? { connect: {
          id: item.modelVersion.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.modelVersion.id !== undefined ? item.modelVersion.id : undefined,
          status: item.modelVersion.status !== undefined ? {
              equals: item.modelVersion.status 
             } : undefined,
        },
        create: {
          modelName: item.modelVersion.modelName !== undefined ? item.modelVersion.modelName : undefined,
          version: item.modelVersion.version !== undefined ? item.modelVersion.version : undefined,
          status: item.modelVersion.status !== undefined ? item.modelVersion.status : undefined,
          performanceAccuracy: item.modelVersion.performanceAccuracy !== undefined ? item.modelVersion.performanceAccuracy : undefined,
          performancePrecision: item.modelVersion.performancePrecision !== undefined ? item.modelVersion.performancePrecision : undefined,
          performanceRecall: item.modelVersion.performanceRecall !== undefined ? item.modelVersion.performanceRecall : undefined,
          performanceF1Score: item.modelVersion.performanceF1Score !== undefined ? item.modelVersion.performanceF1Score : undefined,
          performanceAuc: item.modelVersion.performanceAuc !== undefined ? item.modelVersion.performanceAuc : undefined,
          performanceSharpeRatio: item.modelVersion.performanceSharpeRatio !== undefined ? item.modelVersion.performanceSharpeRatio : undefined,
          performanceMaxDrawdown: item.modelVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.performanceMaxDrawdown : undefined,
          performanceWinRate: item.modelVersion.performanceWinRate !== undefined ? item.modelVersion.performanceWinRate : undefined,
          performanceAvgReturn: item.modelVersion.performanceAvgReturn !== undefined ? item.modelVersion.performanceAvgReturn : undefined,
          performanceCalibrationScore: item.modelVersion.performanceCalibrationScore !== undefined ? item.modelVersion.performanceCalibrationScore : undefined,
          performanceStabilityScore: item.modelVersion.performanceStabilityScore !== undefined ? item.modelVersion.performanceStabilityScore : undefined,
          validationCrossValidationScore: item.modelVersion.validationCrossValidationScore !== undefined ? item.modelVersion.validationCrossValidationScore : undefined,
          validationOutOfSamplePerformance: item.modelVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.validationOutOfSamplePerformance : undefined,
          validationBacktestResults: item.modelVersion.validationBacktestResults !== undefined ? item.modelVersion.validationBacktestResults : undefined,
          validationStatTestResults: item.modelVersion.validationStatTestResults !== undefined ? item.modelVersion.validationStatTestResults : undefined,
          deploymentEnvironment: item.modelVersion.deploymentEnvironment !== undefined ? item.modelVersion.deploymentEnvironment : undefined,
          deploymentTrafficAllocation: item.modelVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.deploymentTrafficAllocation : undefined,
          deploymentRolloutStrategy: item.modelVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.deploymentRolloutStrategy : undefined,
          deploymentHealthCheckConfig: item.modelVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.deploymentHealthCheckConfig : undefined,
          trainingStartTime: item.modelVersion.trainingStartTime !== undefined ? item.modelVersion.trainingStartTime : undefined,
          trainingEndTime: item.modelVersion.trainingEndTime !== undefined ? item.modelVersion.trainingEndTime : undefined,
          trainingDuration: item.modelVersion.trainingDuration !== undefined ? item.modelVersion.trainingDuration : undefined,
          trainingDatasetSize: item.modelVersion.trainingDatasetSize !== undefined ? item.modelVersion.trainingDatasetSize : undefined,
          trainingFeaturesUsed: item.modelVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.trainingFeaturesUsed : undefined,
          trainingHyperparameters: item.modelVersion.trainingHyperparameters !== undefined ? item.modelVersion.trainingHyperparameters : undefined,
          trainingResourcePeakMemoryMB: item.modelVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.trainingResourcePeakMemoryMB : undefined,
          trainingResourceTotalCpuHours: item.modelVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.trainingResourceTotalCpuHours : undefined,
          trainingResourceGpuHours: item.modelVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.trainingResourceGpuHours : undefined,
          deployedAt: item.modelVersion.deployedAt !== undefined ? item.modelVersion.deployedAt : undefined,
          deprecatedAt: item.modelVersion.deprecatedAt !== undefined ? item.modelVersion.deprecatedAt : undefined,
      parentVersion: item.modelVersion.parentVersion ? 
        typeof item.modelVersion.parentVersion === 'object' && Object.keys(item.modelVersion.parentVersion).length === 1 && Object.keys(item.modelVersion.parentVersion)[0] === 'id'
    ? { connect: {
            id: item.modelVersion.parentVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.modelVersion.parentVersion.id !== undefined ? item.modelVersion.parentVersion.id : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? {
                equals: item.modelVersion.parentVersion.status 
               } : undefined,
          },
          create: {
            modelName: item.modelVersion.parentVersion.modelName !== undefined ? item.modelVersion.parentVersion.modelName : undefined,
            version: item.modelVersion.parentVersion.version !== undefined ? item.modelVersion.parentVersion.version : undefined,
            status: item.modelVersion.parentVersion.status !== undefined ? item.modelVersion.parentVersion.status : undefined,
            performanceAccuracy: item.modelVersion.parentVersion.performanceAccuracy !== undefined ? item.modelVersion.parentVersion.performanceAccuracy : undefined,
            performancePrecision: item.modelVersion.parentVersion.performancePrecision !== undefined ? item.modelVersion.parentVersion.performancePrecision : undefined,
            performanceRecall: item.modelVersion.parentVersion.performanceRecall !== undefined ? item.modelVersion.parentVersion.performanceRecall : undefined,
            performanceF1Score: item.modelVersion.parentVersion.performanceF1Score !== undefined ? item.modelVersion.parentVersion.performanceF1Score : undefined,
            performanceAuc: item.modelVersion.parentVersion.performanceAuc !== undefined ? item.modelVersion.parentVersion.performanceAuc : undefined,
            performanceSharpeRatio: item.modelVersion.parentVersion.performanceSharpeRatio !== undefined ? item.modelVersion.parentVersion.performanceSharpeRatio : undefined,
            performanceMaxDrawdown: item.modelVersion.parentVersion.performanceMaxDrawdown !== undefined ? item.modelVersion.parentVersion.performanceMaxDrawdown : undefined,
            performanceWinRate: item.modelVersion.parentVersion.performanceWinRate !== undefined ? item.modelVersion.parentVersion.performanceWinRate : undefined,
            performanceAvgReturn: item.modelVersion.parentVersion.performanceAvgReturn !== undefined ? item.modelVersion.parentVersion.performanceAvgReturn : undefined,
            performanceCalibrationScore: item.modelVersion.parentVersion.performanceCalibrationScore !== undefined ? item.modelVersion.parentVersion.performanceCalibrationScore : undefined,
            performanceStabilityScore: item.modelVersion.parentVersion.performanceStabilityScore !== undefined ? item.modelVersion.parentVersion.performanceStabilityScore : undefined,
            validationCrossValidationScore: item.modelVersion.parentVersion.validationCrossValidationScore !== undefined ? item.modelVersion.parentVersion.validationCrossValidationScore : undefined,
            validationOutOfSamplePerformance: item.modelVersion.parentVersion.validationOutOfSamplePerformance !== undefined ? item.modelVersion.parentVersion.validationOutOfSamplePerformance : undefined,
            validationBacktestResults: item.modelVersion.parentVersion.validationBacktestResults !== undefined ? item.modelVersion.parentVersion.validationBacktestResults : undefined,
            validationStatTestResults: item.modelVersion.parentVersion.validationStatTestResults !== undefined ? item.modelVersion.parentVersion.validationStatTestResults : undefined,
            deploymentEnvironment: item.modelVersion.parentVersion.deploymentEnvironment !== undefined ? item.modelVersion.parentVersion.deploymentEnvironment : undefined,
            deploymentTrafficAllocation: item.modelVersion.parentVersion.deploymentTrafficAllocation !== undefined ? item.modelVersion.parentVersion.deploymentTrafficAllocation : undefined,
            deploymentRolloutStrategy: item.modelVersion.parentVersion.deploymentRolloutStrategy !== undefined ? item.modelVersion.parentVersion.deploymentRolloutStrategy : undefined,
            deploymentHealthCheckConfig: item.modelVersion.parentVersion.deploymentHealthCheckConfig !== undefined ? item.modelVersion.parentVersion.deploymentHealthCheckConfig : undefined,
            trainingStartTime: item.modelVersion.parentVersion.trainingStartTime !== undefined ? item.modelVersion.parentVersion.trainingStartTime : undefined,
            trainingEndTime: item.modelVersion.parentVersion.trainingEndTime !== undefined ? item.modelVersion.parentVersion.trainingEndTime : undefined,
            trainingDuration: item.modelVersion.parentVersion.trainingDuration !== undefined ? item.modelVersion.parentVersion.trainingDuration : undefined,
            trainingDatasetSize: item.modelVersion.parentVersion.trainingDatasetSize !== undefined ? item.modelVersion.parentVersion.trainingDatasetSize : undefined,
            trainingFeaturesUsed: item.modelVersion.parentVersion.trainingFeaturesUsed !== undefined ? item.modelVersion.parentVersion.trainingFeaturesUsed : undefined,
            trainingHyperparameters: item.modelVersion.parentVersion.trainingHyperparameters !== undefined ? item.modelVersion.parentVersion.trainingHyperparameters : undefined,
            trainingResourcePeakMemoryMB: item.modelVersion.parentVersion.trainingResourcePeakMemoryMB !== undefined ? item.modelVersion.parentVersion.trainingResourcePeakMemoryMB : undefined,
            trainingResourceTotalCpuHours: item.modelVersion.parentVersion.trainingResourceTotalCpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceTotalCpuHours : undefined,
            trainingResourceGpuHours: item.modelVersion.parentVersion.trainingResourceGpuHours !== undefined ? item.modelVersion.parentVersion.trainingResourceGpuHours : undefined,
            deployedAt: item.modelVersion.parentVersion.deployedAt !== undefined ? item.modelVersion.parentVersion.deployedAt : undefined,
            deprecatedAt: item.modelVersion.parentVersion.deprecatedAt !== undefined ? item.modelVersion.parentVersion.deprecatedAt : undefined,
          },
        }
      } : undefined,
      childVersions: item.modelVersion.childVersions ? 
        Array.isArray(item.modelVersion.childVersions) && item.modelVersion.childVersions.length > 0 &&  item.modelVersion.childVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.childVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.childVersions.map((item) => ({
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
      abTestsAsControl: item.modelVersion.abTestsAsControl ? 
        Array.isArray(item.modelVersion.abTestsAsControl) && item.modelVersion.abTestsAsControl.length > 0 &&  item.modelVersion.abTestsAsControl.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsControl.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsControl.map((item) => ({
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
      abTestsAsTreatment: item.modelVersion.abTestsAsTreatment ? 
        Array.isArray(item.modelVersion.abTestsAsTreatment) && item.modelVersion.abTestsAsTreatment.length > 0 &&  item.modelVersion.abTestsAsTreatment.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.abTestsAsTreatment.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.abTestsAsTreatment.map((item) => ({
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
      featureImportanceAnalyses: item.modelVersion.featureImportanceAnalyses ? 
        Array.isArray(item.modelVersion.featureImportanceAnalyses) && item.modelVersion.featureImportanceAnalyses.length > 0 &&  item.modelVersion.featureImportanceAnalyses.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.modelVersion.featureImportanceAnalyses.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.modelVersion.featureImportanceAnalyses.map((item) => ({
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
      },
    }))
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_MODELARTIFACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyModelArtifact) {
          return response.data.updateManyModelArtifact;
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
          logger.error("Non-retryable constraint violation in updateManyModelArtifact", {
            operation: 'updateManyModelArtifact',
            model: 'ModelArtifact',
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
          logger.warn("Database connection error in updateManyModelArtifact, retrying...", {
            operation: 'updateManyModelArtifact',
            model: 'ModelArtifact',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyModelArtifact',
            model: 'ModelArtifact',
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
   * Delete a single ModelArtifact record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted ModelArtifact or null.
   */
  async delete(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ModelArtifactType> {
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

        const DELETE_ONE_MODELARTIFACT = gql`
          mutation deleteOneModelArtifact($where: ModelArtifactWhereUniqueInput!) {
            deleteOneModelArtifact(where: $where) {
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
          mutation: DELETE_ONE_MODELARTIFACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneModelArtifact) {
          return response.data.deleteOneModelArtifact;
        } else {
          return null as unknown as ModelArtifactType;
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
          logger.error("Non-retryable constraint violation in deleteOneModelArtifact", {
            operation: 'deleteOneModelArtifact',
            model: 'ModelArtifact',
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
          logger.warn("Database connection error in deleteOneModelArtifact, retrying...", {
            operation: 'deleteOneModelArtifact',
            model: 'ModelArtifact',
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
            operation: 'deleteOneModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneModelArtifact',
            model: 'ModelArtifact',
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
   * Retrieve a single ModelArtifact record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved ModelArtifact or null.
   */
  async get(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<ModelArtifactType | null> {
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

        const GET_MODELARTIFACT = gql`
          query getModelArtifact($where: ModelArtifactWhereUniqueInput!) {
            getModelArtifact(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_MODELARTIFACT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getModelArtifact ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ModelArtifact found') {
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
          logger.warn("Database connection error in getModelArtifact, retrying...", {
            operation: 'getModelArtifact',
            model: 'ModelArtifact',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getModelArtifact',
            model: 'ModelArtifact',
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
   * Retrieve all ModelArtifacts records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of ModelArtifact records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ModelArtifactType[] | null> {
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

        const GET_ALL_MODELARTIFACT = gql`
          query getAllModelArtifact {
            modelArtifacts {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_MODELARTIFACT,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.modelArtifacts ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ModelArtifact found') {
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
          logger.warn("Database connection error in getAllModelArtifact, retrying...", {
            operation: 'getAllModelArtifact',
            model: 'ModelArtifact',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllModelArtifact',
            model: 'ModelArtifact',
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
   * Find multiple ModelArtifact records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found ModelArtifact records or null.
   */
  async findMany(props: ModelArtifactType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<ModelArtifactType[] | null> {
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

        const FIND_MANY_MODELARTIFACT = gql`
          query findManyModelArtifact($where: ModelArtifactWhereInput!) {
            modelArtifacts(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyModelArtifact requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_MODELARTIFACT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.modelArtifacts) {
          return response.data.modelArtifacts;
        } else {
          return [] as ModelArtifactType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ModelArtifact found') {
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
          logger.warn("Database connection error in findManyModelArtifact, retrying...", {
            operation: 'findManyModelArtifact',
            model: 'ModelArtifact',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyModelArtifact',
            model: 'ModelArtifact',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyModelArtifact',
            model: 'ModelArtifact',
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
