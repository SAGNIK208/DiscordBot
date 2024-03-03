const { google } = require('googleapis');
const {SPREADSHEET_ID,SHEET_NAME} = require("../config/config");
const { client_email, private_key } = require('../credentials/credentials.json'); 

class GoogleSheetsRepository {
  async updateLeaderboard(leaderboardEntry) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email,
        private_key,
      },
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    const spreadsheetId = SPREADSHEET_ID;
    const sheetName =  SHEET_NAME;
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range:`${sheetName}!A:A`,
          });
      
        const existingEntries = response.data.values || [];
        const existingIds = existingEntries.map(row => row[0]);;
        let targetId = leaderboardEntry.id;
        const currentValues = [[
            leaderboardEntry.id,
            leaderboardEntry.name,
            leaderboardEntry.email,
            leaderboardEntry.totalScore,
            leaderboardEntry.correctAnswers,
            leaderboardEntry.wrongAnswers
        ]];
      
        if(existingIds.includes(targetId)){
          const updateRange = `${sheetName}!${existingEntries.findIndex(row => row[0] === targetId) + 1}:${existingEntries.findIndex(row => row[0] === targetId) + 1}`;
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range : updateRange,
                valueInputOption: 'RAW',
                resource: {
                  values: currentValues,
                },
              });
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range:`${sheetName}!A1`,
                valueInputOption: 'RAW',
                resource: {
                  values: currentValues,
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
