import type { ProjectInfo } from "./detector.js";
export declare function promptWithCancel<T>(promise: Promise<T | symbol>): Promise<T>;
export declare function promptDescription(info: ProjectInfo): Promise<string>;
export declare function promptAuthor(info: ProjectInfo): Promise<{
    author: string | undefined;
    githubUser: string | undefined;
}>;
export declare function promptDocker(info: ProjectInfo): Promise<{
    hasDocker: string | undefined;
    dockerPort: string | undefined;
}>;
export declare function promptEnvVars(info: ProjectInfo): Promise<string | undefined>;
export declare function promptContributors(): Promise<string | undefined>;
export declare function promptLicense(info: ProjectInfo): Promise<string | undefined>;
export declare function promptTests(info: ProjectInfo): Promise<string | undefined>;
export declare function promptLocalInstall(info: ProjectInfo): Promise<string | undefined>;
export declare function promptUsage(info: ProjectInfo): Promise<string | undefined>;
//# sourceMappingURL=prompts.d.ts.map