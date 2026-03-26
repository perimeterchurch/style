import { readdir, readFile, writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"

interface ManifestEntry {
  slug: string
  name: string
  description: string
  category: string
  install: string
  demoFile: string
}

async function collectDemos() {
  const registryDir = join(process.cwd(), "registry", "ui", "perimeter")
  const outputDir = join(process.cwd(), "src", "lib")
  const outputPath = join(outputDir, "demo-manifest.json")

  const files = await readdir(registryDir)
  const demoFiles = files.filter((f) => f.endsWith(".demo.tsx")).sort()

  const manifest: ManifestEntry[] = []

  for (const file of demoFiles) {
    const content = await readFile(join(registryDir, file), "utf-8")
    const slug = file.replace(".demo.tsx", "")

    const nameMatch = content.match(/name:\s*"([^"]+)"/)
    const descMatch = content.match(/description:\s*"([^"]+)"/)
    const catMatch = content.match(/category:\s*"([^"]+)"/)
    const installMatch = content.match(/install:\s*"([^"]+)"/)

    if (!nameMatch || !descMatch || !catMatch || !installMatch) {
      console.warn(`Skipping ${file}: missing meta fields`)
      continue
    }

    manifest.push({
      slug,
      name: nameMatch[1],
      description: descMatch[1],
      category: catMatch[1],
      install: installMatch[1],
      demoFile: `@registry/ui/perimeter/${slug}.demo`,
    })
  }

  manifest.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  await mkdir(outputDir, { recursive: true })
  await writeFile(outputPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(`Collected ${manifest.length} demo(s) → ${outputPath}`)
}

collectDemos().catch((err) => {
  console.error("Failed to collect demos:", err)
  process.exit(1)
})
