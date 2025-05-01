import { expect, test, mock } from "bun:test"
import { join } from "node:path"

// Create a mock function for unlink with proper typing
const mockUnlink = mock((_path: string, callback: (error: Error | null) => void) => {
	callback(null)
})

// Mock the unlink function
mock.module("node:fs", () => ({
	unlink: mockUnlink,
}))

test("del function deletes file successfully", async () => {
	const testFile = join("/tmp", "test.ica")

	// Import the module after mocking
	const { del } = await import("./parcl")

	// Call the del function
	del(testFile)

	// Verify unlink was called with the correct argument
	expect(mockUnlink).toHaveBeenCalledWith(testFile, expect.any(Function))
})

test("del function handles errors appropriately", async () => {
	const testFile = join("/tmp", "nonexistent.ica")
	const mockError = new Error("File not found")

	// Set up the mock to simulate an error
	mockUnlink.mockImplementationOnce(
		(_path: string, callback: (error: Error | null) => void) => {
			callback(mockError)
		}
	)

	// Import the module after mocking
	const { del } = await import("./parcl")

	// Call the del function
	del(testFile)

	// Verify unlink was called with the correct argument
	expect(mockUnlink).toHaveBeenCalledWith(testFile, expect.any(Function))
})
