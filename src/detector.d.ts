export interface ProjectInfo {
    name?: string;
    description?: string;
    author?: string;
    githubUser?: string;
    license?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    envVars?: string[];
    dockerPort?: string;
    hasDocker?: boolean;
    testCommand?: string;
}
export declare function detectProject(projectPath: string): ProjectInfo;
//# sourceMappingURL=detector.d.ts.map