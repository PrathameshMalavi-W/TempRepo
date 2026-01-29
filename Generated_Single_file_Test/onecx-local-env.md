# Files from C:\Users\prath\onecx\onecx-other\onecx-local-env

## Folder: onecx-local-env/.github/workflows (1 files)

### File: onecx-local-env/.github/workflows/documentation.yml

```yaml

name: Update documentation
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger website update
        uses: peter-evans/repository-dispatch@v1
        with:
          token: ${{ secrets.CI_PAT }}
          repository: onecx/docs
          event-type: dispatch-build-website

```

## Folder: onecx-local-env (1 files)

### File: onecx-local-env/docker-compose.yaml

```yaml

########################################
############## GENERAL #################
########################################
# IMPORTANT: use the same project name as the subsequent compose files using same network/volumes
name: onecx-local-env

include:
  - ./versions/v2/docker-compose.yaml


```

## Folder: onecx-local-env/docs (1 files)

### File: onecx-local-env/docs/antora.yml

```yaml

# Define the same name space as used for the parent documentation project https://github.com/onecx/docs
name: documentation
version: latest
# Do not add any further properties here. This will affect the parent documentation project.

```

## Folder: onecx-local-env/init-data/keycloak (1 files)

### File: onecx-local-env/init-data/keycloak/realm-onecx.json

