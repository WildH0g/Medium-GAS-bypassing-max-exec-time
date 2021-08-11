// jshint esversion: 9
// jshint laxbreak: true

const scan = folderId => {
  const fs = new FileStructure(folderId);
  if (fs.threshold <= fs.timer.getDuration()) {
    fs.scanUnfinished = true;
    return;
  }

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

const saveFile = () => {
  const fileName = 'folder-scanner.json';
  const files = DriveApp.getFilesByName(fileName);
  let file;
  if (files.hasNext()) file = files.next();
  else file = DriveApp.createFile(fileName, '');
  file.setContent(JSON.stringify(new FileStructure()));
};

const readFile = () => {
  const fileName = 'folder-scanner.json';
  const files = DriveApp.getFilesByName(fileName);
  if (files.hasNext())
    return JSON.parse(files.next().getBlob().getDataAsString());
  return null;
};

const deleteFile = () => {
  const fileName = 'folder-scanner.json';
  const files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) files.next().setTrashed(true);
};

const cleanUp = e => {
  deleteFile();
  Trigger.deleteTrigger(e);
  const url = Spreadsheet.create(new FileStructure());
  console.log('spreadsheet created:', url);
};

const pickUpScan = e => {
  if ('running' === ScanStatus.get()) {
    console.log('scan already running, exiting');
    return;
  }

  ScanStatus.set('running');
  const fileTree = readFile();
  if (!fileTree) return;
  const fs = new FileStructure();
  fs.import(fileTree);
  scan('root');

  ScanStatus.set('not running');
  if (true === fs.scanUnfinished) return saveFile();
  cleanUp(e);
};

const main = () => {
  ScanStatus.set('running');
  scan('0B-NVvuK7NJfXQi16WlFsdEx2dkE');
  const fs = new FileStructure();

  ScanStatus.set('not running');
  if (true === fs.scanUnfinished) {
    console.log('did not finish');
    saveFile();
    return new Trigger('pickUpScan', 1);
  } 
  cleanUp();
};

const test = () => {
  ScriptApp.getProjectTriggers().forEach(trigger =>
    ScriptApp.deleteTrigger(trigger)
  );
};
