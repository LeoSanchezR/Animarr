using NzbDrone.Core.JKAnime;
using Sonarr.Http.REST;

namespace Sonarr.Api.V3.JKAnime
{
    public class JKAnimeSearchResource : RestResource
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

    public static class JKAnimeSearchResourceMapper
    {
        public static JKAnimeSearchResource ToResource(this JKAnimeSearchResult model)
        {
            if (model == null)
            {
                return null;
            }

            return new JKAnimeSearchResource
            {
                Title = model.Title,
                AlternativeTitle = model.AlternativeTitle,
                Url = model.Url,
                Slug = model.Slug,
                Type = model.Type,
                Season = model.Season,
                Year = model.Year,
                Synopsis = model.Synopsis,
                Confidence = model.Confidence
            };
        }
    }
}
