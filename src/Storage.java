import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class Storage {
    public static final String filename = "storage.txt";

    public static boolean createFile() {
        try {
            new File(filename).createNewFile();
            return true;
        } catch (Exception exception) {
            return false;
        }
    }
    
    public static boolean store(String content) {
        if (!Storage.createFile()) {
            return false;
        }

        try {
            FileWriter writer = new FileWriter(Storage.filename, true);
            BufferedWriter bufferedWriter = new BufferedWriter(writer);
            bufferedWriter.write(content);
            bufferedWriter.newLine();
            bufferedWriter.close();
        } catch (Exception exception) {
            return false;
        }

        return true;
    }
}
