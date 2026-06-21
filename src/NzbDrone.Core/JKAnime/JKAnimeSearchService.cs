using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using NLog;
using NzbDrone.Common.Http;

namespace NzbDrone.Core.JKAnime
{
    public class JKAnimeSearchService : IJKAnimeSearchService
    {
        private const string DEFAULT_BASE_URL = "https://jkanime.net";
        private const string SEARCH_PATH = "/buscar/";
        private const string USER_AGENT = "Animarr/1.0 (anime search helper)";

        private readonly Logger _logger;
        private readonly IHttpClient _httpClient;

        public JKAnimeSearchService(IHttpClient httpClient, Logger logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public List<JKAnimeSearchResult> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<JKAnimeSearchResult>();
            }

            try
            {
                var encodedQuery = Uri.EscapeDataString(query.Trim());
                var url = $"{DEFAULT_BASE_URL}{SEARCH_PATH}{encodedQuery}";

                _logger.Debug("Searching JKAnime for: {0}", query);

                var requestBuilder = new HttpRequestBuilder(url);
                requestBuilder.PostProcess += r => r.RequestTimeout = TimeSpan.FromSeconds(10);

                var request = requestBuilder.Build();

                request.Headers.Add("User-Agent", USER_AGENT);
                request.AllowAutoRedirect = true;

                var response = _httpClient.Get(request);
                var html = response.Content;

                return ParseSearchResults(html, query);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to search JKAnime for: {0}", query);
                return new List<JKAnimeSearchResult>();
            }
        }

        public JKAnimeSearchResult GetBestMatch(string query)
        {
            var results = Search(query);
            return results.FirstOrDefault();
        }

        private List<JKAnimeSearchResult> ParseSearchResults(string html, string originalQuery)
        {
            var results = new List<JKAnimeSearchResult>();

            if (string.IsNullOrWhiteSpace(html))
            {
                return results;
            }

            // Pattern for search result items - look for anime links with titles
            // JKAnime search results typically have links like /anime-slug/ with title text
            var linkPattern = new Regex(
                @"<a[^>]*href=""\/([^""\/]+)\/""[^>]*>.*?<[^>]*class=""[^""]*title[^""]*""[^>]*>([^<]+)<",
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            // Alternative pattern for search results
            var altPattern = new Regex(
                @"<div[^>]*class=""[^""]*anime[^""]*""[^>]*>.*?<a[^>]*href=""\/([^""\/]+)\/""[^>]*>([^<]+)<",
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            // Simple pattern for any link to anime pages
            var simplePattern = new Regex(
                @"href=""\/([a-z0-9-]+)\/""[^>]*>([^<]{2,})<\/a>",
                RegexOptions.IgnoreCase);

            var matches = linkPattern.Matches(html);
            if (matches.Count == 0)
            {
                matches = altPattern.Matches(html);
            }

            if (matches.Count == 0)
            {
                matches = simplePattern.Matches(html);
            }

            var seenSlugs = new HashSet<string>();

            foreach (Match match in matches)
            {
                var slug = match.Groups[1].Value.Trim();
                var title = match.Groups[2].Value.Trim();

                // Skip navigation links and non-anime pages
                if (string.IsNullOrEmpty(slug) || string.IsNullOrEmpty(title) ||
                    slug.Contains("directorio") || slug.Contains("genero") ||
                    slug.Contains("emision") || slug.Contains("horario") ||
                    slug.Contains("aleatorio") || slug.Contains("buscar") ||
                    seenSlugs.Contains(slug))
                {
                    continue;
                }

                seenSlugs.Add(slug);

                var confidence = CalculateConfidence(title, originalQuery);
                var url = $"{DEFAULT_BASE_URL}/{slug}/";

                results.Add(new JKAnimeSearchResult
                {
                    Title = title,
                    Slug = slug,
                    Url = url,
                    Confidence = confidence
                });
            }

            return results
                .OrderByDescending(r => r.Confidence)
                .Take(10)
                .ToList();
        }

        private double CalculateConfidence(string jkanimeTitle, string query)
        {
            if (string.IsNullOrWhiteSpace(jkanimeTitle) || string.IsNullOrWhiteSpace(query))
            {
                return 0.0;
            }

            var normalizedTitle = jkanimeTitle.ToLowerInvariant().Trim();
            var normalizedQuery = query.ToLowerInvariant().Trim();

            // Exact match
            if (normalizedTitle == normalizedQuery)
            {
                return 1.0;
            }

            // Title starts with query
            if (normalizedTitle.StartsWith(normalizedQuery))
            {
                return 0.9;
            }

            // Query starts with title
            if (normalizedQuery.StartsWith(normalizedTitle))
            {
                return 0.85;
            }

            // Title contains query
            if (normalizedTitle.Contains(normalizedQuery))
            {
                return 0.7;
            }

            // Query contains title
            if (normalizedQuery.Contains(normalizedTitle))
            {
                return 0.6;
            }

            // Word overlap
            var titleWords = normalizedTitle.Split(new[] { ' ', '-', '_', '.' }, StringSplitOptions.RemoveEmptyEntries);
            var queryWords = normalizedQuery.Split(new[] { ' ', '-', '_', '.' }, StringSplitOptions.RemoveEmptyEntries);
            var overlap = titleWords.Intersect(queryWords).Count();
            var totalWords = titleWords.Union(queryWords).Count();

            if (overlap > 0)
            {
                return 0.3 + (0.4 * overlap / totalWords);
            }

            return 0.1;
        }
    }
}
