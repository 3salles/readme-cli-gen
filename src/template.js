import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export function loadTemplate(templatePath) {
    const defaultPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../templates/default.md");
    const filePath = templatePath ?? defaultPath;
    return fs.readFileSync(filePath, "utf-8");
}
export function buildContributorsTable(input) {
    const contributors = input
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
        const [name, user] = line.split("--");
        return { name: name?.trim(), user: user?.trim() };
    })
        .filter((c) => c.name && c.user);
    const rows = [];
    const chunkSize = 3;
    for (let i = 0; i < contributors.length; i += chunkSize) {
        const chunk = contributors.slice(i, i + chunkSize);
        const cells = chunk
            .map((c) => `
    <td align="center">
      <a href="https://github.com/${c.user}">
        <img src="https://avatars.githubusercontent.com/${c.user}" width="100px;" alt="${c.name}"/><br>
        <sub><b>${c.name}</b></sub>
      </a>
    </td>`)
            .join("");
        rows.push(`  <tr>${cells}\n  </tr>`);
    }
    return `<table>\n${rows.join("\n")}\n</table>`;
}
export function fillTemplate(template, data, extras = {}) {
    const allData = { ...data, ...extras };
    let result = template;
    for (const [key, value] of Object.entries(allData)) {
        if (typeof value === "string") {
            result = result.replaceAll(`{{${key}}}`, value);
        }
    }
    result = result.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) => {
        return allData[key] ? block : "";
    });
    return result;
}
export function detectMissingFields(template, data) {
    const matches = template.matchAll(/\{\{(\w+)\}\}/g);
    const missing = [];
    for (const match of matches) {
        const key = match[1];
        if (key !== undefined &&
            key !== "if" &&
            !(key in data) &&
            !missing.includes(key)) {
            missing.push(key);
        }
    }
    return missing;
}
export function buildTableOfContents(data) {
    const lines = [];
    lines.push("* [About the Project](#book-about-the-project)");
    if (data.usage_command)
        lines.push("  * [Usage](#coffee-usage)");
    lines.push("  * [Technologies](#computer-technologies)");
    lines.push("* [Installation](#bricks-installation)");
    lines.push("  * [Prerequisites](#construction-prerequisites)");
    lines.push("  * [Installing Dependencies](#construction-installing-dependencies)");
    if (data.env_vars)
        lines.push("  * [Environment Variables](#wrench-environment-variables)");
    if (data.has_docker)
        lines.push("  * [Running with Docker](#whale-running-with-docker)");
    if (data.run_command)
        lines.push("  * [Running](#arrow_forward-running)");
    if (data.test_command)
        lines.push("  * [Running Tests](#test_tube-running-tests)");
    lines.push("* [Contributing](#handshake-contributing)");
    if (data.contributors_table)
        lines.push("* [Contributors](#contributors)");
    if (data.license)
        lines.push("* [License](#page_facing_up-license)");
    if (data.author)
        lines.push("* [Author](#technologist-author)");
    return lines.join("\n");
}
//# sourceMappingURL=template.js.map