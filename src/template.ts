import fs from "fs";
import path from "path";
import type { ProjectInfo } from "./detector.js";

export interface TemplateData extends ProjectInfo {
  [key: string]: unknown;
  tech_list?: string;
  project_name?: string;
  env_vars?: string;
  has_docker?: string;
  docker_port?: string;
  github_user?: string;
}

export function loadTemplate(templatePath?: string): string {
  const defaultPath = path.resolve("templates/default.md");
  const filePath = templatePath ?? defaultPath;
  return fs.readFileSync(filePath, "utf-8");
}

export function fillTemplate(template: string, data: TemplateData): string {
  let result = template;

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      result = result.replaceAll(`{{${key}}}`, value);
    }
  }

  result = result.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, block) => {
      const value = data[key as keyof TemplateData];
      return value ? block : "";
    },
  );

  return result;
}

export function detectMissingFields(
  template: string,
  data: TemplateData,
): string[] {
  const matches = template.matchAll(/\{\{(\w+)\}\}/g);
  const missing: string[] = [];

  for (const match of matches) {
    const key = match[1];
    if (
      key !== undefined &&
      key !== "if" &&
      !(key in data) &&
      !missing.includes(key)
    ) {
      missing.push(key);
    }
  }

  return missing;
}
