package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class Database {
    private static final String driver = "com.mysql.jdbc.Driver";
    private static final String url = "jdbc:mysql://localhost:3306/discord-bot";
    private static final String username = "root";
    private static final String password = "root";
    private static final String maxPooledStatements = "100";
    private static final String useSSL = "false";

    private Connection connection;
    private Properties properties;

    private Properties getProperties() {
        if (properties == null) {
            properties = new Properties();
            properties.setProperty("user", username);
            properties.setProperty("password", password);
            properties.setProperty("MaxPooledStatements", maxPooledStatements);
            properties.setProperty("useSSL", useSSL);
        }
        return properties;
    }

    private Connection connect() {
        if (connection == null) {
            try {
                Class.forName(driver);
                connection = DriverManager.getConnection(url, getProperties());
            } catch (ClassNotFoundException | SQLException exception) {
                System.out.println("Failed to connect to the database");
                exception.printStackTrace();
            }
        }
        return connection;
    }

    private void disconnect() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException exception) {
                System.out.println("Failed to close the database");
                exception.printStackTrace();
            }
        }
    }

    public void execute(String query) {
        try {
            Statement statement = connect().createStatement();
            ResultSet result = statement.executeQuery(query);
        } catch (SQLException exception) {
            System.out.println(String.format("Failed to execute query '%s'", query));
            exception.printStackTrace();
            return;
        } finally {
            disconnect();
        }
    }
}