```json

{
  "id": "onecx",
  "realm": "onecx",
  "displayName": "OneCX Realm",
  "displayNameHtml": "",
  "notBefore": 0,
  "defaultSignatureAlgorithm": "RS256",
  "revokeRefreshToken": false,
  "refreshTokenMaxReuse": 0,
  "accessTokenLifespan": 300,
  "accessTokenLifespanForImplicitFlow": 900,
  "ssoSessionIdleTimeout": 1800,
  "ssoSessionMaxLifespan": 36000,
  "ssoSessionIdleTimeoutRememberMe": 0,
  "ssoSessionMaxLifespanRememberMe": 0,
  "offlineSessionIdleTimeout": 2592000,
  "offlineSessionMaxLifespanEnabled": false,
  "offlineSessionMaxLifespan": 5184000,
  "clientSessionIdleTimeout": 0,
  "clientSessionMaxLifespan": 0,
  "clientOfflineSessionIdleTimeout": 0,
  "clientOfflineSessionMaxLifespan": 0,
  "accessCodeLifespan": 60,
  "accessCodeLifespanUserAction": 300,
  "accessCodeLifespanLogin": 1800,
  "actionTokenGeneratedByAdminLifespan": 43200,
  "actionTokenGeneratedByUserLifespan": 300,
  "oauth2DeviceCodeLifespan": 600,
  "oauth2DevicePollingInterval": 5,
  "enabled": true,
  "sslRequired": "external",
  "registrationAllowed": false,
  "registrationEmailAsUsername": false,
  "rememberMe": false,
  "verifyEmail": false,
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": false,
  "editUsernameAllowed": false,
  "bruteForceProtected": false,
  "permanentLockout": false,
  "maxFailureWaitSeconds": 900,
  "minimumQuickLoginWaitSeconds": 60,
  "waitIncrementSeconds": 60,
  "quickLoginCheckMilliSeconds": 1000,
  "maxDeltaTimeSeconds": 43200,
  "failureFactor": 30,
  "roles": {
    "realm": [
      {
        "id": "842d03f7-6481-4d5b-b2dd-aa1a592402ce",
        "name": "onecx-user",
        "description": "OneCX Viewing (read access)",
        "composite": false,
        "clientRole": false,
        "containerId": "onecx",
        "attributes": {}
      },
      {
        "id": "7b4629c4-abe6-48b2-a8cc-daa760b0acaa",
        "name": "onecx-admin",
        "description": "OneCX Administration (full access)",
        "composite": false,
        "clientRole": false,
        "containerId": "onecx",
        "attributes": {}
      },
      {
        "id": "de3fbdfa-2123-4812-988a-723b537ac615",
        "name": "offline_access",
        "description": "${role_offline-access}",
        "composite": false,
        "clientRole": false,
        "containerId": "onecx",
        "attributes": {}
      },
      {
        "id": "fa32ab92-b967-4174-94e5-b6d495565ab9",
        "name": "default-roles-onecx",
        "description": "${role_default-roles}",
        "composite": true,
        "composites": {
          "realm": ["offline_access", "uma_authorization"],
          "client": {
            "account": ["manage-account", "view-profile"]
          }
        },
        "clientRole": false,
        "containerId": "onecx",
        "attributes": {}
      },
      {
        "id": "9e2c24e8-0e24-420d-a580-1824378e927b",
        "name": "uma_authorization",
        "description": "${role_uma_authorization}",
        "composite": false,
        "clientRole": false,
        "containerId": "onecx",
        "attributes": {}
      }
    ],
    "client": {
      "realm-management": [
        {
          "id": "10df2e04-bbc0-489e-ba4f-90e811381f75",
          "name": "realm-admin",
          "description": "${role_realm-admin}",
          "composite": true,
          "composites": {
            "client": {
              "realm-management": [
                "view-authorization",
                "create-client",
                "query-realms",
                "view-users",
                "manage-events",
                "query-clients",
                "manage-users",
                "query-groups",
                "manage-authorization",
                "query-users",
                "impersonation",
                "manage-realm",
                "view-clients",
                "view-identity-providers",
                "manage-clients",
                "manage-identity-providers",
                "view-events",
                "view-realm"
              ]
            }
          },
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "c32a6f60-aad2-4883-bd63-859c781d7766",
          "name": "view-authorization",
          "description": "${role_view-authorization}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "e12a1469-7008-4bb9-9a77-4b1aeb56afc8",
          "name": "create-client",
          "description": "${role_create-client}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "487d5208-9af3-4c96-af00-a2eef0460fd2",
          "name": "query-realms",
          "description": "${role_query-realms}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "91459864-223e-4e5c-8c97-09e9515fd961",
          "name": "view-users",
          "description": "${role_view-users}",
          "composite": true,
          "composites": {
            "client": {
              "realm-management": ["query-groups", "query-users"]
            }
          },
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "c9edca80-28d2-4520-9a0f-105e8918968f",
          "name": "manage-events",
          "description": "${role_manage-events}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "e125ab63-269c-4259-a592-bf649437c292",
          "name": "query-clients",
          "description": "${role_query-clients}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "cf9fc3ab-a556-4ae6-8664-4d83fae7531c",
          "name": "manage-users",
          "description": "${role_manage-users}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "ecf02b3e-b69e-466b-b30b-12c93e1ccb22",
          "name": "query-groups",
          "description": "${role_query-groups}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "96a6886a-644b-4923-8a48-277eddb6d56a",
          "name": "manage-authorization",
          "description": "${role_manage-authorization}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "c8d4f47a-4603-426f-b962-7c82b5cfcc1b",
          "name": "query-users",
          "description": "${role_query-users}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "6d95c717-72b9-4c94-934f-a617b360c8b8",
          "name": "impersonation",
          "description": "${role_impersonation}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "ae5ba08b-80ca-46bb-ba9c-446e9ff3e47c",
          "name": "manage-realm",
          "description": "${role_manage-realm}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "f08bd619-84ad-4314-919b-67629eb478b0",
          "name": "view-clients",
          "description": "${role_view-clients}",
          "composite": true,
          "composites": {
            "client": {
              "realm-management": ["query-clients"]
            }
          },
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "b94d6266-2138-43e2-9042-b4b0705a9154",
          "name": "view-identity-providers",
          "description": "${role_view-identity-providers}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "e8ca2a9d-6b5b-430a-988a-d2231a2f5a48",
          "name": "manage-clients",
          "description": "${role_manage-clients}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "92d5b99f-f4b4-4f0a-b9bf-991860d4d980",
          "name": "manage-identity-providers",
          "description": "${role_manage-identity-providers}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "39d18a0c-a592-485e-beb9-5a0f2bd2fc3e",
          "name": "view-events",
          "description": "${role_view-events}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        },
        {
          "id": "b3c5359b-54ce-4d5e-907f-4c9704c2d269",
          "name": "view-realm",
          "description": "${role_view-realm}",
          "composite": false,
          "clientRole": true,
          "containerId": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
          "attributes": {}
        }
      ],
      "onecx-shell-ui-client": [],
      "security-admin-console": [],
      "admin-cli": [],
      "account-console": [],
      "broker": [
        {
          "id": "8ff9cdcd-b6fe-44e3-9c15-2b8b12261bae",
          "name": "read-token",
          "description": "${role_read-token}",
          "composite": false,
          "clientRole": true,
          "containerId": "142b936a-8482-42d4-9c86-a3c63aad0800",
          "attributes": {}
        }
      ],
      "account": [
        {
          "id": "85720816-4690-4183-aedc-623a10a6c250",
          "name": "manage-account",
          "description": "${role_manage-account}",
          "composite": true,
          "composites": {
            "client": {
              "account": ["manage-account-links"]
            }
          },
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "9bbd662d-794f-4381-8414-7724cb92b64d",
          "name": "manage-consent",
          "description": "${role_manage-consent}",
          "composite": true,
          "composites": {
            "client": {
              "account": ["view-consent"]
            }
          },
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "08a31bb9-295a-4d9e-bd9c-15d59e5c0551",
          "name": "manage-account-links",
          "description": "${role_manage-account-links}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "ca8617f4-df90-48b0-8bae-8dab593960af",
          "name": "view-consent",
          "description": "${role_view-consent}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "a7dc1d76-ae24-4f15-8906-a0a8ab97e0fb",
          "name": "view-applications",
          "description": "${role_view-applications}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "9612691a-e736-4ae3-9f0b-b9dda2722735",
          "name": "view-groups",
          "description": "${role_view-groups}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "ae89f910-a2d9-4418-b05a-cefdc04d4b78",
          "name": "view-profile",
          "description": "${role_view-profile}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        },
        {
          "id": "829903a5-9c35-4427-92d7-4c1ca4721404",
          "name": "delete-account",
          "description": "${role_delete-account}",
          "composite": false,
          "clientRole": true,
          "containerId": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
          "attributes": {}
        }
      ]
    }
  },
  "groups": [],
  "defaultRole": {
    "id": "fa32ab92-b967-4174-94e5-b6d495565ab9",
    "name": "default-roles-onecx",
    "description": "${role_default-roles}",
    "composite": true,
    "clientRole": false,
    "containerId": "onecx"
  },
  "requiredCredentials": ["password"],
  "otpPolicyType": "totp",
  "otpPolicyAlgorithm": "HmacSHA1",
  "otpPolicyInitialCounter": 0,
  "otpPolicyDigits": 6,
  "otpPolicyLookAheadWindow": 1,
  "otpPolicyPeriod": 30,
  "otpPolicyCodeReusable": false,
  "otpSupportedApplications": [
    "totpAppFreeOTPName",
    "totpAppGoogleName",
    "totpAppMicrosoftAuthenticatorName"
  ],
  "localizationTexts": {},
  "webAuthnPolicyRpEntityName": "keycloak",
  "webAuthnPolicySignatureAlgorithms": ["ES256"],
  "webAuthnPolicyRpId": "",
  "webAuthnPolicyAttestationConveyancePreference": "not specified",
  "webAuthnPolicyAuthenticatorAttachment": "not specified",
  "webAuthnPolicyRequireResidentKey": "not specified",
  "webAuthnPolicyUserVerificationRequirement": "not specified",
  "webAuthnPolicyCreateTimeout": 0,
  "webAuthnPolicyAvoidSameAuthenticatorRegister": false,
  "webAuthnPolicyAcceptableAaguids": [],
  "webAuthnPolicyExtraOrigins": [],
  "webAuthnPolicyPasswordlessRpEntityName": "keycloak",
  "webAuthnPolicyPasswordlessSignatureAlgorithms": ["ES256"],
  "webAuthnPolicyPasswordlessRpId": "",
  "webAuthnPolicyPasswordlessAttestationConveyancePreference": "not specified",
  "webAuthnPolicyPasswordlessAuthenticatorAttachment": "not specified",
  "webAuthnPolicyPasswordlessRequireResidentKey": "not specified",
  "webAuthnPolicyPasswordlessUserVerificationRequirement": "not specified",
  "webAuthnPolicyPasswordlessCreateTimeout": 0,
  "webAuthnPolicyPasswordlessAvoidSameAuthenticatorRegister": false,
  "webAuthnPolicyPasswordlessAcceptableAaguids": [],
  "webAuthnPolicyPasswordlessExtraOrigins": [],
  "users": [
    {
      "id": "f994b031-8316-47fe-8ebf-c76803b071d6",
      "createdTimestamp": 1760416629430,
      "username": "onecx",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "Admin",
      "email": "onecx_admin@1000kit.org",
      "attributes": {},
      "credentials": [
        {
          "type": "password",
          "value": "onecx"
        }
      ],
      "realmRoles": ["onecx-admin"]
    },
    {
      "id": "3248e0b4-a5a8-4091-94e2-64e4f961f268",
      "createdTimestamp": 1760416629430,
      "username": "onecx_user",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "User",
      "email": "onecx_user@1000kit.org",
      "attributes": {},
      "credentials": [
        {
          "type": "password",
          "value": "onecx_user"
        }
      ],
      "realmRoles": ["onecx-user"]
    },
    {
      "id": "9e70a802-b9bd-496c-a03f-e866c4a7f8ca",
      "createdTimestamp": 1760416629430,
      "username": "onecx_t1_admin",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "T1 Admin",
      "email": "onecx_t1_admin@1000kit.org",
      "attributes": {
        "orgId": ["t1"]
      },
      "credentials": [
        {
          "type": "password",
          "value": "onecx_t1_admin"
        }
      ],
      "realmRoles": ["onecx-admin"]
    },
    {
      "id": "f9d671d6-995b-49d7-9328-56d8020db58c",
      "createdTimestamp": 1760416629430,
      "username": "onecx_t1_user",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "T1 User",
      "email": "onecx_t1_user@1000kit.org",
      "attributes": {
        "orgId": ["t1"]
      },
      "credentials": [
        {
          "type": "password",
          "value": "onecx_t1_user"
        }
      ],
      "realmRoles": ["onecx-user"]
    },
    {
      "id": "3a16329a-825b-4b8f-bcbb-4dee95c688a8",
      "createdTimestamp": 1760416629430,
      "username": "onecx_t2_admin",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "T2 Admin",
      "email": "onecx_t2_admin@1000kit.org",
      "attributes": {
        "partyId": ["107"],
        "orgId": ["t2"]
      },
      "credentials": [
        {
          "type": "password",
          "value": "onecx_t2_admin"
        }
      ],
      "realmRoles": ["onecx-admin"]
    },
    {
      "id": "58ed91c9-0444-4399-9070-ec28d6aaa00a",
      "createdTimestamp": 1760416629430,
      "username": "onecx_t2_user",
      "enabled": true,
      "totp": false,
      "emailVerified": true,
      "firstName": "OneCX",
      "lastName": "T2 User",
      "email": "onecx_t2_user@1000kit.org",
      "attributes": {
        "partyId": ["107"],
        "orgId": ["t2"]
      },
      "credentials": [
        {
          "type": "password",
          "value": "onecx_t2_user"
        }
      ],
      "realmRoles": ["onecx-user"]
    }
  ],
  "scopeMappings": [
    {
      "clientScope": "offline_access",
      "roles": ["offline_access"]
    }
  ],
  "clientScopeMappings": {
    "account": [
      {
        "client": "account-console",
        "roles": ["manage-account", "view-groups"]
      }
    ]
  },
  "clients": [
    {
      "id": "8e1a6990-4912-410c-905d-14a9a38b5cd3",
      "clientId": "account",
      "name": "${client_account}",
      "rootUrl": "${authBaseUrl}",
      "baseUrl": "/realms/onecx/account/",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": ["/realms/onecx/account/*"],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {},
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "795579ec-e543-4147-b269-b057e26a0280",
      "clientId": "account-console",
      "name": "${client_account-console}",
      "rootUrl": "${authBaseUrl}",
      "baseUrl": "/realms/onecx/account/",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": ["/realms/onecx/account/*"],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {
        "pkce.code.challenge.method": "S256"
      },
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "protocolMappers": [
        {
          "id": "3c805f1e-ef78-4329-bc7c-13710105af58",
          "name": "audience resolve",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-audience-resolve-mapper",
          "consentRequired": false,
          "config": {}
        }
      ],
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "9fded93a-769b-4fe3-b02d-e5c07a99cc39",
      "clientId": "admin-cli",
      "name": "${client_admin-cli}",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": [],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": false,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": true,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {},
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "142b936a-8482-42d4-9c86-a3c63aad0800",
      "clientId": "broker",
      "name": "${client_broker}",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": [],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": true,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "publicClient": false,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {},
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "clientId": "onecx-shell-ui-client",
      "name": "onecx-shell-ui-client",
      "description": "Client for OneCX Shell authorization",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": ["*"],
      "webOrigins": ["*"],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": true,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {
        "saml.assertion.signature": "false",
        "saml.multivalued.roles": "false",
        "saml.force.post.binding": "false",
        "saml.encrypt": "false",
        "oauth2.device.authorization.grant.enabled": "false",
        "backchannel.logout.revoke.offline.tokens": "false",
        "saml.server.signature": "false",
        "saml.server.signature.keyinfo.ext": "false",
        "use.refresh.tokens": "true",
        "exclude.session.state.from.auth.response": "false",
        "oidc.ciba.grant.enabled": "false",
        "saml.artifact.binding": "false",
        "backchannel.logout.session.required": "true",
        "client_credentials.use_refresh_token": "false",
        "saml_force_name_id_format": "false",
        "saml.client.signature": "false",
        "tls.client.certificate.bound.access.tokens": "false",
        "saml.authnstatement": "false",
        "display.on.consent.screen": "false",
        "saml.onetimeuse.condition": "false"
      },
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": true,
      "nodeReRegistrationTimeout": -1,
      "defaultClientScopes": [
        "web-origins",
        "roles",
        "profile",
        "email",
        "partyId",
        "Organization_ID"
      ],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "8c947402-1f5f-4cfe-ace6-cab68509465c",
      "clientId": "onecx-local-env-client-id",
      "name": "onecx-local-env-client",
      "description": "Client for OneCX",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "secret": "t4LXKbpxedZoHn9mynwSih9Cz9W1VbS8u9vaDz5A",
      "redirectUris": [],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": false,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": true,
      "publicClient": false,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {
        "realm_client": "false",
        "backchannel.logout.session.required": "true",
        "backchannel.logout.revoke.offline.tokens": "false"
      },
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": true,
      "nodeReRegistrationTimeout": -1,
      "protocolMappers": [
        {
          "id": "d10d5cef-1662-4bef-b122-34b4eb8fa1ab",
          "name": "Client Host",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usersessionmodel-note-mapper",
          "consentRequired": false,
          "config": {
            "user.session.note": "clientHost",
            "id.token.claim": "true",
            "introspection.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "clientHost",
            "jsonType.label": "String"
          }
        },
        {
          "id": "31324188-8875-412e-9282-cfc90ec4243d",
          "name": "Client IP Address",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usersessionmodel-note-mapper",
          "consentRequired": false,
          "config": {
            "user.session.note": "clientAddress",
            "id.token.claim": "true",
            "introspection.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "clientAddress",
            "jsonType.label": "String"
          }
        },
        {
          "id": "abd18fc2-23d7-4c47-8c86-ae7db271b112",
          "name": "Client ID",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usersessionmodel-note-mapper",
          "consentRequired": false,
          "config": {
            "user.session.note": "client_id",
            "id.token.claim": "true",
            "introspection.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "client_id",
            "jsonType.label": "String"
          }
        }
      ],
      "defaultClientScopes": [
        "web-origins",
        "roles",
        "profile",
        "email",
        "Organization_ID",
        "ocx-an:read",
        "ocx-an:write",
        "ocx-an:delete",
        "ocx-bm:read",
        "ocx-bm:write",
        "ocx-bm:delete",
        "ocx-hp:read",
        "ocx-hp:write",
        "ocx-hp:delete",
        "ocx-pa:read",
        "ocx-pa:write",
        "ocx-pa:delete",
        "ocx-pa-op:write",
        "ocx-pa-ext:read",
        "ocx-pm:read",
        "ocx-pm:write",
        "ocx-pm:delete",
        "ocx-ps:read",
        "ocx-ps:write",
        "ocx-ps:delete",
        "ocx-ps-mfe:write",
        "ocx-ps-ms:write",
        "ocx-ps-product:write",
        "ocx-ps-slot:write",
        "ocx-sc:read",
        "ocx-sc:write",
        "ocx-sc:delete",
        "ocx-th:read",
        "ocx-th:write",
        "ocx-th:delete",
        "ocx-tn:read",
        "ocx-tn:write",
        "ocx-up:read",
        "ocx-up:write",
        "ocx-up:delete",
        "ocx-wc:read",
        "ocx-wc:write",
        "ocx-wc:delete",
        "ocx-ws:read",
        "ocx-ws:write",
        "ocx-ws:delete"
      ],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "e945a4d0-3a35-48a3-adab-52afc7f729c2",
      "clientId": "realm-management",
      "name": "${client_realm-management}",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": [],
      "webOrigins": [],
      "notBefore": 0,
      "bearerOnly": true,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "publicClient": false,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {},
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    },
    {
      "id": "7b32e649-8bbe-4a05-ae27-051404a84741",
      "clientId": "security-admin-console",
      "name": "${client_security-admin-console}",
      "rootUrl": "${authAdminUrl}",
      "baseUrl": "/admin/onecx/console/",
      "surrogateAuthRequired": false,
      "enabled": true,
      "alwaysDisplayInConsole": false,
      "clientAuthenticatorType": "client-secret",
      "redirectUris": ["/admin/onecx/console/*"],
      "webOrigins": ["+"],
      "notBefore": 0,
      "bearerOnly": false,
      "consentRequired": false,
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "frontchannelLogout": false,
      "protocol": "openid-connect",
      "attributes": {
        "pkce.code.challenge.method": "S256"
      },
      "authenticationFlowBindingOverrides": {},
      "fullScopeAllowed": false,
      "nodeReRegistrationTimeout": 0,
      "protocolMappers": [
        {
          "id": "150734bb-1ab5-4ab3-9c32-23a4a8af28ef",
          "name": "locale",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "locale",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "locale",
            "jsonType.label": "String"
          }
        }
      ],
      "defaultClientScopes": ["web-origins", "roles", "profile", "email"],
      "optionalClientScopes": [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt"
      ]
    }
  ],
  "clientScopes": [
    {
      "id": "f1df983e-b787-4fb0-bebd-4e0839cee048",
      "name": "email",
      "description": "OpenID Connect built-in scope: email",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${emailScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "2d5658aa-062c-4e24-8702-ca9e5f7f4a34",
          "name": "email",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "email",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "email",
            "jsonType.label": "String"
          }
        },
        {
          "id": "77b5c030-3573-4f0a-9e06-f8438dd8ffa1",
          "name": "email verified",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "emailVerified",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "email_verified",
            "jsonType.label": "boolean"
          }
        }
      ]
    },
    {
      "id": "1e2b6261-1d84-4fb3-a379-eee5f52652c6",
      "name": "address",
      "description": "OpenID Connect built-in scope: address",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${addressScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "6e1f5359-a46d-4c51-a365-caef49db7c7f",
          "name": "address",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-address-mapper",
          "consentRequired": false,
          "config": {
            "user.attribute.formatted": "formatted",
            "user.attribute.country": "country",
            "user.attribute.postal_code": "postal_code",
            "userinfo.token.claim": "true",
            "user.attribute.street": "street",
            "id.token.claim": "true",
            "user.attribute.region": "region",
            "access.token.claim": "true",
            "user.attribute.locality": "locality"
          }
        }
      ]
    },
    {
      "id": "68e889ff-f747-44f2-a34e-8097a95adade",
      "name": "role_list",
      "description": "SAML role list",
      "protocol": "saml",
      "attributes": {
        "consent.screen.text": "${samlRoleListScopeConsentText}",
        "display.on.consent.screen": "true"
      },
      "protocolMappers": [
        {
          "id": "dab1d114-9377-420f-bca5-25c96fd791e8",
          "name": "role list",
          "protocol": "saml",
          "protocolMapper": "saml-role-list-mapper",
          "consentRequired": false,
          "config": {
            "single": "false",
            "attribute.nameformat": "Basic",
            "attribute.name": "Role"
          }
        }
      ]
    },
    {
      "id": "1be5359a-b679-4766-979e-ea1011624204",
      "name": "roles",
      "description": "OpenID Connect scope for add user roles to the access token",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "false",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${rolesScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "bfc36735-3bc4-496e-9fa0-577d86709ee8",
          "name": "realm roles",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-realm-role-mapper",
          "consentRequired": false,
          "config": {
            "user.attribute": "foo",
            "access.token.claim": "true",
            "claim.name": "realm_access.roles",
            "jsonType.label": "String",
            "multivalued": "true"
          }
        },
        {
          "id": "76bb72dc-dac8-4583-85ef-3d8688204f55",
          "name": "client roles",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-client-role-mapper",
          "consentRequired": false,
          "config": {
            "user.attribute": "foo",
            "access.token.claim": "true",
            "claim.name": "resource_access.${client_id}.roles",
            "jsonType.label": "String",
            "multivalued": "true"
          }
        },
        {
          "id": "4f8b8c1d-ddba-4e3c-9203-1df9f2d88526",
          "name": "audience resolve",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-audience-resolve-mapper",
          "consentRequired": false,
          "config": {}
        }
      ]
    },
    {
      "id": "ocx-an:read",
      "name": "ocx-an:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-an:write",
      "name": "ocx-an:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-an:delete",
      "name": "ocx-an:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-bm:read",
      "name": "ocx-bm:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-bm:write",
      "name": "ocx-bm:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-bm:delete",
      "name": "ocx-bm:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-hp:read",
      "name": "ocx-hp:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-hp:write",
      "name": "ocx-hp:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-hp:delete",
      "name": "ocx-hp:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pa:read",
      "name": "ocx-pa:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pa:write",
      "name": "ocx-pa:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pa:delete",
      "name": "ocx-pa:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pa-op:write",
      "name": "ocx-pa-op:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pa-ext:read",
      "name": "ocx-pa-ext:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pm:read",
      "name": "ocx-pm:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pm:write",
      "name": "ocx-pm:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-pm:delete",
      "name": "ocx-pm:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps:read",
      "name": "ocx-ps:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps:write",
      "name": "ocx-ps:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps:delete",
      "name": "ocx-ps:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps-mfe:write",
      "name": "ocx-ps-mfe:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps-ms:write",
      "name": "ocx-ps-ms:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps-product:write",
      "name": "ocx-ps-product:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ps-slot:write",
      "name": "ocx-ps-slot:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-sc:read",
      "name": "ocx-sc:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-sc:write",
      "name": "ocx-sc:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-sc:delete",
      "name": "ocx-sc:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-th:read",
      "name": "ocx-th:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-th:write",
      "name": "ocx-th:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-th:delete",
      "name": "ocx-th:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-tn:read",
      "name": "ocx-tn:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-tn:write",
      "name": "ocx-tn:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-up:read",
      "name": "ocx-up:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-up:write",
      "name": "ocx-up:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-up:delete",
      "name": "ocx-up:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-wc:read",
      "name": "ocx-wc:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-wc:write",
      "name": "ocx-wc:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-wc:delete",
      "name": "ocx-wc:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ws:read",
      "name": "ocx-ws:read",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ws:write",
      "name": "ocx-ws:write",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "ocx-ws:delete",
      "name": "ocx-ws:delete",
      "description": "created by initial import",
      "protocol": "openid-connect",
      "attributes": {}
    },
    {
      "id": "1be5359a-b679-4766-979e-ea1011624123",
      "name": "partyId",
      "description": "party id scope",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "false",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${rolesScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "ae3e11aa-e9ac-4f5f-a31b-f3c273493123",
          "name": "partyId",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "multivalued": "true",
            "user.attribute": "partyId",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "partyId",
            "jsonType.label": "String"
          }
        }
      ]
    },
    {
      "id": "1be5359a-b679-4766-979e-ea1011624166",
      "name": "Organization_ID",
      "description": "Tenant organization ID, mapping: orgId",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "false",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${rolesScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "ae3e11aa-e9ac-4f5f-a31b-f3c273493166",
          "name": "orgId",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "multivalued": "false",
            "user.attribute": "orgId",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "orgId",
            "jsonType.label": "String"
          }
        }
      ]
    },
    {
      "id": "1a210999-e32e-4631-ac53-5958b32d87c5",
      "name": "profile",
      "description": "OpenID Connect built-in scope: profile",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${profileScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "9a07b319-5191-4b1f-9021-1e1fb1522fbe",
          "name": "family name",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "lastName",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "family_name",
            "jsonType.label": "String"
          }
        },
        {
          "id": "ae3e11aa-e9ac-4f5f-a31b-f3c273493052",
          "name": "middle name",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "middleName",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "middle_name",
            "jsonType.label": "String"
          }
        },
        {
          "id": "604c9e77-b54a-48fa-b895-5e7c25f8240b",
          "name": "full name",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-full-name-mapper",
          "consentRequired": false,
          "config": {
            "id.token.claim": "true",
            "access.token.claim": "true",
            "userinfo.token.claim": "true"
          }
        },
        {
          "id": "12d0c7ab-7f0b-4af5-abb0-cebd608cbc0b",
          "name": "updated at",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "updatedAt",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "updated_at",
            "jsonType.label": "String"
          }
        },
        {
          "id": "5defb609-7f40-4e76-a1e0-680505842ad4",
          "name": "zoneinfo",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "zoneinfo",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "zoneinfo",
            "jsonType.label": "String"
          }
        },
        {
          "id": "44347143-207a-488b-9ebf-081437fd626e",
          "name": "username",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "username",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "preferred_username",
            "jsonType.label": "String"
          }
        },
        {
          "id": "e837e378-b949-485b-b50b-665068ed6170",
          "name": "given name",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "firstName",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "given_name",
            "jsonType.label": "String"
          }
        },
        {
          "id": "462136ff-1a3c-4b8d-ad8c-6856224cccf4",
          "name": "gender",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "gender",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "gender",
            "jsonType.label": "String"
          }
        },
        {
          "id": "0dab1d8b-160a-441c-b7b5-1f541eefd8d2",
          "name": "profile",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "profile",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "profile",
            "jsonType.label": "String"
          }
        },
        {
          "id": "c99ea1b2-a0ce-4ec5-9df6-0c58fc691258",
          "name": "birthdate",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "birthdate",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "birthdate",
            "jsonType.label": "String"
          }
        },
        {
          "id": "592cddfa-4856-49d7-b884-8d414e66bd4b",
          "name": "locale",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "locale",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "locale",
            "jsonType.label": "String"
          }
        },
        {
          "id": "95235e13-7fd1-4273-a63b-e8c776ac6146",
          "name": "website",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "website",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "website",
            "jsonType.label": "String"
          }
        },
        {
          "id": "4b0a2bbd-959b-42c7-a7b5-032d3c059136",
          "name": "nickname",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "nickname",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "nickname",
            "jsonType.label": "String"
          }
        },
        {
          "id": "7dffca67-b2a4-416a-b33f-39bb7a4f6769",
          "name": "picture",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "picture",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "picture",
            "jsonType.label": "String"
          }
        }
      ]
    },
    {
      "id": "7f94f95e-cc10-419b-8f64-cf0256d6dc53",
      "name": "phone",
      "description": "OpenID Connect built-in scope: phone",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "true",
        "consent.screen.text": "${phoneScopeConsentText}"
      },
      "protocolMappers": [
        {
          "id": "156e12d2-e0a6-4401-9985-6d0a6ad77073",
          "name": "phone number verified",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "phoneNumberVerified",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "phone_number_verified",
            "jsonType.label": "boolean"
          }
        },
        {
          "id": "76bca57a-780e-4cd2-8688-83932bf55562",
          "name": "phone number",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-attribute-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "phoneNumber",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "phone_number",
            "jsonType.label": "String"
          }
        }
      ]
    },
    {
      "id": "39a2044e-fb01-419a-85aa-2556caf17032",
      "name": "web-origins",
      "description": "OpenID Connect scope for add allowed web origins to the access token",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "false",
        "display.on.consent.screen": "false",
        "consent.screen.text": ""
      },
      "protocolMappers": [
        {
          "id": "2b2120cc-def1-4ba8-ae23-6be2f40c46b8",
          "name": "allowed web origins",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-allowed-origins-mapper",
          "consentRequired": false,
          "config": {}
        }
      ]
    },
    {
      "id": "82ab41e9-a0f4-4073-9051-c44201959598",
      "name": "offline_access",
      "description": "OpenID Connect built-in scope: offline_access",
      "protocol": "openid-connect",
      "attributes": {
        "consent.screen.text": "${offlineAccessScopeConsentText}",
        "display.on.consent.screen": "true"
      }
    },
    {
      "id": "b54c7358-149e-4989-b2db-6098fc923fa1",
      "name": "microprofile-jwt",
      "description": "Microprofile - JWT built-in scope",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "false"
      },
      "protocolMappers": [
        {
          "id": "8646cdca-b895-409e-9193-6afad2c9bed2",
          "name": "upn",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-property-mapper",
          "consentRequired": false,
          "config": {
            "userinfo.token.claim": "true",
            "user.attribute": "username",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "upn",
            "jsonType.label": "String"
          }
        },
        {
          "id": "a6b2525d-f1e2-4540-b913-f14c359d56a0",
          "name": "groups",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-realm-role-mapper",
          "consentRequired": false,
          "config": {
            "multivalued": "true",
            "userinfo.token.claim": "true",
            "user.attribute": "foo",
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "groups",
            "jsonType.label": "String"
          }
        }
      ]
    }
  ],
  "defaultDefaultClientScopes": [
    "role_list",
    "profile",
    "email",
    "roles",
    "web-origins"
  ],
  "defaultOptionalClientScopes": [
    "offline_access",
    "address",
    "phone",
    "microprofile-jwt"
  ],
  "browserSecurityHeaders": {
    "contentSecurityPolicyReportOnly": "",
    "xContentTypeOptions": "nosniff",
    "xRobotsTag": "none",
    "xFrameOptions": "SAMEORIGIN",
    "contentSecurityPolicy": "frame-src 'self'; frame-ancestors 'self'; object-src 'none';",
    "xXSSProtection": "1; mode=block",
    "strictTransportSecurity": "max-age=31536000; includeSubDomains"
  },
  "smtpServer": {},
  "eventsEnabled": false,
  "eventsListeners": ["jboss-logging"],
  "enabledEventTypes": [],
  "adminEventsEnabled": false,
  "adminEventsDetailsEnabled": false,
  "identityProviders": [],
  "identityProviderMappers": [],
  "components": {
    "org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy": [
      {
        "id": "e980af2c-64c7-47b1-9c2a-d6368dd56dd5",
        "name": "Allowed Client Scopes",
        "providerId": "allowed-client-templates",
        "subType": "authenticated",
        "subComponents": {},
        "config": {
          "allow-default-scopes": ["true"]
        }
      },
      {
        "id": "6a771ff8-be9c-4404-885e-d11f619f89f3",
        "name": "Full Scope Disabled",
        "providerId": "scope",
        "subType": "anonymous",
        "subComponents": {},
        "config": {}
      },
      {
        "id": "8b0a32c5-354c-41e6-907c-718a438bd34d",
        "name": "Allowed Protocol Mapper Types",
        "providerId": "allowed-protocol-mappers",
        "subType": "anonymous",
        "subComponents": {},
        "config": {
          "allowed-protocol-mapper-types": [
            "oidc-usermodel-attribute-mapper",
            "saml-user-property-mapper",
            "oidc-address-mapper",
            "saml-user-attribute-mapper",
            "saml-role-list-mapper",
            "oidc-full-name-mapper",
            "oidc-usermodel-property-mapper",
            "oidc-sha256-pairwise-sub-mapper"
          ]
        }
      },
      {
        "id": "4439d431-ac3a-4c0a-bf3a-bd78e5a2b173",
        "name": "Allowed Client Scopes",
        "providerId": "allowed-client-templates",
        "subType": "anonymous",
        "subComponents": {},
        "config": {
          "allow-default-scopes": ["true"]
        }
      },
      {
        "id": "ac599cd1-8c17-42d7-9e36-289b4c6570c5",
        "name": "Consent Required",
        "providerId": "consent-required",
        "subType": "anonymous",
        "subComponents": {},
        "config": {}
      },
      {
        "id": "cfb0534b-7f66-4bb7-ae5a-a4a29c079c50",
        "name": "Max Clients Limit",
        "providerId": "max-clients",
        "subType": "anonymous",
        "subComponents": {},
        "config": {
          "max-clients": ["200"]
        }
      },
      {
        "id": "d8b433bd-6a54-48c1-85bb-1611f0f162a0",
        "name": "Allowed Protocol Mapper Types",
        "providerId": "allowed-protocol-mappers",
        "subType": "authenticated",
        "subComponents": {},
        "config": {
          "allowed-protocol-mapper-types": [
            "oidc-usermodel-attribute-mapper",
            "oidc-usermodel-property-mapper",
            "saml-user-property-mapper",
            "oidc-sha256-pairwise-sub-mapper",
            "oidc-full-name-mapper",
            "saml-user-attribute-mapper",
            "saml-role-list-mapper",
            "oidc-address-mapper"
          ]
        }
      },
      {
        "id": "086bca90-cbb1-46ee-aabe-b8c3ef3449ae",
        "name": "Trusted Hosts",
        "providerId": "trusted-hosts",
        "subType": "anonymous",
        "subComponents": {},
        "config": {
          "host-sending-registration-request-must-match": ["true"],
          "client-uris-must-match": ["true"]
        }
      }
    ],
    "org.keycloak.keys.KeyProvider": [
      {
        "id": "e19cc5b2-f6c0-420d-8a10-8c85cef9777d",
        "name": "rsa-generated",
        "providerId": "rsa-generated",
        "subComponents": {},
        "config": {
          "priority": ["100"]
        }
      },
      {
        "id": "f7395300-b374-464b-8428-cfa9aab3fe62",
        "name": "hmac-generated",
        "providerId": "hmac-generated",
        "subComponents": {},
        "config": {
          "priority": ["100"],
          "algorithm": ["HS256"]
        }
      },
      {
        "id": "d6540a8e-fe4b-4006-9bd4-2f8cf78b3d1c",
        "name": "aes-generated",
        "providerId": "aes-generated",
        "subComponents": {},
        "config": {
          "priority": ["100"]
        }
      }
    ]
  },
  "internationalizationEnabled": false,
  "supportedLocales": [],
  "authenticationFlows": [
    {
      "id": "c2536e1a-6499-44a8-9907-066fff413d57",
      "alias": "Account verification options",
      "description": "Method with which to verity the existing account",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "idp-email-verification",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "ALTERNATIVE",
          "priority": 20,
          "flowAlias": "Verify Existing Account by Re-authentication",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "064c5153-161c-4e46-8793-ecb66ab55f11",
      "alias": "Authentication Options",
      "description": "Authentication options.",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "basic-auth",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "basic-auth-otp",
          "authenticatorFlow": false,
          "requirement": "DISABLED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "auth-spnego",
          "authenticatorFlow": false,
          "requirement": "DISABLED",
          "priority": 30,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "7f3e0bd6-e14c-4777-9089-0087bcb72080",
      "alias": "Browser - Conditional OTP",
      "description": "Flow to determine if the OTP is required for the authentication",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "conditional-user-configured",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "auth-otp-form",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "5271c9c8-0984-46b0-950a-2171c640b26d",
      "alias": "Direct Grant - Conditional OTP",
      "description": "Flow to determine if the OTP is required for the authentication",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "conditional-user-configured",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "direct-grant-validate-otp",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "c0cae987-4973-4106-869d-5860c293dd9b",
      "alias": "First broker login - Conditional OTP",
      "description": "Flow to determine if the OTP is required for the authentication",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "conditional-user-configured",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "auth-otp-form",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "97185047-cb08-4325-8081-027b7ec5e714",
      "alias": "Handle Existing Account",
      "description": "Handle what to do if there is existing account with same email/username like authenticated identity provider",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "idp-confirm-link",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "REQUIRED",
          "priority": 20,
          "flowAlias": "Account verification options",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "274db827-ca45-44de-8197-f9cc0f376ba3",
      "alias": "Reset - Conditional OTP",
      "description": "Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "conditional-user-configured",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "reset-otp",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "989b654c-27b8-415a-a42c-dc59998c894c",
      "alias": "User creation or linking",
      "description": "Flow for the existing/non-existing user alternatives",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticatorConfig": "create unique user config",
          "authenticator": "idp-create-user-if-unique",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "ALTERNATIVE",
          "priority": 20,
          "flowAlias": "Handle Existing Account",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "49dc6731-498a-4656-89a6-b9f65ff63cdf",
      "alias": "Verify Existing Account by Re-authentication",
      "description": "Reauthentication of existing account",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "idp-username-password-form",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "CONDITIONAL",
          "priority": 20,
          "flowAlias": "First broker login - Conditional OTP",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "c801eea9-32d7-4300-8d97-49158fb7ef82",
      "alias": "browser",
      "description": "browser based authentication",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "auth-cookie",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "auth-spnego",
          "authenticatorFlow": false,
          "requirement": "DISABLED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "identity-provider-redirector",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 25,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "ALTERNATIVE",
          "priority": 30,
          "flowAlias": "forms",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "0beb51ef-66dd-438a-988c-81161d502c1e",
      "alias": "clients",
      "description": "Base authentication for clients",
      "providerId": "client-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "client-secret",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "client-jwt",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "client-secret-jwt",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 30,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "client-x509",
          "authenticatorFlow": false,
          "requirement": "ALTERNATIVE",
          "priority": 40,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "a1ee7444-a290-4871-8f6c-80ab1dc1238f",
      "alias": "direct grant",
      "description": "OpenID Connect Resource Owner Grant",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "direct-grant-validate-username",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "direct-grant-validate-password",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "CONDITIONAL",
          "priority": 30,
          "flowAlias": "Direct Grant - Conditional OTP",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "e1eb2e86-699a-4d2d-a1bd-3baba8a2bf0c",
      "alias": "docker auth",
      "description": "Used by Docker clients to authenticate against the IDP",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "docker-http-basic-authenticator",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "5d1a9d6a-a095-4739-a927-7b5e057ff2ab",
      "alias": "first broker login",
      "description": "Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticatorConfig": "review profile config",
          "authenticator": "idp-review-profile",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "REQUIRED",
          "priority": 20,
          "flowAlias": "User creation or linking",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "39c116c6-cb29-40a2-b15c-76830b5de91d",
      "alias": "forms",
      "description": "Username, password, otp and other auth forms.",
      "providerId": "basic-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "auth-username-password-form",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "CONDITIONAL",
          "priority": 20,
          "flowAlias": "Browser - Conditional OTP",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "260b9c0d-69ad-4282-bb7b-175c76810889",
      "alias": "http challenge",
      "description": "An authentication flow based on challenge-response HTTP Authentication Schemes",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "no-cookie-redirect",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "REQUIRED",
          "priority": 20,
          "flowAlias": "Authentication Options",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "ffbdd71e-efa1-4bfd-bf38-a9863e76ffde",
      "alias": "registration",
      "description": "registration flow",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "registration-page-form",
          "authenticatorFlow": true,
          "requirement": "REQUIRED",
          "priority": 10,
          "flowAlias": "registration form",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "62141b74-09a9-4502-848f-c720fe1d814d",
      "alias": "registration form",
      "description": "registration form",
      "providerId": "form-flow",
      "topLevel": false,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "registration-user-creation",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "registration-profile-action",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 40,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "registration-password-action",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 50,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "registration-recaptcha-action",
          "authenticatorFlow": false,
          "requirement": "DISABLED",
          "priority": 60,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    },
    {
      "id": "f8af3e63-ea9c-4eed-80bf-53561720a1f0",
      "alias": "reset credentials",
      "description": "Reset credentials for a user if they forgot their password or something",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "reset-credentials-choose-user",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "reset-credential-email",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 20,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticator": "reset-password",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 30,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        },
        {
          "authenticatorFlow": true,
          "requirement": "CONDITIONAL",
          "priority": 40,
          "flowAlias": "Reset - Conditional OTP",
          "userSetupAllowed": false,
          "autheticatorFlow": true
        }
      ]
    },
    {
      "id": "cd261a58-18b3-4e8a-8363-7979f3f429a1",
      "alias": "saml ecp",
      "description": "SAML ECP Profile Authentication Flow",
      "providerId": "basic-flow",
      "topLevel": true,
      "builtIn": true,
      "authenticationExecutions": [
        {
          "authenticator": "http-basic-authenticator",
          "authenticatorFlow": false,
          "requirement": "REQUIRED",
          "priority": 10,
          "userSetupAllowed": false,
          "autheticatorFlow": false
        }
      ]
    }
  ],
  "authenticatorConfig": [
    {
      "id": "d9e6d926-f7aa-40e4-b036-5642031848b4",
      "alias": "create unique user config",
      "config": {
        "require.password.update.after.registration": "false"
      }
    },
    {
      "id": "da845414-c833-4d3f-9e9c-88f55f08bc2e",
      "alias": "review profile config",
      "config": {
        "update.profile.on.first.login": "missing"
      }
    }
  ],
  "requiredActions": [
    {
      "alias": "CONFIGURE_TOTP",
      "name": "Configure OTP",
      "providerId": "CONFIGURE_TOTP",
      "enabled": true,
      "defaultAction": false,
      "priority": 10,
      "config": {}
    },
    {
      "alias": "terms_and_conditions",
      "name": "Terms and Conditions",
      "providerId": "terms_and_conditions",
      "enabled": false,
      "defaultAction": false,
      "priority": 20,
      "config": {}
    },
    {
      "alias": "UPDATE_PASSWORD",
      "name": "Update Password",
      "providerId": "UPDATE_PASSWORD",
      "enabled": true,
      "defaultAction": false,
      "priority": 30,
      "config": {}
    },
    {
      "alias": "UPDATE_PROFILE",
      "name": "Update Profile",
      "providerId": "UPDATE_PROFILE",
      "enabled": true,
      "defaultAction": false,
      "priority": 40,
      "config": {}
    },
    {
      "alias": "VERIFY_EMAIL",
      "name": "Verify Email",
      "providerId": "VERIFY_EMAIL",
      "enabled": true,
      "defaultAction": false,
      "priority": 50,
      "config": {}
    },
    {
      "alias": "delete_account",
      "name": "Delete Account",
      "providerId": "delete_account",
      "enabled": false,
      "defaultAction": false,
      "priority": 60,
      "config": {}
    },
    {
      "alias": "update_user_locale",
      "name": "Update User Locale",
      "providerId": "update_user_locale",
      "enabled": true,
      "defaultAction": false,
      "priority": 1000,
      "config": {}
    }
  ],
  "browserFlow": "browser",
  "registrationFlow": "registration",
  "directGrantFlow": "direct grant",
  "resetCredentialsFlow": "reset credentials",
  "clientAuthenticationFlow": "clients",
  "dockerAuthenticationFlow": "docker auth",
  "attributes": {
    "cibaBackchannelTokenDeliveryMode": "poll",
    "cibaAuthRequestedUserHint": "login_hint",
    "clientOfflineSessionMaxLifespan": "0",
    "oauth2DevicePollingInterval": "5",
    "clientSessionIdleTimeout": "0",
    "clientOfflineSessionIdleTimeout": "0",
    "cibaInterval": "5",
    "realmReusableOtpCode": "false",
    "cibaExpiresIn": "120",
    "oauth2DeviceCodeLifespan": "600",
    "parRequestUriLifespan": "60",
    "clientSessionMaxLifespan": "0",
    "frontendUrl": "http://keycloak-app:8080",
    "acr.loa.map": "{}"
  },
  "keycloakVersion": "23.0.4",
  "userManagedAccessAllowed": false,
  "clientProfiles": {
    "profiles": []
  },
  "clientPolicies": {
    "policies": []
  }
}


```

