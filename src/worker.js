import fs from 'fs';
import path from 'path';
import _ from 'lodash';
const { promises: fsp } = fs;


export const move = async (src, dest, data = []) => {
  const fromFolder = getPath(src);
  const toFolder = getPath(dest);
  await data.map(async (item) => {
    await fsp.copyFile(`${fromFolder}/${item}`,`${toFolder}/${item}`);
    await fsp.unlink(`${fromFolder}/${item}`)
    .then(() => console.log('Success moved'))
    .catch((error) => console.log(error));
  });
};

export const getPath = (files) => path.resolve(...files.split('/'));

export const getNormalizeNames = async (pathToFolder) => {
  const files = await fsp.readdir(pathToFolder);
   return  files.map( (file) => {
    const pattern = new RegExp('-|_', 'gim');
    const nFile = file.toLowerCase().replaceAll(pattern, ' ');
    fs.renameSync(getPath(`${pathToFolder}/${file}`), getPath(`${pathToFolder}/${nFile}`))
    return nFile;
   });
};

export const isDir = (path) => {
  const stat =  fs.statSync(path);
  return stat.isDirectory();
};

export const getWordsFromFilename = (fileName) => {
  const cuteExt = fileName.split('.')[0];
  return _.words(cuteExt);
}

const getMap = () => {
  const pathToMap = getPath('map.json');
  const file = fs.readFileSync(pathToMap);
  return JSON.parse(file);
};

export const sortByFoldersName = async (pathToFolder) => {
  console.log(getPath('map.json'));
  //return;
  const map = getMap()
  const normFiles = await getNormalizeNames(pathToFolder); 
  const files =  normFiles.filter((file) => !isDir(getPath(`${pathToFolder}/${file}`)));
  return Object.keys(map).reduce((acc, key) => {
    acc[key] = files.filter((file) => _.intersectionWith(getWordsFromFilename(file), _.get(map, key), (a, b) => {
      const regExp = new RegExp(`${b}`);
      return regExp.test(a);
    }).length > 0);
    return acc;
  }, {});
};