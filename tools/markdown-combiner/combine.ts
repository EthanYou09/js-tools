#!/usr/bin/env bun

/**
 * @name Markdown Combiner
 * @description A Bun.js CLI tool to find and combine multiple Markdown files into a single file.
 *
 * @usage
 * # Default: Searches in the current directory (`./`) and outputs to `./combined.md`
 * bun run combine.ts
 *
 * # Specify source directory
 * bun run combine.ts --src ./path/to/docs
 *
 * # Specify output file
 * bun run combine.ts --out ./dist/bundle.md
 *
 * # Specify both source and output
 * bun run combine.ts --src ./my-docs --out ./bundle.md
 */

import { readdir, stat, exists } from 'node:fs/promises';
import { resolve, join } from 'path';

// --- Main Execution ---
(async () => {
  try {
    // 1. Parse Command-Line Arguments
    const args = Bun.argv;
    const srcDir = getArgValue(args, '--src', '.');
    const outFile = getArgValue(args, '--out', './combined.md');

    const sourcePath = resolve(process.cwd(), srcDir);
    const outputPath = resolve(process.cwd(), outFile);

    console.log(`🔍 Searching for Markdown files in '${sourcePath}'...`);

    // 2. Validate Source Directory
    if (!(await exists(sourcePath))) {
      throw new Error(`Source directory not found: ${sourcePath}`);
    }
    const sourceStats = await stat(sourcePath);
    if (!sourceStats.isDirectory()) {
      throw new Error(`Source path is not a directory: ${sourcePath}`);
    }

    // 3. Smart File Discovery (Recursive)
    const allFiles = await readdir(sourcePath, { recursive: true });
    const markdownFiles = allFiles
      .filter((file): file is string => typeof file === 'string' && (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.markdown')))
      .sort(); // Sort for predictable order

    // 4. Handle No Files Found
    if (markdownFiles.length === 0) {
      console.warn(`⚠️ No Markdown files found in '${sourcePath}'. Exiting.`);
      return;
    }

    console.log(`📚 Found ${markdownFiles.length} files to combine.`);

    // 5. Intelligent Concatenation
    const combinedContent: string[] = [`# Combined Documentation\n`];

    for (const relativePath of markdownFiles) {
      console.log(`   ↳ Combining: ${relativePath}`);
      const fullPath = join(sourcePath, relativePath);

      const separator = `\n---\n## Source: ${relativePath}\n---\n`;
      const fileContent = await Bun.file(fullPath).text();

      combinedContent.push(separator, fileContent);
    }

    // 6. Write the final output
    await Bun.write(outputPath, combinedContent.join('\n'));

    console.log(`\n✅ Successfully combined all files into '${outputPath}'!`);
  } catch (error) {
    // 7. Robust Error Handling
    if (error instanceof Error) {
      console.error(`\n❌ An error occurred: ${error.message}`);
    } else {
      console.error('\n❌ An unknown error occurred.', error);
    }
    process.exit(1);
  }
})();

// --- Helper Functions ---

/**
 * Parses command-line arguments to find the value for a given flag.
 * @param args - The array of arguments from `Bun.argv`.
 * @param flag - The flag to look for (e.g., "--src").
 * @param defaultValue - The value to return if the flag is not found.
 * @returns The value of the argument or the default value.
 */
function getArgValue(args: string[], flag: string, defaultValue: string): string {
  const flagIndex = args.indexOf(flag);
  if (flagIndex !== -1 && flagIndex + 1 < args.length) {
    return args[flagIndex + 1] ?? defaultValue;
  }
  return defaultValue;
}
