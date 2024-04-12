const sql = require('mssql');

const config = {
		user: 'powerbi', // better stored in an app setting such as process.env.DB_USER
		password: 'HowdyStats!', // better stored in an app setting such as process.env.DB_PASSWORD
		server: 'sbrondel.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
		port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
		database: 'howdyscout2024', // better stored in an app setting such as process.env.DB_NAME
		authentication: {
				type: 'default'
		},
		options: {
				encrypt: true
		}
}

/*
		//Use Azure VM Managed Identity to connect to the SQL database
		const config = {
				server: process.env["db_server"],
				port: process.env["db_port"],
				database: process.env["db_database"],
				authentication: {
						type: 'azure-active-directory-msi-vm'
				},
				options: {
						encrypt: true
				}
		}

		//Use Azure App Service Managed Identity to connect to the SQL database
		const config = {
				server: process.env["db_server"],
				port: process.env["db_port"],
				database: process.env["db_database"],
				authentication: {
						type: 'azure-active-directory-msi-app-service'
				},
				options: {
						encrypt: true
				}
		}
*/

console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
	try {
			var poolConnection = await sql.connect(config);

			console.log("Reading rows from the Table...");
			var resultSet = await poolConnection.request().query(`
					SELECT TOP 20 *
					FROM frc6377MatchScouting
			`);

			console.log(`${resultSet.recordset.length} rows returned.`);

			// Output row contents
			console.log(resultSet.recordset)

			// Close connection
			await poolConnection.close();
	} catch (err) {
			console.error(err.message);
	}
}

// Export the function
module.exports = connectAndQuery;