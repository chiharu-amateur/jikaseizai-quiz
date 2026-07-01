function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["送信日時", "開始日時", "名前", "点数", "満点", "正答率", "難易度", "回答詳細"]);
  }

  sheet.appendRow([
    new Date(),
    data.startedAt || "",
    data.name || "",
    data.score || 0,
    data.total || 0,
    (data.percent || 0) + "%",
    data.difficulty || "",
    JSON.stringify(data.answers || [])
  ]);

  return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
