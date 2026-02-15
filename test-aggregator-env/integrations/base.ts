import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

export abstract class BasePlatformConnector {
    abstract fetchJobs(filters?: JobFilter): Promise<Job[]>;

    protected handleError(error: unknown, platform: string): void {
        console.error(`[${platform}] Error fetching jobs:`, error);
    }

    async healthCheck(): Promise<boolean> {
        try {
            await this.fetchJobs({ limit: 1 });
            return true;
        } catch (e) {
            return false;
        }
    }
}
