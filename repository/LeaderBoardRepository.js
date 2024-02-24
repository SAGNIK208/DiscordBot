class LeaderboardRepository{
    constructor(dataProvider){
        this.dataProvider = dataProvider;
    }
     updateLeaderboard(leaderboardEntry) {
        this.dataProvider.updateLeaderboard(leaderboardEntry);
    }
}

module.exports = LeaderboardRepository;