using System.Collections.Generic;

namespace NzbDrone.Core.JKAnime
{
    public interface IJKAnimeSearchService
    {
        List<JKAnimeSearchResult> Search(string query);
        JKAnimeSearchResult GetBestMatch(string query);
    }
}
