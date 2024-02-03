# mari-pili

Mari Pili is an awesome bot that can fit all your needs

[![Docker Build and Publish](https://github.com/lcaparros/mari-pili/actions/workflows/docker-build-and-publish.yml/badge.svg)](https://github.com/lcaparros/mari-pili/actions/workflows/docker-build-and-publish.yml)

[![GitHub Repository](https://img.shields.io/static/v1.svg?color=4edafc&labelColor=555555&logoColor=ffffff&style=flat&label=lcaparros/mari-pili&message=GitHub%20Repo&logo=github)](https://github.com/lcaparros/mari-pili)
[![GitHub Stars](https://img.shields.io/github/stars/lcaparros/mari-pili.svg?color=4edafc&labelColor=555555&logoColor=ffffff&style=flat&logo=github)](https://github.com/lcaparros/mari-pili)
[![GitHub](https://img.shields.io/static/v1.svg?color=4edafc&labelColor=555555&logoColor=ffffff&style=flat&label=lcaparros&message=GitHub&logo=github)](https://github.com/lcaparros 'view the source for all of our repositories.')

# Contribution

## Pull Requests

Create a new Pull Request with the necessary changes. After being reviewed and merged a new tag will be generated, creating a new Release and publishing the new version.

```shell
$ git tag -a v1.0.9 -m "This is my new amazing version"
$ git push origin v1.0.9
```

Or you can also do it running the following command, replacing `<update_type>` way with one of the semantic versioning release types (patch, major, or minor):

```shell
$ npm version <update_type>
$ git push --follow-tags
```

## How to push a new version of the image

```shell
$ docker build --build-arg VERSION=1.0.9 --build-arg BUILD_DATE="$(date +%Y/%m/%dT%H:%M:%S)" -t mari-pili .
$ docker tag mari-pili lcaparros/mari-pili:1.0.9
$ docker push lcaparros/mari-pili:1.0.9
```

# Usage

Just type the command below to run the bot inside its docker container

```shell
$ docker run --rm --name mari-pili registry/mari-pili:1.0.9
```