## Folder: onecx-local-env/init-data/pgadmin (1 files)

### File: onecx-local-env/init-data/pgadmin/servers.json

```json

{
  "Servers": {
    "1": {
      "Name": "Root postgres",
      "Group": "Servers",
      "Host": "postgresdb",
      "Port": 5432,
      "MaintenanceDB": "postgres",
      "Username": "postgres",
      "SSLMode": "prefer"
    }
  }
}


```

## Folder: onecx-local-env/init-data/traefik/base (2 files)

### File: onecx-local-env/init-data/traefik/base/traefik-conf.yml

```yaml

# NOTE : conf in this file are not cumulative and cancel any option passed to traefik at launch with command in docker compose file
api:
  # http://traefik:8082/dashboard/
  dashboard: true
  insecure: true
  debug: false
  disabledashboardad: true

#log:
#  level: "INFO"
#  filePath: "/var/log/traefik/traefik.log"
#accessLog:
#  filePath: "/var/log/traefik/access.log"
#  bufferingSize: 0

entryPoints:
  web:
    address: ":80"

providers:
  docker:
    endpoint: unix:///var/run/docker.sock
    # If set to false, containers that don't have a traefik.enable=true label will be ignored from the resulting routing configuration
    #exposedByDefault: false
  file:
    # read all local microfrontend configurations automatically
    directory: /etc/traefik/active
    watch: true



```

### File: onecx-local-env/init-data/traefik/base/traefik-services.yml

```yaml

http:
  services:
    local_bff:
      loadBalancer:
        servers:
        - url: "http://host.docker.internal:8585/"


```

## Folder: onecx-local-env/init-data/traefik/inactive (2 files)

### File: onecx-local-env/init-data/traefik/inactive/_mfe_template.yml

```yaml

####################################################
# Integrate a local running Microfrontend into OneCX
####################################################
# Microfrontend: "{{MFE_NAME}}""
http:
  routers:
    local_{{MFE_NAME}}:
      # path prefix as used for MFE registration in product store
      rule: "Host(`local-proxy`) && PathPrefix(`{{MFE_PATH}}`)"
      service: local_{{MFE_NAME}}
      # higher prio than calculated based on rule length (traefik standard)
      priority: 323
      middlewares:
        - strip_{{MFE_NAME}}

  # Remove the used mfe path so that it maps directly to localhost:port
  middlewares:
    strip_{{MFE_NAME}}:
      stripPrefix:
        prefixes:
          - "{{MFE_STRIPPATH}}"

  services:
    local_{{MFE_NAME}}:
      loadBalancer:
        servers:
        - url: "http://host.docker.internal:{{MFE_PORT}}/"   # Angular project started outside Docker with this port


```

### File: onecx-local-env/init-data/traefik/inactive/local_mfe.yml

```yaml

####################################################
# Integrate a local running Microfrontend into OneCX
####################################################
# Any local Microfrontend
http:
  routers:
    local_local_mfe_router:
      # path prefix as used for MFE registration in product store
      rule: "Host(`local-proxy`) && PathPrefix(`/mfe/local/`)"
      service: local_mfe
      middlewares:
        - local_mfe

  # Remove the used mfe path so that it maps directly to localhost:port
  middlewares:
    local_mfe:
      stripPrefix:
        prefixes:
          - "/mfe/local"

  services:
    local_mfe:
      loadBalancer:
        servers:
        - url: "http://host.docker.internal:4200/"   # Angular project started outside Docker with this port


```

## Folder: onecx-local-env/onecx-data/bookmark (1 files)

### File: onecx-local-env/onecx-data/bookmark/default_ADMIN.json

```json

{
  "id": "onecx-local-env_import-bookmarks_default-ADMIN",
  "created": "2025-11-03T11:40:25.069932525Z",
  "bookmarks": {
    "PUBLIC": [
      {
        "displayName": "Workspaces",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-workspace",
        "appId": "onecx-workspace-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 1
      },
      {
        "displayName": "Themes",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-theme",
        "appId": "onecx-theme-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 2
      },
      {
        "displayName": "Products & Applications",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-product-store",
        "appId": "onecx-product-store-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 3
      },
      {
        "displayName": "Permissions",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-permission",
        "appId": "onecx-permission-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 4
      },
      {
        "displayName": "Parameters",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-parameter",
        "appId": "onecx-parameter-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 5
      },
      {
        "displayName": "User Profiles",
        "endpointName": "search",
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-user-profile",
        "appId": "onecx-user-profile-ui",
        "scope": "PUBLIC",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": false,
        "position": 6
      }
    ],
    "PRIVATE": [
      {
        "displayName": "Default Theme",
        "endpointName": "theme-detail",
        "endpointParameters": {
          "theme-name": "OneCXDefaultTheme"
        },
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-theme",
        "appId": "onecx-theme-ui",
        "scope": "PRIVATE",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": null,
        "position": 1
      },
      {
        "displayName": "Welcome",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-welcome",
        "appId": "onecx-welcome-ui",
        "scope": "PRIVATE",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": null,
        "position": 2
      },
      {
        "displayName": "Products for Admin",
        "endpointName": "workspace-detail",
        "endpointParameters": {
          "workspace-name": "ADMIN"
        },
        "query": {},
        "fragment": "products",
        "url": null,
        "productName": "onecx-workspace",
        "appId": "onecx-workspace-ui",
        "scope": "PRIVATE",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": null,
        "position": 3
      },
      {
        "displayName": "Permissions for Admin",
        "endpointName": "workspace",
        "endpointParameters": {
          "workspace-name": "ADMIN"
        },
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-permission",
        "appId": "onecx-permission-ui",
        "scope": "PRIVATE",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": null,
        "position": 4
      },
      {
        "displayName": "Data Orchestrator",
        "endpointName": null,
        "endpointParameters": {},
        "query": {},
        "fragment": null,
        "url": null,
        "productName": "onecx-data-orchestrator",
        "appId": "onecx-data-orchestrator-ui",
        "scope": "PRIVATE",
        "imageUrl": null,
        "image": null,
        "external": null,
        "target": "_self",
        "disabled": null,
        "position": 6
      }
    ]
  }
}


```

## Folder: onecx-local-env/onecx-data/parameter (1 files)

### File: onecx-local-env/onecx-data/parameter/onecx-parameter_onecx-parameter-bff.json

```json

{
  "parameters": [
    { "name": "param1", "displayName": "Test parameter 1", "description": "Test parameter 1 - object", "value": {"a": 1} },
    { "name": "param2", "displayName": "Test parameter 2", "description": "Test parameter 2 - string", "value": "text" },
    { "name": "param3", "displayName": "Test parameter 3", "description": "Test parameter 3 - boolean", "value": true },
    { "name": "param4", "displayName": "Test parameter 4", "description": "Test parameter 4 - numeric", "value": 100 }
  ]
}

```

## Folder: onecx-local-env/onecx-data/permission (23 files)

### File: onecx-local-env/onecx-data/permission/onecx-announcement_onecx-announcement-bff.json

```json

{
  "name": "onecx-announcement-bff",
  "permissions": [
    { "resource": "announcement", "action": "read" },
    { "resource": "announcement", "action": "write" },
    { "resource": "announcement", "action": "delete" }
  ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-announcement_onecx-announcement-ui.json

```json

