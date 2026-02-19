import { spawn } from 'node:child_process';
import path from 'node:path';

function run(cmd, args, cwd) {
  const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Process ${cmd} exited with code ${code}`);
    }
  });
  return child;
}

const root = process.cwd();

// Start main server
run('npm', ['run', 'dev'], root);

// Start NGO dashboard dev server on 5174
run('npm', ['run', 'dev', '--', '--port', '5174'], path.join(root, 'Ngo dashboard', 'com-aid-system-main'));


