import type { ProjectInfo } from "./detector.js";
export interface TemplateData extends ProjectInfo {
    tech_list?: string;
    project_name?: string;
    env_vars?: string;
    has_docker?: string;
    docker_port?: string;
    github_user?: string;
    contributors_table?: string;
    license_badge?: string;
    table_of_contents?: string;
    usage_command?: string;
    test_command?: string;
    run_command?: string;
}
export declare function loadTemplate(templatePath?: string): string;
export declare function buildContributorsTable(input: string): string;
export declare function fillTemplate(template: string, data: TemplateData, extras?: Record<string, string>): string;
export declare function detectMissingFields(template: string, data: TemplateData): string[];
export declare function buildTableOfContents(data: TemplateData): string;
//# sourceMappingURL=template.d.ts.map