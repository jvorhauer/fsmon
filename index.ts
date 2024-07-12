import { unlinkSync, watch } from "node:fs"
import { $, type ShellError } from "bun"

const here = process.env.ICA_DIR as string

const watcher = watch(here, async (event, filename) => {
	console.info(`Detected ${event} on ${here}/${filename}`)
	if (filename?.endsWith(".ica")) {
		const file = Bun.file(`${here}/${filename}`)
		console.info(`Checking size of ${file.name}: ${file.size} bytes`)
		if (file.size > 0) {
			console.info(`Reading content of ${file.name}...`)
			const text = await file.text()
			const replaced = text.replace("DesktopViewer-ForceFullScreenStartup=On", "DesktopViewer-ForceFullScreenStartup=Off")
			console.info(`Writing replaced content to /tmp/${filename}...`)
			Bun.write(`/tmp/${filename}`, replaced)

			console.info(`Opening /tmp/${filename} with default application...`)
			try {
				await $`open /tmp/${filename}`
			} catch (e) {
				const se = e as ShellError
				console.error(`Opening ${filename} failed with exit code ${se.exitCode}`)
				console.error(se.stderr.toString())
				console.error(se.stdout.toString())
			}

			if (await file.exists()) {
				console.info(`Deleting ${here}/${filename}...`)
				unlinkSync(`${here}/${filename}`)
			}
		}
	}
})

console.info(`Started watcher on ${here}`)

process.on("SIGINT", () => {
	console.info("Closing watcher...")
	watcher.close()
	process.exit(0)
})
