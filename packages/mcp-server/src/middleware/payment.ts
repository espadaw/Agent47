// Payment middleware for x402 protocol

// Pricing structure (in USDC)
export const TOOL_PRICES: Record<string, number> = {
    findJobs: 0.001,
    getTopOpportunities: 0.005,
    comparePrice: 0.002,
    getPlatformStats: 0.001
};

export interface PaymentHeader {
    amount: number;
    currency: string;
    recipient: string;
    network: string;
}

export class PaymentRequiredError extends Error {
    constructor(public amount: number, public toolName: string) {
        super(`Payment of ${amount} USDC required for ${toolName}`);
        this.name = 'PaymentRequiredError';
    }
}

/**
 * Check if payment has been made for a tool call
 * @param toolName Name of the tool being called
 * @param headers Request headers containing payment proof
 * @returns Promise<boolean> True if payment is valid
 * @throws PaymentRequiredError if payment is missing or invalid
 */
export async function checkPayment(toolName: string, headers: any): Promise<boolean> {
    const price = TOOL_PRICES[toolName];

    if (!price) {
        throw new Error(`Unknown tool: ${toolName}`);
    }

    // Check if payment verification is enabled
    const verificationEnabled = process.env.PAYMENT_VERIFICATION_ENABLED === 'true';

    if (!verificationEnabled) {
        console.log(`[Payment] Verification disabled, allowing ${toolName} call`);
        return true;
    }

    // Check if payment header exists
    const paymentProof = headers['x-payment-proof'];

    if (!paymentProof) {
        throw new PaymentRequiredError(price, toolName);
    }

    // Verify payment on Base blockchain
    const isValid = await verifyPayment(paymentProof, price);

    if (!isValid) {
        throw new PaymentRequiredError(price, toolName);
    }

    console.log(`[Payment] Verified ${price} USDC payment for ${toolName}`);
    return true;
}

/**
 * Verify a payment transaction on Base network
 * @param proof Transaction hash or payment proof
 * @param expectedAmount Expected USDC amount
 * @returns Promise<boolean> True if payment is valid
 */
async function verifyPayment(proof: string, expectedAmount: number): Promise<boolean> {
    try {
        // TODO: Implement actual blockchain verification
        // This is a placeholder implementation

        // In production, this should:
        // 1. Query Base blockchain for transaction by hash
        // 2. Verify transaction is to Agent47 wallet address
        // 3. Verify amount >= expectedAmount
        // 4. Verify transaction is recent (prevent replay attacks)
        // 5. Check transaction is confirmed

        const recipientAddress = process.env.AGENT47_WALLET_ADDRESS;

        if (!recipientAddress) {
            console.error('[Payment] No AGENT47_WALLET_ADDRESS configured');
            return false;
        }

        // For now, just log the verification attempt
        console.log(`[Payment] Verifying transaction ${proof} for ${expectedAmount} USDC to ${recipientAddress}`);

        // Placeholder: In development, accept any proof
        if (process.env.NODE_ENV === 'development') {
            return true;
        }

        // TODO: Use Coinbase SDK or Base RPC to verify transaction
        // Example implementation:
        /*
        const coinbase = Coinbase.configureFromJson({ 
            filePath: process.env.COINBASE_API_KEY_PATH 
        });
        
        const transaction = await coinbase.getTransaction({
            networkId: 'base-mainnet',
            transactionHash: proof
        });
        
        // Verify recipient, amount, and confirmation status
        if (transaction.to.toLowerCase() !== recipientAddress.toLowerCase()) {
            return false;
        }
        
        if (transaction.value < expectedAmount) {
            return false;
        }
        
        if (!transaction.confirmed) {
            return false;
        }
        
        return true;
        */

        return false; // Reject in production until implemented

    } catch (error) {
        console.error('[Payment] Error verifying payment:', error);
        return false;
    }
}

/**
 * Format payment error response
 * @param error PaymentRequiredError instance
 * @returns Formatted error object for HTTP 402 response
 */
export function formatPaymentError(error: PaymentRequiredError) {
    return {
        error: 'Payment Required',
        code: 402,
        amount: error.amount,
        currency: 'USDC',
        network: 'Base',
        recipient: process.env.AGENT47_WALLET_ADDRESS || 'TBD',
        tool: error.toolName,
        instructions: 'Send payment to recipient address on Base network, include transaction hash in X-Payment-Proof header'
    };
}
