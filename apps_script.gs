function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('回答')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('回答');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送信日時', '名前', '難易度', '得点', '満点', '正答率', '回答詳細']);
  }

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date(),
    data.name || '',
    data.difficulty || '',
    data.score || 0,
    data.total || 0,
    data.percent || 0,
    data.answers || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
