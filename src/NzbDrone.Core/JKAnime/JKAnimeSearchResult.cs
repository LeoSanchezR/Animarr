namespace NzbDrone.Core.JKAnime
{
    public class JKAnimeSearchResult
    {
        public string Title { get; set; }
        public string AlternativeTitle { get; set; }
        public string Url { get; set; }
        public string Slug { get; set; }
        public string Type { get; set; }
        public string Season { get; set; }
        public int? Year { get; set; }
        public string Synopsis { get; set; }
        public double Confidence { get; set; }
    }
}
