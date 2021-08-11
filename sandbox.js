// jshint esversion: 9
// jshint laxbreak: true
const scan = folderId => {
  if (undefined === fs.tree[folderId]) {
    try {
      const newFolder = new Folder({
        id: folderId,
        isRoot: 'root' === folderId,
      });
      fs.addFolder(newFolder);
      newFolder.subfolders.forEach(subFolder => scan(subFolder));
    } catch (err) {
      console.log('ERROR', err);
    }
  } else {
    fs.tree[folderId].subfolders.forEach(subfolder => scan(subfolder));
  }
};