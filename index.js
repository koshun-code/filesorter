import fsp from 'fs/promises';
import { sortByFoldersName, getPath, move } from './src/worker.js';

export default async (from) => {
  const sortedFiles = await sortByFoldersName(from);
  const res = Object.keys(sortedFiles).map(async (folder) => {
    const pathsFolder = getPath(`${from}/${folder}`);
    await fsp.access(pathsFolder, fsp.R_OK)
      .catch(() => fsp.mkdir(pathsFolder));
    await move(from, `${from}/${folder}`, sortedFiles[folder]);
  });
  return res;
};
