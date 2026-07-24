import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function getSofficeCandidates() {
  return [
    process.env.LIBREOFFICE_PATH,
    "soffice",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/usr/bin/soffice",
    "/usr/local/bin/soffice",
  ].filter((candidate): candidate is string => Boolean(candidate));
}

export async function convertDocxToPdf(buffer: Buffer) {
  const workDirectory = await mkdtemp(join(tmpdir(), "osai-docx-"));
  const inputPath = join(workDirectory, "resume.docx");
  const outputPath = join(workDirectory, "resume.pdf");
  let lastError: unknown;

  try {
    await writeFile(inputPath, buffer);

    for (const executable of getSofficeCandidates()) {
      try {
        await execFileAsync(
          executable,
          [
            "--headless",
            `-env:UserInstallation=file://${join(workDirectory, "profile")}`,
            "--convert-to",
            "pdf",
            "--outdir",
            workDirectory,
            inputPath,
          ],
          { timeout: 45_000 },
        );

        return await readFile(outputPath);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("LibreOffice is not available.");
  } finally {
    await rm(workDirectory, { force: true, recursive: true });
  }
}
