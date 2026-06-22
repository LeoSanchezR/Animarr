FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet build src/NzbDrone.Console/Sonarr.Console.csproj -c Release

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

ENV DOTNET_EnableDiagnostics=0 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=1 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libsqlite3-0 \
        libicu-dev \
        openssl \
        curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /src/_output/net10.0/ ./
COPY _output/UI/ ./UI/

EXPOSE 8989

ENTRYPOINT ["dotnet", "Sonarr.dll"]
CMD ["-nobrowser", "-data=/config"]
