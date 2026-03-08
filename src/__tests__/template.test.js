import { describe, expect, it } from "vitest";
import { buildContributorsTable, buildTableOfContents, detectMissingFields, fillTemplate, } from "../template.js";
// ---------------------------------------------------------------------------
// fillTemplate
// ---------------------------------------------------------------------------
describe("fillTemplate", () => {
    it("replaces {{key}} placeholders with data values", () => {
        const result = fillTemplate("Hello {{name}}!", { project_name: "world", name: "world" });
        expect(result).toBe("Hello world!");
    });
    it("leaves unknown placeholders untouched", () => {
        const result = fillTemplate("Hello {{unknown}}!", {});
        expect(result).toBe("Hello {{unknown}}!");
    });
    it("renders {{#if key}}...{{/if}} block when key is present", () => {
        const result = fillTemplate("{{#if has_docker}}Docker section{{/if}}", {
            has_docker: "true",
        });
        expect(result).toBe("Docker section");
    });
    it("removes {{#if key}}...{{/if}} block when key is absent", () => {
        const result = fillTemplate("before{{#if has_docker}}Docker section{{/if}}after", {});
        expect(result).toBe("beforeafter");
    });
    it("substitutes extras values", () => {
        const result = fillTemplate("Value: {{custom}}", {}, { custom: "hello" });
        expect(result).toBe("Value: hello");
    });
    it("extras override data for the same key", () => {
        const result = fillTemplate("{{description}}", { description: "original" }, { description: "overridden" });
        expect(result).toBe("overridden");
    });
    it("replaces all occurrences of the same placeholder", () => {
        const result = fillTemplate("{{name}} and {{name}}", { project_name: "x", name: "x" });
        expect(result).toBe("x and x");
    });
});
// ---------------------------------------------------------------------------
// detectMissingFields
// ---------------------------------------------------------------------------
describe("detectMissingFields", () => {
    it("returns empty array when all fields are present", () => {
        const missing = detectMissingFields("{{name}} {{description}}", {
            project_name: "x",
            name: "x",
            description: "y",
        });
        expect(missing).toEqual([]);
    });
    it("returns field names missing from data", () => {
        const missing = detectMissingFields("{{name}} {{missing_field}}", {
            project_name: "x",
            name: "x",
        });
        expect(missing).toEqual(["missing_field"]);
    });
    it("ignores the 'if' keyword from conditional blocks", () => {
        const missing = detectMissingFields("{{#if has_docker}}text{{/if}}", {});
        expect(missing).not.toContain("if");
    });
    it("deduplicates repeated field names", () => {
        const missing = detectMissingFields("{{foo}} {{foo}} {{foo}}", {});
        expect(missing).toEqual(["foo"]);
    });
    it("does not list fields that are present in data", () => {
        const missing = detectMissingFields("{{description}}", { description: "hello" });
        expect(missing).toEqual([]);
    });
});
// ---------------------------------------------------------------------------
// buildContributorsTable
// ---------------------------------------------------------------------------
describe("buildContributorsTable", () => {
    it("returns an HTML table", () => {
        const result = buildContributorsTable("Alice--alice");
        expect(result).toContain("<table>");
        expect(result).toContain("</table>");
    });
    it("creates a cell with github avatar and link for each contributor", () => {
        const result = buildContributorsTable("Alice--alice");
        expect(result).toContain("https://github.com/alice");
        expect(result).toContain("https://avatars.githubusercontent.com/alice");
        expect(result).toContain("Alice");
    });
    it("fits up to 3 contributors in a single row", () => {
        const input = "A--a\nB--b\nC--c";
        const result = buildContributorsTable(input);
        const rowCount = (result.match(/<tr>/g) ?? []).length;
        expect(rowCount).toBe(1);
    });
    it("wraps a 4th contributor into a second row", () => {
        const input = "A--a\nB--b\nC--c\nD--d";
        const result = buildContributorsTable(input);
        const rowCount = (result.match(/<tr>/g) ?? []).length;
        expect(rowCount).toBe(2);
    });
    it("ignores lines without the -- separator", () => {
        const result = buildContributorsTable("invalid line\nAlice--alice");
        expect(result).toContain("alice");
        expect(result).not.toContain("invalid");
    });
    it("trims whitespace from name and username", () => {
        const result = buildContributorsTable("  Alice  --  alice  ");
        expect(result).toContain(">Alice<");
        expect(result).toContain("github.com/alice");
    });
});
// ---------------------------------------------------------------------------
// buildTableOfContents
// ---------------------------------------------------------------------------
describe("buildTableOfContents", () => {
    it("always includes base sections", () => {
        const toc = buildTableOfContents({});
        expect(toc).toContain("About the Project");
        expect(toc).toContain("Installation");
        expect(toc).toContain("Contributing");
    });
    it("includes Usage subsection when usage_command is set", () => {
        const toc = buildTableOfContents({ usage_command: "npm start" });
        expect(toc).toContain("Usage");
    });
    it("omits Usage subsection when usage_command is absent", () => {
        const toc = buildTableOfContents({});
        expect(toc).not.toContain("Usage");
    });
    it("includes Environment Variables when env_vars is set", () => {
        const toc = buildTableOfContents({ env_vars: "DATABASE_URL" });
        expect(toc).toContain("Environment Variables");
    });
    it("omits Environment Variables when env_vars is absent", () => {
        const toc = buildTableOfContents({});
        expect(toc).not.toContain("Environment Variables");
    });
    it("includes Docker section when has_docker is set", () => {
        const toc = buildTableOfContents({ has_docker: "true" });
        expect(toc).toContain("Docker");
    });
    it("omits Docker section when has_docker is absent", () => {
        const toc = buildTableOfContents({});
        expect(toc).not.toContain("Docker");
    });
    it("includes Contributors when contributors_table is set", () => {
        const toc = buildTableOfContents({ contributors_table: "<table></table>" });
        expect(toc).toContain("Contributors");
    });
    it("includes License when license is set", () => {
        const toc = buildTableOfContents({ license: "MIT" });
        expect(toc).toContain("License");
    });
    it("includes Author when author is set", () => {
        const toc = buildTableOfContents({ author: "Alice" });
        expect(toc).toContain("Author");
    });
    it("omits License and Author when not set", () => {
        const toc = buildTableOfContents({});
        expect(toc).not.toContain("License");
        expect(toc).not.toContain("Author");
    });
    it("includes Running Tests when test_command is set", () => {
        const toc = buildTableOfContents({ test_command: "npm test" });
        expect(toc).toContain("Running Tests");
    });
    it("omits Running Tests when test_command is absent", () => {
        const toc = buildTableOfContents({});
        expect(toc).not.toContain("Running Tests");
    });
});
//# sourceMappingURL=template.test.js.map