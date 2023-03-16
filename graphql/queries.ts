import { gql } from "@apollo/client";

export const GET_JUJU_STATS = gql`
	query Query {
		getJujuStats {
			supportedAssets {
				id
				address
				chainId
				name
				symbol
				decimals
				standardName
				logo
				isSupportedBackingToken
				oracleAddress
			}
			activeChains {
				name
				id
				rpc
				logo
			}
			totalUsers
			totalValueLocked
		}
	}
`;

export const GET_FAQS = gql`
	query Query {
		getFAQ {
			answer
			question
		}
	}
`;

export const GET_SUPPORTED_TOKENS = gql`
	query Query {
		getSupportedTokens {
			address
			decimals
			logo
			name
			oracleAddress
			symbol
			chain {
				name
				id
			}
		}
	}
`;

export const GET_CHAIN_SUPPORTED_TOKENS = gql`
	query GetChainSupportedTokens($chainId: Int!) {
		getChainSupportedTokens(chainId: $chainId) {
			... on Token {
				logo
				name
				symbol
				address
			}
		}
	}
`;

export const GET_AGGREGATE_RATE = gql`
	query Query($tokenAddress: String!, $chainId: ID!) {
		getAggregateRate(tokenAddress: $tokenAddress, chainID: $chainId)
	}
`;

export const GET_SWAP_TO_WNGN_QUOTE = gql`
	query GetSwapToWNGNQuote(
		$user: String!
		$token: String!
		$amount: Float!
		$slippage: Float!
		$chainId: Int!
	) {
		getSwapToWNGNQuote(
			user: $user
			token: $token
			amount: $amount
			slippage: $slippage
			chainId: $chainId
		) {
			amount
			amountWNGNMinReceived
			canSwapToNaira
			amountWNGNReceived
			isETH
			receiver
			ref
			token
		}
	}
`;

export const GET_SWAP_TO_WNGN_TX = gql`
	query GetSwapToWNGNQuote(
		$swapToWngnQuote: SwapToWNGNQuoteInput!
		$chainId: Int!
	) {
		getSwapToWNGNTx(swapToWNGNQuote: $swapToWngnQuote, chainId: $chainId) {
			data
			from
			to
			value
		}
	}
`;

export const GET_REDEEM_QUOTE = gql`
	query GetRedeemQuote($user: String!, $amount: Float!, $chainId: Int!) {
		getRedeemQuote(user: $user, amount: $amount, chainId: $chainId) {
			amountNairaReceived
			canRedeem
			receiver
			ref
		}
	}
`;

export const GET_REDEEM_TX = gql`
	query GetRedeemTx($redeemQuote: RedeemQuoteInput!, $chainId: Int!) {
		getRedeemTx(redeemQuote: $redeemQuote, chainId: $chainId) {
			data
			from
			to
			value
		}
	}
`;

export const GET_MESSAGE = gql`
	query Query {
		getMessage
	}
`;

export const VERIFY_SIGNATURE = gql`
	query Query($message: String!, $address: String!, $signatureHash: String!) {
		verifySignature(
			message: $message
			address: $address
			signatureHash: $signatureHash
		)
	}
`;

export const GET_POOLS = gql`
	query Query($chainId: Int) {
		getPools(chainId: $chainId) {
			address
			tokens {
				logo
				name
				symbol
				decimals
				liquidity
				address
			}
		}
	}
`;

export const GET_POOL_USER_DATA = gql`
	query Query($pool: String, $user: String, $chainId: Int) {
		getPoolUserData(pool: $pool, user: $user, chainId: $chainId) {
			pool
			poolShare
			user
			liquiditySupplied {
				name
				logo
				liquidity
				decimals
				address
				symbol
			}
		}
	}
`;

export const GET_ADD_LIQUIDITY_QUOTE = gql`
	query GetAddLiquidityQuote(
		$user: String!
		$token: String!
		$amount: Float!
		$slippage: Float!
		$chainId: Int!
	) {
		getAddLiquidityQuote(
			user: $user
			token: $token
			amount: $amount
			slippage: $slippage
			chainId: $chainId
		) {
			amountIn
			amountTokenMin
			amountWNGNMin
			isETH
			canAddLiquidity
			token
			receiver
			pool
			requiresSwap
			lpTokensReceived
			swapQuote {
				amountIn
				amountOut
				priceImpact
				receiver
				swapTx {
					data
					from
					to
					value
				}
				tokenIn
				tokenOut
			}
		}
	}
`;

export const GET_ADD_LIQUIDITY_QUOTE_TX = gql`
	query GetAddLiquidityTx(
		$addLiquidityQuote: AddLiquidityQuoteInput!
		$chainId: Int!
	) {
		getAddLiquidityTx(
			addLiquidityQuote: $addLiquidityQuote
			chainId: $chainId
		) {
			data
			from
			to
			value
		}
	}
`;

export const GET_REMOVE_LIQUIDITY_QUOTE = gql`
	query GetRemoveLiquidityQuote(
		$user: String!
		$pool: String!
		$liquidity: Float!
		$chainId: Int!
	) {
		getRemoveLiquidityQuote(
			user: $user
			pool: $pool
			liquidity: $liquidity
			chainId: $chainId
		) {
			canRemoveLiquidity
			pool
			liquidity
			amountWNGN
			amountToken
			receiver
		}
	}
`;

export const GET_REMOVE_LIQUIDITY_QUOTE_TX = gql`
	query GetRemoveLiquidityTx(
		$removeLiquidityQuote: RemoveLiquidityQuoteInput!
		$chainId: Int!
	) {
		getRemoveLiquidityTx(
			removeLiquidityQuote: $removeLiquidityQuote
			chainId: $chainId
		) {
			from
			to
			data
			value
		}
	}
`;

export const GET_USER_ID = gql`
	query Query($eoa: String!) {
		getUserId(eoa: $eoa) {
			... on User {
				id
				eoa
				createdAt
				accountDetails {
					accountName
					accountNumber
					default
					bank {
						name
						id
						code
					}
				}
			}
		}
	}
`;
