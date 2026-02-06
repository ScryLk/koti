#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { loadPatterns, scanProject, checkProject } from '@kodi/core';

const program = new Command();
program
  .name('kodi')
  .description('Kodi CLI — Documentação Ativa para padronização de código')
  .version('0.1.0');

program
  .command('init')
  .description('Inicializa Kodi no projeto atual')
  .option('--language <lang>', 'Linguagem principal do projeto', 'java')
  .action(async (opts) => {
    const cwd = process.cwd();
    const kodiDir = path.join(cwd, '.kodi');
    const patternsDir = path.join(kodiDir, 'patterns');
    await fs.ensureDir(patternsDir);

    const configPath = path.join(kodiDir, 'config.yaml');
    const config = `llm:\n  provider: local\nproject:\n  language: ${opts.language}\n`;
    await fs.writeFile(configPath, config, 'utf8');

    const examplePattern = `id: service-class-naming\nlanguage: ${opts.language}\ntype: naming-convention\nscope: class\nrule: "Classes de serviço devem terminar com 'Service'"\npattern: "^[A-Z][a-zA-Z]*Service$"\nseverity: error\nauto_fix: true\n`;
    await fs.writeFile(path.join(patternsDir, `${opts.language}-naming.yaml`), examplePattern, 'utf8');

    console.log(chalk.green('Kodi initialized successfully.'));
    console.log('\nCreated:');
    console.log(`  ${path.relative(cwd, kodiDir)}/`);
    console.log(`  ${path.relative(cwd, configPath)}`);
    console.log(`  ${path.relative(cwd, patternsDir)}/`);
    console.log('\nNext steps:');
    console.log("  1. Run 'kodi scan --discover' to detect existing patterns");
    console.log("  2. Run 'kodi check' to verify compliance");
    console.log("  3. Run 'kodi watch' to monitor changes");
  });

program
  .command('scan')
  .description('Escaneia o projeto e mostra estatísticas')
  .option('--cwd <dir>', 'Diretório raiz', process.cwd())
  .action(async (opts) => {
    const summary = await scanProject(opts.cwd);
    console.log(chalk.blue('Scanning project...'));
    console.log(`\nAnalyzed:\n  • ${summary.totalFiles} files`);
    console.log('\nBy extension:');
    for (const [ext, count] of Object.entries(summary.byExt)) {
      console.log(`  • .${ext}: ${count}`);
    }
  });

program
  .command('check')
  .description('Verifica conformidade com padrões ativos')
  .option('--cwd <dir>', 'Diretório raiz', process.cwd())
  .option('--patterns <dir>', 'Diretório de padrões', path.join(process.cwd(), '.kodi', 'patterns'))
  .action(async (opts) => {
    const patterns = await loadPatterns(opts.patterns).catch(() => []);
    const result = await checkProject(opts.cwd, patterns);

    console.log(chalk.blue('Checking compliance...'));
    console.log(`\nResults:\n  ✓ ${result.passedFiles} files passed\n  ✗ ${result.failedFiles} files with violations`);

    if (result.violations.length) {
      console.log('\nViolations:');
      for (const v of result.violations.slice(0, 10)) {
        console.log(`\n  ${v.filePath}\n    ${v.message} [${v.severity}] (pattern: ${v.patternId})`);
      }
      if (result.violations.length > 10) {
        console.log(`\n  ...and ${result.violations.length - 10} more`);
      }
    }
    console.log(`\nScore: ${result.score}/100`);
  });

program.parseAsync();
