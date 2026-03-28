#!/usr/bin/env node
// Cross-platform replacement for the bash postinstall git hooks setup.
// Equivalent logic to:
//   if [ -d .git ]; then
//     if command -v prek; then prek install
//     elif [ -d node_modules/@j178/prek ]; then exit 1
//     else echo "Skipping..."
//   fi
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

// Only set up git hooks inside a git repository
if (!existsSync('.git')) {
  process.exit(0);
}

const isWindows = process.platform === 'win32';

// Check if prek binary is available in PATH
const prekCheck = spawnSync('prek', ['--version'], {
  stdio: 'ignore',
  shell: isWindows,
});

if (!prekCheck.error) {
  // prek found — install hooks
  const result = spawnSync('prek', ['install'], {
    stdio: 'inherit',
    shell: isWindows,
  });
  process.exit(result.status ?? 0);
} else if (existsSync('node_modules/@j178/prek')) {
  console.error('ERROR: prek package found but binary not in PATH');
  process.exit(1);
} else {
  console.log('Skipping git hook setup (prek not installed)');
}
