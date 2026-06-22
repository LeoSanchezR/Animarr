FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet msbuild -restore src/Sonarr.sln \
  -p:SelfContained=true \
  -p:Configuration=Release \
  -p:Platform=Posix \
  -p:RuntimeIdentifiers=linux-x64 \
  -p:EnableWindowsTargeting=true \
  -p:RunAnalyzers=false \
  -p:RunAnalyzersDuringBuild=false \
  -p:TreatWarningsAsErrors=false \
  -p:EnforceCodeStyleInBuild=false \
  -t:PublishAllRids

RUN test -f _output/net10.0/linux-x64/publish/Sonarr.dll
RUN test -f _output/net10.0/linux-x64/publish/Sonarr.Mono.dll

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

COPY --from=build /src/_output/net10.0/linux-x64/publish/ ./
COPY _output/UI/ ./UI/

EXPOSE 8989

ENTRYPOINT ["dotnet", "Sonarr.dll"]
CMD ["-nobrowser", "-data=/config"]
