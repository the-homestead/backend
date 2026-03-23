import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultAc, defaultStatements } from 'better-auth/plugins/admin/access';

// ── Resource + action registry ─────────────────────────────────────────────────
const accessStatement = {
    ...defaultStatements,

    // The mod/addon/project itself
    project: [
        'create', // any registered user can create a project (starts as draft)
        'read', // anyone including guests can read public project metadata
        'update-own', // author edits their own project metadata (title, description, tags etc.)
        'update-any', // staff can edit any project (e.g. to fix bad metadata or policy violations)
        'delete-own', // author soft-deletes their own project (can be restored within grace period)
        'delete-any', // staff can hard-delete (purge) or restore any project
        'publish', // flip project from draft → publicly listed (may be gated behind review)
        'unpublish', // pull a project from listing without deleting it (staff or author)
        'feature', // pin project to homepage / trending section (staff only)
        'transfer', // reassign project ownership to another user or org (password-verified at middleware layer)
        'share', // generate shareable or embeddable links for a project
    ],

    // Individual releases attached to a project
    version: [
        'create', // author creates a new version (starts as draft, not publicly visible)
        'read', // anyone can read version metadata; actual file download is gated by file permissions
        'update-own', // author edits their own version (changelog, attached files, compatibility tags etc.)
        'update-any', // staff can edit any version (e.g. to correct bad metadata or flag a bad release)
        'delete-own', // author soft-deletes their own version (can be restored within grace period)
        'delete-any', // staff can hard-delete (purge) or restore any version
        'publish', // author lists the version publicly (makes it visible and downloadable)
        'yank', // mark a version as broken or recalled — stays visible with a warning banner but discouraged from download
    ],

    // The actual uploaded file artifact(s) attached to a version
    file: [
        'upload', // author uploads a file and attaches it to a version
        'read', // download/access a file; can differ from version visibility (e.g. server jars gated separately)
        'replace', // swap out a file on a version without deleting the version; tracked separately for audit trail
        'delete-own', // author removes a file from their own version (e.g. to replace a bad build)
        'delete-any', // staff removes a file from any version without deleting the version itself
        'scan', // trigger AV / hash integrity scan on a file (staff only)
    ],

    // User comments and reviews on projects
    comment: [
        'create', // any logged-in user can post a comment (may be held for approval based on trust level)
        'read', // anyone can read approved comments; held comments are only visible to author and staff
        'update-own', // commenter edits their own comment (edit history tracked)
        'delete-own', // commenter soft-deletes their own comment (mod/staff can still see it)
        'delete-any', // staff removes any comment (soft or hard delete depending on severity)
        'approve', // mod+ approves a held comment from a new or untrusted user
        'pin', // pin a comment to the top of the thread (project author or staff)
        'lock', // lock a comment thread to prevent further replies (staff only)
    ],

    // Abuse reports, DMCA submissions, and content flag tickets
    report: [
        'create', // any logged-in user can file a report against a project, version, file, or comment
        'read-own', // reporter can see the status and updates on their own submitted report
        'read-any', // staff can see all reports; once a report is escalated, mod visibility is pulled at query layer
        'assign', // mod claims a report/ticket to manage it (prevents duplicate handling)
        'warn', // issue a formal warning to a user tied to a report (mod+)
        'escalate', // moderator bumps a report to admin — mod loses read visibility once escalated unless re-added by admin+
        'resolve', // admin+ closes a report with a final verdict (approved, dismissed, actioned)
    ],

    // Curated mod lists and modpacks created by users or staff
    collection: [
        'create', // any registered user can create a collection
        'read', // collections are public; project visibility within them is still gated by each project's own permissions
        'update-own', // collection author edits metadata (title, description) and manages the project list
        'delete-own', // collection author soft-deletes their own collection
        'delete-any', // staff can delete any collection being abused (does not delete the projects inside it)
        'feature', // staff pin a collection to homepage or curated sections
        'add-project', // add a project to a collection (collection author or project author depending on collection settings)
        'remove-project', // remove a project from a collection
    ],

    // Content taxonomy — game versions, mod loaders (Forge, Fabric etc.), categories
    tag: [
        'read', // anyone can read tags
        'create', // staff only — create a new tag
        'update', // staff only — rename or reconfigure a tag
        'delete', // staff only — remove a tag (cascades to tagged content)
    ],

    // Platform and project analytics — download counts, referrers, geo breakdowns
    analytics: [
        'read-own', // project author views stats for their own projects
        'read-any', // staff views platform-wide analytics
        'export', // export analytics as CSV/JSON (author+ for own, staff for platform-wide)
    ],
} as const;

const ac = createAccessControl(accessStatement);

// ── Roles ──────────────────────────────────────────────────────────────────────

