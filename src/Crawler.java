import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

class Crawler {
    public static final String entrypoint = "https://www.reddit.com/";
    public static final String[] allowedContentTypes = {"text/html"};

    public static void main(String[] args) {
        System.out.println("Hello World");
        Crawler crawler = new Crawler();
        crawler.crawl(Crawler.entrypoint);
    }

    public HttpResponse<String> request(String url) throws URISyntaxException, IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        URI uri = new URI(url);
        HttpRequest request = HttpRequest.newBuilder(uri).build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public Boolean shouldCrawl(HttpResponse<String> response) {
        HttpHeaders headers = response.headers();
        List<String> contentType = headers.map().get("Content-Type");

        if (contentType.size() != 0) {
            boolean result = false;

            for (String mimeType : Crawler.allowedContentTypes) {
                if (contentType.get(0).startsWith(mimeType)) {
                    result = true;
                }
            }

            return result;
        }

        return false;
    }

    public void crawl(String url) {
        try {
            HttpResponse<String> result = this.request(url);

            if (!this.shouldCrawl(result)) {
                return;
            }

            Parser parser = new Parser(result.body());
            List<String> links = parser.getLinks();

            for (String link : links.subList(0, 5)) {
                System.out.println(link);
            }
        } catch (Exception error) {
            System.out.println("Error");
        }
    }
}
