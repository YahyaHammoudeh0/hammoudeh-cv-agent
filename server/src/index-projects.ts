import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const DOCUMENTS_DIR = process.env.PROJECT_INDEX_DOCUMENTS_DIR ?? "/Users/yahya/Documents";
const GITHUB_OWNER = process.env.PROJECT_INDEX_GITHUB_OWNER ?? "YahyaHammoudeh0";
const OUTPUT_FILE = join(REPO_ROOT, "server", "knowledge", "99_project_index.md");
const MAX_DEPTH = 4;
const MAX_SNIPPET_CHARS = 1800;

const ignoredDirs = new Set([
  ".git",
  ".next",
  ".pytest_cache",
  ".venv",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
  "venv",
]);

const markerFiles = new Set([
  "Cargo.toml",
  "go.mod",
  "package.json",
  "pom.xml",
  "pyproject.toml",
  "README.md",
  "README.MD",
  "README.txt",
  "PROJECT.md",
]);

interface LocalProject {
  name: string;
  path: string;
  markers: string[];
  snippets: string[];
}

interface GithubRepo {
  name: string;
  description?: string;
  url: string;
  isPrivate: boolean;
  primaryLanguage?: { name?: string };
  updatedAt?: string;
  readme?: string;
}

function walk(dir: string, depth = 0, found = new Set<string>()) {
  if (depth > MAX_DEPTH) return found;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  const names = new Set(entries.map((entry) => entry.name));
  if ([...markerFiles].some((marker) => names.has(marker))) {
    found.add(dir);
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredDirs.has(entry.name)) continue;
    walk(join(dir, entry.name), depth + 1, found);
  }
  return found;
}

function readSnippet(path: string) {
  try {
    return readFileSync(path, "utf8")
      .replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .slice(0, MAX_SNIPPET_CHARS)
      .trim();
  } catch {
    return "";
  }
}

function readPackageSummary(path: string) {
  try {
    const pkg = JSON.parse(readFileSync(path, "utf8")) as {
      name?: string;
      description?: string;
      scripts?: Record<string, string>;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = Object.keys({
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }).slice(0, 18);
    return [
      pkg.name ? `Package: ${pkg.name}` : "",
      pkg.description ? `Description: ${pkg.description}` : "",
      deps.length ? `Notable packages: ${deps.join(", ")}` : "",
      pkg.scripts ? `Scripts: ${Object.keys(pkg.scripts).slice(0, 10).join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return "";
  }
}

function collectLocalProjects(): LocalProject[] {
  const roots = [...walk(DOCUMENTS_DIR)];
  return roots
    .map((root) => {
      const entries = readdirSync(root);
      const markers = entries.filter((name) => markerFiles.has(name));
      const snippets: string[] = [];
      for (const marker of markers) {
        const path = join(root, marker);
        if (marker === "package.json") {
          const summary = readPackageSummary(path);
          if (summary) snippets.push(`${marker}\n${summary}`);
        } else {
          const snippet = readSnippet(path);
          if (snippet) snippets.push(`${marker}\n${snippet}`);
        }
      }
      return {
        name: basename(root),
        path: root,
        markers,
        snippets,
      };
    })
    .filter((project) => project.snippets.length > 0)
    .sort((a, b) => a.path.localeCompare(b.path));
}

function ghJson(args: string[]) {
  try {
    return execFileSync("gh", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function collectGithubRepos(): GithubRepo[] {
  const raw = ghJson([
    "repo",
    "list",
    GITHUB_OWNER,
    "--limit",
    "200",
    "--json",
    "name,description,url,isPrivate,primaryLanguage,updatedAt",
  ]);
  if (!raw) return [];

  const repos = JSON.parse(raw) as GithubRepo[];
  return repos
    .map((repo) => {
      const readmeRaw = ghJson([
        "api",
        `repos/${GITHUB_OWNER}/${repo.name}/readme`,
        "--jq",
        ".content",
      ]);
      const readme = readmeRaw
        ? Buffer.from(readmeRaw.replace(/\s/g, ""), "base64")
            .toString("utf8")
            .slice(0, MAX_SNIPPET_CHARS)
            .trim()
        : "";
      return { ...repo, readme };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function section(title: string, body: string) {
  return `## ${title}\n${body.trim()}\n`;
}

function renderLocal(projects: LocalProject[]) {
  return projects
    .map((project) =>
      section(
        project.name,
        [
          `Path: ${relative(DOCUMENTS_DIR, project.path) || "."}`,
          `Markers: ${project.markers.join(", ")}`,
          project.snippets.map((snippet) => `\n${snippet}`).join("\n\n"),
        ].join("\n"),
      ),
    )
    .join("\n");
}

function renderGithub(repos: GithubRepo[]) {
  return repos
    .map((repo) =>
      section(
        repo.name,
        [
          `URL: ${repo.url}`,
          `Visibility: ${repo.isPrivate ? "private" : "public"}`,
          repo.primaryLanguage?.name ? `Primary language: ${repo.primaryLanguage.name}` : "",
          repo.description ? `Description: ${repo.description}` : "",
          repo.updatedAt ? `Updated: ${repo.updatedAt}` : "",
          repo.readme ? `\nREADME excerpt:\n${repo.readme}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    )
    .join("\n");
}

function main() {
  if (!existsSync(DOCUMENTS_DIR) || !statSync(DOCUMENTS_DIR).isDirectory()) {
    throw new Error(`Documents directory not found: ${DOCUMENTS_DIR}`);
  }

  const localProjects = collectLocalProjects();
  const githubRepos = collectGithubRepos();
  const generatedAt = new Date().toISOString();

  const markdown = [
    "# Auto Project Index",
    "",
    `Generated: ${generatedAt}`,
    "",
    "This file is generated from safe project metadata, README-style docs, package manifests, and GitHub repository metadata. It intentionally excludes source dumps, .env files, build outputs, node_modules, and git internals.",
    "",
    "# Local Documents Projects",
    renderLocal(localProjects),
    "# GitHub Repositories",
    renderGithub(githubRepos),
  ].join("\n");

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, markdown, "utf8");
  console.log(
    `Indexed ${localProjects.length} local projects and ${githubRepos.length} GitHub repositories into ${OUTPUT_FILE}`,
  );
}

main();
