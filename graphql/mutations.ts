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

export const DELETE_ACCOUNT_DETAILS = gql`
	mutation DeleteAccountDetails(
		$userId: String!
		$accountNumber: String!
		$accountName: String
	) {
		deleteAccountDetails(
			userId: $userId
			accountNumber: $accountNumber
			accountName: $accountName
		) {
			... on AccountDetails {
				accountName
				accountNumber
				id
			}
		}
	}
`;

export const ADD_KYC_DETAILS = gql`
	mutation AddKYC(
		$userId: String!
		$identificationFirstName: String!
		$identificationMiddleName: String!
		$identificationLastName: String!
		$identificationType: IdentificationType!
		$identificationNumber: String!
		$identificationImage: String!
	) {
		addKYC(
			userId: $userId
			identificationFirstName: $identificationFirstName
			identificationMiddleName: $identificationMiddleName
			identificationLastName: $identificationLastName
			identificationType: $identificationType
			identificationNumber: $identificationNumber
			identificationImage: $identificationImage
		) {
			... on KYC {
				createdAt
				id
				identificationFirstName
				identificationLastName
				identificationImage
				identificationMiddleName
				identificationType
				identificationNumber
				status
				updatedAt
			}
		}
	}
`;

export const UPDATE_KYC_DETAILS = gql`
	mutation UpdateKYC(
		$userId: String!
		$identificationImage: String = null
		$identificationType: IdentificationType = null
		$identificationLastName: String = null
		$identificationNumber: String = null
		$identificationFirstName: String = null
		$identificationMiddleName: String = null
	) {
		updateKYC(
			userId: $userId
			identificationImage: $identificationImage
			identificationType: $identificationType
			identificationLastName: $identificationLastName
			identificationNumber: $identificationNumber
			identificationFirstName: $identificationFirstName
			identificationMiddleName: $identificationMiddleName
		) {
			... on User {
				eoa
				id
				reference
			}
		}
	}
`;
