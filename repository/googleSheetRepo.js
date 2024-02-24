const { google } = require('googleapis');
const credentials = require('../credentials/credentials.json');
const sheets = google.sheets({ version: 'v4', auth: credentials });
const {SPREADSHEET_ID,RANGE,SHEET_NAME} = require("../config/config");

const spreadsheetId = SPREADSHEET_ID;
const sheetName =  SHEET_NAME;

class GoogleSheetsRepository {
  async updateLeaderboard(leaderboardEntry) {
    try {
        const range = RANGE.replace(/{leaderBoardId}/g,leaderboardEntry.getId());
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
          });
      
        const existingValues = response.data.values || [];
        const curentValues = [
            leaderboardEntry.getId(),
            leaderboardEntry.getName(),
            leaderboardEntry.getEmail(),
            leaderboardEntry.getTotalScore(),
            leaderboardEntry.getCorrectAnswers(),
            leaderboardEntry.getWrongAnswers()
        ];
      
        if(existingValues.length>0){
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: {
                  values: curentValuesValues,
                },
              });
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Leaderboard!A:F',
                valueInputOption: 'RAW',
                resource: {
                  values: curentValues,
                },
              });
        }

    
        console.log('Leaderboard updated successfully.');
      } catch (error) {
        console.error('Error updating leaderboard:', error.message);
      }
  }
}

module.exports = GoogleSheetsRepository;
