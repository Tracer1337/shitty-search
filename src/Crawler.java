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
    public static final String entrypoint = "https://play.google.com/store/apps/details?id=com.easymeme69.memegenerator";
    public static final String[] allowedContentTypes = {"text/html"};
    public static final List<String> ignoreUrls = List.of(
        "https://books.google.com/books/publisher/content/images/frontcover",
        "https://play-lh.googleusercontent.com",
        "https://www.youtube.com/embed",
        "https://i.ytimg.com/",
        "https://youtu.be/",
        "https://github.githubassets.com"
    );
    public static final int maxThreads = 30;
    public static final Storage visitedStorage = new Storage("visited.txt");
    public static int i = 0;

    public static void main(String[] args) {
        Queue<String> urls = new LinkedList<String>();
        List<String> knownUrls = new ArrayList<String>();
        urls.add(entrypoint);

        ExecutorService executorService = Executors.newCachedThreadPool();
        CompletionService<List<String>> completionService = new ExecutorCompletionService<List<String>>(executorService);
        int threadsCount = 0;

        Storage queueStorage = new Storage("queue.txt");
        Storage knownUrlsStorage = new Storage("known.txt");

        while (urls.size() > 0) {
            queueStorage.clear();
            urls.forEach(queueStorage::store);

            knownUrlsStorage.clear();
            knownUrls.forEach(knownUrlsStorage::store);
            
            for (int i = 0; i < maxThreads; i++) {
                if (threadsCount >= maxThreads) {
                    break;
                }

                String url = urls.poll();

                if (url == null) {
                    break;
                }

                Crawler crawler = new Crawler(url);
                completionService.submit(crawler);
                threadsCount++;
            }

            System.out.println(String.format("Threads: %d", threadsCount));

            try {
                Future<List<String>> result = completionService.take();
                List<String> newUrls = result.get();
                if (newUrls != null) {
                    newUrls.forEach((newUrl) -> {
                        if (!knownUrls.contains(newUrl)) {
                            urls.add(newUrl);
                            knownUrls.add(newUrl);
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
        return crawl(url);
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

        if (contentType != null && contentType.size() != 0) {
            if (response.statusCode() != 200) {
                return false;
            }

            boolean result = false;

            for (String mimeType : allowedContentTypes) {
                if (contentType.get(0).startsWith(mimeType)) {
                    result = true;
                }
            }

            return result;
        }

        return false;
    }

    private void storeHTML(String url, HttpResponse<String> response) {
        Storage storage = new Storage(Crawler.i++ + ".html");
        storage.store(url);
        storage.store("");
        storage.store(response.body());
    }

    public List<String> crawl(String url) {
        System.out.println("Crawling: " + url);

        try {
            HttpResponse<String> result = request(url);

            if (!shouldCrawl(result)) {
                return null;
            }

            storeHTML(url, result);
            visitedStorage.store(url);

            Parser parser = new Parser(result.body());
            List<String> links = parser.getLinks();

            links.removeIf((link) ->
                Crawler.ignoreUrls.stream().anyMatch(
                    (ignored) -> link.startsWith(ignored)
                )
            );

            return links;
        } catch (Exception exception) {
            System.out.println("Error");
            exception.printStackTrace();
        }

        return null;
    }
}
