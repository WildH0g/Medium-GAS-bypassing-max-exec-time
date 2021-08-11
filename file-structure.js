// jshint esversion: 9
// jshint laxbreak: true
class Folder {
  constructor(options) {
    let { id, isRoot = false } = options;

    const folder = DriveApp.getFolderById(id);
    const subfolders = [];
    const files = [];
    const parent = isRoot ? null : folder.getParents().next().getId();
    const name = folder.getName();
    const _subfolders = folder.getFolders();
    const _files = folder.getFiles();

    while (_subfolders.hasNext()) {
      subfolders.push(_subfolders.next().getId());
    }

    while (_files.hasNext()) {
      const _id = _files.next().getId();
      const _file = new File(_id);
      files.push(_file.options);
    }
    return { id, name, parent, subfolders, files };
  }
}

class File {
  constructor(id) {
    const file = DriveApp.getFileById(id);
    const name = file.getName();
    const mimeType = file.getMimeType();
    const size = file.getSize();
    this.options = { name, mimeType, id, size };
    return this;
  }
}

class FileStructure {
  constructor(rootId) {
    if (FileStructure.instance) return FileStructure.instance;
    const root = !!rootId ? new Folder({ id: rootId, isRoot: true }) : null;

    this.tree = {
      root,
    };

    this.timer = new Timer();
    this.timer.start();
    // this.threshold = 5 * 60 * 1000;
    this.threshold = 2 * 60 * 1000;

    FileStructure.instance = this;
    return FileStructure.instance;
  }

  addFolder(folderObj) {
    if (this.tree && this.tree.root && this.tree.root.id === folderObj.id)
      return;
    this.tree[folderObj.id] = folderObj;
    return this;
  }

  import(fs) {
    this.tree = fs.tree;
    return this;
  }
}
