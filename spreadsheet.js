// jshint esversion: 9
// jshint laxbreak: true
class Spreadsheet {
  static create(fs) {
    const { tree } = fs ;
    const data = Object.values(tree).reduce((ar, node) => {
      const { files, id, name } = node;
      const fileData = files.map(file => [file.name, file.id, file.size, file.mimeType, name, id]);
      ar.push(...fileData);
      return ar;
    }, [['File name', 'File ID', 'Size', 'Mime Type', 'Folder Name', 'Folder ID']]);
    const ss = SpreadsheetApp.create('Folder Scanner');
    ss.getSheets()[0].getRange(1, 1, data.length, data[0].length).setValues(data);
    SpreadsheetApp.flush();
    return ss.getUrl();
  }
}

const testSS = () => {
  Spreadsheet.create(readFile());
};