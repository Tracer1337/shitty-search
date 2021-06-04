import database.Database;

public class DatabaseTest {
    public static void main(String[] args) {
        Database database = new Database();
        database.execute("SHOW TABLES");
    }
}
