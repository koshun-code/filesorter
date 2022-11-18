import fs from 'fs';
import path from 'path';
import _ from 'lodash';
const { promises: fsp } = fs;

// key - название папки
// value - массив с сопоставлением для имёт
const map = {
  //computer_science: ['refactoring', 'computers','sicp','tdd', 'computer_science', 'reactive', 'operatsionnye', 'programmirovania', 'programmist', 'programming'],
  //algoritms: ['algoritm', 'алгоритмы', 'алгоритм'],
  //css: ['css', 'bootstrap'],
  git: ['git'],
  //html: ['html', 'html5'],
  //python:['python', 'питон', 'django', 'beautifulsoup'],
  //data_science: ['data-science', 'data science'],
  //go: ['go'],
  //js: ['javascript', 'js', 'vue', 'react', 'vue3', 'es6', 'typescript', 'graphql', 'angular'],
 // java: ['java', 'spring'],
 // php: ['laravel', 'symfony', 'php'],
  math: ['math','математика', 'математике'],
  linux: ['bash', 'linux'],
  //ruby: ['ruby', 'ruby on rails', 'rubyist'],
  //db: ['postgresql', 'sql', 'mysql', 'db', 'mongo'],
 // docker:['docker'],
 // "C#": ['c#'],
  //rust: ['rust'],
  //api: ['api'],
  haskell: ['haskell'],
  hacking: ['hacking', 'безопасност[и?|ь?]', 'хакинг[а?|е?]', 'хакер[а?]', 'проникновени[я?|е?]', 'ловушка'],
  //seo: ['seo'],
  c:['c'],
  //pattertns: ['patterns'],
 // mind:['stoicism', 'meditation', 'meditatsii'],
  //security:['info-bez'],
};

const move = async (src, dest, data = []) => {
  const fromFolder = getPath(src);
  const toFolder = getPath(dest);
  await data.map(async (item) => {
    await fsp.copyFile(`${fromFolder}/${item}`,`${toFolder}/${item}`);
    await fsp.unlink(`${fromFolder}/${item}`)
    .then(() => console.log('Success moved'))
    .catch((error) => console.log(error));
  });
};

const getPath = (files) => path.resolve(...files.split('/'));

const getNormalizeNames = async (pathToFolder) => {
  const files = await fsp.readdir(pathToFolder);
   return  files.map( (file) => {
    const pattern = new RegExp('-|_', 'gim');
    const nFile = file.toLowerCase().replaceAll(pattern, ' ');
    fs.renameSync(getPath(`${pathToFolder}/${file}`), getPath(`${pathToFolder}/${nFile}`))
    return nFile;
   });
};

const isDir = (path) => {
  const stat =  fs.statSync(path);
  return stat.isDirectory();
};

const getWordsFromFilename = (fileName) => {
  const cuteExt = fileName.split('.')[0];
  return _.words(cuteExt);
}

const sortByFoldersName = async (pathToFolder) => {
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

const moveToFolder = async (from) => {
  const sortedFiles = await sortByFoldersName(from);
  console.log(sortedFiles); 
  return;
  const res = await Object.keys(sortedFiles).map( async (folder) => {
    const pathsFolder = getPath(`${from}/${folder}`);
    if (!fs.existsSync(pathsFolder)) {
      await fsp.mkdir(pathsFolder)
    }
    await move(from, `${from}/${folder}`, sortedFiles[folder]);
  });
  return res;
};
moveToFolder('test');