/** Unauthenticated / logged-out visitor — read-only across all public resources */
export const guestRole = ac.newRole({
    project: ['read'],
    version: ['read'],
    file: ['read'],
    comment: ['read'],
    collection: ['read'],
    tag: ['read'],
});

/** Standard registered user — can create and manage their own content */
export const userRole = ac.newRole({
    ...defaultAc.statements,
    project: ['create', 'read', 'update-own', 'delete-own', 'publish', 'transfer', 'share'],
    version: ['create', 'read', 'update-own', 'delete-own', 'publish', 'yank'],
    file: ['upload', 'read', 'replace', 'delete-own'],
    comment: ['create', 'read', 'update-own', 'delete-own'],
    report: ['create', 'read-own'],
    collection: ['create', 'read', 'update-own', 'delete-own', 'add-project', 'remove-project'],
    tag: ['read'],
    analytics: ['read-own'],
});

/**
 * Verified / trusted publisher.
 * Gets analytics export on top of standard user perms.
 * Also first to receive beta feature access (handled at app layer, not here).
 */
export const authorRole = ac.newRole({
    ...userRole.statements,
    analytics: ['read-own', 'export'],
});

/**
 * Tier 1 monthly subscriber.
 * Permissions mirror standard user — actual VIP benefits (no rate limits, no ads,
 * multi-threaded downloads etc.) are enforced at the app/middleware layer, not here.
 */
export const vip_oneRole = ac.newRole({
    ...userRole.statements,
});

/**
 * Tier 2 monthly subscriber.
 * Same as vip_one at the permission layer — higher-tier benefits handled at app layer.
 */
export const vip_twoRole = ac.newRole({
    ...userRole.statements,
});

/**
 * Content moderator — manages reports, warnings, and content moderation.
 * Can escalate reports to admin but loses visibility on that report once escalated
 * unless an admin/owner explicitly re-adds them.
 * Cannot resolve reports, manage financials, or access platform-wide analytics.
 */
export const moderatorRole = ac.newRole({
    ...userRole.statements,
    project: [...userRole.statements.project, 'update-any', 'unpublish'],
    version: [...userRole.statements.version, 'update-any', 'delete-any'],
    file: [...userRole.statements.file, 'delete-any', 'scan'],
    comment: [...userRole.statements.comment, 'delete-any', 'approve', 'pin', 'lock'],
    report: ['create', 'read-own', 'read-any', 'assign', 'warn', 'escalate'],
    collection: [...userRole.statements.collection, 'delete-any'],
    tag: ['read'],
    analytics: ['read-own'],
});

/**
 * Site administrator — handles abuse, DMCA, user management, and full content control.
 * Cannot access server-level controls, infrastructure config, or platform financials
 * (those are developer/owner only and live outside this permission schema).
 */
export const adminRole = ac.newRole({
    ...adminAc.statements,
    project: [
        'create',
        'read',
        'update-own',
        'update-any',
        'delete-own',
        'delete-any',
        'publish',
        'unpublish',
        'feature',
        'transfer',
        'share',
    ],
    version: [
        'create',
        'read',
        'update-own',
        'update-any',
        'delete-own',
        'delete-any',
        'publish',
        'yank',
    ],
    file: ['upload', 'read', 'replace', 'delete-own', 'delete-any', 'scan'],
    comment: ['create', 'read', 'update-own', 'delete-any', 'approve', 'pin', 'lock'],
    report: ['create', 'read-own', 'read-any', 'assign', 'warn', 'escalate', 'resolve'],
    collection: [
        'create',
        'read',
        'update-own',
        'delete-any',
        'feature',
        'add-project',
        'remove-project',
    ],
    tag: ['read', 'create', 'update', 'delete'],
    analytics: ['read-own', 'read-any', 'export'],
});

/**
 * Developer — full access identical to owner at the permission layer.
 * Server-level control, infrastructure, and financial access are gated
 * outside this schema (admin panel + deployment layer).
 */
export const developerRole = ac.newRole({
    ...adminRole.statements,
});

/** Platform owner — unrestricted. Inherits everything from developer/admin. */
export const ownerRole = ac.newRole({
    ...developerRole.statements,
});

const roles = {
    guestRole,
    userRole,
    authorRole,
    vip_oneRole,
    vip_twoRole,
    moderatorRole,
    adminRole,
    developerRole,
    ownerRole,
} as const;

export const RoleEnum = Object.freeze(
    Object.fromEntries(Object.keys(roles).map((k) => [k, k])),
) as { [K in keyof typeof roles]: K };
export type Role = (typeof roles)[keyof typeof roles];
export type AppRole = keyof typeof roles;
export type RoleOrArray = AppRole | AppRole[];
