/**
 * Plaid Integration Service
 *
 * This is a stub implementation for the MVP.
 * Feature-flagged via NEXT_PUBLIC_ENABLE_PLAID environment variable.
 * In production, integrate with Plaid SDK for real bank connections.
 */

import { db } from '@/lib/db'

// Check if Plaid is enabled
export function isPlaidEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PLAID === 'true'
}

// Plaid environments
export const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'

// Mock Plaid institutions for development
export const MOCK_INSTITUTIONS = [
  { id: 'ins_1', name: 'Chase', logo: null },
  { id: 'ins_2', name: 'Bank of America', logo: null },
  { id: 'ins_3', name: 'Wells Fargo', logo: null },
  { id: 'ins_4', name: 'Citi', logo: null },
  { id: 'ins_5', name: 'Capital One', logo: null },
]

/**
 * Create a Plaid link token for the user
 * STUB: In production, use Plaid SDK
 */
export async function createLinkToken(userId: string) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  // In production:
  // const plaidClient = new PlaidApi(...)
  // const response = await plaidClient.linkTokenCreate({...})

  console.log('Creating Plaid link token for user:', userId)

  return {
    link_token: `link-sandbox-mock-${Date.now()}`,
    expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }
}

/**
 * Exchange public token for access token
 * STUB: In production, use Plaid SDK
 */
export async function exchangePublicToken(publicToken: string) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  console.log('Exchanging public token:', publicToken)

  return {
    access_token: `access-sandbox-mock-${Date.now()}`,
    item_id: `item-sandbox-mock-${Date.now()}`,
  }
}

/**
 * Get accounts from Plaid
 * STUB: In production, use Plaid SDK
 */
export async function getAccounts(accessToken: string) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  console.log('Getting accounts for access token:', accessToken)

  // Return mock accounts
  return {
    accounts: [
      {
        account_id: 'acc_mock_1',
        name: 'Plaid Checking',
        official_name: 'Plaid Gold Standard 0% Interest Checking',
        type: 'depository',
        subtype: 'checking',
        balances: {
          available: 1000,
          current: 1100,
          limit: null,
        },
      },
      {
        account_id: 'acc_mock_2',
        name: 'Plaid Savings',
        official_name: 'Plaid Silver Standard 0.1% Interest Saving',
        type: 'depository',
        subtype: 'savings',
        balances: {
          available: 5000,
          current: 5000,
          limit: null,
        },
      },
    ],
    item: {
      item_id: 'item_mock_1',
      institution_id: 'ins_1',
    },
  }
}

/**
 * Get transactions from Plaid
 * STUB: In production, use Plaid SDK
 */
export async function getTransactions(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  console.log('Getting transactions for access token:', accessToken)

  // Return mock transactions
  return {
    transactions: [
      {
        transaction_id: 'tx_mock_1',
        account_id: 'acc_mock_1',
        amount: 25.50,
        date: new Date().toISOString().split('T')[0],
        name: 'Starbucks',
        merchant_name: 'Starbucks',
        category: ['Food and Drink', 'Coffee Shop'],
        pending: false,
      },
      {
        transaction_id: 'tx_mock_2',
        account_id: 'acc_mock_1',
        amount: 150.00,
        date: new Date().toISOString().split('T')[0],
        name: 'Whole Foods',
        merchant_name: 'Whole Foods Market',
        category: ['Food and Drink', 'Groceries'],
        pending: false,
      },
    ],
    total_transactions: 2,
  }
}

/**
 * Sync Plaid accounts to database
 */
