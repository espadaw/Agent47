import { BasePlatformConnector } from './base';
import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * Virtuals Protocol Connector using ACP (Agent Commerce Protocol)
 * 
 * Uses the @virtuals-protocol/acp-node SDK to discover and interact with AI agents
 * Requires: VIRTUALS_ENTITY_ID and WALLET_PRIVATE_KEY environment variables
 */
export class VirtualsConnector extends BasePlatformConnector {
    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.log('[Virtuals] Fetching agents via ACP SDK...');

            // Dynamically import the ACP SDK
            const { default: AcpClient,
                AcpContractClient,
                baseAcpConfig,
                baseSepoliaAcpConfig,
                AcpGraduationStatus
            } = await import('@virtuals-protocol/acp-node');
            const entityId = process.env.VIRTUALS_ENTITY_ID;
            const privateKey = process.env.WALLET_PRIVATE_KEY;

            if (!entityId || !privateKey) {
                return [];
            }

            // Ensure private key has 0x prefix
            let formattedPrivateKey = privateKey;
            if (!formattedPrivateKey.startsWith('0x')) {
                formattedPrivateKey = `0x${privateKey}`;
            }

            // Create Contract Client (Mainnet)
            const contractClient = new AcpContractClient(
                entityId as any,
                baseAcpConfig
            );

            // Initialize Contract Client
            // defaulting sessionKeyId to 0, which might fail if not properly set up
            await contractClient.init(formattedPrivateKey as any, 0);

            const client = new AcpClient({
                acpContractClient: contractClient,
                skipSocketConnection: true
            });

            // Browse available agents on the network
            const agents = await client.browseAgents(
                filters?.query || '',
                { graduationStatus: AcpGraduationStatus.GRADUATED }
            );

            console.log(`[Virtuals] Found ${agents.length} agents`);

            return agents
                .map(agent => this.normalizeJob(agent))
                .filter(job => this.matchesFilter(job, filters));

        } catch (error: any) {
            // Log specific SDK errors but don't fail the aggregation
            if (error.message && error.message.includes('not deployed')) {
                console.warn('[Virtuals] Agent not deployed or wrong network.');
            } else if (error.message && error.message.includes('whitelisted')) {
                console.warn('[Virtuals] Authentication failed: Wallet not whitelisted or invalid session key.');
            } else {
                console.error('[Virtuals] SDK Error:', error.message || error);
            }
            return [];
        }
    }

    protected normalizeJob(agent: any): Job {
        const price = agent.price || agent.rate || '0';
        const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;

        return {
            id: agent.id || agent.agentId,
            platform: Platform.VIRTUALS,
            title: `Hire: ${agent.name || 'AI Agent'}`,
            description: agent.description || agent.bio || 'AI Agent available for hire',
            url: `https://app.virtuals.io/agents/${agent.id}`,
            salary: {
                min: priceNum,
                max: priceNum,
                currency: 'VIRT',
            },
            postedAt: new Date(),
            category: JobCategory.OTHER,
            tags: ['ACP', 'AI Agent', agent.status || 'AVAILABLE'],
        };
    }

    private matchesFilter(job: Job, filters?: JobFilter): boolean {
        if (!filters) return true;

        if (filters.query) {
            const query = filters.query.toLowerCase();
            if (!job.title.toLowerCase().includes(query) &&
                !job.description.toLowerCase().includes(query)) {
                return false;
            }
        }

        if (filters.minPrice && job.salary.min < filters.minPrice) return false;
        if (filters.maxPrice && job.salary.max > filters.maxPrice) return false;

        return true;
    }
}
