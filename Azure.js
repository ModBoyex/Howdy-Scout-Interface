const sql = require("mssql");
const fs = require("fs");

console.log("Getting Our Scouting Data!");

const config = {
	user: "powerbi", // better stored in an app setting such as process.env.DB_USER
	password: "HowdyStats!", // better stored in an app setting such as process.env.DB_PASSWORD
	server: "sbrondel.database.windows.net", // better stored in an app setting such as process.env.DB_SERVER
	port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
	database: "howdyscout2024", // better stored in an app setting such as process.env.DB_NAME
	authentication: {
		type: "default",
	},
	options: {
		encrypt: true,
	},
};

console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
	try {
		var poolConnection = await sql.connect(config);

		console.log("Reading rows from the Table...");
		var resultSet = await poolConnection.request().query(`
					SELECT*
					FROM frc6377MatchScouting
			`);

		console.log(`${resultSet.recordset.length} rows returned.`);

		// Write the data to a JSON file
		fs.writeFileSync(
			"scouting_data.json",
			'{"data": '.concat(JSON.stringify(resultSet.recordset, null, 2), "}"),
		);

		console.log("Data written to frc_team_data.json");

		// Close connection
		await poolConnection.close();

		// Close connection
		await poolConnection.close();
	} catch (err) {
		console.error(err.message);
	}
}
