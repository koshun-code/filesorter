
import _ from 'lodash';
import { sortByFoldersName, getPath, move } from './src/workwithfolders';

export default async (from) => {
  const sortedFiles = await sortByFoldersName(from);
  const res = Object.keys(sortedFiles).map( async (folder) => {
    const pathsFolder = getPath(`${from}/${folder}`);
    if (!fs.existsSync(pathsFolder)) {
      await fsp.mkdir(pathsFolder)
    }
    await move(from, `${from}/${folder}`, sortedFiles[folder]);
  });
  return res;
};
