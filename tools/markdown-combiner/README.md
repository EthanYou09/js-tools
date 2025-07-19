    # Markdown Combiner

    A script to find all Markdown files (`.md`, `.markdown`) within a specified source folder, combine their contents into a single Markdown file, and save it to a specified output path.

    ## Usage

    You can run this tool using the `bun run` script defined in the root `package.json`.

    ```bash
    # The first argument is the script name, followed by --
    # to pass arguments to the script itself.
    bun run combine-md -- [options]
    ```

    ### Options

    -   `--src <path>`: The source directory to search for Markdown files.
        -   **Default:** `.` (the current directory)
    -   `--out <path>`: The path for the final combined output file.
        -   **Default:** `./combined.md`

    ### Examples

    **Default Behavior**
    (Searches in the current folder, outputs to `combined.md`)
    ```bash
    bun run combine-md
    ```

    **Specify Source Directory**
    ```bash
    bun run combine-md -- --src ./my-documentation
    ```

    **Specify Both Source and Output**
    ```bash
    bun run combine-md -- --src ./docs --out ./dist/bundle.md
    ```
