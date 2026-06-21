using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Core.JKAnime;
using Sonarr.Http;

namespace Sonarr.Api.V3.JKAnime
{
    [V3ApiController("jkanime")]
    public class JKAnimeSearchController : Controller
    {
        private readonly IJKAnimeSearchService _jkanimeSearchService;

        public JKAnimeSearchController(IJKAnimeSearchService jkanimeSearchService)
        {
            _jkanimeSearchService = jkanimeSearchService;
        }

        [HttpGet("search")]
        [Produces("application/json")]
        public List<JKAnimeSearchResource> Search([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return new List<JKAnimeSearchResource>();
            }

            var results = _jkanimeSearchService.Search(term);
            return results.ConvertAll(JKAnimeSearchResourceMapper.ToResource);
        }

        [HttpGet("bestmatch")]
        [Produces("application/json")]
        public ActionResult<JKAnimeSearchResource> GetBestMatch([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return NotFound();
            }

            var result = _jkanimeSearchService.GetBestMatch(term);
            if (result == null)
            {
                return NotFound();
            }

            return JKAnimeSearchResourceMapper.ToResource(result);
        }
    }
}
