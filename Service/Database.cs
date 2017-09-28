using System.Collections.Generic;
using MySql.Data;
using MySql.Data.MySqlClient;


namespace MySharpView.Service
{

    public class InstancePool
    {
        public static Dictionary<string, MySqlConnection> pool = new Dictionary<string, MySqlConnection>();
    }

    public class InstanceConnection
    {
        public Connection Connection;
        public Instance Instance;
    }

    public class Instance
    {
        public string Name;

        public List<Database> Databases;
    }

    public class Database
    {
        public string Name;
        public List<Table> Tables;
    }

    public class Table
    {
        public string Name;
    }

    public class Connection
    {

        public string host;

        public int port;

        public string username;

        public string password;

        public string database;

        public InstanceConnection Open()
        {
            var instanceConnection = new InstanceConnection();
            instanceConnection.Connection = this;
            instanceConnection.Instance = new Instance();

            instanceConnection.Instance.Name = username + "@" + host + ":" + port;
            instanceConnection.Instance.Databases = new List<Database>();

            string connStr = $"server={this.host};user={this.username};database={this.database};port={this.port};password={this.password};SslMode=none";
            MySqlConnection mySqlConnection;
            if (InstancePool.pool.ContainsKey(connStr))
            {
                mySqlConnection = InstancePool.pool[connStr];
            }
            else
            {
                mySqlConnection = new MySqlConnection(connStr);
                mySqlConnection.Open();
                InstancePool.pool[connStr] = mySqlConnection;
            }

            var databases = mySqlConnection.Query("show databases");
            foreach (var row in databases.Data)
            {
                var database = new Database();
                database.Name = row[0];
                mySqlConnection.ChangeDatabase(database.Name);
                var tables = mySqlConnection.Query("show tables;");
                database.Tables = new List<Table>();
                foreach (var tableRow in tables.Data)
                {
                    var table = new Table();
                    table.Name = tableRow[0];
                    database.Tables.Add(table);
                }
                instanceConnection.Instance.Databases.Add(database);
            }

            return instanceConnection;
        }
    }

    public static class MysqlExtensions
    {
        public static QueryResult Query(this MySqlConnection mySqlConnection, string sql)
        {
            lock (mySqlConnection)
            {
                QueryResult result = new QueryResult();
                MySqlCommand cmd = mySqlConnection.CreateCommand();
                cmd.CommandText = sql;
                using (MySqlDataReader dataReader = cmd.ExecuteReader())
                {
                    result.Meta = new string[dataReader.FieldCount];
                    for (int i = 0; i < dataReader.FieldCount; i++)
                    {
                        result.Meta[i] = dataReader.GetName(i);
                    }

                    while (dataReader.Read())
                    {
                        string[] row = new string[dataReader.FieldCount];
                        for (int i = 0; i < dataReader.FieldCount; i++)
                        {
                            row[i] = dataReader.GetString(i);
                        }
                        result.Data.Add(row);
                    }
                    return result;
                }
            }
        }
    }

    public class QueryResult
    {
        public string[] Meta;
        public List<string[]> Data = new List<string[]>();
    }
}
