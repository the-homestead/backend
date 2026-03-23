import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/organization/access';

// ── Org-scoped resource + action registry ──────────────────────────────────────
//
// NOTE: defaultStatements here is from the ORGANIZATION plugin, not the admin
// plugin. It includes the built-in org resources:
//   organization: ["update", "delete"]
//   member:       ["create", "update", "delete"]
//   invitation:   ["create", "cancel", "revoke"]
//
const orgStatement = {
    ...defaultStatements,

    // Org-owned projects — scoped to what members can do within the org context.
    // Fine-grained enforcement (e.g. which specific project) is handled at the
    // query/service layer using the global role from the IAM server.
    project: [
        'create', // create a project under the org
        'read', // read org project listings (public projects are readable anyway)
        'update', // edit project metadata (contributor+)
        'publish', // publish a project under the org name (publisher+)
        'delete', // soft-delete an org project (publisher+ or org owner)
        'transfer', // transfer a project to another org member or sub-team (org owner only)
    ],

    // Sub-team management within the org
    team: [
        'create', // create a sub-team within the org (admin+)
        'update', // rename or reconfigure a sub-team (admin+)
        'delete', // remove a sub-team (admin+)
        'manage-members', // add/remove users from a sub-team (admin+)
    ],
} as const;

export const orgAc = createAccessControl(orgStatement);

// ── Org roles ──────────────────────────────────────────────────────────────────
//
// These REPLACE the default better-auth org roles (owner, admin, member).
// Passed to the organization plugin config on both server and client.
//
// Global platform roles (moderator, admin, etc.) are separate and still enforced
// by the IAM server. These org roles only gate actions within an org context.

/**
 * Regular org member — can read and contribute content but cannot publish
 * or manage the org itself.
 */
export const orgMember = orgAc.newRole({
    project: ['create', 'read', 'update'],
    // no org management, no team management, no publish
});

/**
 * Contributor — same as member but explicitly named for orgs that want
 * a semantic distinction (e.g. external contributors vs internal members).
 * Functionally identical to member for now; extend as needed.
 */
export const orgContributor = orgAc.newRole({
    ...orgMember.statements,
});

/**
 * Publisher — trusted org member who can publish projects under the org name.
 * Can also soft-delete org projects they created.
 * Cannot manage the org, teams, or transfer ownership.
 */
export const orgPublisher = orgAc.newRole({
    ...orgMember.statements,
    project: ['create', 'read', 'update', 'publish', 'delete'],
    invitation: ['create'], // can invite new members
});

/**
 * Org admin — manages the org structure, teams, and members.
 * Can do everything a publisher can, plus full team and member management.
 * Cannot delete the org or transfer org ownership.
 */
export const orgAdmin = orgAc.newRole({
    ...adminAc.statements, // built-in org admin perms (org update, member CRUD, invite CRUD)
    project: ['create', 'read', 'update', 'publish', 'delete'],
    team: ['create', 'update', 'delete', 'manage-members'],
});

/**
 * Org owner — full control over the org including ownership transfer and deletion.
 * Inherits everything from admin plus project transfer and org delete.
 */
export const orgOwner = orgAc.newRole({
    ...orgAdmin.statements,
    project: [...orgAdmin.statements.project, 'transfer'],
    organization: ['update', 'delete'], // can delete or rename the org
});

// ── Plugin config reference ────────────────────────────────────────────────────
//
// ── Types ──────────────────────────────────────────────────────────────────────
//
// Use these types in services — they match the keys registered in the plugin
// config (owner, admin, publisher, contributor, member), NOT the export names
// (orgOwner, orgAdmin etc.).

export type OrgRole = 'owner' | 'admin' | 'publisher' | 'contributor' | 'member';
export type OrgRoleOrArray = OrgRole | OrgRole[];

// SERVER (auth.ts):
//
// import { organization } from "better-auth/plugins";
// import { orgAc, orgOwner, orgAdmin, orgPublisher, orgContributor, orgMember } from "./org-access";
//
// organization({
//   teams: {
//     enabled: true,
//   },
//   ac: orgAc,
//   roles: {
//     owner:       orgOwner,
//     admin:       orgAdmin,
//     publisher:   orgPublisher,
//     contributor: orgContributor,
//     member:      orgMember,
//   },
// })
//
// CLIENT (auth-client.ts):
//
// import { organizationClient } from "better-auth/client/plugins";
// import { orgAc, orgOwner, orgAdmin, orgPublisher, orgContributor, orgMember } from "./org-access";
//
// organizationClient({
//   ac: orgAc,
//   roles: {
//     owner:       orgOwner,
//     admin:       orgAdmin,
//     publisher:   orgPublisher,
//     contributor: orgContributor,
//     member:      orgMember,
//   },
// })
