import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Parser {
    private String html;

    public Parser(String html) {
        this.html = html;
    }
    
    public List<String> getLinks() {
        List<String> links = new ArrayList<String>();
        Pattern pattern = Pattern.compile("https?:\\/\\/[0-9A-z.-]+(\\/[0-9A-z./-]*(\\?([0-9A-z-]+=[^&#\"'-]+&?)*)?(#[^\"']*)?)?");
        Matcher matcher = pattern.matcher(this.html);
        while (matcher.find()) {
            links.add(matcher.group());
        }
        return links;
    }
}
