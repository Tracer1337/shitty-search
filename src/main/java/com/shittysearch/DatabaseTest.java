import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import database.Database;

public class DatabaseTest {
    public static void main(String[] args) {
        Database database = new Database();
        try {
            ResultSet result = database.query("SHOW TABLES");
            while (result.next()) {
                System.out.println(result.getString(1));
            }
        } catch (SQLException exception) {
            exception.printStackTrace();
        }
        database.disconnect();
    }
}
