import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Crawler implements Callable<List<String>> {
    public static final String entrypoint = "https://www.reddit.com/";
    public static final String[] allowedContentTypes = {"text/html"};

    public static void main(String[] args) {
        Queue<String> urls = new LinkedList<String>();
        urls.add(Crawler.entrypoint);
        ExecutorService exec = Executors.newCachedThreadPool();
        List<Callable<List<String>>> threads = new ArrayList<Callable<List<String>>>();

        Crawler thread = new Crawler(urls.poll());
        threads.add(thread);

        try {
            List<Future<List<String>>> results = exec.invokeAll(threads);
            for (Future<List<String>> result : results) {
                System.out.println(result.get());
            }
        } catch (Exception exception) {
            System.out.println("Error");
        }
    }

    public String url;

    public Crawler(String url) {
        this.url = url;
    }

    public List<String> call() {
        return this.crawl(this.url);
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

    public List<String> crawl(String url) {
        System.out.println(url);

        try {
            HttpResponse<String> result = this.request(url);

            if (!this.shouldCrawl(result)) {
                return null;
            }

            Parser parser = new Parser(result.body());
            List<String> links = parser.getLinks();

            return links;
        } catch (Exception error) {
            System.out.println("Error");
        }

        return null;
    }
}
