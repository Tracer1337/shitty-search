import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Storage {
    private static final String dirname = "storage";

    private String filename;

    public Storage(String filename) {
        this.filename = filename;
    }

    public boolean createFile(String filepath) {
        try {
            new File(filepath).createNewFile();
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean createDir(String path) {
        File dir = new File(path);
        if (!dir.exists()) {
            return dir.mkdirs();
        }
        return true;
    }

    public boolean clear() {
        return store("", false);
    }

    public boolean store(String content) {
        return store(content, true);
    }
    
    public boolean store(String content, boolean append) {
        String filepath = getFilePath(filename);

        if (!createDir(getFilePath())) {
            return false;
        }

        if (!createFile(filepath)) {
            return false;
        }

        try {
            FileWriter writer = new FileWriter(filepath, append);
            BufferedWriter bufferedWriter = new BufferedWriter(writer);
            bufferedWriter.write(content);
            if (append) {
                bufferedWriter.newLine();
            }
            bufferedWriter.close();
        } catch (Exception exception) {
            return false;
        }

        return true;
    }

    private String getFilePath() {
        return getFilePath(null);
    }

    private String getFilePath(String filename) {
        Path currentPath = Paths.get(System.getProperty("user.dir"));
        Path filePath = filename == null
            ? Paths.get(currentPath.toString(), dirname)
            : Paths.get(currentPath.toString(), dirname, filename);
        return filePath.toString();
    }
}
