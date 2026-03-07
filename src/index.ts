import * as p from "@clack/prompts";
import fs from "fs";
import path from "path";
import { detectProject } from "./detector.js";
import type { TemplateData } from "./template.js";
import { detectMissingFields, fillTemplate, loadTemplate } from "./template.js";

async function main() {
  p.intro("📝 README Generator");

  const projectPath = process.argv[2] ?? process.cwd();
  p.log.info(`Lendo projeto em: ${projectPath}`);

  const info = detectProject(projectPath);

  // Tech list
  const allDeps = {
    ...info.dependencies,
    ...info.devDependencies,
  };
  const techList = Object.keys(allDeps)
    .map((dep) => `* [${dep}](https://npmjs.com/package/${dep})`)
    .join("\n");

  // Descrição
  let description = info.description;

  if (description) {
    const useDetected = await p.confirm({
      message: `Descrição detectada: "${description}". Deseja usá-la?`,
    });

    if (p.isCancel(useDetected)) {
      p.cancel("Operação cancelada.");
      process.exit(0);
    }

    if (!useDetected) description = undefined;
  }

  if (!description) {
    const written = await p.text({
      message: "Escreva a descrição do projeto:",
      placeholder: "Um projeto incrível que faz...",
      validate: (v) =>
        !v || v.trim() === "" ? "A descrição não pode ser vazia." : undefined,
    });

    if (p.isCancel(written)) {
      p.cancel("Operação cancelada.");
      process.exit(0);
    }

    description = written;
  }

  // Autor
  const showAuthor = await p.confirm({
    message: "Deseja exibir o autor no README?",
  });

  if (p.isCancel(showAuthor)) {
    p.cancel("Operação cancelada.");
    process.exit(0);
  }

  let author: string | undefined;
  let githubUser: string | undefined;

  if (showAuthor) {
    author = info.author;
    githubUser = info.githubUser;

    if (author) {
      const useDetected = await p.confirm({
        message: `Autor detectado: "${author}". Deseja usá-lo?`,
      });

      if (p.isCancel(useDetected)) {
        p.cancel("Operação cancelada.");
        process.exit(0);
      }

      if (!useDetected) author = undefined;
    }

    if (!author) {
      const written = await p.text({
        message: "Qual o seu nome?",
        placeholder: "Beatriz Salles",
        validate: (v) =>
          !v || v.trim() === "" ? "O autor não pode ser vazio." : undefined,
      });

      if (p.isCancel(written)) {
        p.cancel("Operação cancelada.");
        process.exit(0);
      }

      author = written;
    }

    if (!githubUser) {
      const written = await p.text({
        message: "Qual o seu usuário do GitHub?",
        placeholder: "seu-usuario",
        validate: (v) =>
          !v || v.trim() === "" ? "O usuário não pode ser vazio." : undefined,
      });

      if (p.isCancel(written)) {
        p.cancel("Operação cancelada.");
        process.exit(0);
      }

      githubUser = written;
    }
  }

  // Monta o data
  const envVars = info.envVars?.join("\n");
  const hasDocker = info.hasDocker ? "true" : undefined;
  const dockerPort = info.dockerPort;

  const data: TemplateData = {
    ...info,
    project_name: info.name,
    tech_list: techList,
    description,
    author,
    github_user: githubUser,
    env_vars: envVars,
    has_docker: hasDocker,
    docker_port: dockerPort,
  };

  // Carrega o template
  const templatePath = process.argv[3];
  const template = loadTemplate(templatePath);

  // Detecta campos faltando
  const missing = detectMissingFields(template, data);

  if (missing.length > 0) {
    p.log.warn("Alguns campos não foram detectados automaticamente:");

    for (const field of missing) {
      const value = await p.text({
        message: `Qual o valor de "${field}"?`,
        placeholder: field,
      });

      if (p.isCancel(value)) {
        p.cancel("Operação cancelada.");
        process.exit(0);
      }

      data[field] = value;
    }
  }

  // Gera o README
  const readme = fillTemplate(template, data);
  const outputPath = path.join(projectPath, "README.md");
  fs.writeFileSync(outputPath, readme);

  p.outro(`✅ README.md gerado em ${outputPath}`);
}

main();
