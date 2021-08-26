# Cobalt Strike Community Kit

Cobalt Strike is a post-exploitation framework designed to be extended and customized by the user community. Several excellent tools and scripts have been written and published, but they can be challenging to locate. Community Kit is a central repository of extensions written by the user community to extend the capabilities of Cobalt Strike. The Cobalt Strike team acts as the curator and provides this kit to showcase this fantastic work. 

You can view the kit here

https://cobalt-strike.github.io/community_kit/

## Links to external content

The file `tracked_repos.txt` contains the list of projects displayed on the community kit website.

## Downloader

The script `community_kit_downloader.sh` can be used to download or update all projects in the community kit.

### Requirements

- Designed for Linux
- bash
- git
- curl

### Usage

CD to a starting directory 

```
cd /backup
```

Run Script

```
curl -s https://raw.githubusercontent.com/Cobalt-Strike/community_kit/main/community_kit_downloader.sh | bash
```

If the kit exists, all projects will be updated.

If the kit does not exist, it will be cloned to a depth of 1.

NOTE: This should be considered a clean copy. If you modify any of the projects (and you should), then you should work from a copy.

## Disclaimer

These links are being provided as a convenience and for informational purposes only; they do not constitute an endorsement or an approval by HelpSystems of any of the products, services or opinions of the corporation or organization or individual. HelpSystems bears no responsibility for the accuracy, legality or content of the external site or for that of subsequent links. Contact the external site owner for answers to questions regarding its content.