export async function syncAccounts(userId: string, itemId: string, accessToken: string) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  const { accounts } = await getAccounts(accessToken)

  for (const plaidAccount of accounts) {
    const existingAccount = await db.account.findFirst({
      where: {
        userId,
        plaidAccountId: plaidAccount.account_id,
      },
    })

    const accountType = mapPlaidAccountType(plaidAccount.type, plaidAccount.subtype)

    if (existingAccount) {
      // Update existing account
      await db.account.update({
        where: { id: existingAccount.id },
        data: {
          currentBalance: plaidAccount.balances.current,
          availableBalance: plaidAccount.balances.available,
          creditLimit: plaidAccount.balances.limit,
          lastSynced: new Date(),
        },
      })
    } else {
      // Create new account
      await db.account.create({
        data: {
          userId,
          name: plaidAccount.name,
          type: accountType,
          subtype: plaidAccount.subtype,
          currentBalance: plaidAccount.balances.current,
          availableBalance: plaidAccount.balances.available,
          creditLimit: plaidAccount.balances.limit,
          plaidAccountId: plaidAccount.account_id,
          plaidItemId: itemId,
          isConnected: true,
          isManual: false,
          lastSynced: new Date(),
        },
      })
    }
  }
}

/**
 * Sync Plaid transactions to database
 */
export async function syncTransactions(
  userId: string,
  accessToken: string,
  startDate: Date,
  endDate: Date
) {
  if (!isPlaidEnabled()) {
    throw new Error('Plaid integration is not enabled')
  }

  const { transactions } = await getTransactions(
    accessToken,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  )

  for (const plaidTx of transactions) {
    // Find the linked account
    const account = await db.account.findFirst({
      where: {
        userId,
        plaidAccountId: plaidTx.account_id,
      },
    })

    if (!account) continue

    const existingTx = await db.transaction.findFirst({
      where: {
        plaidTransactionId: plaidTx.transaction_id,
      },
    })

    if (existingTx) {
      // Update existing transaction
      await db.transaction.update({
        where: { id: existingTx.id },
        data: {
          amount: -plaidTx.amount, // Plaid uses positive for debits
          pending: plaidTx.pending,
        },
      })
    } else {
      // Create new transaction
      await db.transaction.create({
        data: {
          userId,
          accountId: account.id,
          amount: -plaidTx.amount,
          description: plaidTx.name,
          merchantName: plaidTx.merchant_name,
          category: mapPlaidCategory(plaidTx.category),
          date: new Date(plaidTx.date),
          plaidTransactionId: plaidTx.transaction_id,
          pending: plaidTx.pending,
          isManual: false,
        },
      })
    }
  }
}

/**
 * Map Plaid account type to our account type
 */
function mapPlaidAccountType(type: string, subtype?: string): 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'LOAN' | 'OTHER' {
  if (type === 'depository') {
    if (subtype === 'checking') return 'CHECKING'
    if (subtype === 'savings') return 'SAVINGS'
  }
  if (type === 'credit') return 'CREDIT_CARD'
  if (type === 'investment') return 'INVESTMENT'
  if (type === 'loan') return 'LOAN'
  return 'OTHER'
}

/**
 * Map Plaid category to our transaction category
 */
function mapPlaidCategory(categories: string[]): string {
  if (!categories || categories.length === 0) return 'UNCATEGORIZED'

  const primary = categories[0]?.toLowerCase() || ''
  const secondary = categories[1]?.toLowerCase() || ''

  if (primary.includes('food')) {
    if (secondary.includes('groceries')) return 'FOOD_GROCERIES'
    if (secondary.includes('restaurant') || secondary.includes('dining')) return 'FOOD_DINING'
    return 'FOOD_DELIVERY'
  }

  if (primary.includes('travel')) return 'TRANSPORT_RIDESHARE'
  if (primary.includes('transfer')) return 'FINANCIAL_TRANSFER'
  if (primary.includes('payment')) return 'DEBT_PAYMENT'
  if (primary.includes('shops') || primary.includes('shopping')) return 'SHOPPING_OTHER'
  if (primary.includes('entertainment')) return 'ENTERTAINMENT_OTHER'

  return 'UNCATEGORIZED'
}

/**
 * Remove a Plaid item (disconnect bank)
 */
export async function removeItem(userId: string, itemId: string) {
  // In production, also call Plaid API to remove item
  await db.account.updateMany({
    where: {
      userId,
      plaidItemId: itemId,
    },
    data: {
      isConnected: false,
      plaidAccountId: null,
      plaidItemId: null,
    },
  })
}
