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
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Crawler implements Callable<List<String>> {
    public static final String entrypoint = "https://www.easymeme69.com/";
    public static final String[] allowedContentTypes = {"text/html"};
    public static final int maxThreads = 3;

    public static void main(String[] args) {
        Queue<String> urls = new LinkedList<String>();
        List<String> visited = new ArrayList<String>();
        urls.add(Crawler.entrypoint);

        ExecutorService executorService = Executors.newCachedThreadPool();
        CompletionService<List<String>> completionService = new ExecutorCompletionService<List<String>>(executorService);
        int threadsCount = 0;

        while (urls.size() > 0) {
            for (int i = 0; i < Crawler.maxThreads; i++) {
                if (threadsCount >= Crawler.maxThreads) {
                    break;
                }

                String url = urls.poll();

                if (url == null) {
                    break;
                }

                Crawler crawler = new Crawler(url);
                completionService.submit(crawler);
                visited.add(url);
                Storage.store(url);
                threadsCount++;
            }

            System.out.println(String.format("New iteration with %d threads", threadsCount));

            try {
                Future<List<String>> result = completionService.take();
                List<String> newUrls = result.get();
                if (newUrls != null) {
                    newUrls.forEach((newUrl) -> {
                        if (!visited.contains(newUrl)) {
                            urls.add(newUrl);
                        }
                    });
                }
                threadsCount--;

            } catch (InterruptedException exception) {
                System.out.println("Error interrupted exception");
                exception.printStackTrace();

            } catch (ExecutionException exception) {
                System.out.println("Error execution exception");
                exception.printStackTrace();
            }
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
        System.out.println("Crawling: " + url);

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
