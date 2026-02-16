export class BasePlatformConnector {
    handleError(error, platform) {
        console.error(`[${platform}] Error fetching jobs:`, error);
    }
    async healthCheck() {
        try {
            await this.fetchJobs({ limit: 1 });
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
