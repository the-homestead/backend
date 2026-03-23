import { describe, it, expect, beforeAll } from "bun:test"
import type { TestHelpers } from "better-auth/plugins"
import { auth } from "src/modules/auth/auth.main"

describe("protected route", () => {
    let test: TestHelpers

    beforeAll(async () => {
        const ctx = await auth.$context
        test = ctx.test
    })

    it("should return user data for authenticated request", async () => {
        // Setup
        const user = test.createUser({ email: "test@example.com" })
        await test.saveUser(user)

        // Get authenticated headers
        const headers = await test.getAuthHeaders({ userId: user.id })

        // Test authenticated request
        const session = await auth.api.getSession({ headers })
        expect(session?.user.id).toBe(user.id)

        // Cleanup
        await test.deleteUser(user.id)
    })
})