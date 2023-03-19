import { gql } from "@apollo/client";

export const TRANSFER_FIAT = gql`
	mutation Mutation(
		$accountNumber: String!
		$bankName: String!
		$amount: String!
	) {
		transferFiatToCustomer(
			account_number: $accountNumber
			bank_name: $bankName
			amount: $amount
		)
	}
`;

export const ADD_USER = gql`
	mutation AddUser($signature: String!, $address: String!) {
		addUser(signature: $signature, address: $address) {
			... on User {
				id
				reference
				signature
				eoa
				level
				kyc {
					id
					user {
						id
						eoa
						signature
						level
						createdAt
						reference
					}
					status
					createdAt
					updatedAt
					identificationFirstName
					identificationMiddleName
					identificationLastName
					identificationNumber
					identificationType
					identificationImage
				}
				createdAt
				accountDetails {
					id
					accountName
					accountNumber
					bank {
						id
						name
						code
					}
					default
				}
			}
		}
	}
`;

export const ADD_ACCOUNT_DETAILS = gql`
	mutation AddAccountDetails(
		$userId: String!
		$accountNumber: String!
		$accountName: String!
		$bankName: String!
		$bankCode: String
	) {
		addAccountDetails(
			userId: $userId
			accountNumber: $accountNumber
			accountName: $accountName
			bankName: $bankName
			bankCode: $bankCode
		) {
			... on AccountDetails {
				accountName
				accountNumber
				default
				id
			}
			... on Error {
				additionalInfo
				code
				message
			}
		}
	}
`;

export const SET_USER_MAIN_ACCOUNT = gql`
	mutation Mutation($userId: String!, $accountId: String!) {
		setUserMainAccount(userId: $userId, accountId: $accountId) {
			... on AccountDetails {
				accountName
				accountNumber
				default
			}
		}
	}
`;