{
  "name": "onecx-announcement-ui",
  "permissions": [
    {
      "resource": "ANNOUNCEMENT",
      "action": "CREATE"
    },
    {
      "resource": "ANNOUNCEMENT",
      "action": "DELETE"
    },
    {
      "resource": "ANNOUNCEMENT",
      "action": "EDIT"
    },
    {
      "resource": "ANNOUNCEMENT",
      "action": "SEARCH"
    },
    {
      "resource": "ANNOUNCEMENT",
      "action": "VIEW"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-help_onecx-help-bff.json

```json

{
  "name": "onecx-help-bff",
  "permissions": [
    { "resource": "help", "action": "read" },
    { "resource": "help", "action": "write" },
    { "resource": "help", "action": "delete" }
  ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-help_onecx-help-ui.json

```json

{
  "name": "onecx-help-ui",
  "permissions": [
    {
      "resource": "HELP",
      "action": "CREATE"
    },
    {
      "resource": "HELP",
      "action": "DELETE"
    },
    {
      "resource": "HELP",
      "action": "EDIT"
    },
    {
      "resource": "HELP",
      "action": "SEARCH"
    },
    {
      "resource": "HELP",
      "action": "VIEW"
    },
    {
      "resource": "HELP",
      "action": "EXPORT"
    },
    {
      "resource": "HELP",
      "action": "IMPORT"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-iam_onecx-iam-bff.json

```json

{
    "name": "onecx-iam-bff",
    "permissions": [
        { "resource": "password", "action": "write" },
        { "resource": "provider", "action": "admin-read" },
        { "resource": "provider", "action": "read" },
        { "resource": "role", "action": "admin-read" },
        { "resource": "role", "action": "admin-write" },
        { "resource": "role", "action": "read" },
        { "resource": "user", "action": "admin-read" },
        { "resource": "user", "action": "admin-write" },
        { "resource": "user", "action": "read" },
        { "resource": "user", "action": "write" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-iam_onecx-iam-ui.json

```json

{
    "name": "onecx-iam-ui",
    "permissions": [
        { "resource": "PERMISSION", "action": "VIEW" },
        { "resource": "ROLE", "action": "CREATE" },
        { "resource": "ROLE", "action": "DELETE" },
        { "resource": "ROLE", "action": "EDIT" },
        { "resource": "ROLE", "action": "SEARCH" },
        { "resource": "USER", "action": "CREATE" },
        { "resource": "USER", "action": "DELETE" },
        { "resource": "USER", "action": "EDIT" },
        { "resource": "USER", "action": "SEARCH" },
        { "resource": "USER", "action": "VIEW" }
    ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-parameter_onecx-parameter-bff.json

```json

{
    "name": "onecx-parameter-bff",
    "permissions": [
        { "resource": "parameter", "action": "delete" },
        { "resource": "parameter", "action": "read" },
        { "resource": "parameter", "action": "write" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-parameter_onecx-parameter-ui.json

```json

{
    "name": "onecx-parameter-ui",
    "permissions": [
        {"resource": "PARAMETER", "action": "DELETE"},
        {"resource": "PARAMETER", "action": "EDIT"},
        {"resource": "PARAMETER", "action": "SEARCH"},
        {"resource": "PARAMETER", "action": "VIEW"},
        {"resource": "USAGE", "action": "SEARCH"},
        {"resource": "USAGE", "action": "VIEW"}
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-permission_onecx-permission-bff.json

```json

{
    "name": "onecx-permission-bff",
    "permissions": [
        { "resource": "application", "action": "delete" },
        { "resource": "application", "action": "read" },
        { "resource": "application", "action": "write" },
        { "resource": "assignment", "action": "delete" },
        { "resource": "assignment", "action": "read" },
        { "resource": "assignment", "action": "write" },
        { "resource": "permission", "action": "delete" },
        { "resource": "permission", "action": "read" },
        { "resource": "permission", "action": "write" },
        { "resource": "role", "action": "delete" },
        { "resource": "role", "action": "read" },
        { "resource": "role", "action": "write" },
        { "resource": "workspace", "action": "delete" },
        { "resource": "workspace", "action": "read" },
        { "resource": "workspace", "action": "write" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-permission_onecx-permission-ui.json

```json

{
    "name": "onecx-permission-ui",
    "permissions": [
        {"resource": "APP", "action": "EDIT"},
        {"resource": "APP", "action": "SEARCH"},
        {"resource": "APP", "action": "VIEW"},
        {"resource": "IAM_ROLE", "action": "VIEW"},
        {"resource": "PERMISSION", "action": "CREATE"},
        {"resource": "PERMISSION", "action": "DELETE"},
        {"resource": "PERMISSION", "action": "EDIT"},
        {"resource": "PERMISSION", "action": "GRANT"},
        {"resource": "ROLE", "action": "CREATE"},
        {"resource": "ROLE", "action": "DELETE"},
        {"resource": "ROLE", "action": "EDIT"}
    ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-product-store_onecx-product-store-bff.json

```json

{
    "name": "onecx-product-store-bff",
    "permissions": [
        { "resource": "image", "action": "read" },
        { "resource": "image", "action": "write" },
        { "resource": "microfrontend", "action": "delete" },
        { "resource": "microfrontend", "action": "read" },
        { "resource": "microfrontend", "action": "write" },
        { "resource": "microservice", "action": "delete" },
        { "resource": "microservice", "action": "read" },
        { "resource": "microservice", "action": "write" },
        { "resource": "product", "action": "delete" },
        { "resource": "product", "action": "read" },
        { "resource": "product", "action": "write" },
        { "resource": "slot", "action": "delete" },
        { "resource": "slot", "action": "read" },
        { "resource": "slot", "action": "write" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-product-store_onecx-product-store-ui.json

```json

{
  "name": "onecx-product-store-ui",
  "permissions": [
    { "resource": "APP", "action": "CREATE" },
    { "resource": "APP", "action": "DELETE" },
    { "resource": "APP", "action": "EDIT" },
    { "resource": "APP", "action": "SEARCH" },
    { "resource": "APP", "action": "VIEW" },
    { "resource": "ENDPOINT", "action": "SEARCH" },
    { "resource": "PRODUCT", "action": "CREATE" },
    { "resource": "PRODUCT", "action": "DELETE" },
    { "resource": "PRODUCT", "action": "EDIT" },
    { "resource": "PRODUCT", "action": "SEARCH" },
    { "resource": "PRODUCT", "action": "VIEW" },
    { "resource": "SLOT", "action": "CREATE" },
    { "resource": "SLOT", "action": "DELETE" },
    { "resource": "SLOT", "action": "EDIT" },
    { "resource": "SLOT", "action": "SEARCH" },
    { "resource": "SLOT", "action": "VIEW" }
  ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-shell_onecx-shell-bff.json

```json

{
    "name": "onecx-shell-bff",
    "permissions": [
        { "resource": "workspaceConfig", "action": "read" },
        { "resource": "userProfile", "action": "read" },
        { "resource": "permission", "action": "read" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-tenant_onecx-tenant-bff.json

```json

{
    "name": "onecx-tenant-bff",
    "permissions": [
        {"resource": "tenant", "action": "delete"},
        {"resource": "tenant", "action": "read"},
        {"resource": "tenant", "action": "write"}
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-tenant_onecx-tenant-ui.json

```json

{
    "name": "onecx-tenant-ui",
    "permissions": [
        { "resource": "TENANT", "action": "CREATE" },
        { "resource": "TENANT", "action": "DELETE" },
        { "resource": "TENANT", "action": "EDIT" },
        { "resource": "TENANT", "action": "SEARCH" },
        { "resource": "TENANT", "action": "VIEW" },
        { "resource": "SEARCHCONFIG", "action": "VIEW" }
    ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-theme_onecx-theme-bff.json

```json

{
    "name": "onecx-theme-bff",
    "permissions": [
        { "resource": "themes", "action": "delete" },
        { "resource": "themes", "action": "read" },
        { "resource": "themes", "action": "write" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-theme_onecx-theme-ui.json

```json

{
    "name": "onecx-theme-ui",
    "permissions": [
        { "resource": "THEME", "action": "CREATE" },
        { "resource": "THEME", "action": "DELETE" },
        { "resource": "THEME", "action": "EDIT" },
        { "resource": "THEME", "action": "SEARCH" },
        { "resource": "THEME", "action": "VIEW" },
        { "resource": "THEME", "action": "EXPORT" },
        { "resource": "THEME", "action": "IMPORT" }
    ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-user-profile_onecx-user-profile-bff.json

```json

{
    "name": "onecx-user-profile-bff",
    "permissions": [
        {"resource": "userProfile", "action": "delete"},
        {"resource": "userProfile", "action": "read"},
        {"resource": "userProfile", "action": "write"},
        {"resource": "userProfile", "action": "adminRead"},
        {"resource": "userProfile", "action": "adminWrite"},
        {"resource": "userProfile", "action": "adminDelete"}
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-user-profile_onecx-user-profile-ui.json

```json

{
    "name": "onecx-user-profile-ui",
    "permissions": [
        { "resource": "USERPROFILE", "action": "CREATE" },
        { "resource": "USERPROFILE", "action": "DELETE" },
        { "resource": "USERPROFILE", "action": "EDIT" },
        { "resource": "USERPROFILE", "action": "SEARCH" },
        { "resource": "USERPROFILE", "action": "VIEW" },
        { "resource": "USERPROFILE", "action": "EXPORT" },
        { "resource": "USERPROFILE", "action": "IMPORT" },
        { "resource": "USERPROFILE", "action": "ADMIN_VIEW" },
        { "resource": "USERPROFILE", "action": "ADMIN_EDIT" },
        { "resource": "USERPROFILE", "action": "ADMIN_DELETE" },
        { "resource": "ACCOUNT_SETTINGS", "action": "VIEW" },
        { "resource": "ACCOUNT_SETTINGS_LAYOUT_MENU", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_COLOR_SCHEME", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_BREADCRUMBS", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_LANGUAGE_TIMEZONE", "action": "VIEW" },
        { "resource": "ACCOUNT_SETTINGS_LANGUAGE", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_TIMEZONE", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_LAYOUT_THEME", "action": "VIEW" },
        { "resource": "ACCOUNT_SETTINGS_PREFERENCES", "action": "VIEW" },
        { "resource": "ACCOUNT_SETTINGS_PRIVACY", "action": "EDIT" },
        { "resource": "ACCOUNT_SETTINGS_PRIVACY", "action": "VIEW" },
        { "resource": "PROFILE_PERSONAL_INFO", "action": "VIEW" },
        { "resource": "PROFILE_ADDRESS", "action": "VIEW" },
        { "resource": "PROFILE_ADDRESS", "action": "EDIT" },
        { "resource": "PROFILE_AVATAR", "action": "VIEW" },
        { "resource": "PROFILE_AVATAR", "action": "EDIT" },
        { "resource": "PROFILE_IDM", "action": "VIEW" },
        { "resource": "PROFILE_PHONE", "action": "EDIT" },
        { "resource": "PROFILE_PHONE", "action": "VIEW" },
        { "resource": "CHANGE_PASSWORD", "action": "VIEW" },
        { "resource": "IAM_ROLE", "action": "VIEW" },
        { "resource": "ROLES_PERMISSIONS", "action": "VIEW" },
        { "resource": "ROLES_PERMISSIONS", "action": "ADMIN_VIEW" }
    ]
}


```

### File: onecx-local-env/onecx-data/permission/onecx-welcome_onecx-welcome-bff.json

```json

{
    "name": "onecx-welcome-bff",
    "permissions": [
        {"resource": "image", "action": "delete"},
        {"resource": "image", "action": "read"},
        {"resource": "image", "action": "write"}
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-welcome_onecx-welcome-ui.json

```json

{
    "name": "onecx-welcome-ui",
    "permissions": [
        { "resource": "IMAGE", "action": "DELETE" },
        { "resource": "IMAGE", "action": "EDIT" },
        { "resource": "IMAGE", "action": "VIEW" }
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-workspace_onecx-workspace-bff.json

```json

{
    "name": "onecx-workspace-bff",
    "permissions": [
        {"resource": "assignment", "action": "delete"},
        {"resource": "assignment", "action": "read"},
        {"resource": "assignment", "action": "write"},
        {"resource": "menu", "action": "delete"},
        {"resource": "menu", "action": "read"},
        {"resource": "menu", "action": "write"},
        {"resource": "role", "action": "delete"},
        {"resource": "role", "action": "read"},
        {"resource": "role", "action": "write"},
        {"resource": "slot", "action": "delete"},
        {"resource": "slot", "action": "read"},
        {"resource": "slot", "action": "write"},
        {"resource": "workspace", "action": "delete"},
        {"resource": "workspace", "action": "read"},
        {"resource": "workspace", "action": "write"},
        {"resource": "product", "action": "delete"},
        {"resource": "product", "action": "read"},
        {"resource": "product", "action": "write"}
    ]
}

```

### File: onecx-local-env/onecx-data/permission/onecx-workspace_onecx-workspace-ui.json

```json

{
    "name": "onecx-workspace-ui",
    "permissions": [
        { "resource": "MENU", "action": "CREATE" },
        { "resource": "MENU", "action": "DELETE" },
        { "resource": "MENU", "action": "EDIT" },
        { "resource": "MENU", "action": "DRAG_DROP" },
        { "resource": "MENU", "action": "GRANT" },
        { "resource": "MENU", "action": "VIEW" },
        { "resource": "MENU", "action": "EXPORT" },
        { "resource": "MENU", "action": "IMPORT" },
        
        { "resource": "WORKSPACE", "action": "CREATE" },
        { "resource": "WORKSPACE", "action": "DELETE" },
        { "resource": "WORKSPACE", "action": "EDIT" },
        { "resource": "WORKSPACE", "action": "SEARCH" },
        { "resource": "WORKSPACE", "action": "VIEW" },
        { "resource": "WORKSPACE", "action": "EXPORT" },
        { "resource": "WORKSPACE", "action": "IMPORT" },
        { "resource": "WORKSPACE", "action": "GOTO_PERMISSION" },
        { "resource": "WORKSPACE", "action": "GOTO_APP_STORE" },

        { "resource": "WORKSPACE_CONTACT", "action": "VIEW" },
        { "resource": "WORKSPACE_INTERNAL", "action": "VIEW" },
        { "resource": "WORKSPACE_PRODUCTS", "action": "VIEW" },
        { "resource": "WORKSPACE_PRODUCTS", "action": "REGISTER" },
        { "resource": "WORKSPACE_ROLE", "action": "CREATE" },
        { "resource": "WORKSPACE_ROLE", "action": "DELETE" },
        { "resource": "WORKSPACE_ROLE", "action": "EDIT" },
        { "resource": "WORKSPACE_ROLE", "action": "VIEW" },
        { "resource": "WORKSPACE_SLOT", "action": "CREATE" },
        { "resource": "WORKSPACE_SLOT", "action": "DELETE" },
        { "resource": "WORKSPACE_SLOT", "action": "EDIT" },
        { "resource": "WORKSPACE_SLOT", "action": "VIEW" }
    ]
}


```

## Folder: onecx-local-env/onecx-data/permission-assignment (12 files)

### File: onecx-local-env/onecx-data/permission-assignment/onecx-announcement.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-announcement",
  "assignments": {
    "onecx-announcement": {
      "onecx-announcement-ui": {
        "onecx-admin": {
          "ANNOUNCEMENT": [ "CREATE", "DELETE", "EDIT", "SEARCH", "VIEW" ]
        },
        "onecx-user": {
          "ANNOUNCEMENT": [ "SEARCH", "VIEW" ]
        }
      },
      "onecx-announcement-bff": {
        "onecx-admin": {
          "announcement": ["read", "write", "delete"]
        },
        "onecx-user": {
          "announcement": ["read"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-help.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-help",
  "assignments": {
    "onecx-help": {
      "onecx-help-ui": {
        "onecx-admin": {
          "HELP": [ "CREATE", "DELETE", "EDIT", "SEARCH", "VIEW", "EXPORT", "IMPORT" ]
        },
        "onecx-user": {
          "HELP": [ "SEARCH", "VIEW" ]
        }
      },
      "onecx-help-bff": {
        "onecx-admin": {
          "help": ["read", "write", "delete"]
        },
        "onecx-user": {
          "help": ["read"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-iam.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-iam",
  "assignments": {
    "onecx-iam": {
      "onecx-iam-bff": {
        "onecx-admin": {
          "password": ["write"],
          "provider": ["admin-read", "read"],
          "role": ["admin-read", "admin-write", "read"],
          "user": ["admin-read", "admin-write", "read", "write"]
        },
        "onecx-user": {
          "password": ["write"],
          "provider": ["read"],
          "role": ["read"],
          "user": ["read"]
        }
      },
      "onecx-iam-ui": {
        "onecx-admin": {
          "PERMISSION": [ "VIEW" ],
          "ROLE": ["CREATE", "DELETE", "EDIT", "SEARCH"],
          "USER": ["CREATE", "DELETE", "EDIT", "SEARCH", "VIEW"]
        },
        "onecx-user": {
          "PERMISSION": [ "VIEW" ],
          "ROLE": ["SEARCH"],
          "USER": ["SEARCH", "VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-parameter.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-parameter",
  "assignments": {
    "onecx-parameter": {
      "onecx-parameter-bff": {
        "onecx-admin": {
          "parameter": ["read", "write", "delete"]
        },
        "onecx-user": {
          "parameter": ["read"]
        }
      },
      "onecx-parameter-ui": {
        "onecx-admin": {
          "PARAMETER": ["DELETE", "EDIT", "SEARCH", "VIEW"]
        },
        "onecx-user": {
          "PARAMETER": ["SEARCH", "VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-permission.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-permission",
  "assignments": {
    "onecx-permission": {
      "onecx-permission-bff": {
        "onecx-admin": {
          "permission": ["read", "write", "delete"],
          "role": ["read", "write", "delete"],
          "assignment": ["read", "write", "delete"],
          "application": ["read", "write", "delete"],
          "workspace": ["read", "write", "delete"]
        },
        "onecx-user": {
          "permission": ["read"],
          "role": ["read"],
          "assignment": ["read"],
          "application": ["read"],
          "workspace": ["read"]
        }
      },
      "onecx-permission-ui": {
        "onecx-admin": {
          "APP": ["EDIT", "SEARCH", "VIEW"],
          "IAM_ROLE": ["VIEW"],
          "PERMISSION": ["GRANT", "CREATE", "DELETE", "EDIT"],
          "ROLE": ["CREATE", "DELETE", "EDIT"]
        },
        "onecx-user": {
          "APP": ["VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-product-store.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-product-store",
  "assignments": {
    "onecx-product-store": {
      "onecx-product-store-bff": {
        "onecx-admin": {
          "image": ["read", "write"],
          "microfrontend": ["read", "write", "delete"],
          "microservice": ["read", "write", "delete"],
          "product": ["read", "write", "delete"],
          "slot": ["read", "write", "delete"]
        },
        "onecx-user": {
          "image": ["read"],
          "microfrontend": ["read"],
          "microservice": ["read"],
          "product": ["read"],
          "slot": ["read"]
        }
      },
      "onecx-product-store-ui": {
        "onecx-admin": {
          "APP": ["CREATE", "DELETE", "EDIT", "SEARCH", "VIEW"],
          "ENDPOINT": [ "SEARCH" ],
          "PRODUCT": ["CREATE", "DELETE", "EDIT", "SEARCH", "VIEW"],
          "SLOT": ["DELETE", "CREATE", "EDIT", "SEARCH", "VIEW"]
        },
        "onecx-user": {
          "APP": ["SEARCH", "VIEW"],
          "ENDPOINT": [ "SEARCH" ],
          "PRODUCT": ["SEARCH", "VIEW"],
          "SLOT": ["SEARCH", "VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-shell.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-shell",
  "assignments": {
    "onecx-shell": {
      "onecx-shell-bff": {
        "onecx-admin": {
          "workspaceConfig": ["read"],
          "userProfile": ["read"],
          "permission": ["read"]
        },
        "onecx-user": {
          "workspaceConfig": ["read"],
          "userProfile": ["read"],
          "permission": ["read"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-tenant.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-tenant",
  "assignments": {
    "onecx-tenant": {
      "onecx-tenant-bff": {
        "onecx-admin": {
          "tenant": ["read", "write", "delete"]
        },
        "onecx-user": {
          "tenant": ["read"]
        }
      },
      "onecx-tenant-ui": {
        "onecx-admin": {
          "TENANT": ["CREATE", "DELETE", "EDIT", "SEARCH", "VIEW"],
          "SEARCHCONFIG": ["VIEW"]
        },
        "onecx-user": {
          "TENANT": ["VIEW"],
          "SEARCHCONFIG": ["VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-theme.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-theme",
  "assignments": {
    "onecx-theme": {
      "onecx-theme-bff": {
        "onecx-admin": {
          "themes": ["read", "write", "delete"]
        },
        "onecx-user": {
          "themes": ["read"]
        }
      },
      "onecx-theme-ui": {
        "onecx-admin": {
          "THEME": [
            "CREATE",
            "DELETE",
            "EDIT",
            "SEARCH",
            "VIEW",
            "EXPORT",
            "IMPORT"
          ]
        },
        "onecx-user": {
          "THEME": ["SEARCH", "VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-user-profile.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-user-profile",
  "assignments": {
    "onecx-user-profile": {
      "onecx-user-profile-bff": {
        "onecx-admin": {
          "userProfile": [
            "read",
            "write",
            "delete",
            "adminRead",
            "adminWrite",
            "adminDelete"
          ]
        },
        "onecx-user": {
          "userProfile": ["read"]
        }
      },
      "onecx-user-profile-ui": {
        "onecx-admin": {
          "ACCOUNT_SETTINGS": ["VIEW"],
          "ACCOUNT_SETTINGS_LAYOUT_MENU": ["EDIT"],
          "ACCOUNT_SETTINGS_COLOR_SCHEME": ["EDIT"],
          "ACCOUNT_SETTINGS_BREADCRUMBS": ["EDIT"],
          "ACCOUNT_SETTINGS_LANGUAGE_TIMEZONE": ["VIEW"],
          "ACCOUNT_SETTINGS_LANGUAGE": ["EDIT"],
          "ACCOUNT_SETTINGS_TIMEZONE": ["EDIT"],
          "ACCOUNT_SETTINGS_LAYOUT_THEME": ["VIEW"],
          "ACCOUNT_SETTINGS_PREFERENCES": ["VIEW"],
          "ACCOUNT_SETTINGS_PRIVACY": ["EDIT", "VIEW"],
          "CHANGE_PASSWORD": [ "VIEW" ],
          "IAM_ROLE": [ "VIEW" ],
          "USERPROFILE": [
            "CREATE",
            "DELETE",
            "EDIT",
            "SEARCH",
            "VIEW",
            "EXPORT",
            "IMPORT",
            "ADMIN_VIEW",
            "ADMIN_EDIT",
            "ADMIN_DELETE"
          ],
          "PROFILE_PERSONAL_INFO": ["VIEW"],
          "PROFILE_ADDRESS": ["EDIT", "VIEW"],
          "PROFILE_AVATAR": ["EDIT", "VIEW"],
          "PROFILE_IDM": ["VIEW"],
          "PROFILE_PHONE": ["EDIT", "VIEW"],
          "ROLES_PERMISSIONS": ["ADMIN_VIEW", "VIEW"]
        },
        "onecx-user": {
          "ACCOUNT_SETTINGS": ["VIEW"],
          "ACCOUNT_SETTINGS_LAYOUT_MENU": ["EDIT"],
          "ACCOUNT_SETTINGS_COLOR_SCHEME": ["EDIT"],
          "ACCOUNT_SETTINGS_BREADCRUMBS": ["EDIT"],
          "ACCOUNT_SETTINGS_LANGUAGE_TIMEZONE": ["VIEW"],
          "ACCOUNT_SETTINGS_LANGUAGE": ["EDIT"],
          "ACCOUNT_SETTINGS_TIMEZONE": ["EDIT"],
          "ACCOUNT_SETTINGS_LAYOUT_THEME": ["VIEW"],
          "ACCOUNT_SETTINGS_PREFERENCES": ["VIEW"],
          "ACCOUNT_SETTINGS_PRIVACY": ["EDIT", "VIEW"],
          "CHANGE_PASSWORD": [ "VIEW" ],
          "IAM_ROLE": [ "VIEW" ],
          "USERPROFILE": [
            "CREATE",
            "DELETE",
            "EDIT",
            "SEARCH",
            "VIEW"
          ],
          "PROFILE_PERSONAL_INFO": ["VIEW"],
          "PROFILE_ADDRESS": ["EDIT", "VIEW"],
          "PROFILE_AVATAR": ["EDIT", "VIEW"],
          "PROFILE_PHONE": ["EDIT", "VIEW"],
          "ROLES_PERMISSIONS": ["VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-welcome.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-welcome",
  "assignments": {
    "onecx-welcome": {
      "onecx-welcome-bff": {
        "onecx-admin": {
          "image": ["read", "write", "delete"]
        },
        "onecx-user": {
          "image": ["read"]
        }
      },
      "onecx-welcome-ui": {
        "onecx-admin": {
          "IMAGE": ["DELETE", "EDIT", "VIEW"]
        },
        "onecx-user": {
          "IMAGE": ["VIEW"]
        }
      }
    }
  }
}


```

### File: onecx-local-env/onecx-data/permission-assignment/onecx-workspace.json

```json

{
  "id": "onecx-local-env_import-permission-assignments_onecx-workspace",
  "assignments": {
    "onecx-workspace": {
      "onecx-workspace-bff": {
        "onecx-admin": {
          "assignment": ["read", "write", "delete"],
          "menu": ["read", "write", "delete"],
          "role": ["read", "write", "delete"],
          "slot": ["read", "write", "delete"],
          "workspace": ["read", "write", "delete"],
          "product": ["read", "write", "delete"]
        },
        "onecx-user": {
          "assignment": ["read"],
          "menu": ["read"],
          "role": ["read"],
          "slot": ["read"],
          "workspace": ["read"],
          "product": ["read"]
        }
      },
      "onecx-workspace-ui": {
        "onecx-admin": {
          "MENU": [
            "CREATE",
            "DELETE",
            "EDIT",
            "DRAG_DROP",
            "VIEW",
            "EXPORT",
            "IMPORT",
            "GRANT"
          ],
          "WORKSPACE": [
            "CREATE",
            "DELETE",
            "GOTO_PERMISSION",
            "GOTO_APP_STORE",
            "EDIT",
            "SEARCH",
            "VIEW",
            "EXPORT",
            "IMPORT"
          ],
          "WORKSPACE_CONTACT": ["VIEW"],
          "WORKSPACE_INTERNAL": ["VIEW"],
          "WORKSPACE_PRODUCTS": ["VIEW", "REGISTER"],
          "WORKSPACE_ROLE": ["CREATE", "DELETE", "EDIT", "VIEW"],
          "WORKSPACE_SLOT": ["CREATE", "DELETE", "EDIT", "VIEW"]
        },
        "onecx-user": {
          "MENU": ["VIEW"],
          "WORKSPACE": ["GOTO_PERMISSION", "GOTO_APP_STORE", "SEARCH", "VIEW"],
          "WORKSPACE_CONTACT": ["VIEW"],
          "WORKSPACE_INTERNAL": ["VIEW"],
          "WORKSPACE_PRODUCTS": ["VIEW"],
          "WORKSPACE_ROLE": ["VIEW"],
          "WORKSPACE_SLOT": ["VIEW"]
        }
      }
    }
  }
}


```

## Folder: onecx-local-env/onecx-data/product-store/microfrontends (40 files)

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-announcement_onecx-announcement-ui_announcement-banner.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Announcement Banner",
  "description": "Display active announcements as banner (carousel)",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/announcement/",
  "remoteEntry": "/mfe/announcement/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXAnnouncementBannerComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-announcement",
  "tagName": "ocx-announcement-banner-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-announcement_onecx-announcement-ui_list-active.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Announcement List Active",
  "description": "List active announcements",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/announcement/",
  "remoteEntry": "/mfe/announcement/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXAnnouncementListActiveComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-announcement",
  "tagName": "ocx-announcement-list-active-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-announcement_onecx-announcement-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Announcement UI",
  "description": "OneCX Announcement UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/announcement/",
  "remoteEntry": "/mfe/announcement/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXAnnouncementModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-announcement",
  "tagName": "ocx-announcement-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-bookmark_onecx-bookmark-ui_list-bookmarks.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Bookmark Lists",
  "description": "Show active user and workspace bookmarks",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/bookmark/",
  "remoteEntry": "/mfe/bookmark/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXBookmarkListComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-bookmark",
  "tagName": "ocx-show-bookmark-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-bookmark_onecx-bookmark-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Bookmark UI",
  "description": "OneCX Bookmark UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/bookmark/",
  "remoteEntry": "/mfe/bookmark/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXBookmarkModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-bookmark",
  "tagName": "ocx-bookmark-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-bookmark_onecx-bookmark-ui_manage-bookmark.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Bookmark Creation & Deletion",
  "description": "Create and Delete User Bookmarks",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/bookmark/",
  "remoteEntry": "/mfe/bookmark/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXManageBookmarkComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-bookmark",
  "tagName": "ocx-bookmark-manage-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-data-orchestrator_onecx-data-orchestrator-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Data Orchestrator UI",
  "description": "OneCX Data Orchestrator UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/data-orchestrator/",
  "remoteEntry": "/mfe/data-orchestrator/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXDataOrchestratorModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-data-orchestrator",
  "tagName": "ocx-data-orchestrator-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-help_onecx-help-ui_help-item-editor.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Help Item Editing",
  "description": "Edit help item",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/help/",
  "remoteEntry": "/mfe/help/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXHelpItemEditorComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-help",
  "tagName": "ocx-help-item-editor-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-help_onecx-help-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Help UI",
  "description": "OneCX Help UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/help/",
  "remoteEntry": "/mfe/help/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXHelpModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-help",
  "tagName": "ocx-help-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-help_onecx-help-ui_show-help.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Help Item Viewing",
  "description": "Show help item",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/help/",
  "remoteEntry": "/mfe/help/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXShowHelpComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-help",
  "tagName": "ocx-show-help-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-iam_onecx-iam-ui_change-pwd.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX IAM Change Password",
  "description": "Change USer Password in IDM",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/iam/",
  "remoteEntry": "/mfe/iam/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXChangePasswordComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-iam",
  "tagName": "ocx-change-password-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-iam_onecx-iam-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX IAM UI",
  "description": "OneCX IAM UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/iam/",
  "remoteEntry": "/mfe/iam/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXIamModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-iam",
  "tagName": "ocx-iam-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "roles",
      "path": "/roles"
    },
    {
      "name": "users",
      "path": "/users"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-iam_onecx-iam-ui_user-roles.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX IAM User Roles",
  "description": "Provide IAM user roles",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/iam/",
  "remoteEntry": "/mfe/iam/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXIamUserRolesComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-iam",
  "tagName": "ocx-iam-user-roles-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-parameter_onecx-parameter-ui_main.json

```json

{
  "appVersion": "dev",
  "appName": "OneCX Parameter UI",
  "description": "OneCX Parameter UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/parameter/",
  "remoteEntry": "/mfe/parameter/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXParameterModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-parameter",
  "tagName": "ocx-parameter-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-permission_onecx-permission-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Permission UI",
  "description": "OneCX Permission UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/permission/",
  "remoteEntry": "/mfe/permission/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXPermissionModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-permission",
  "tagName": "ocx-permission-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "product",
      "path": "/product/{product-name}"
    },
    {
      "name": "workspace",
      "path": "/workspace/{workspace-name}"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-permission_onecx-permission-ui_user-roles-permissions.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Permission Roles & Permissions",
  "description": "Show current user's roles and permissions",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/permission/",
  "remoteEntry": "/mfe/permission/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXUserRolesPermissionsComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-permission",
  "tagName": "ocx-user-roles-permissions-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-product-store_onecx-product-store-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Product Store UI",
  "description": "OneCX Product Store UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/product-store/",
  "remoteEntry": "/mfe/product-store/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXProductStoreModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-product-store",
  "tagName": "ocx-product-store-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "product-detail",
      "path": "/{product-name}"
    },
    {
      "name": "product-detail#apps",
      "path": "/{product-name}#apps"
    },
    {
      "name": "apps",
      "path": "/apps"
    },
    {
      "name": "slots",
      "path": "/slots"
    },
    {
      "name": "endpoints",
      "path": "/endpoints"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-product-store_onecx-product-store-ui_product-data.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Product Data",
  "description": "Provide Product Data",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/product-store/",
  "remoteEntry": "/mfe/product-store/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXProductDataComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-product-store",
  "tagName": "ocx-product-data-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-search-config_onecx-search-config-ui_group-selection.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Search Config column group selection",
  "description": "Column group selection",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/search-config/",
  "remoteEntry": "/mfe/search-config/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXColumnGroupSelectionComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-search-config",
  "tagName": "ocx-column-group-selection-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-search-config_onecx-search-config-ui_search-config.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Search Config",
  "description": "Search Configurations",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/search-config/",
  "remoteEntry": "/mfe/search-config/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXSearchConfigComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-search-config",
  "tagName": "ocx-search-config-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-shell_onecx-shell-ui_toast.json

```json

{
  "appVersion": "xxx",
  "appName": "onecx-shell-ui",
  "description": "onecx-shell-ui",
  "remoteBaseUrl": "/onecx-shell/",
  "remoteEntry": "/onecx-shell/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXShellToastComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-shell",
  "tagName": "ocx-shell-toast-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-tenant_onecx-tenant-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Tenant UI",
  "description": "OneCX Tenant UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/tenant/",
  "remoteEntry": "/mfe/tenant/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXTenantModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-tenant",
  "tagName": "ocx-tenant-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-theme_onecx-theme-ui_current-theme-logo.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Current Theme Logo",
  "description": "Display the logo of the current theme. Use imageStyleClass as slot input parameter to adjust the image style.",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/theme/",
  "remoteEntry": "/mfe/theme/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXCurrentThemeLogoComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-theme",
  "tagName": "ocx-current-theme-logo-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-theme_onecx-theme-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Theme UI",
  "description": "OneCX Theme UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/theme/",
  "remoteEntry": "/mfe/theme/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXThemeModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-theme",
  "tagName": "ocx-theme-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "theme-detail",
      "path": "/{theme-name}"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-theme_onecx-theme-ui_theme-data.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Theme Data",
  "description": "Provide theme data like themes, theme, logo for given theme name(s)",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/theme/",
  "remoteEntry": "/mfe/theme/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXThemeDataComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-theme",
  "tagName": "ocx-theme-data-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-user-profile_onecx-user-profile-ui_avatar-image.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX User Avatar",
  "description": "User avatar image component",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/user-profile/",
  "remoteEntry": "/mfe/user-profile/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXAvatarImageComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-user-profile",
  "tagName": "ocx-avatar-image-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-user-profile_onecx-user-profile-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX User Profile UI",
  "description": "OneCX User Profile UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/user-profile/",
  "remoteEntry": "/mfe/user-profile/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXUserProfileModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-user-profile",
  "tagName": "ocx-user-profile-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "search",
      "path": "/search"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-welcome_onecx-welcome-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Welcome UI",
  "description": "OneCX Welcome UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/welcome/",
  "remoteEntry": "/mfe/welcome/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXWelcomeModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-welcome",
  "tagName": "ocx-welcome-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_current-workspace-logo.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Logo",
  "description": "Display the logo of the current workspace. Use imageStyleClass as slot input parameter to adjust the image style.",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXCurrentWorkspaceLogoComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-current-workspace-logo-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_footer-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Footer Menu",
  "description": "Creates the footer menu of the workspace (if configured)",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXFooterMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-footer-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_horizontal-main-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Horizontal Menu",
  "description": "Creates the main menu in horizontal orientation, displayed only if screen dimension is greather then mobile breakpoint (767px)",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXHorizontalMainMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-horizontal-main-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_main.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace UI",
  "description": "OneCX Workspace UI",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "note": "Import via MF operator",
  "exposedModule": "./OneCXWorkspaceModule",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-workspace-component",
  "type": "MODULE",
  "deprecated": false,
  "undeployed": false,
  "endpoints": [
    {
      "name": "workspace-detail",
      "path": "/{workspace-name}"
    }
  ]
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_slim-user-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace User Menu Slim",
  "description": "Displaying the user menu in slim mode",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXSlimUserMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-slim-user-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_slim-vertical-main-menu.json

```json

{
  "appVerticalion": "xxx",
  "appName": "OneCX Workspace Vertical Menu Slim",
  "description": "Displaying the vertical menu in slim mode",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXSlimVerticalMainMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-slim-vertical-main-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_toggle-menu-button.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Toggle Menu",
  "description": "Toggle visibility of vertical menu",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXToggleMenuButtonComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-toggle-menu-button-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}


```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_user-avatar-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace User Avatar Menu",
  "description": "Displaying the user avatar menu",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXUserAvatarMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-user-avatar-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_user-siderbar-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace User Menu",
  "description": "Displaying the user menu in vertical orientation",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXUserSidebarMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-user-siderbar-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_version-info.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Version Info",
  "description": "Display version information of shell and current application",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXVersionInfoComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-version-info-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_vertical-main-menu.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Vertical Menu",
  "description": "Displaying the vertical menu",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "note": "Imported MFE",
  "exposedModule": "./OneCXVerticalMainMenuComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-vertical-main-menu-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/microfrontends/onecx-workspace_onecx-workspace-ui_workspace-data.json

```json

{
  "appVersion": "xxx",
  "appName": "OneCX Workspace Data",
  "description": "Provide workspace data like workspaces, workspace, logo",
  "contact": "onecx@1000kit.org",
  "remoteBaseUrl": "/mfe/workspace/",
  "remoteEntry": "/mfe/workspace/remoteEntry.js",
  "exposedModule": "./OneCXWorkspaceDataComponent",
  "technology": "WEBCOMPONENTMODULE",
  "remoteName": "onecx-workspace",
  "tagName": "ocx-workspace-data-component",
  "type": "COMPONENT",
  "deprecated": false,
  "undeployed": false
}

```

## Folder: onecx-local-env/onecx-data/product-store/microservices (42 files)

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-announcement_onecx-announcement-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-announcement-bff",
  "description": "OneCX Announcement Backend For Frontend",
  "type": "bff"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-announcement_onecx-announcement-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-announcement-svc",
  "description": "OneCX Announcement Backend Service",
  "type": "svc"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-announcement_onecx-announcement-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-announcement-ui",  
  "displayName": "OneCX Announcement UI",
  "description": "OneCX Announcement UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-bookmark_onecx-bookmark-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-bookmark-bff",
  "description": "OneCX Bookmark Backend For Frontend",
  "type": "bff"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-bookmark_onecx-bookmark-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-bookmark-svc",
  "description": "OneCX Bookmark Backend Service",
  "type": "svc"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-bookmark_onecx-bookmark-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-bookmark-ui",
  "description": "OneCX Bookmark UI",
  "type": "ui"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-data-orchestrator_onecx-data-orchestrator-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-data-orchestrator-bff",
  "description": "OneCX Data Orchestrator Backend For Frontend",
  "type": "bff"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-data-orchestrator_onecx-data-orchestrator-operator.json

```json

{
  "version": "xxx",
  "name": "onecx-data-orchestrator-operator",
  "description": "OneCX Data Orchestrator Operator",
  "type": "operator"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-data-orchestrator_onecx-data-orchestrator-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-data-orchestrator-ui",
  "description": "OneCX Data Orchestrator UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-help_onecx-help-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-help-bff",
  "description": "OneCX Help Backend For Frontend",
  "type": "bff"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-help_onecx-help-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-help-svc",
  "description": "OneCX Help Backend Service",
  "type": "svc"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-help_onecx-help-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-help-ui",
  "description": "OneCX Help UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-iam_onecx-iam-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-iam-bff",
  "description": "OneCX IAM Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-iam_onecx-iam-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-iam-svc",
  "description": "OneCX IAM Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-iam_onecx-iam-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-iam-ui",
  "description": "OneCX IAM UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-parameter_onecx-parameter-bff.json

```json

{
  "version": "dev",
  "name": "onecx-parameter-bff",
  "description": "OneCX Parameter Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-parameter_onecx-parameter-svc.json

```json

{
  "version": "dev",
  "name": "onecx-parameter-svc",
  "description": "OneCX Parameter Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-parameter_onecx-parameter-ui.json

```json

{
  "version": "dev",
  "name": "onecx-parameter-ui",
  "description": "OneCX Parameter UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-permission_onecx-permission-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-permission-svc",
  "description": "OneCX Permission Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-product-store_onecx-product-store-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-product-store-bff",
  "description": "OneCX Product Store Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-product-store_onecx-product-store-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-product-store-svc",
  "description": "OneCX Product Store Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-product-store_onecx-product-store-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-product-store-ui",
  "description": "OneCX Product Store UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-search-config_onecx-search-config-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-search-config-bff",
  "description": "OneCX Search Config Backend For Frontend",
  "type": "bff"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-search-config_onecx-search-config-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-search-config-svc",
  "description": "OneCX Search Config Backend Service",
  "type": "svc"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-search-config_onecx-search-config-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-search-config-ui",
  "description": "OneCX Search Config UI",
  "type": "ui"
}


```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-shell_onecx-shell-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-shell-bff",
  "description": "OneCX Shell Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-shell_onecx-shell-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-shell-ui",
  "description": "OneCX Shell UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-tenant_onecx-tenant-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-tenant-bff",
  "description": "OneCX Tenant Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-tenant_onecx-tenant-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-tenant-svc",
  "description": "OneCX Tenant Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-tenant_onecx-tenant-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-tenant-ui",
  "description": "OneCX Tenant UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-theme_onecx-theme-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-theme-bff",
  "description": "OneCX Theme Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-theme_onecx-theme-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-theme-svc",
  "description": "OneCX Theme Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-theme_onecx-theme-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-theme-ui",
  "description": "OneCX Theme UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-user-profile_onecx-user-profile-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-user-profile-bff",
  "description": "OneCX User Profile Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-user-profile_onecx-user-profile-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-user-profile-svc",
  "description": "OneCX User Profile Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-user-profile_onecx-user-profile-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-user-profile-ui",
  "description": "OneCX User Profile UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-welcome_onecx-welcome-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-welcome-bff",
  "description": "OneCX Welcome Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-welcome_onecx-welcome-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-welcome-svc",
  "description": "OneCX Welcome Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-welcome_onecx-welcome-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-welcome-ui",
  "description": "OneCX Welcome UI",
  "type": "ui"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-workspace_onecx-workspace-bff.json

```json

{
  "version": "xxx",
  "name": "onecx-workspace-bff",
  "description": "OneCX Workspace Backend For Frontend",
  "type": "bff"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-workspace_onecx-workspace-svc.json

```json

{
  "version": "xxx",
  "name": "onecx-workspace-svc",
  "description": "OneCX Workspace Backend Service",
  "type": "svc"
}

```

### File: onecx-local-env/onecx-data/product-store/microservices/onecx-workspace_onecx-workspace-ui.json

```json

{
  "version": "xxx",
  "name": "onecx-workspace-ui",
  "description": "OneCX Workspace UI",
  "type": "ui"
}

```

## Folder: onecx-local-env/onecx-data/product-store/products (15 files)

### File: onecx-local-env/onecx-data/product-store/products/onecx-announcement.json

```json

{
  "version": "xxx",
  "description": "Manage Announcements",
  "imageUrl": "",
  "iconName": "comment",
  "displayName": "OneCX Announcement",
  "basePath": "/announcement",
  "provider": "OneCX Team",
  "classifications": [ 
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-bookmark.json

```json

{
  "version": "xxx",
  "description": "Manage User and Workspace Bookmarks",
  "imageUrl": "",
  "iconName": "bookmark",
  "displayName": "OneCX Bookmark",
  "basePath": "/bookmark",
  "provider": "OneCX Team",
  "classifications": [ 
    "Tool"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-data-orchestrator.json

```json

{
  "version": "xxx",
  "description": "Manage Kubernetes Custom Data Resources",
  "imageUrl": "",
  "iconName": "desktop",
  "displayName": "OneCX Data Orchestrator",
  "basePath": "/data",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-help.json

```json

{
  "version": "xxx",
  "description": "Manage Help Items",
  "imageUrl": "",
  "iconName": "question-circle",
  "displayName": "OneCX Help",
  "basePath": "/help",
  "provider": "OneCX Team",
  "classifications": [ 
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-iam.json

```json

{
  "version": "xxx",
  "description": "OneCX IAM",
  "imageUrl": "",
  "iconName": "id-card",
  "displayName": "OneCX IAM",
  "basePath": "/iam",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-parameter.json

```json

{
  "version": "xxx",
  "description": "OneCX Parameter",
  "imageUrl": "",
  "iconName": "sliders-h",
  "displayName": "OneCX Parameter",
  "basePath": "/parameter",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-permission.json

```json

{
  "version": "xxx",
  "description": "OneCX Permission",
  "imageUrl": "",
  "iconName": "cog",
  "displayName": "OneCX Permission",
  "basePath": "/permission",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-product-store.json

```json

{
  "version": "xxx",
  "description": "Store Products and Applications",
  "imageUrl": "",
  "iconName": "shop",
  "displayName": "OneCX Product Store",
  "basePath": "/products",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-search-config.json

```json

{
  "version": "xxx",
  "description": "Manage Search Configurations",
  "imageUrl": "",
  "iconName": "search-plus",
  "displayName": "OneCX Search Config",
  "basePath": "/search-config",
  "provider": "OneCX Team",
  "classifications": [
    "Tool"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-shell.json

```json

{
  "version": "xxx",
  "description": "The base for the cooperation of OneCX Products",
  "imageUrl": "",
  "iconName": "home",
  "displayName": "OneCX Shell",
  "basePath": "/newShell",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-tenant.json

```json

{
  "version": "xxx",
  "description": "Display Tenants",
  "imageUrl": "",
  "iconName": "building-columns",
  "displayName": "OneCX Tenant",
  "basePath": "/tenant",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": false,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-theme.json

```json

{
  "version": "xxx",
  "description": "Manage Workspace Themes",
  "imageUrl": "",
  "iconName": "palette",
  "displayName": "OneCX Theme",
  "basePath": "/theme",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-user-profile.json

```json

{
  "version": "xxx",
  "description": "Manage User Settings",
  "imageUrl": "",
  "iconName": "user",
  "displayName": "OneCX User Profile",
  "basePath": "/user",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-welcome.json

```json

{
  "version": "xxx",
  "description": "Manage the content of the Workspace Start page",
  "imageUrl": "",
  "iconName": "home",
  "displayName": "OneCX Welcome",
  "basePath": "/welcome",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

### File: onecx-local-env/onecx-data/product-store/products/onecx-workspace.json

```json

{
  "version": "xxx",
  "description": "OneCX Workspace",
  "imageUrl": "",
  "iconName": "desktop",
  "displayName": "OneCX Workspace",
  "basePath": "/workspace",
  "provider": "OneCX Team",
  "classifications": [
    "Administration"
  ],
  "multitenancy": true,
  "undeployed": false
}

```

## Folder: onecx-local-env/onecx-data/product-store/slots (11 files)

### File: onecx-local-env/onecx-data/product-store/slots/onecx-announcement.json

```json

[
  {
    "appId": "onecx-announcement-ui",
    "slots": [
      {
        "name": "onecx-product-data",
        "description": "Getting base data of all products provided by product store",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-workspace-data",
        "description": "Get Workspaces using a given Product",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-help.json

```json

[
  {
    "appId": "onecx-help-ui",
    "slots": [
      {
        "name": "onecx-product-data",
        "description": "Getting base data of all products provided by product store",
        "deprecated": false,
        "undeployed": false
      }
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-iam.json

```json

[
  {
    "appId": "onecx-iam-ui",
    "slots": [
      {
        "name": "onecx-iam-user-permissions",
        "description": "Display user permissions",
        "deprecated": false,
        "undeployed": false
      }
    ]
  }
]


```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-parameter.json

```json

[
  {
    "appId": "onecx-parameter-ui",
    "slots": [
      {
        "name": "onecx-product-data",
        "description": "Getting base data of all products provided by product store",
        "deprecated": false,
        "undeployed": false
      }
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-permission.json

```json

[
  {
    "appId": "onecx-permission-ui",
    "slots": [
      {
        "name": "onecx-permission-iam-user-roles",
        "description": "Receive IAM user roles",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]


```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-product-store.json

```json

[
  {
    "appId": "onecx-product-store-ui",
    "slots": [
      {
        "name": "onecx-workspace-data",
        "description": "Get Workspaces using a given Product",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-shell.json

```json

[
  {
    "appId": "onecx-shell-ui",
    "slots": [
      {
        "name": "onecx-column-group-selection",
        "description": "Slot used by library components that can be used in all applications. Its defined in shell and should not be redefined in products that use the slots. Use this slot to manage table column group selection via assigned remote components.",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-search-config",
        "description": "Slot used by library components that can be used in all applications. Its defined in shell and should not be redefined in products that use the slots. Use this slot to manage search configurations on the search pages via assigned remote components.",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-footer",
        "description": "Footer area on the page e.g. logo, footer menu, version info etc.",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-header-left",
        "description": "Shell header left region",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-header-right",
        "description": "Shell header right region e.g. horizontal menu, top bar",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-horizontal-menu",
        "description": "Shell horizontal menu within shell header right",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-sub-header",
        "description": "Shell sub header region e.g. banner bar",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-vertical-menu",
        "description": "Shell vertical menu",
        "deprecated": true,
        "undeployed": false
      },
      {
        "name": "onecx-shell-header.start",
        "description": "Start region of the shell header (e.g. logo)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-header.center",
        "description": "Center region of the shell header (e.g. horizontal menu, search bar)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-header.end",
        "description": "End region of the shell header (e.g. user profile)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-sub-header.start",
        "description": "Start region of the shell sub header (e.g. bookmarks)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-sub-header.center",
        "description": "Center region of the shell sub header (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-sub-header.end",
        "description": "End region of the shell sub header (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-start.start",
        "description": "Start region of the shell body start (e.g. quick links)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-start.center",
        "description": "Center region of the shell body start (e.g. sidebar navigation)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-start.end",
        "description": "End region of the shell body start (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-header.start",
        "description": "Start region of the shell body header (e.g. breadcrumbs)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-header.center",
        "description": "Center region of the shell body header (e.g. title)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-header.end",
        "description": "End region of the shell body header (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-footer.start",
        "description": "Start region of the shell body footer (e.g. info)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-footer.center",
        "description": "Center region of the shell body footer (e.g. comment section)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-footer.end",
        "description": "End region of the shell body footer (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-end.start",
        "description": "Start region of the shell body end (e.g. quick links)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-end.center",
        "description": "Center region of the shell body end (e.g. sidebar navigation)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-body-end.end",
        "description": "End region of the shell body end (e.g. action buttons)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-footer.start",
        "description": "Start region of the shell footer (e.g. logo)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-footer.center",
        "description": "Center region of the shell footer (e.g. footer menu)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-footer.end",
        "description": "End region of the shell footer (e.g. version info)",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-shell-extensions",
        "description": "For providing additional functions, that will not be displayed inside the slot (e.g. toast messages, cookie banner)",
        "deprecated": false,
        "undeployed": false
      }
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-theme.json

```json

[
  {
    "appId": "onecx-theme-ui",
    "slots": [
      {
        "name": "onecx-workspace-data",
        "description": "Getting data from Workspaces for the current Theme",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]

```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-user-profile.json

```json

[
  {
    "appId": "onecx-user-profile-ui",
    "slots": [
      {
        "name": "onecx-user-profile-change-password",
        "description": "User Profile change password",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-user-profile-permissions",
        "description": "User Profile show user roles and permissions",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-user-profile-admin-view-permissions",
        "description": "User Profile show other user roles and permissions for admin",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]



```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-welcome.json

```json

[
  {
    "appId": "onecx-welcome-ui",
    "slots": [
      {
        "name": "onecx-welcome-list-bookmarks",
        "description": "List bookmarks for user and workspace",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-welcome-list-active",
        "description": "List active announcements for workspace",
        "deprecated": false,
        "undeployed": false
      }    
    ]
  }
]


```

### File: onecx-local-env/onecx-data/product-store/slots/onecx-workspace.json

```json

[
  {
    "appId": "onecx-workspace-ui",
    "slots": [
      {
        "name": "onecx-avatar-image",
        "description": "Area to displaying the users avatar provided by avatar image component",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-custom-user-info",
        "description": "Area on top of the avatar menu for displaying specific user info",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-iam-user-roles",
        "description": "Receive IAM user roles",
        "deprecated": false,
        "undeployed": false
      },
      {
        "name": "onecx-theme-data",
        "description": "Getting theme data (like theme logo) to be used within workspace",
        "deprecated": false,
        "undeployed": false
      }
    ]
  }
]


```

## Folder: onecx-local-env/onecx-data/tenant (1 files)

### File: onecx-local-env/onecx-data/tenant/tenant-import.json

```json

{
  "id": "onecx-local-env_import-onecx-tenants",
  "tenants": {
    "tenant1": {
      "orgId": "t1",
      "description": "OneCX Tenant 1"
    },
    "tenant2": {
      "orgId": "t2",
      "description": "OneCX Tenant 2"
    }
  }
}

```

## Folder: onecx-local-env/onecx-data/theme (4 files)

### File: onecx-local-env/onecx-data/theme/default_OneCX.json

```json

{
  "id": "onecx-local-env_import-themes_default-OneCX",
  "created": "2025-10-20T11:11:17.047397Z",
  "themes": {
    "default": {
      "displayName": "OneCX",
      "cssFile": null,
      "description": "OneCX Theme",
      "assetsUrl": null,
      "logoUrl": null,
      "smallLogoUrl": null,
      "faviconUrl": null,
      "previewImageUrl": null,
      "assetsUpdateDate": null,
      "properties": {
        "font": {
          "font-family": null,
          "font-size": null
        },
        "topbar": {
          "topbar-bg-color": "#0D3650",
          "topbar-item-text-color": " #ffffff",
          "topbar-text-color": "#ffffff",
          "topbar-left-bg-color": "#0D3650",
          "topbar-item-text-hover-bg-color": "rgba(255, 255, 255, 0.12)",
          "topbar-menu-button-bg-color": " rgb(255 0 68)",
          "topbar-menu-button-text-color": "#ffffff",
          "logo-color": " #ffffff"
        },
        "general": {
          "primary-color": "#274B5F",
          "secondary-color": "#1C4257",
          "text-color": " rgba(0, 0, 0, 0.87)",
          "text-secondary-color": "#262626",
          "body-bg-color": " #f7f7f7",
          "content-bg-color": " #ffffff",
          "content-alt-bg-color": " #ffffff",
          "overlay-content-bg-color": " #ffffff",
          "hover-bg-color": "#ad1457",
          "solid-surface-text-color": " #ffffff",
          "divider-color": " #e4e4e4",
          "button-hover-bg": "#ad1457",
          "danger-button-bg": "#D32F2F",
          "info-message-bg": "#b3e5fc",
          "success-message-bg": "#c8e6c9",
          "warning-message-bg": "#ffecb3",
          "error-message-bg": "#ffcdd2"
        },
        "sidebar": {
          "menu-text-color": "#274B5F",
          "menu-bg-color": " #fdfeff",
          "menu-item-text-color": " #515c66",
          "menu-item-hover-bg-color": " #e4e4e4",
          "menu-active-item-text-color": " #515c66",
          "menu-active-item-bg-color": " rgba(0, 0, 0, 0.04)",
          "inline-menu-border-color": " #e4e4e4"
        }
      },
      "images": {
        "logo-small": {
          "imageData": "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",
          "mimeType": "image/png"
        },
        "favicon": {
          "imageData": "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",
          "mimeType": "image/x-icon"
        },
        "logo": {
          "imageData": "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",
          "mimeType": "image/png"
        }
      },
      "mandatory": true
    }
  }
}

```

### File: onecx-local-env/onecx-data/theme/default_theme1.json

```json

{
  "id": "onecx-local-env_import-themes_default-theme1",
  "created": "2025-12-03T06:05:58.177126338Z",
  "themes": {
    "theme1": {
      "displayName": "Theme 1",
      "cssFile": null,
      "description": "Theme 1",
      "assetsUrl": null,
      "logoUrl": null,
      "smallLogoUrl": null,
      "faviconUrl": null,
      "previewImageUrl": null,
      "assetsUpdateDate": null,
      "properties": {
        "font": {
          "font-family": "",
          "font-size": ""
        },
        "topbar": {
          "topbar-bg-color": "#10384F",
          "topbar-item-text-color": "#FFFFFF",
          "topbar-text-color": "#FFFFFF",
          "topbar-left-bg-color": "#10384F",
          "topbar-item-text-hover-bg-color": "",
          "topbar-menu-button-bg-color": "",
          "topbar-menu-button-text-color": "",
          "logo-color": "#FFFFFF"
        },
        "general": {
          "primary-color": "#007CBF",
          "secondary-color": "#5EA611",
          "text-color": "#10384F",
          "text-secondary-color": "#10384F",
          "body-bg-color": "#FFFFFF",
          "content-bg-color": "#FFFFFF",
          "content-alt-bg-color": "#624963",
          "overlay-content-bg-color": "#FFFFFF",
          "hover-bg-color": "#E6F2F5",
          "solid-surface-text-color": "#10384F",
          "divider-color": "#D9D9D9",
          "button-hover-bg": "#00607E",
          "button-active-bg": "#007CBF",
          "danger-button-bg": "#D30F4B",
          "info-message-bg": "#00BCFF",
          "success-message-bg": "#89D329",
          "warning-message-bg": "#f5a623",
          "error-message-bg": "#D30F4B "
        },
        "sidebar": {
          "menu-text-color": "#10384F",
          "menu-bg-color": "#FFFFFF",
          "menu-item-text-color": "#10384F",
          "menu-item-bg-color": "#FFFFFF",
          "menu-item-hover-bg-color": "#E6F2F5",
          "menu-active-item-text-color": "#10384F",
          "menu-active-item-bg-color": "#cce5ee",
          "menu-inline-border-color": ""
        }
      },
      "overrides": null,
      "images": {
        "logo": {
          "imageData": "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m4zbd90dAH7ibTLmPMlm/8k4vbve8EOZDrtuM01JKblOMo3ju+sTAD/RSpIpyXpI1uOQMWMyDF7e+TQQYH3a1fAqGcZ1MtjfALxrl0mSkj9a55dTsvLCzifVMCSlJKXkF9pHF4NbBAA6MCYZxoiuPkUEGp9247DNMK6zG/7d7G7+auqNw5B61wAA78KTpHyUjz+bXK+Tn5tckz6hrjfZXW+SMuSfPSt5lmQbcwwA3oUpyZCLacpvDyX/5lDyH4xDdsOYIsb6dBBgfeqNSYZkGL+ey/e/nd0uKdPRO/8A8ONTZ5eZpuQXvps8GZP1H3/XneINPb1I1vWdum+M8Z9fAfBurc6S7XUyjvn/2kWpTTz4NBBg/aRYXzzN5rvJtz9KvvLzJRkms0wA3pn1efJHPkz+lX/tXfeEH8L7P5Vsx2R3k1xd1cdmAPBOTMn2KhfjlOshedZe5eBTRID1k+LsIvkP/6Xkr/wPycsXU168rJ8BwI/TlPYm8HvJv/Ovvuve8EP6X75Wv37pv0k+W5IyJNNYvwLAj9N4nZyfZxqukzEZh+z/HolPCQHWT4p1C6vWZ8nwJPmrf/bd9gcA+NT4gz+X/MG77gQAP/G+9tfrnxAuQysh1qeH/fiTaO3NKwAAAD5dyvm77gE/SgIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwPqJM73rDgAAAAC8lvXh2ynJuPjVkGSckmEMn1Qlxzu1GsuPvycAAADw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",
          "mimeType": "image/png"
        }
      },
      "mandatory": false
    }
  }
}

```

### File: onecx-local-env/onecx-data/theme/default_theme2.json

```json

{
  "id": "onecx-local-env_import-themes_default-theme2",
  "created": "2025-12-02T06:09:10.961983301Z",
  "themes": {
    "theme2": {
      "displayName": "Theme 2",
      "cssFile": null,
      "description": "Theme 2",
      "assetsUrl": null,
      "logoUrl": null,
      "smallLogoUrl": null,
      "faviconUrl": null,
      "previewImageUrl": null,
      "assetsUpdateDate": null,
      "properties": {
        "font": {
          "font-family": "",
          "font-size": ""
        },
        "topbar": {
          "topbar-bg-color": "#10384F",
          "topbar-item-text-color": "#FFFFFF",
          "topbar-text-color": "#FFFFFF",
          "topbar-left-bg-color": "#10384F",
          "topbar-item-text-hover-bg-color": "",
          "topbar-menu-button-bg-color": "",
          "topbar-menu-button-text-color": "",
          "logo-color": "#FFFFFF"
        },
        "general": {
          "primary-color": "#007CBF",
          "secondary-color": "#5EA611",
          "text-color": "#10384F",
          "text-secondary-color": "#10384F",
          "body-bg-color": "#FFFFFF",
          "content-bg-color": "#FFFFFF",
          "content-alt-bg-color": "#624963",
          "overlay-content-bg-color": "#FFFFFF",
          "hover-bg-color": "#E6F2F5",
          "solid-surface-text-color": "#10384F",
          "divider-color": "#D9D9D9",
          "button-hover-bg": "#00607E",
          "button-active-bg": "#007CBF",
          "danger-button-bg": "#D30F4B",
          "info-message-bg": "#00BCFF",
          "success-message-bg": "#89D329",
          "warning-message-bg": "#FF3162",
          "error-message-bg": "#D30F4B "
        },
        "sidebar": {
          "menu-text-color": "#10384F",
          "menu-bg-color": "#FFFFFF",
          "menu-item-text-color": "#10384F",
          "menu-item-bg-color": "#FFFFFF",
          "menu-item-hover-bg-color": "#E6F2F5",
          "menu-active-item-text-color": "#10384F",
          "menu-active-item-bg-color": "#cce5ee",
          "menu-inline-border-color": ""
        }
      },
      "overrides": null,
      "mandatory": false
    }
  }
}

```

### File: onecx-local-env/onecx-data/theme/t1_theme1.json

```json

{
  "id": "onecx-local-env_import-themes_t1-theme1",
  "created": "2025-12-03T06:05:58.177126338Z",
  "themes": {
    "theme1": {
      "displayName": "Theme 1",
      "cssFile": null,
      "description": "Theme 1",
      "assetsUrl": null,
      "logoUrl": null,
      "smallLogoUrl": null,
      "faviconUrl": null,
      "previewImageUrl": null,
      "assetsUpdateDate": null,
      "properties": {
        "font": {
          "font-family": "",
          "font-size": ""
        },
        "topbar": {
          "topbar-bg-color": "#10384F",
          "topbar-item-text-color": "#FFFFFF",
          "topbar-text-color": "#FFFFFF",
          "topbar-left-bg-color": "#10384F",
          "topbar-item-text-hover-bg-color": "",
          "topbar-menu-button-bg-color": "",
          "topbar-menu-button-text-color": "",
          "logo-color": "#FFFFFF"
        },
        "general": {
          "primary-color": "#007CBF",
          "secondary-color": "#5EA611",
          "text-color": "#10384F",
          "text-secondary-color": "#10384F",
          "body-bg-color": "#FFFFFF",
          "content-bg-color": "#FFFFFF",
          "content-alt-bg-color": "#624963",
          "overlay-content-bg-color": "#FFFFFF",
          "hover-bg-color": "#E6F2F5",
          "solid-surface-text-color": "#10384F",
          "divider-color": "#D9D9D9",
          "button-hover-bg": "#00607E",
          "button-active-bg": "#007CBF",
          "danger-button-bg": "#D30F4B",
          "info-message-bg": "#00BCFF",
          "success-message-bg": "#89D329",
          "warning-message-bg": "#f5a623",
          "error-message-bg": "#D30F4B "
        },
        "sidebar": {
          "menu-text-color": "#10384F",
          "menu-bg-color": "#FFFFFF",
          "menu-item-text-color": "#10384F",
          "menu-item-bg-color": "#FFFFFF",
          "menu-item-hover-bg-color": "#E6F2F5",
          "menu-active-item-text-color": "#10384F",
          "menu-active-item-bg-color": "#cce5ee",
          "menu-inline-border-color": ""
        }
      },
      "overrides": null,
      "images": {
        "logo": {
          "imageData": "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m4zbd90dAH7ibTLmPMlm/8k4vbve8EOZDrtuM01JKblOMo3ju+sTAD/RSpIpyXpI1uOQMWMyDF7e+TQQYH3a1fAqGcZ1MtjfALxrl0mSkj9a55dTsvLCzifVMCSlJKXkF9pHF4NbBAA6MCYZxoiuPkUEGp9247DNMK6zG/7d7G7+auqNw5B61wAA78KTpHyUjz+bXK+Tn5tckz6hrjfZXW+SMuSfPSt5lmQbcwwA3oUpyZCLacpvDyX/5lDyH4xDdsOYIsb6dBBgfeqNSYZkGL+ey/e/nd0uKdPRO/8A8ONTZ5eZpuQXvps8GZP1H3/XneINPb1I1vWdum+M8Z9fAfBurc6S7XUyjvn/2kWpTTz4NBBg/aRYXzzN5rvJtz9KvvLzJRkms0wA3pn1efJHPkz+lX/tXfeEH8L7P5Vsx2R3k1xd1cdmAPBOTMn2KhfjlOshedZe5eBTRID1k+LsIvkP/6Xkr/wPycsXU168rJ8BwI/TlPYm8HvJv/Ovvuve8EP6X75Wv37pv0k+W5IyJNNYvwLAj9N4nZyfZxqukzEZh+z/HolPCQHWT4p1C6vWZ8nwJPmrf/bd9gcA+NT4gz+X/MG77gQAP/G+9tfrnxAuQysh1qeH/fiTaO3NKwAAAD5dyvm77gE/SgIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwAIAAACgawIsAAAAALomwPqJM73rDgAAAAC8lvXh2ynJuPjVkGSckmEMn1Qlxzu1GsuPvycAAADwI3SaaszG8c6P+YQ5BFhjSXsha6i7dkwyDPGW1ifdqn09pFb2KAAAAJ8yZdrf7s53vSVDSpb3w3xiHQKsYUrNK6ezOcfKOA41w+ITa2wB1ovnF0mS5y+S9957lz0CAACAt24q+/8057x+sH+hg0+B5Z8QTu1lu28l5T9LMvz/7N3Pq6Zpehfw7309z6mqnu6emSRm4oii+ANciUJARBTBP8BVwAQUl7qMKG5UUETERZYuFA0EIYggQnYGhahgBnQhLszCCEowJNEkM9N2dZ3zPvfl4nlPdXc8nYlYmfee6s+n6TrnNGdxQdOcqm9f1/dO5RJJ5Xe6TvI9OfK1dCc//JNJvbj1TAAAAPBG9cgxz8jqP6bzTzLzy5FpvDU+EWC9bvf+hWT8+VsMw2+yMZK//FPJ3/wjt54EAAAA3rTj+vHfXf/mLfJxgPXOlx4/G8nYz7SjI6z8Djc7qZHcvXdJMvO9X731RAAAAPDG3X3xdYJR6ewiDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGA540e+76+ntmOkjmRWUrceiTelk4zZOWpk1uj3xjv5C//tr956LAAAAHjj+g//UHK8un4xRnpLxkwybjoXb8b+4S+8l/vnP9fz2TfiX+rbp2bnG+/u+eD9PV9+eH7rcQAAAOA3x0e/nBxfT3ok9+91Hl4kdcSmztthv3z5l5K9v3urd0YyjlsPxBvW2d7dRj17NX7pxRz5kd/+V/MXf+5v3XoqAAAAeLO2d5LuJNnyfPvePOsPk4xk3ngw3oT9ePEy2xj/MuPuDya5j2jybXIkeX6X/I+7S35XMh9q61vPBAAAAG/e2O+Su4eZ/Jna8qNJXibZxRxvh33rTld9d42RJM9uPRBv1J4k6XwlyUOSDP/hAgAA8DaqMWZfs42RZMx3hFdvj30kGcn/nkky5xFFWG+Tmcqe5Juv/0FbnQQAAOAtNDuVmXlelyWp+znnVik5x1tgv+TMIyvnVWhViSffFjOP94Kv/51eN+0AAADg7XLNqer6R+CZVFKVsqjzNqiRkUQvEgAAAABr2rdsSdIz83VKCQAAAACrqE7nMbyanpYEAAAAYDF15Ein3RACAAAAsKQaY6Ta6SAAAAAAa9q37dqBNWc8QAgAAADAauqYR3p2qipz6sACAAAAYC3V1Zk1z/52C1gAAAAALKa2uWXMcYZXFrAAAAAAWMw+amRk6MACAAAAYEl1HEcewysdWAAAAACspro7GaNvPQgAAAAAPGXfr5/ocAcAAABgRdVJZtI63AEAAABYUR3ZMzJiBwsAAACAFdVIpzPnGV7ZwQIAAABgLfuWI8mwfwUAAADAkqozMlM6sAAAAABY0n5ky0iiAwsAAACAFdXIkUq3DiwAAAAAVlRbziNC+1cAAAAArKiObcvsoQMLAAAAgCXtPUZqjGTOpOxgAQAAALCW2uaRnnOm6gyxAAAAAGAhNdKpGmcHlgUsAAAAABZTl0p6RgcWAAAAAEuqT6VWEiwAAAAAFrPvtSd5rMFyQwgAAADAWqq78xheTSXuAAAAACymjuPIGKNvPQgAAAAAPKWSkUR+BQAAAMCa9mRLknk2uOvAAgAAAGAtlRxJepzhlQ4sAAAAANZSZ2ilvR0AAACANe3JfusZAAAAAOAz7WeJe6IDCwAAAIAVXTuwZuvAAgAAAGBFlXQ+3sICAAAAgLU83gz2TacAAAAAgM+g9AoAAACApVW2JK38CgAAAIA17RlJRoZHCAEAAABYUWUmmZkeIQQAAABgRXauAAAAAFjantqTpDNnUvIsAAAAANZSOY5k9hleTTeEAAAAAKyl0jMZs289CAAAAAA8pc4arLJ6BQAAAMCS9mRLknE+QagDCwAAAIC1VHLkLL+qnCEWAAAAAKyjkk4ybj0HAAAAADzp8WZQiTsAAAAAS1J6BQAAAMDSbGABAAAAsDQbWAAAAAAszQYWAAAAAEuzgQUAAADA0vb0niQzmZFnAQAAALCaSnXOC8LKGWIBAAAAwDoq2yUZFrAAAAAAWFNlVjKrLWABAAAAsKI9tZ2fzZmUFSwAAAAA1lJ5OJKjO1VniAUAAAAAC6lcZjJuPQYAAAAAPK2y78novvUgAAAAAPCUPWPkXMHyDCEAAAAA66nuS5Ke8QwhAAAAAAuqxPUgAAAAAOuqa4O7FAsAAACAJdnAAgAAAGBplRxJvEIIAAAAwJoeTwgBAAAAYEl1vj44bGABAAAAsCQbWAAAAAAsbU/2JJnJzLmNBQAAAADrqNSRpMcZXs1bzwMAAAAAn1LZZjIyLWABAAAAsKLK3JPZFrAAAAAAWNJ+lriPTmZSVrAAAAAAWEulLkl1Mq1gAQAAALCeSjq5/gIAAAAAq6m8TF4XuFvAAgAAAGAxlTES0RUAAAAAi6ps98nocetBAAAAAOApdd4O2sACAAAAYE2VbEksYAEAAACwprqGV14hBAAAAGBJe7JfP318ihAAAAAA1lHJkaT7DK9UYQEAAACwlmuABQAAAABrupa4W70CAAAAYE37NcAaOrAAAAAAWFElD0l66sACAAAAYEWV7lvPAAAAAACfqXI3kkSKBQAAAMCS9oxrdqUCCwAAAIAFVZ8dWDawAAAAAFhSZdZ5QKjDHQAAAIAFVV5uSQ8bWAAAAAAsqTLGrWcAAAAAgM+0p++SZGpxBwAAAGBFlW1GCRYAAAAAq6rs98mIDiwAAAAAllSZz249AwAAAAB8pv3ae9U6sAAAAABYUSUP+UQHllNCAAAAAJZSUX8FAAAAwMLq7vwoxQIAAABgSfu4fqIBCwAAAIAV1Ud9n07PyhliAQAAAMBKqsa3/iYAAAAAuJX92bPnSUbPmZQbQgAAAAAWU3Me6dmpSqYbQgAAAAAWU6/qPqnrK4Q2sAAAAABYTO1zT+Y1wLKBBQAAAMBi9mfblu4RHVgAAAAArKgePtrSnakDCwAAAIAV1cPLu6THOO8HrWABAAAAsJZ6XvfJ6HmGV1awAAAAAFhLVS4Zbf8KAAAAgDXVR89epEfa/hUAAAAAK6oelWTEDhYAAAAAK6oX/StJZuvAAgAAAGBFdW5fAQAAAMCa6mXeSTKsXgEAAACwpKocSYY1LAAAAACWVF/Iy4zMqcIdAAAAgBXVffZ0VLgDAAAAsKZ6Ne+SjL71IAAAAADwlHp2t916BgAAAAD4TPX87kXGOFuwqrRgAQAAALCWejlfpmd3VV2r3AEAAABgHXW/33/c4G4BCwAAAIDF1Lv/691kZnqGEAAAAIAV1fZwlzHGODMsK1gAAAAArKU+yM+nM2elMq1gAQAAALCYmiNJxq3nAAAAAIAn1RePdzPGaB3uAAAAAKyojjHTHR3uAAAAACypvvHuryaj+9aDAAAAAMBT6m4+v/UMAAAAAPCZ6ov9PCM6sAAAAABYU32Yu3RaBxYAAAAAS6pv9BczMuYZX9nBAgAAAGAt9X5/PZ2OdwgBAAAAWFG919/UgQUAAADAsup/9ncnOrAAAAAAWFR9eHk/SbUOLAAAAABWVN/3W/59urt1YAEAAACwonq2fZQaI3MmZQELAAAAgMXUz46vpjOm/SsAAAAAVlTj1bX7SoIFAAAAwILq9/3S1zJUuAMAAACwqPog7yQjbQELAAAAgBXVT+Z3p+xeAQAAALCo+m35Wjqjbz0IAAAAADyl/nS+kS2bDiwAAAAAllQ/lKQydGABAAAAsKSaSfr+/tZzAAAAAMCT6qd/5t/m8nBYvgIAAABgSfUPfuKv5eF4lZnpNUIAAAAAllM/8LW/n7k/dKUytWABAAAAsJh6cXw5vQmuAAAAAFhT/atf+cepsfWtBwEAAACAp1S6Mkr3FQAAAABrqt/zM781Xd2ZiQ53AAAAAFZTH969zMg4wytVWAAAAAAspv77y59NjZpzJi4JAQAAAFhNvf9972YeZ3g1bWABAAAAsJj6rj/0peShvUIIAAAAwJLq6z//K8m49RgAAAAA8LT64IOXqdraI4QAAAAArKjez8t0hkcIAQAAAFhSvegP0hl9xld2sAAAAABYS3398tWMHIkdLAAAAAAWVA/jnYzR0/4VAAAAACuq97/5c+kq+1cAAAAALKnq9e6VHSwAAAAA1lPfHF/JyNEzlbKDBQAAAMBiasyZTjshBAAAAGBJ9e74ZpLqWw8CAAAAAE+pS54lmQIsAAAAAJZUH+bLGaNVuAMAAACwpHr28EE6Y+rAAgAAAGBF9ezhZVIVK1gAAAAArKjuayZzeIYQAAAAgCXVw+VVxhiZc6bKChYAAAAAa6kX3/Ve+ji6qjKnFSwAAAAA1lLz+fO03AoAAACARdV7L7+erupbDwIAAAAAT6mtZ2ZGPEMIAAAAwIrq63k3W44ZzxACAAAAsCArVwAAAAAsrd7rVzmiAwsAAACANdXsLRX5FQAAAABrqg8evpCqKcECAAAAYEl1Nx6urxACAAAAwHrqRb9M68ACAAAAYFF1n+cZmbeeAwAAAACeVK9yp8QdAAAAgGXV89xnZljBAgAAAGBJdZdh/woAAACAZdXLy0cZStwBAAAAWFQdPVNjJHMmVbeeBwAAAAA+pV68+yLHMTtVZ4gFAAAAAAupjJG0C0IAAAAA1lQf9UM2HVgAAAAALKoq49YzAAAAAMBnqmd5liOH8isAAAAANDXscgAAIABJREFUllSzZ8awhQUAAADAmurV5VVKBxYAAAAAi6p97JlxQQgAAADAmupu3KXTNrAAAAAAWFI9HJeM0oEFAAAAwJrq0p3KsIEFAAAAwJLqWY7MDCVYAAAAACypKkc6lWQmqVvPAwAAAACfUve5y5aj8zrEAgAAAIB11LR1BQAAAMDC6vnlIUeNdkEIAAAAwIqqR6UewysXhAAAAAAspu7fvcs4jr71IAAAAADwlKp5xO0gAAAAAKuqu+OSY4zHrx0RAgAAALCUOrKluh+Dq/HrfjcAAAAAfJvVw9gyLF4BAAAAsKi6y0ynlLgDAAAAsKTaM3PcegoAAAAA+Az1cOzZatrAAgAAAGBJdUlpbgcAAABgWfU8Dzl0YAEAAACwqLJ9BQAAAMDK6tW8ZBtj3noQAAAAAHhK3XoAAAAAAPj11PM8y5FDBxYAAAAAS6rOjEUsAAAAAFZVr3LJlmEDCwAAAIAl1ZYtHfkVAAAAAGuqu2PPUdMlIQAAAABLqst+ZDvqDK/mrccBAAAAgE+ry94ZU3QFAAAAwJpqn5WWXwEAAACwqNqqMqPFHQAAAIA11eW4pLS3AwAAALCoOpKMsoEFAAAAwJrqWWaOjFvPAQAAAABPqmQmqb5+vPU8AAAAAPApdd932XLkDK+8RggAAADAWuq6cyW5AgAAAGBJteeiAwsAAACAZdXsStJeIQQAAABgSXXpPdtwQQgAAADAmmrLTKdsYAEAAACwpNrGzNSBBQAAAMCi6uhK5bCBBQAAAMCS6phbRnUyk9StxwEAAACAT6vt7pJ+2GYqZ4gFAAAAAAupUZ3pgBAAAACARdXszjaGCAsAAACAJdUcM+nH+0ElWAAAAACspfa55xhHRwkWAAAAAAuycgUAAADA0uqSI1t0YAEAAACwpqq2hAUAAADAuqpSOepQfgUAAADAkqrTKVVYAAAAACyqjnSGDiwAAAAAFlVbj3SOW88BAAAAAE+qLSNH2gYWAAAAAEuqS3e2oQMLAAAAgDVVnx1Yt54DAAAAAJ5UlcrM4YQQAAAAgCVdAywAAAAAWFNd5pG9xsxMogoLAAAAgMVUV5I5zvDKKhYAAAAAi6m7fea4lA4sAAAAAJZUs2VXAAAAAKyrZu6yeYUQAAAAgEXVyIz0CgAAAIBV1dYzR20yLAAAAACWVEdGNjtYAAAAACyqOltGjnnrQQAAAADgKdcOrLKCBQAAAMCSaqTTGbeeAwAAAACeVLNHxjhsYAEAAACwpErK/hUAAAAAy6rqI1MHFgAAAACLqiSZww4WAAAAAGuqmSN7tpnMXPMsAAAAAFhGnaHVY3g1bzwOAAAAAHxaVSqXTB1YAAAAACyperQKdwAAAACWVb116iLCAgAAAGBNNTLSQ34FAAAAwJpqzJEjx63nAAAAAIAnVaezacECAAAAYFF1nAFWZpK69TQAAAAA8GvUlsoll1lJ5q2nAQAAAIBfo0YqMy4IAQAAAFhTzT6y1ybBAgAAAGBJaq8AAAAAWFpVOtMrhAAAAAAsygYWAAAAAEurmUqNiw0sAAAAAJZUScciFgAAAACrqurOJTVvPQgAAAAAPKU6IzVcEAIAAACwpjoysufSMw4JAQAAAFhPbekc2VJJ3BECAAAAsJoas3PU6FjBAgAAAGBBNbeR7XLEChYAAAAAK7oGWK0DCwAAAIAl1TY7l6EDCwAAAIA11UgyM2RXAAAAACypZkb2cbn1HAAAAADwpGvtVfdtxwAAAACAp9XozkV9OwAAAACLqvOXsoEFAAAAwJLqSGevykzsYQEAAACwnKokR7oriacIAQAAAFhNjVSOeIUQAAAAgDVVulNjs3wFAAAAwJLODqxUOjqwAAAAAFhPVUYuufSIDiwAAAAA1lMjI4foCgAAAIBFVaezj71vPQgAAAAAPKXm7Gw10p2UEiwAAAAAFlPb3Zb7jx56jGS6JAQAAABgMefOleQKAAAAgEVVZ2avXYIFAAAAwJLqUx8AAAAAYDE10nlIeYUQAAAAgCVVZjKG/AoAAACANdWRkWe5dMchIQAAAADrqUpyZGQk0eQOAAAAwGpqpHMZuxtCAAAAAJZUnZE9l1vPAQAAAABPqpnKlsuc0YEFAAAAwHqqeuZSeyo6sAAAAABYT410jmw6sAAAAABYUnVG7sbD49eWsAAAAABYSs1UKkd0YAEAAACwotoycz+etQ4sAAAAAFZUSdJRgQUAAADAmuqYR57Xs+45U+WIEAAAAIC1VCWZc2bkekI4p3UsAAAAAJaxp+p1eXvNmVSNm04EAAAAAJ+wz+6kz6Wrqsqcs0uIBQAAAMAi9prXtwfHyLyeFAIAAADAKqpHpTPmHOeThPPWEwEAAADAJ+xnffvjxeBMYgcLAAAAgHXslU7SubZgRYgFAAAAwEr2cT0aHBmiKwAAAACWU53K8YnwSgcWAAAAACvZZ187sDrJsIMFAAAAwFr2qiPdyVnkrgMLAAAAgLXsYyTj+gjhnEnJrgAAAABYyH7MLcl1/6pm5iwhFgAAAADL2FOdswAryXRCCAAAAMBa9i3z+vTgyCzRFQAAAABr2XuOdHWSocIdAAAAgOXUrE4nndnXTSwAAAAAWEfVrIx5fYbwcQULAAAAABaxjxoZOQOsOWfKE4QAAAAALGTv7nSfrxBWlRALAAAAgKXUnPN1gAUAAAAAq6kadZ4QnleE48bzAAAAAMCn7GcD1rUDKzMV54MAAAAArKM6nSPH6/BqeoYQAAAAgIWUwAoAAACAle2PJ4MdRe4AAAAArEfhFQAAAABL22efJ4TDA4QAAAAALKiqrktYLggBAAAAWNA+xsi2bUmSOWdeB1oAAAAAsIC953y9fFVVQiwAAAAAlrLPa4/72YA1E+EVAAAAAAvZqzr98Q5WMoVYAAAAAKxjH5nX7auRGdkVAAAAAGvZe9brDayygAUAAADAYvZZI8k4t7CkVwAAAAAspqo74zg+Dq/mvPVMAAAAAPDaPua1A2vk7MC68UAAAAAA8En7MSrpzsgZXgmxAAAAAFjJnpwdWCfxFQAAAABr2bcc109HZqpKiAUAAADAQvZO0tcvnBACAAAAsJp9ZkvyeEQovgIAAABgLVXpnMHVY3g1bzsRAAAAAHzCPvLxDpb9KwAAAABWU30NrmaG/SsAAAAAllOz+yxx7/5W3wsAAAAA33ZVVRlj3HoOAAAAAHjSPsZ4HWDNOVOlBQsAAACAdew9OzMzIyNVJcQCAAAAYCn7rF9T2y67AgAAAGAhVamMXDuwZjxDCAAAAMBS9jHH6wBr1kxNK1gAAAAArGM/6kiSswNr1hliuSMEAAAAYBF7Oklfv6qcJ4TyKwAAAAAWsW9zOz8byYztKwAAAADWsvfodHcykkoJsQAAAABYSs3M9OsbQgAAAABYS9X1BcKcH8ev870AAAAA8G1XI50tSaUf+9utYwEAAACwjOpUZsZjeDXmrScCAAAAgE/YZ0aScb0dvMZYAAAAALCIqnRGjnwcXtnBAgAAAGAd++hzByudzGH/CgAAAIC1VFflGMP+FQAAAABL2ucYyTgbsDJnUnawAAAAAFjHXvNIknTGGV4JsQAAAIDvNNd8g7fTnuTTt4OyKwAAfoP6+3/w/APD6KSUqgJwI8clOR7GzEhlXn8SVep1YRLf6fZZW5JkVGxffQ7c9+XWIwAAb4n+/h9MXr1MciTjSDL8MQGA2+iZfOH3vqoPfzYz2/35s8hPpbfJntlJ+vzKCeFb5fxPdWZeV+wqI6/6o/F3f8cP9924u/V4AHxOdM+MUbl8dJ///Iv/Jv8o/+HWI/GmXDo5ZmbG9beP06NAANxIpz78L5X9xazL/V06qfH4U0nG8TbYt3r8LcaQXb1lHsOreh1lPaT6i7m/vMj9rYcD4POjkj7muHvxfv+lH/2J/MM/99WMxwdk+M62HZX9mJX8jYz6kzN5eeuRAPj8mt1Vx/2vZuT3P+5xzEpX4jceb4G9e6S7k+v/ORNivT0ew6uZuu++z7a9kx7d3R/eejQAPmd6zP7oPvlP/+Kn8j2/80/ln/7xH8sP/Os/e+ux+P+19cjRSfLHkvFHy58PALilT/4PspmkZtUsC1hviX3O83xwjDPE4m0yz3+hnfdH7X9ljof7zIdnqb7xXAB8rpwLwe/2MX/xp3/8n/29f/7jfzt/4P0/ceupeBPmeLwX/HqSzOSSzPbnBABuoJPUTGYlWypbZs3UjDWdt8Neo84NLNnVW6eqas501XyR1N95ffqrmAKAG+hty5e+8pUfe/eDdz74wpe/VPmmn0jf8er8U0Il2/XLPTlbR248GQCfU/XpL6xfvUX2kfOvJK8bk3g7zJlZNWvOmsm8T6X11wHwbTdzVOq9dP/XOY8PLw8PmfOwDvz2stYPALxxe+f8K8nHjUkSjrdCXdPm68cX5z+88VAAfO7MzMdNq3fGGFslcww/kAAA+I2rmfk6wAIA+E3wyd9otN91AADw/6oq9fqEEAAAAABWowMLAAAAgKXtR44kycjQgQUAAADAciRVAAAAACxt37K9/uK6faVbFQAAAIBl7N19vkLYSQ0nhAAAAACsZZ/bTHJ2YGXGUSEAAAAAS6madQZXM53K+TkAAAAALGIfNfLYg+V8EAAAAIDV7D2vHViVrtQQYgEAAACwkn2WDiwAAAAA1lU1R8ZMMsfUgQUAAADAavZRnZEk6cw5UjawAAAAAFhIdVeOY2TOdFUybWABAAAAsJB9zpFk5FzDUoIFAAAAwFr2Gke6k2R0XpdgCbEAAAAAWMN+3b9KIroCAAAAYD37cY2sRrrtXwEAAACwGlkVAAAAAEvbtzw+Ozim7SsAAAAAVrN3kr5+4YQQAAAAgNXss7ckyUiG+AoAAACA1VRVJ5lJz/nxDhYAAAAArGEfY2bbkmRkzqQsYAEAAACwkL3nSNLpjK6KEAsAAACApdSszpEk1d/qewEAAADg226vVFKd/vgxQgAAAABYxj7mSGpkJJmZKfeDAAAAACykOp1jHplzzkplTq8QAgAAALCOfdbrwGpkJrGABQAAAMBC9joqnT7jq0qEWAAAAACsZB9jZPRIxrUDS3oFAAAAwEL2I0eSZGR0pYRYAAAAACxFUgUAAADA0vYt2+PnbfsKAAAAgNXsnU7OGvc4IQQAAABgNTUzc6STnL8AAAAAwEr2ysi5gTVuPQsAAAAA/F/2cV28GunMDMeDAAAAACylOpXOyExmJZm3nggAAAAAPmGfPdIZqU4yZmIHCwAAAICF7FWd9Exn9BleCbEAAAAAWMc+xkxGMpLMmZTsCgAAAICF7Mes5HyDsKuEWAAAAACsZU+NnPtXSSK9AgAAAGAt+zaP87MaPVMpHVgAAAAALKQ6Z237nNcK93njiQAAAADgE/ZZW5JkJFMBFgAAAACr2dOddCfJiBZ3AAAAABazb483g2NM7VcAAAAArKZ6jHSSOcbZgXXriQAAAADgE2omub5D2DedBAAAAACesD+eDEqvAAAAAFjRPq6fjJzngzqwAAAAAFhJdc4Twpm0DiwAAAAAVlMznU4yHBECAAAAsKC9UskZYvX4lt8OAAAAAN9e+8hIMq4dWDOlBQsAAACAhexHjiTJyJiVEmIBAAAAsJR6XX2lAgsAAACABe3btj1+3nPO/J/27t1Jkuyq4/jvnMzu6Zl9sAopIJCIAAJDEHJw4G/AwMPAwcYgFPwNuBg4GPwnWBCBgYk8AoNHCAkWIQj02NXsTE9X5jkY597Mm9XVs0KP2BLx/UTsVndV1n3lzZo8p25mu7P6CgAAAAAAANdjzqilV6mUu4skFgAAAAAAAK7JHB5KpSZNlckidwUAAAAAAIAr4h4uC1NfiaX4bBsEAAAAAAAAjGZz06RJ4h5YAAAAAAAAuEJzZkqZSol7YAEAAAAAAODqeERozZS4eBAAAAAAAABXyN2sLiA0s8+6MQAAAAAAAMC52VQ3bzdlhIw/QggAAAAAAICr4inXKlNIcnEdIQAAAAAAAK7LHDLltvKqp7EAAAAAAACA6zC7VklSytK2NVgksQAAAAAAAHAd5n7ndhOpKwAAAAAAAFyfea2/QSiT0hUKOUksAAAAAAAAXA2XUvUft3EHAAAAAADA9ZmnDFUCawouIQQAAAAAAMC18XRXyhSZxvorAAAAAAAAXJs5zJTTpEkKRUjOGiwAAAAAAABcD/dIWaSyJ6+CNVgAAAAAAAC4HrN5aKp7YCX3wAIAAAAAAMC18Qyre2CJv0EIAAAAAACA6+PhqVUpSUn2CgAAAAAAANdm9qiLBlMpubEECwAAAAAAAFdlNjdJkskyIuT8FUIAAAAAAABckXldV0mSmcndFRFJEgsAAAAAAADXws0kKWVmXDwIAAAAAACAqzPX3x6UpJRkn2VbAAAAAAAAgEe4VhAAAAAAAABXzevPDq6SLD/rxgAAAAAAAADn2gosU11CCAAAAAAAAFyXWZr6z1mrsbiqEAAAAAAAANfDa+VVak9e8ccIAQAAAAAAcD24BxYAAAAAAACu2lz3v5LE0isAAAAAAABcId+uIBwyWQAAAAAAAMC1mLd7tqeCFBYAAAAAAACuzbwlrUz8EUIAAAAAAABcnXm481Vuf4SQJBYAAAAAAACuhGu4CRYAAAAAAABwbWb5dhOsVBirrwAAAAAAAHBVZqW1BVgmeUjhJLEAAAAAAABwNWbFKiklc4mbYAEAAAAAAODKeP0VQpOMG2EBAAAAAADg+szSNPzK6isAAAAAAABcl+GvEEbslxACAAAAAAAA18GlUOYq1bWEAAAAAAAAwFWZh8QV98ACAAAAAADA1Wk3vCJ3BQAAAAAAgOs03rGdLBYAAAAAAACuDn9yEAAAAAAAAFdtHn5e22NIsV7aGAAA4EewSprqMdvXZyz8BgDgpyYi5W6KaP/guqSQ3KWI7ddwl0fsr4/atuGSH16qbaM9+lCWQvJWTi91LEv9YavO23axnxj4sFHE1qp99U3vSysiJN/af9aPrQyvmg7d3/8/FrvVf1ZWyFu793IkpR/efCzC5e2lcQBdvUXScUyijYm/ZV8ohqaelzWOu7ui1XtcuXQsZN+/fasYyuhte6qsYdR7OWfjF4eSW1mKrQnHwW/bPS4rpTgksO7aG2/PhgoAAODHMbXH5wp3La4M/vrx/wuhQ5zQzoPb4xB0PAoKLhS1naz2Mo8n5YcT5P6GsxP8GE76+7m4V1CV5wHaeII/BnP7a73+oX2qE3jX47pbT3WILM7adOxv1TtWf+zLMZbaOnQWDPR6+2g/Lues/rNgxD9l22PTL4x5C34vtek8CNo6dja2j+p/ot5D+Ncn2hPje9gXn1Jvf9kv7tbHQem4Ly6VM7QxW4ymHuDuIf/jwP48XD5res3loazH9T/dv0M/dQxYxzaNZbmOwfL4/vOfx/r16Pmh/rN+nJdxDPHP0xG+1fBk+RfKG/t7aV9c6tfb+nAs+9Pn1Pjxct7n48/H/r2tn5fqkhReCauqeE8CWW3TPru27JHavKrf98/bseB6zR81JmxPsviQkAqrHNY+S8/L0pio8d7zbWs/btvq13FubKPTnnTfnxv7Edr758N79u6fdWwb/K1Dh9d9O6CP5RzfvHVrb9f24bFve0i4DdWNfTl2+fG+8Etlje+MkPtZOefj1z8LtnqrBB827Um7y2Xt9fkT4+fn2/Z/R58Yv7eVNdc3oCZJ35Ty1yV93/cTTQAAgB9L1Aqszyvzn3WzTvrCa9l0KeDEzxzPfk5+K2k7HfXzk9ZHJ6IXinoUtR1Pyg8nyIc3DGVcCCDGAO2pE/wejFwOCsZ6+wn8U6HlMSg4b9Oxv8dg7tHr42Mcf3i8+bGtY42XArSngpEng7mnnxiCw8dtejQHhg5deodfGL+LZQ1NeWp8zwPct9U7vHyhqLOU0VmAef6Wy23cn/ChrP3p4yQ4b8JhLl9o11jhU/07L3sMWC+2qY/5WTVP9vVC/Zda6Gf9uNjXS+0d2/So3h/i/W/ZF+fve/sInm/36XNqyBW9ta7zz80n29G//8njLz0xMGR3tSWBWrpJOWaPWh6gJ9PlksVeZua+ratyVsr2cqsj63FPvrRklvUDzxQpuaqsiL6tyWtBjWR9JFsiNXs57TOqf+lhpm31drZUn1s7LnNofzUmMuVD/7Zku1slMy3TtxqlSMvWpmxtDTdXKNoKK6XSJVe2foTCTFKEpbytEFJajYxnWzDlJle0JHW2fdG2rcdwhYdJntnGpJ6XZdsX4e4WEdHGr563zP7JFHKTIjxNkrK6UY2QWV/dFjWGLmVkvUXZmpNh3j41Q5Jl7Qtl2ym9rD5JWlltUmRNwojMtt+i9m30SdP70k4csrK1pmxt6hNiK0uR0VYRtrIy5v3QiN9/6hgBAAD4kQ3xfs6L9P5r6QfDpQL42bVaKiZJ8S9h+g1XvlZdJxoV7VjsJ8CqE+CsWEGHE2BrJ6v9pFUhq5PxmkDZTnx7lJahcAvL2AILSXUCnPvvrqiraDzrXNnTx9d75FWRTpW/lddOsCVFKisIrXKGemLffqi/91dSmIcrrZWVIZOrAqQ6OU+LVPh4gj+2T6rgJ9WCnZQsqxVbtNlTK7WNW1ZQkFub9nZu4+wVSEgtIOkBhGq806RpG5F63aa2L7z2Wa7SNLXgxFtkaimdUjZJr16m1kWKN6EXzySbUqdZWqZULtK8pEyqjLZL8gxb5B7SSamcqjwzyU7R1nxkmOSmVFjNQa19aFPmLSAySUubLxYKa0FfqAZePQxK79GlhbR4vxyozaEeVLULe9xTq6TwlK094Iq+bf2wVhlu1cZsx0EPhq3N+W2fuHQ61WIn7/VbSqmwSO+ZutX6vKp94Ke2/3pad6r5ua4tAFbLHJikte/Dmrhu6SFp7f1b2/5r25untEgeqdPUFstY219rDmm92j+rQumqMan+uWkPnG279qjGZLEKmrVWX8z2OWprPS6tPW4KKdymtv2617uo5qotbRmP9zFp7VhqO/fQKsVi6WZtnB9qPttUc9zaMXFaJLPs863GZQkpFObVrwdv4zRVosFO0ZIl2RI8KWvj9+DtM21q/XtTj1P/fZLCQm8mxbRUu+wmt/3lLtnr2n+v5+rfNKvqvZeby6dZ8lny6ZjEaofz46v2reULhtXQ2bbdD/ohidaeTynSjsm1Ni3bZ1jtgdzf4626vbyhjrTtU2d/bfy9V5/y7K+1emwvp8/c7S4Fsjb19/718r31o8/8w/Nj+Vt5x+ePbd3LqjGrcnzb9Gy1eeawbSvLeh3949cO4zeOxbHeVH1GXnjN9zbV8bkOCcCpUnZTtqSp1Ti0fRF9/HKVm7U+VT8is7602J5v9edevvfyTHWoWv8nqNU/9Tav7aNpHKf2xLS3tXerzgZWzS/8ud7kSaEHAQAA/HSYlKab9Va3L9/XO/n8s24QfhJOHjq5lPZVn09fPS7iN0nLcNLsCk3yWOvb8i2waO+ZF20nuObSMm3ntJV6CmnuJ81zxV/LclZfBXW1FKCKds11Qr72E/rhPWbSPLwnVHGqz5ImhZZKq2w33biphwdVji4X7ZewzRVMzIs0pXQvaU35s2etDy/lmuRxU/2Yb+W6V+iNfLmV1kl7SPOsPb6pbt2ldHLpB8+lZ6+k+RN53Kk6eSvljfT8e/X+7zyvIb3rbXou6STFvXTn0k1Iei75M+k/vyWdTtJ779X45eckvZLWf5Vu35M+/0L61ip9eJK+8IF0+4H08DXJPpLefLGa+OUvS9/5nvT1vzmbHH8h0x8pMxW/G/J/+mvFi3+U+0n6w7+SXr2Q/u53JPsv6fShFK8kfUv+8a9K3/156Ve+rXj3JH/zcQ3493+59p99JF8kfSzpnVX64AeK5X25vae4/0RaFlUCYJHuP9cC9PvaJx/cS+uNwt+RlpAvbY7qJF9eKNZZevdNy/md2hx/aHP0HSlW6RTS3SrdLdLphRQ3VZdCcVpafvC9mrPLUm+9XeWRklZ5ztJ6I1krP6L+e/ddSZKv/VbEq5STPKYK/iKlZylN0ZIMIcWLCna31TSnSmDc3lW+KrIdOynpTiGTos3ptR0jt6tq1cWttlsQRTse8lnN6RdrC/rbipt8NqyIapHlrRRTyvOmBeBjWZLith5T1Ye7rLI07WX013OuY/MuWp4v2j2aUspbRd62uZDS8xbsxiy9vpdefyKdFul2lm4mhaw+a9Y63v3GK763VbKber2vROqPd3eSWsKkBep1nNmezHjekzy14kZ6rp7n3fLw9kwepngWlQhoa2Skd9uYZEvstNffi+p7/5zpC1Okmn+S9H5LumTW56meScotB/+2Va7bgixpWx22/bwtbtoTX/t3T8PKq9wTVft7+6WPY2JrWC21bVPP12qpsl3xOLznfGVomA3Jq77d/lDb6JAY8rNNnxyPsa3nb9qGov8w9nsfk1ph1tK5fdutiKEBWz98K74/3+fMeaMf78lerx2G9+m+jXXYoYs+9Gs/Bo7t6ivctjZvK+LOBtZseM6PQ2l9TM7b3N5j2vL5IbXj6Zgk7XNXsqrlz7/0Jwo/yfoOeMuOBgAA+L/o395lSrMt+uq//eln3ST8hORv/4F0el2BfT6orVraHzPqxNLUIgyrQGsLRlKhFlBOobbERp7WF3ANZeW28CfktU2u2oMK24OKtsij1nBZ3QJmjXYivb9H2b4NjtwXVaVU30ibvG/bFu+4pj2IH1cRqAcqprB1D5j3VUvak1NWJ/LWEg9e5cUYP43XCPUvodOk1VoCI7QF/lsQ0BIf4RUMHALS1tYeY4RJk0vLsrdl229qY+R73NbaEDneb2qq8a9VV5UsmeY2Dq3cVy+l5UHSSXpxI9ksLbP0MLexf2iBx9T2zST5IvkqnSYprJIradLcEj6tBT6pxmP16nuukk8V7Mrqyh5b6qoXTXUJ2dKThEuNwxa5u8IsBE73AAADwUlEQVRWyVf5aWrj1hKr01QJBi01JyaXFquE4vSg/W9UaFhZ0I6FqbVvHZK1vrR9Ne1zwV26v2/d82HbtSXHpirrjbfjojXe7qv5U31BILutffrwptpiVuNqrsqohjRVwkNz6+eruerJ17V/esbWbiR/KflJ+sFdmwNzzS3/pA1e22e3N9Inpng1y29eKexUK4Jk0nxXx+L8P3XcPJuke5e+/a50+7Fk35WmdxU+SbPL7UZx8025naR/fq8lmd9vZf2SZF+X5q9JeSd9yRT/8Fyur8j0t3XEZEr/IenP/li6/6L0778lvf6G4hsfyr/ykfRrL6UPP5Ievqd4/WV5PJde/ncdU6ePFTez/Bd/oRKXb95Iy6o4vZLn+4q8k5ZX8iUVn39Ti/Me7iVNiuXn5LHUShf39jlxJy230jsn6SYrsaaQ4nkdp/FQ+2INaU7p7kFan1VCOpf6XMq1rbRp++BubZ8LleBU3LTXFymWYzDff46eCLO2/2z/zNs+KLPmUF92FNoSGIdts5ffPjOilzmWpbZdbp8NF8vayrR9CdWjbXvb8uy5oV5pKGdIRj5VVl9mlO21w7ZvG5N+vOrymGx9OitLw3s+dfzyrC8/xL4IO471tkDYHo9f/zfjrfWe74vzMTkrq8+1Txu/87nQ+/ZoTN5eVv80BQAAAH4k+Zu/J8W99m9DW9Kk33fEogI2byfdh/u0eHupb9MSRGEK7/eXyf1+KC2pFWm1mktel5ypJVI0lH+ot//ckkn9K92tzXWnk/1+WWNZkswrgXFezrBOYQsELCpx0e4hE5byaIHtto1X4s9z6+9wg696GPuRLRHiWQmQrQ39vS2wXafW3tbO7VKhaG0JeR+Tdd3aWOPQt13359qVZ/s2rc29DGv7dL3QP637fKhbxTzRjz7W3pI2qVi9Ep3uLbHZEoMtyRlWF4RuZbU211WC1W/vZcm3BKAf+tfmUljNIQvF2t4r1aoFa6sThjGJSGlt887W6lPa3pWtLe2SnK3eNr/P9415rYRzrxhPJo9hjLIlE5e2UsNaf6wnINXGpSVO6hLCmkM9QZltfpjv70mrZJy3BEhdfrkfS7aqXVbZ6mtBr7XEbvbyva7s247f2OtQL3MvP1KVKJxCYwKwYn2X59L6621f9xUcU5vyayV5PKSTVSJnOkn3r6TXD9K61Cq0W1f4fSUdpxvpjUkPk+RTSza+rr5MN23sZ8Wa8levakdOLUE3zaoE4NKSeKZ4OdU+mm7bmHws2STdvZD9/V/+OB+nAN7ifwHIxE3yQnSqlwAAAABJRU5ErkJggg==",
          "mimeType": "image/png"
        }
      },
      "mandatory": true
    }
  }
}

```

## Folder: onecx-local-env/onecx-data/welcome (1 files)

### File: onecx-local-env/onecx-data/welcome/default_ADMIN.json

```json

{
  "id": "onecx-local-env_import-welcome-images_ADMIN",
  "created": "2025-10-23T15:37:00.121664Z",
  "config": {
    "images": [
      {
        "image": {
          "position": "1",
          "visible": true,
          "objectFit": "scale-down",
          "objectPosition": "center center",
          "backgroundColor": "unset",
          "url": null
        },
        "imageData": {
          "imageData": "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",
          "dataLength": 264143,
          "mimeType": "image/*"
        }
      }
    ]
  }
}

```

## Folder: onecx-local-env/onecx-data/workspace (2 files)

### File: onecx-local-env/onecx-data/workspace/default_ADMIN.json

```json

{
  "id": "onecx-local-env_import-workspace_ADMIN",
  "created": "2025-10-20T11:09:39.79186Z",
  "workspaces": {
    "ADMIN": {
      "displayName": "OneCX Admin",
      "description": "Default Workspace",
      "theme": "default",
      "homePage": "/workspace",
      "baseUrl": "/admin",
      "companyName": "OneCX Organization",
      "address": {
        "city": "Munich",
        "country": "Germany",
        "postalCode": "81825"
      },
      "roles": [
        {
          "name": "onecx-admin",
          "description": "OneCX Administration (full access)"
        },
        {
          "name": "onecx-user",
          "description": "OneCX Viewing (read access)"
        }
      ],
      "products": [
        {
          "productName": "onecx-announcement",
          "baseUrl": "/announcement",
          "microfrontends": [
            {
              "appId": "onecx-announcement-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-bookmark",
          "baseUrl": "/bookmark",
          "microfrontends": [
            {
              "appId": "onecx-bookmark-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-data-orchestrator",
          "baseUrl": "/data",
          "microfrontends": [
            {
              "appId": "onecx-data-orchestrator-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-help",
          "baseUrl": "/help",
          "microfrontends": [
            {
              "appId": "onecx-help-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-iam",
          "baseUrl": "/iam",
          "microfrontends": [
            {
              "appId": "onecx-iam-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-parameter",
          "baseUrl": "/parameter",
          "microfrontends": [
            {
              "appId": "onecx-parameter-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-permission",
          "baseUrl": "/permission",
          "microfrontends": [
            {
              "appId": "onecx-permission-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-product-store",
          "baseUrl": "/application",
          "microfrontends": [
            {
              "appId": "onecx-product-store-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-search-config",
          "baseUrl": "/search-config",
          "microfrontends": [
            {
              "appId": "onecx-search-config-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-shell",
          "baseUrl": "/shell",
          "microfrontends": []
        },
        {
          "productName": "onecx-tenant",
          "baseUrl": "/tenant",
          "microfrontends": [
            {
              "appId": "onecx-tenant-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-theme",
          "baseUrl": "/theme",
          "microfrontends": [
            {
              "appId": "onecx-theme-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-user-profile",
          "baseUrl": "/user",
          "microfrontends": [
            {
              "appId": "onecx-user-profile-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-welcome",
          "baseUrl": "/welcome",
          "microfrontends": [
            {
              "appId": "onecx-welcome-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-workspace",
          "baseUrl": "/workspace",
          "microfrontends": [
            {
              "appId": "onecx-workspace-ui",
              "basePath": "/"
            }
          ]
        }
      ],
      "slots": [
        {
          "name": "onecx-avatar-image",
          "components": [
            {
              "productName": "onecx-user-profile",
              "appId": "onecx-user-profile-ui",
              "name": "./OneCXAvatarImageComponent"
            }
          ]
        },
        {
          "name": "onecx-column-group-selection",
          "components": [
            {
              "productName": "onecx-search-config",
              "appId": "onecx-search-config-ui",
              "name": "./OneCXColumnGroupSelectionComponent"
            }
          ]
        },
        {
          "name": "onecx-iam-user-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-iam-user-roles",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXIamUserRolesComponent"
            }
          ]
        },
        {
          "name": "onecx-permission-iam-user-roles",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXIamUserRolesComponent"
            }
          ]
        },
        {
          "name": "onecx-product-data",
          "components": [
            {
              "productName": "onecx-product-store",
              "appId": "onecx-product-store-ui",
              "name": "./OneCXProductDataComponent"
            }
          ]
        },
        {
          "name": "onecx-search-config",
          "components": [
            {
              "productName": "onecx-search-config",
              "appId": "onecx-search-config-ui",
              "name": "./OneCXSearchConfigComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-extensions",
          "components": [
            {
              "productName": "onecx-shell",
              "appId": "onecx-shell-ui",
              "name": "./OneCXShellToastComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-footer.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXFooterMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-footer.end",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXVersionInfoComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-header.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXCurrentWorkspaceLogoComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXToggleMenuButtonComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-header.end",
          "components": [
            {
              "productName": "onecx-help",
              "appId": "onecx-help-ui",
              "name": "./OneCXHelpItemEditorComponent"
            },
            {
              "productName": "onecx-bookmark",
              "appId": "onecx-bookmark-ui",
              "name": "./OneCXManageBookmarkComponent"
            },
            {
              "productName": "onecx-help",
              "appId": "onecx-help-ui",
              "name": "./OneCXShowHelpComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXUserAvatarMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-horizontal-menu",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXHorizontalMainMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-header.center",
          "components": [
            {
              "productName": "onecx-announcement",
              "appId": "onecx-announcement-ui",
              "name": "./OneCXAnnouncementBannerComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-start.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXSlimUserMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXSlimVerticalMainMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXUserSidebarMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXVerticalMainMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-theme-data",
          "components": [
            {
              "productName": "onecx-theme",
              "appId": "onecx-theme-ui",
              "name": "./OneCXThemeDataComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-admin-view-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-change-password",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXChangePasswordComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-welcome-list-active",
          "components": [
            {
              "productName": "onecx-announcement",
              "appId": "onecx-announcement-ui",
              "name": "./OneCXAnnouncementListActiveComponent"
            }
          ]
        },
        {
          "name": "onecx-welcome-list-bookmarks",
          "components": [
            {
              "productName": "onecx-bookmark",
              "appId": "onecx-bookmark-ui",
              "name": "./OneCXBookmarkListComponent"
            }
          ]
        },
        {
          "name": "onecx-workspace-data",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXWorkspaceDataComponent"
            }
          ]
        }
      ],
      "images": {
        "logo-small": {
          "imageData": "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",
          "mimeType": "image/png"
        },
        "logo": {
          "imageData": "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",
          "mimeType": "image/png"
        }
      },
      "menuItems": [
        {
          "key": "USER_PROFILE_MENU",
          "name": "User Profile Menu",
          "disabled": false,
          "position": 1,
          "badge": "folder",
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "UPM_PERSONAL_INFO",
              "name": "Personal Info",
              "url": "/user",
              "disabled": false,
              "position": 0,
              "badge": "user",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_ACCOUNT_SETTINGS",
              "name": "Account Settings",
              "url": "/user/account",
              "disabled": false,
              "position": 1,
              "badge": "cog",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Einstellungen",
                "en": "Settings"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_PERMISSIONS",
              "name": "My Permissions",
              "url": "/user/roles",
              "disabled": false,
              "position": 2,
              "badge": "lock",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Berechtigungen",
                "en": "Permissions"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_BOOKMARKS",
              "name": "My Bookmarks",
              "url": "/bookmark",
              "disabled": false,
              "position": 2,
              "badge": "bookmark",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Lesezeichen",
                "en": "Bookmarks"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_CHANGE_PASSWORD",
              "name": "Change Password",
              "url": "/user/account/change-password",
              "disabled": false,
              "position": 3,
              "badge": "key",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Passwort Ã¤ndern"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            }
          ]
        },
        {
          "key": "PORTAL_FOOTER_MENU",
          "name": "Footer Menu",
          "disabled": false,
          "position": 3,
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "PFM_CONTACT",
              "name": "Contact",
              "url": "/contact",
              "disabled": false,
              "position": 0,
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PFM_IMPRINT",
              "name": "Impressum",
              "url": "/imprint",
              "disabled": false,
              "position": 1,
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            }
          ]
        },
        {
          "key": "PORTAL_MAIN_MENU",
          "name": "Main Menu",
          "disabled": false,
          "position": 0,
          "badge": "folder",
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "PMM_PRODUCT_STORE",
              "name": "Application Store",
              "url": "/application",
              "disabled": false,
              "position": 0,
              "badge": "cog",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PMM_WELCOME",
              "name": "Welcome Page",
              "url": "/welcome",
              "disabled": false,
              "position": 1,
              "badge": "home",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Startseite",
                "en": "Start page"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PMM_WORKSPACE_MGMT",
              "name": "Workspace",
              "disabled": false,
              "position": 2,
              "badge": "folder",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_WM_WORKSPACES",
                  "name": "Workspaces",
                  "url": "/workspace",
                  "disabled": false,
                  "position": 0,
                  "badge": "ellipsis-h",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_WM_THEMES",
                  "name": "Themes",
                  "url": "/theme",
                  "disabled": false,
                  "position": 1,
                  "badge": "palette",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_WM_TENANTS",
                  "name": "Tenants",
                  "url": "/tenant",
                  "disabled": false,
                  "position": 2,
                  "badge": "android",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "Mandanten",
                    "en": "Tenants"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_USERS_AND_ROLES",
              "name": "Users & Permissions",
              "disabled": false,
              "position": 3,
              "badge": "users",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_UR_PERMISSIONS",
                  "name": "Roles & Permissions",
                  "url": "/permission",
                  "disabled": false,
                  "position": 1,
                  "badge": "lock",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_UR_IAM_USERS_ROLES",
                  "name": "IAM Users & Roles",
                  "url": "/iam",
                  "disabled": false,
                  "position": 2,
                  "badge": "users",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_UR_USER_PROFILES",
                  "name": "OneCX User Profiles",
                  "url": "/user/search",
                  "disabled": false,
                  "position": 3,
                  "badge": "users",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_MISC",
              "name": "Miscellanea",
              "disabled": false,
              "position": 4,
              "badge": "map",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_MISC_WELCOME",
                  "name": "Welcome Page",
                  "url": "/welcome",
                  "disabled": false,
                  "position": 1,
                  "badge": "home",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_ANN",
                  "name": "Announcements",
                  "url": "/announcement",
                  "disabled": false,
                  "position": 2,
                  "badge": "calendar-plus",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "AnkÃ¼ndigungen",
                    "en": "Announcements"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_HELP",
                  "name": "Help Items",
                  "url": "/help",
                  "disabled": false,
                  "position": 3,
                  "badge": "question-circle",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "Hilfeartikel",
                    "en": "Help Items"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_PARAM",
                  "name": "Parameter",
                  "url": "/parameter",
                  "disabled": false,
                  "position": 4,
                  "badge": "database",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_DO",
                  "name": "Data Orchestrator",
                  "url": "/data",
                  "disabled": false,
                  "position": 5,
                  "badge": "cog",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_DEVELOPER_TOOLS",
              "name": "Developer Tools",
              "disabled": false,
              "position": 5,
              "badge": "code",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PDT_KEYCLOAK_DEF",
                  "name": "Keycloak default",
                  "url": "http://keycloak-app",
                  "disabled": false,
                  "position": 1,
                  "badge": "user-edit",
                  "external": true,
                  "target": "_blank",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PDT_STORYBOOK",
                  "name": "Storybook",
                  "url": "https://master--62dfd0cfe549629f83343eb1.chromatic.com/",
                  "disabled": false,
                  "position": 2,
                  "badge": "book",
                  "external": true,
                  "target": "_blank",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_APPS",
              "name": "Other Apps",
              "disabled": true,
              "position": 6,
              "badge": "ellipsis-h",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_APPS_PROCESS_LOG",
                  "name": "Process Log",
                  "url": "/processlog",
                  "disabled": true,
                  "position": 1,
                  "badge": "cog",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            }
          ]
        }
      ],
      "mandatory": true
    }
  }
}

```

### File: onecx-local-env/onecx-data/workspace/t1_ADMIN.json

```json

{
  "id": "onecx-local-env_import-workspace_t1-ADMIN",
  "created": "2025-12-03T04:43:50.459317Z",
  "workspaces": {
    "ADMIN": {
      "displayName": "ADMIN",
      "description": "Default Workspace tenant 1",
      "theme": "theme1",
      "homePage": "/",
      "baseUrl": "/admin",
      "companyName": "OneCX Organization",
      "address": {
        "city": "Munich",
        "country": "Germany",
        "postalCode": "81825"
      },
      "roles": [
        {
          "name": "onecx-admin",
          "description": "OneCX Administration (full access)"
        },
        {
          "name": "onecx-user",
          "description": "OneCX Viewing (read access)"
        }
      ],
      "products": [
        {
          "productName": "onecx-announcement",
          "baseUrl": "/announcement",
          "microfrontends": [
            {
              "appId": "onecx-announcement-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-bookmark",
          "baseUrl": "/bookmark",
          "microfrontends": [
            {
              "appId": "onecx-bookmark-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-data-orchestrator",
          "baseUrl": "/data",
          "microfrontends": [
            {
              "appId": "onecx-data-orchestrator-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-help",
          "baseUrl": "/help",
          "microfrontends": [
            {
              "appId": "onecx-help-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-iam",
          "baseUrl": "/iam",
          "microfrontends": [
            {
              "appId": "onecx-iam-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-parameter",
          "baseUrl": "/parameter",
          "microfrontends": [
            {
              "appId": "onecx-parameter-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-permission",
          "baseUrl": "/permission",
          "microfrontends": [
            {
              "appId": "onecx-permission-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-product-store",
          "baseUrl": "/application",
          "microfrontends": [
            {
              "appId": "onecx-product-store-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-search-config",
          "baseUrl": "/search-config",
          "microfrontends": [
            {
              "appId": "onecx-search-config-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-shell",
          "baseUrl": "/shell",
          "microfrontends": []
        },
        {
          "productName": "onecx-tenant",
          "baseUrl": "/tenant",
          "microfrontends": [
            {
              "appId": "onecx-tenant-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-theme",
          "baseUrl": "/theme",
          "microfrontends": [
            {
              "appId": "onecx-theme-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-user-profile",
          "baseUrl": "/user",
          "microfrontends": [
            {
              "appId": "onecx-user-profile-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-welcome",
          "baseUrl": "/welcome",
          "microfrontends": [
            {
              "appId": "onecx-welcome-ui",
              "basePath": "/"
            }
          ]
        },
        {
          "productName": "onecx-workspace",
          "baseUrl": "/workspace",
          "microfrontends": [
            {
              "appId": "onecx-workspace-ui",
              "basePath": "/"
            }
          ]
        }
      ],
      "slots": [
        {
          "name": "onecx-avatar-image",
          "components": [
            {
              "productName": "onecx-user-profile",
              "appId": "onecx-user-profile-ui",
              "name": "./OneCXAvatarImageComponent"
            }
          ]
        },
        {
          "name": "onecx-column-group-selection",
          "components": [
            {
              "productName": "onecx-search-config",
              "appId": "onecx-search-config-ui",
              "name": "./OneCXColumnGroupSelectionComponent"
            }
          ]
        },
        {
          "name": "onecx-iam-user-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-iam-user-roles",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXIamUserRolesComponent"
            }
          ]
        },
        {
          "name": "onecx-permission-iam-user-roles",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXIamUserRolesComponent"
            }
          ]
        },
        {
          "name": "onecx-product-data",
          "components": [
            {
              "productName": "onecx-product-store",
              "appId": "onecx-product-store-ui",
              "name": "./OneCXProductDataComponent"
            }
          ]
        },
        {
          "name": "onecx-search-config",
          "components": [
            {
              "productName": "onecx-search-config",
              "appId": "onecx-search-config-ui",
              "name": "./OneCXSearchConfigComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-footer.end",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXVersionInfoComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-footer.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXFooterMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-header.center",
          "components": [
            {
              "productName": "onecx-announcement",
              "appId": "onecx-announcement-ui",
              "name": "./OneCXAnnouncementBannerComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-body-start.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXSlimUserMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXSlimVerticalMainMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXUserSidebarMenuComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXVerticalMainMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-extensions",
          "components": [
            {
              "productName": "onecx-shell",
              "appId": "onecx-shell-ui",
              "name": "./OneCXShellToastComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-header.end",
          "components": [
            {
              "productName": "onecx-help",
              "appId": "onecx-help-ui",
              "name": "./OneCXHelpItemEditorComponent"
            },
            {
              "productName": "onecx-bookmark",
              "appId": "onecx-bookmark-ui",
              "name": "./OneCXManageBookmarkComponent"
            },
            {
              "productName": "onecx-help",
              "appId": "onecx-help-ui",
              "name": "./OneCXShowHelpComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXUserAvatarMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-header.start",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXCurrentWorkspaceLogoComponent"
            },
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXToggleMenuButtonComponent"
            }
          ]
        },
        {
          "name": "onecx-shell-horizontal-menu",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXHorizontalMainMenuComponent"
            }
          ]
        },
        {
          "name": "onecx-theme-data",
          "components": [
            {
              "productName": "onecx-theme",
              "appId": "onecx-theme-ui",
              "name": "./OneCXThemeDataComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-admin-view-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-change-password",
          "components": [
            {
              "productName": "onecx-iam",
              "appId": "onecx-iam-ui",
              "name": "./OneCXChangePasswordComponent"
            }
          ]
        },
        {
          "name": "onecx-user-profile-permissions",
          "components": [
            {
              "productName": "onecx-permission",
              "appId": "onecx-permission-ui",
              "name": "./OneCXUserRolesPermissionsComponent"
            }
          ]
        },
        {
          "name": "onecx-welcome-list-active",
          "components": [
            {
              "productName": "onecx-announcement",
              "appId": "onecx-announcement-ui",
              "name": "./OneCXAnnouncementListActiveComponent"
            }
          ]
        },
        {
          "name": "onecx-welcome-list-bookmarks",
          "components": [
            {
              "productName": "onecx-bookmark",
              "appId": "onecx-bookmark-ui",
              "name": "./OneCXBookmarkListComponent"
            }
          ]
        },
        {
          "name": "onecx-workspace-data",
          "components": [
            {
              "productName": "onecx-workspace",
              "appId": "onecx-workspace-ui",
              "name": "./OneCXWorkspaceDataComponent"
            }
          ]
        }
      ],
      "images": {
        "logo-small": {
          "imageData": "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",
          "mimeType": "image/png"
        },
        "logo": {
          "imageData": "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",
          "mimeType": "image/png"
        }
      },
      "menuItems": [
        {
          "key": "PORTAL_MAIN_MENU",
          "name": "Main Menu",
          "disabled": false,
          "position": 0,
          "badge": "folder",
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "PMM_PRODUCT_STORE",
              "name": "Application Store",
              "url": "/application",
              "disabled": false,
              "position": 0,
              "badge": "cog",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PMM_WELCOME",
              "name": "Welcome Page",
              "url": "/welcome",
              "disabled": false,
              "position": 1,
              "badge": "home",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Startseite",
                "en": "Start page"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PMM_WORKSPACE_MGMT",
              "name": "Workspace",
              "disabled": false,
              "position": 2,
              "badge": "folder",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_WM_WORKSPACES",
                  "name": "Workspaces",
                  "url": "/workspace",
                  "disabled": false,
                  "position": 0,
                  "badge": "ellipsis-h",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_WM_THEMES",
                  "name": "Themes",
                  "url": "/theme",
                  "disabled": false,
                  "position": 1,
                  "badge": "palette",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_WM_TENANTS",
                  "name": "Tenants",
                  "url": "/tenant",
                  "disabled": false,
                  "position": 2,
                  "badge": "android",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "Mandanten",
                    "en": "Tenants"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_USERS_AND_ROLES",
              "name": "Users & Permissions",
              "disabled": false,
              "position": 3,
              "badge": "users",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_UR_PERMISSIONS",
                  "name": "Roles & Permissions",
                  "url": "/permission",
                  "disabled": false,
                  "position": 0,
                  "badge": "lock",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_UR_IAM_USERS_ROLES",
                  "name": "IAM Users & Roles",
                  "url": "/iam",
                  "disabled": false,
                  "position": 1,
                  "badge": "users",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_UR_USER_PROFILES",
                  "name": "OneCX User Profiles",
                  "url": "/user/search",
                  "disabled": false,
                  "position": 2,
                  "badge": "users",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_MISC",
              "name": "Miscellanea",
              "disabled": false,
              "position": 4,
              "badge": "map",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_MISC_WELCOME",
                  "name": "Welcome Page",
                  "url": "/welcome",
                  "disabled": false,
                  "position": 0,
                  "badge": "home",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_ANN",
                  "name": "Announcements",
                  "url": "/announcement",
                  "disabled": false,
                  "position": 1,
                  "badge": "calendar-plus",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "AnkÃ¼ndigungen",
                    "en": "Announcements"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_HELP",
                  "name": "Help Items",
                  "url": "/help",
                  "disabled": false,
                  "position": 2,
                  "badge": "question-circle",
                  "external": false,
                  "target": "_self",
                  "i18n": {
                    "de": "Hilfeartikel",
                    "en": "Help Items"
                  },
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_PARAM",
                  "name": "Parameter",
                  "url": "/parameter",
                  "disabled": false,
                  "position": 3,
                  "badge": "database",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PMM_MISC_DO",
                  "name": "Data Orchestrator",
                  "url": "/data",
                  "disabled": false,
                  "position": 4,
                  "badge": "cog",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_DEVELOPER_TOOLS",
              "name": "Developer Tools",
              "disabled": false,
              "position": 5,
              "badge": "code",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PDT_KEYCLOAK_DEF",
                  "name": "Keycloak default",
                  "url": "http://keycloak-app",
                  "disabled": false,
                  "position": 0,
                  "badge": "user-edit",
                  "external": true,
                  "target": "_blank",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                },
                {
                  "key": "PDT_STORYBOOK",
                  "name": "Storybook",
                  "url": "https://master--62dfd0cfe549629f83343eb1.chromatic.com/",
                  "disabled": false,
                  "position": 1,
                  "badge": "book",
                  "external": true,
                  "target": "_blank",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            },
            {
              "key": "PMM_APPS",
              "name": "Other Apps",
              "disabled": true,
              "position": 6,
              "badge": "ellipsis-h",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": [
                {
                  "key": "PMM_APPS_PROCESS_LOG",
                  "name": "Process Log",
                  "url": "/processlog",
                  "disabled": true,
                  "position": 0,
                  "badge": "cog",
                  "external": false,
                  "target": "_self",
                  "i18n": {},
                  "roles": [
                    "onecx-admin",
                    "onecx-user"
                  ],
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "key": "USER_PROFILE_MENU",
          "name": "User Profile Menu",
          "disabled": false,
          "position": 1,
          "badge": "folder",
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "UPM_PERSONAL_INFO",
              "name": "Personal Info",
              "url": "/user",
              "disabled": false,
              "position": 0,
              "badge": "user",
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_ACCOUNT_SETTINGS",
              "name": "Account Settings",
              "url": "/user/account",
              "disabled": false,
              "position": 1,
              "badge": "cog",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Einstellungen",
                "en": "Settings"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_PERMISSIONS",
              "name": "My Permissions",
              "url": "/user/roles",
              "disabled": false,
              "position": 2,
              "badge": "lock",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Berechtigungen",
                "en": "Permissions"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_BOOKMARKS",
              "name": "My Bookmarks",
              "url": "/bookmark",
              "disabled": false,
              "position": 3,
              "badge": "bookmark",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Lesezeichen",
                "en": "Bookmarks"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "UPM_CHANGE_PASSWORD",
              "name": "Change Password",
              "url": "/user/account/change-password",
              "disabled": false,
              "position": 4,
              "badge": "key",
              "external": false,
              "target": "_self",
              "i18n": {
                "de": "Passwort Ã¤ndern"
              },
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            }
          ]
        },
        {
          "key": "PORTAL_FOOTER_MENU",
          "name": "Footer Menu",
          "disabled": false,
          "position": 2,
          "external": false,
          "target": "_self",
          "i18n": {},
          "roles": [
            "onecx-admin",
            "onecx-user"
          ],
          "children": [
            {
              "key": "PFM_CONTACT",
              "name": "Contact",
              "url": "/contact",
              "disabled": false,
              "position": 0,
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            },
            {
              "key": "PFM_IMPRINT",
              "name": "Impressum",
              "url": "/imprint",
              "disabled": false,
              "position": 1,
              "external": false,
              "target": "_self",
              "i18n": {},
              "roles": [
                "onecx-admin",
                "onecx-user"
              ],
              "children": []
            }
          ]
        }
      ],
      "mandatory": true
    }
  }
}

```

## Folder: onecx-local-env/versions/v1 (1 files)

### File: onecx-local-env/versions/v1/docker-compose.yaml

```yaml
